const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const session = require('express-session');
const pgSession = require('connect-pg-simple')(session);
const path = require('path');
const db = require('./config/db');
const authRoutes = require('./routes/auth');
const cookieParser = require('cookie-parser');

const app = express();
app.use(cookieParser());
app.use(express.json());

const port = process.env.PORT || 3000;

// Middleware setup
app.use(bodyParser.json());
app.use(cors({
    origin: '*', //allow all request from all origins
    credentials: true //allow cookies and credentials to be sent
}));
app.use(session({
    store: new pgSession({
        pool: db, // Connection pool from config/db.js
        tableName: 'session',
        createTableIfMissing: false,
    }),
    secret: 'your_secret_key',
    resave: false,
    saveUninitialized: false,
    cookie: { maxAge: 1000 * 60 * 60 * 24 } // 1 day
}));

const adminMiddleware = (req, res, next) => {
    if (req.session.user && req.session.user.userRole === 'admin') {
        next();
    }
    else {
        res.status(403).send('access denied');
    }
}

// API routes
app.use('/auth', authRoutes);

app.use('/auth/admin', adminMiddleware);

// Serve static files from the React app
app.use(express.static(path.join(__dirname, 'build')));
app.get('*', (req, res) => {
    res.sendFile(path.join(__dirname, 'build', 'index.html'));
});

// Start the server
app.listen(port, async () => {
    try {
        console.log(`Server running on port ${port}`);
        await initializeTables();
    } catch (error) {
        console.error('Error initializing server:', error);
    }
});

// Function to initialize database tables
const initializeTables = async () => {
    const tables = [
        {
            name: 'session',
            query: `CREATE TABLE IF NOT EXISTS session (
            sid VARCHAR PRIMARY KEY,
            sess JSON NOT NULL,
            expire TIMESTAMP NOT NULL
            )`
        },
        {
            name: 'users',
            query: `CREATE TABLE IF NOT EXISTS users (
            user_id SERIAL PRIMARY KEY,
            password VARCHAR(255) NOT NULL,
            role VARCHAR(10) CHECK (role IN ('user', 'admin')) NOT NULL,
            email VARCHAR(100) UNIQUE NOT NULL,
            created_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP
            )`
        },
        {
            name: 'user_details',
            query: `CREATE TABLE IF NOT EXISTS user_details (
            id SERIAL PRIMARY KEY,
            user_id INT REFERENCES users(user_id) ON DELETE CASCADE,
            first_name VARCHAR(50) NOT NULL,
            middle_name VARCHAR(50),
            last_name VARCHAR(50) NOT NULL,
            gender VARCHAR(10) CHECK (gender IN ('male', 'female')),
            country VARCHAR(20) NOT NULL,
            email VARCHAR(255) UNIQUE NOT NULL,
            phone_number VARCHAR(50) UNIQUE NOT NULL,
            password VARCHAR(255)
            )`
        },
        {
            name: 'questions',
            query: `CREATE TABLE IF NOT EXISTS questions (
            id INT PRIMARY KEY,
            q_number INT,
            text TEXT NOT NULL,
            options TEXT[]
            )`
        },
        {
            name: 'answers',
            query: `CREATE TABLE IF NOT EXISTS answers (
            id SERIAL PRIMARY KEY,
            question_id INT REFERENCES questions(id),
            user_id INT REFERENCES users(user_id),
            answer TEXT,
            created_at TIMESTAMPTZ DEFAULT NOW()
            )`
        }
        // Add other tables if needed here
        ];

    for (const table of tables) {
        try {
            await db.query(table.query);
            console.log(`Table ${table.name} initialized successfully.`);
        } catch (err) {
            console.error(`Error creating table ${table.name}:`, err);
            throw err;
        }
    }
};
