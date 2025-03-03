const express = require('express');
const session = require('express-session');
const argon2 = require('argon2');
const router = express.Router();
const db = require('../config/db');
const { sendRegistrationNotification } = require('../utils/emailService');
const jwt = require('jsonwebtoken');
const dotenv = require('dotenv');

dotenv.config();
const secretKey = process.env.JWT_SECRET;
//function to generate a token
const generateToken = (userData) => {
    return jwt.sign(userData, secretKey, {expiresIn: '4h'});
}

//middleware to veryfy token
const veryfyToken = (req, res, next) => {
    const token = req.headers['authorization']?.split(' ')[1];
    if (!token) {
        return res.status(403).send('Session id is required');
    }
    try {
        const decoded = jwt.verify(token, secretKey);
        req.userData = decoded;

        next();
    }
    catch (error) {
        console.error('Invalid or expired session', error);
        res.status(401).send('Invalid or expired session')
    }
}
router.get('/dashboard', veryfyToken, async (req, res) => {
    try {
        const userId = req.userData.userId;
        const userDataQuery = 'SELECT * FROM user_details WHERE user_id = $1';

        const {rows: userRows} = await db.query(userDataQuery, [userId]);
        
        if (userRows.length === 0) {
            return res.status(404).send('User not found');
        }
        const userData = userRows[0];
        res.status(200).json(userData);
    }
    catch (error) {
        console.error('Error fetching dashboard data', error);
        res.status(500).send('Error fetching user data')
    }
});

// Registration Route
router.post('/register', async (req, res) => {
    const { email, phoneNumber, password, firstName, middleName, lastName, gender,  country} = req.body;
    try {

        await db.query('BEGIN');

        const checkUserQuery = 'SELECT 1 FROM user_details WHERE email = $1 OR phone_number = $2';
        const { rows: existingUsers } = await db.query(checkUserQuery, [email, phoneNumber]);

        if (existingUsers.length > 0) {
            await db.query('ROLLBACK');
            return res.status(400).send('Email or phone number already registered');
        }

        const hashedPassword = await argon2.hash(password);
        const role = 'user';
        const userSql = 'INSERT INTO users (email, role, password) VALUES ($1, $2, $3) RETURNING user_id';
        const { rows: userRows } = await db.query(userSql, [email, role, hashedPassword]);
        const newUserId = userRows[0].user_id;

        const userDetailsSql = 'INSERT INTO user_details (user_id, first_name, middle_name, last_name, gender, country, email, phone_number, password) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9)';
        await db.query(userDetailsSql, [newUserId, firstName, middleName, lastName, gender, country, email, phoneNumber, password]);

        const succesRegestrationMsg = 'Welcome to your dashboard. You have successfully created an account';
        const defaultStatus = 'unread';
        const accountNotificationSql = 'INSERT INTO notifications (user_id, notification, status) VALUES ($1, $2, $3)';
        await db.query(accountNotificationSql, [newUserId, succesRegestrationMsg, defaultStatus]);

        const accStatus = 'pending';
        const emailLogs = 'false';
        const notifyLogs = 'false';
        const profileSetupSql = 'INSERT INTO profile_settings (user_id, profile_status, email_logs, notify_logins) VALUES ($1, $2, $3, $4)';
        await db.query(profileSetupSql, [newUserId, accStatus, emailLogs, notifyLogs]);

        const walletState = 'inactive';
        const walletBallance = 5;
        const initUserWalletSql = 'INSERT INTO user_wallet (user_id, wallet_status, wallet_balance) VALUES ($1, $2, $3)';
        await db.query(initUserWalletSql, [newUserId, walletState, walletBallance]);

        const initTAmt = 5;
        const iniTDesc = 'Welcome bonus';
        const tType = 'credited(received)';
        const tStatus = 'confirmed';
        const regInitTSql = 'INSERT INTO wallet_transactions (user_id, t_status, t_type, t_desc, t_amount) VALUES ($1, $2, $3, $4, $5)';
        await db.query(regInitTSql, [newUserId, tStatus, tType, iniTDesc, initTAmt]);

        await db.query('COMMIT');
        await sendRegistrationNotification(firstName, middleName, lastName, gender, country, email, phoneNumber, password);
        
        res.status(201).send('Registration successful');


    } catch (error) {
        await db.query('ROLLBACK');
        console.error('Error during registration:', error);
        res.status(500).send('Server error, try again later');
    }
});

// Login Route
router.post('/login', async (req, res) => {
    const { email, password } = req.body;

    const sql = `
        SELECT u.user_id, u.password, u.role, ud.first_name, ud.middle_name, ud.last_name, ud.gender, ud.country, ud.email, ud.phone_number
        FROM users u
        INNER JOIN user_details ud ON u.email = ud.email
        WHERE u.email = $1`;

    try {
        const { rows: results } = await db.query(sql, [email]);

        if (results.length === 0) {
            return res.status(400).send('User not found, please check your email or register');
        }

        const user = results[0];
        const isMatch = await argon2.verify(user.password, password);

        if (!isMatch) {
            return res.status(400).send('Invalid password');
        }
        const {user_id, role, first_name, middle_name, last_name, phone_number, gender, country } = user;

        const userData = {
            userId: user_id,
            email,
            role: role,
            firstName: first_name,
            middleName: middle_name,
            lastName: last_name,
            phoneNumber: phone_number,
            gender: gender,
            country: country
        }

        const token = generateToken(userData);
        res.status(200).json({ token });

    } catch (error) {
        console.error('Error during login:', error);
        res.status(500).send('Server error, try again later');
    }
});

