import React, { useState } from "react";
import { LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer } from "recharts";
import "../profile.css";
import ProfilePic from '../images/profile/boy.png';
import Sidebar from "./Sidebar";
const Profile = () => {
    const [darkMode, setDarkMode] = useState(false);
    const [notifications, setNotifications] = useState(true);

    // Example user data
    const user = {
        name: "Test Names",
        email: "test46@gmail.com",
        location: "New York, USA",
        bio: "Software Engineer | React Enthusiast | Tech Blogger",
        avatar: ProfilePic,
        cover: "https://source.unsplash.com/1000x400/?nature,technology",
        balance: "$12,540.75",
        accountStatus: "Active",
    };

    const data = [
        { name: "Jan", balance: 0 },
        { name: "Feb", balance: 0 },
        { name: "Mar", balance: 0 },
        { name: "Apr", balance: 0 },
        { name: "May", balance: 0 },
        { name: "Jun", balance: 1 },
    ];

    return (<>
        {
            <Sidebar />
        }
        <div className={`profile-container ${darkMode ? "dark-mode" : ""}`}>
            {/* Cover Photo */}
            <div className="cover-photo" style={{ backgroundImage: `url(${user.cover})` }}>
                <div className="overlay"></div>
            </div>

            {/* Profile Info */}
            <div className="profile-info">
                <img src={user.avatar} alt="Profile" className="profile-avatar" />
                <h2 className="profile-name">{user.name}</h2>
                <p className="profile-bio">{user.bio}</p>
                <div className="profile-details">
                    <p><strong>Email:</strong> {user.email}</p>
                    <p><strong>Location:</strong> {user.location}</p>
                </div>
            </div>

            {/* Account Cards */}
            <div className="cards">
                <div className="card">
                    <h3>Account Balance</h3>
                    <p className="balance">{user.balance}</p>
                </div>
                <div className="card">
                    <h3>Account Status</h3>
                    <p className={`status ${user.accountStatus === "Active" ? "active" : "inactive"}`}>
                        {user.accountStatus}
                    </p>
                </div>
            </div>

            {/* Graph */}
            <div className="graph-card">
                <h3>Account Growth</h3>
                <ResponsiveContainer width="100%" height={250}>
                    <LineChart data={data}>
                        <XAxis dataKey="name" stroke="#8884d8" />
                        <YAxis />
                        <Tooltip />
                        <Line type="monotone" dataKey="balance" stroke="#007bff" strokeWidth={2} />
                    </LineChart>
                </ResponsiveContainer>
            </div>
            {/* Toggle Switches */}
            <div className="toggles">
                <div className="toggle">
                    <span>Dark Mode</span>
                    <div className={`toggle-switch ${darkMode ? "active" : ""}`} onClick={() => setDarkMode(!darkMode)}>
                        <div className="toggle-circle"></div>
                    </div>
                </div>
                <div className="toggle">
                    <span>Notifications</span>
                    <div className={`toggle-switch ${notifications ? "active" : ""}`} onClick={() => setNotifications(!notifications)}>
                        <div className="toggle-circle"></div>
                    </div>
                </div>
            </div>
        </div>
        </>
    );
};

export default Profile;