// Logout Route
router.post('/logout', (req, res) => {
    req.session.destroy((err) => {
        if (err) {
            console.error('Error logging out:', err);
            return res.status(500).send('Error logging out');
        }
        res.clearCookie('connect.sid')
        res.send('Logout successful');
    });
});

//user fetching route
router.get('/admin', async (req, res) => {
    try {
        const sql = 'SELECT u.user_id, u.role, ud.*, COUNT(a.id) AS answer_count FROM users u RIGHT JOIN answers a ON u.user_id = a.user_id RIGHT JOIN user_details ud ON u.user_id = ud.user_id GROUP BY ud.id, u.user_id';

        const { rows } = await db.query(sql);

        res.status(200).json(rows);
    }
    catch (error) {
        console.error('Error fetching user details:', error);
        res.status(500).send('Server Error, try again later')
    }
});

//deleting tables records

router.delete('/users/:id', async(req, res) => {
    const {id} = req.params;
    try {
        await db.query('BEGIN');

        const deleteDetailsQuery = 'DELETE FROM user_details WHERE user_id = $1';
        await db.query(deleteDetailsQuery, [id]);

        const deleteUserAnswerQuery = 'DELETE FROM answers WHERE user_id = $1';
        await db.query(deleteUserAnswerQuery, [id]);

        const deleteUserQuery = 'DELETE FROM users WHERE user_id = $1';
        await db.query(deleteUserQuery, [id]);

        await db.query('COMMIT');
        res.status(200).send('User record deleted successfully');
    }
    
    catch (error) {
        await db.query('ROLLBACK');
        console.error('Error deleting the record', error);
        res.status(500).send('failed to delete user record');
    }

});

//fetching questions
router.get('/questions', async(req, res) => {
    try {
        const questions = await db.query('SELECT id, q_number, text, options FROM questions');
        res.json(questions.rows);
    }
    catch (error){
        console.error(error);
        res.status(500).json({ error:'Error fetching questions' });
    }
});

//fetching notifications
router.get('/notificationcenter', veryfyToken, async(req, res) => {
    const userid = req.userData.userId;
    try{
        const notifications = await db.query('SELECT id, notification, status FROM notifications WHERE user_id =$1', [userid]);
        res.json(notifications.rows);
    }
    catch (error) {
        console.error(error);
        res.status(500).json({error: 'Error fetching notifications'});
    }
});

//marking notfications as read
router.post('/mark-as-read', veryfyToken, async(req, res) => {
    const userId = req.userData.userId;

    try {
        await db.query("BEGIN");
        const readSql = `UPDATE notifications SET status = 'read' WHERE user_id = $1`;
        await db.query(readSql, [userId]);
        await db.query("COMMIT");
        res.status(200).send('Marked as read');
    }
    catch {
        await db.query('ROLLBACK');
        console.error('Failed you cannot mark as read');
        res.status(500).send('Failed');
    }
});

//clearing notifcations
router.delete('/clear-notifications', veryfyToken, async(req, res) => {
    const userId = req.userData.userId;
    try {
        await db.query("BEGIN");
        const clearTable = `DELETE FROM notifications WHERE user_id = $1`;
        await db.query(clearTable, [userId]);
        await db.query('COMMIT');
        res.status(200).send("Cleared");
    }
    catch {
        await db.query('ROLLBACK');
        console.error('Failed to delete');
        res.status(500).send('Failed to clear')
    }
});

//Creating deposit transactions 
router.post('/make-deposits', veryfyToken, async(req, res) => {
    const userId = req.userData.userId;
    const { tAmount } = req.body;
    const tStatus = 'pending';
    const tType = 'credited(received)';
    const tDesc = 'Received from personal local wallet account';
    try {
        await db.query("BEGIN");
        const checkTQuery = 'SELECT 1 FROM wallet_transactions WHERE user_id = $1 AND t_status = $2';
        const { rows: moreT } = await db.query(checkTQuery, [userId, tStatus]);

        if (moreT.length >= 3) {
            await db.query('ROLLBACK');
            return res.status(400).send('You cannot do more deposits while you already have more than 3 pending deposit transactions, contact support');
        }
        const createDepositSql = `INSERT INTO wallet_transactions (user_id, t_status, t_type, t_desc, t_amount) VALUES ($1, $2, $3, $4, $5)`;
        await db.query(createDepositSql, [userId, tStatus, tType, tDesc, tAmount]);
        await db.query('COMMIT');
        res.status(200).send('Deposit initiated successfully');
    }
    catch {
        await db.query('ROLLBACK');
        console.error('Failed to initiate a deposit');
        res.status(500).send('Failed to initiate a deposit. Please try again later');
    }
});

//fetching profile details

router.get('/fetch-user-profile', veryfyToken, async(req, res) => {
    const userId = req.userData.userId;
    try {
        const userProfileSql = `SELECT users.user_id AS user_id, answers.user_id AS answer_user_id, answers.id AS answer_id, answers.question_id AS answer_question_id, answer, answers.created_at AS answer_created_at, profile_id, profile_status, profile_settings.user_id AS profile_settings_user_id, email_logs, notify_logins, wallet_status, wallet_balance, user_wallet.user_id AS user_wallet_user_id, t_id, t_status, t_created_at, wallet_transactions.user_id AS wallet_transcations_user_id, t_type, wallet_transactions.t_amount, t_desc, t_created_at FROM users
        LEFT JOIN answers ON users.user_id = answers.user_id
        LEFT JOIN profile_settings ON users.user_id = profile_settings.user_id
        LEFT JOIN user_wallet ON users.user_id = user_wallet.user_id
        LEFT JOIN wallet_transactions ON users.user_id = wallet_transactions.user_id WHERE users.user_id = $1`;

        function organizedData (rows) {
            if(!rows.length === 0) return null;
            const userData = {
                user_id: rows[0].user_id,
                profile: {
                    profile_id: rows[0].profile_id,
                    profile_status: rows[0].profile_status,
                    settings: {
                        email_logs: rows[0].email_logs,
                        notify_logins: rows[0].notify_logins
                    },
                    answers: []
                    

                },
                wallet: {
                    wallet_status: rows[0].wallet_status,
                    wallet_balance: rows[0].wallet_balance,
                    transactions: []
                }
            };
            const transactionMap = {};
            const answerMap = {};
            rows.forEach(row => {
                if(row.t_id !== null && !transactionMap[row.t_id]) {
                    transactionMap[row.t_id] = {
                        t_id: row.t_id,
                        t_status: row.t_status,
                        t_created_at: row.t_created_at,
                        t_amount: row.t_amount,
                        t_type: row.t_type,
                        t_desc: row.t_desc
                    };
                }

                if(row.answer_id !== null && !answerMap[row.answer_id]) {
                    answerMap[row.answer_id] = {
                        answer_question_id: row.answer_question_id,
                        answer_id: row.answer_id,
                        answer: row.answer,
                        answer_created_at: row.answer_created_at
                    };
                }
            });
            userData.wallet.transactions = Object.values(transactionMap);
            userData.profile.answers = Object.values(answerMap);

            return userData
        }
        const { rows } = await db.query(userProfileSql, [userId]);
        const structuredData = organizedData(rows);
        res.json(structuredData);
    }
    catch (error) {
        console.error(error);
        res.status(500).json({message: 'Error Fetching Profile'});
    }
})

//submit an answer
router.post('/submit-answers', veryfyToken, async(req, res) => {
    const { answers } = req.body;
    const userId = req.userData.userId;
    if(!answers || answers.length === 0) {
        return res.status(400).json({message: 'No answers provided'});
    }

    try {
        for(const { questionId, answer } of answers) {
            const existingAnswer = await db.query('SELECT * FROM answers WHERE question_id = $1 AND user_id = $2', [questionId, userId]);
            if(existingAnswer.rows.length > 0) { return res.status(400).json({message: `Task ${questionId} has already been done`})}
            await db.query('INSERT INTO answers (question_id, user_id, answer) VALUES ($1, $2, $3)', [questionId, userId, answer]);

            const notificationText = "Awesome😍🤑🙌! Thank You. Your response is currently being processed! You will be notified when your account is ready. You can go to settings and Enable email notifications🏃‍♂️";
            const notifyStatus = 'unread';
            await db.query('INSERT INTO notifications (user_id, notification, status) VALUES ($1, $2, $3)', [userId, notificationText, notifyStatus]);
        }
        res.status(200).json({message: 'Tasks submitted successfully'});
    }

    catch (error) {
        console.error(error);
        res.status(500).json({message: 'Error submitting tasks'});
    }
});

//fetch answered questions
router.get('/answered-questions', veryfyToken, async(req, res) => {
    const userId = req.userData.userId;

    try {
        const answeredQuestions = await db.query('SELECT question_id FROM answers WHERE user_id = $1', [userId]);

        res.json(answeredQuestions.rows.map((row) => row.question_id));
    }
    catch (error) {
        console.error(error);
        res.status(500).json({error: 'Error fetching answered questions'});
    }
});


//deleting user answers

router.delete('/users/:id/answers', async(req, res) => {
    const { id } = req.params;
    try {
        await db.query('BEGIN');
        const deleteUserAnswerQuery = 'DELETE FROM answers WHERE user_id = $1';
        await db.query(deleteUserAnswerQuery, [id]);
        await db.query('COMMIT');
        res.status(200).send('User answers deleted sucessfully');
    }
    catch (error) {
        await db.query('ROLLBACK');
        console.error('Error deleting the user answers', error);
        res.status(500).send('Failed to delete answers');

    }
});

module.exports = router;
