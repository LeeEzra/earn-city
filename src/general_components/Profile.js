import React, { useEffect, useState } from 'react';
import { LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer } from "recharts";
import "../profile.css";
import ProfilePic from '../images/profile/boy.png';
import Sidebar from "./Sidebar";
import coverPic from '../images/profile/cover-photo.PNG'
const Profile = () => {
    const [darkMode, setDarkMode] = useState(false);
    const [notifications, setNotifications] = useState(true);
    const [loading, setLoading] = useState(true);
    const [user, setUser] = useState(null);

    // Example user data
    const user2 = {
        email: "test46@gmail.com",
        location: "Nairobi, Kenya",
        bio: "Software Engineer | React Enthusiast | Tech Blogger",
        avatar: ProfilePic,
        cover:'',
        balance: "$540.75",
        accountStatus: "Active",
    };

    const data = [
        { name: "Jan", balance: 5 },
        { name: "Feb", balance: 0 },
        { name: "Mar", balance: 3 },
        { name: "Apr", balance: 2 },
        { name: "May", balance: 0 },
        { name: "Jun", balance: 5 },
    ];
    useEffect(() => {
        const token = localStorage.getItem('token');
    
        if (!token) {
          setIsAuthenticated(false);
          setLoading(false);
          return;
        }
    
        try {
          const parts = token.split('.');
          if (parts.length !== 3) {
            throw new Error('Invalid session format');
          }
          const decodedToken = JSON.parse(atob(parts[1]));
          if (decodedToken.exp < Date.now() / 1000) {
            throw new Error('Session expired');
          }
          setUser(decodedToken);
        } catch (error) {
          console.error('Error decoding session:', error.message);
          setIsAuthenticated(false);
        } finally {
          setLoading(false);
        }
      }, []);

    return (<>
        {
            <Sidebar />
        }
        {user && (
            <div className={`profile-container ${darkMode ? "dark-mode" : ""}`}>
            {/* Cover Photo */}
            <div className="cover-photo" style={{ backgroundImage: `url(${user2.cover})` }}>
                <div className="overlay"></div>
            </div>

            {/* Profile Info */}
            <div className="profile-info">
                <img src={user2.avatar} alt="Profile" className="profile-avatar" />
                <h2 className="profile-name">{user.firstName} {user.middleName} {user.lastName}</h2>
                <p className="profile-bio">{user2.bio}</p>
                <div className="profile-details">
                    <p><strong>Email:</strong> {user.email}</p>
                    <p><strong>Country:</strong> {user2.location}</p>
                </div>
            </div>

            {/* Account Cards */}
            <div className="cards">
                <div className="card">
                    <h3>Account Balance</h3>
                    <p className="balance">{user2.balance}</p>
                </div>
                <div className="card">
                    <h3>Account Status</h3>
                    <p className={`status ${user2.accountStatus === "Active" ? "active" :  "pending"}`}>
                        {user2.accountStatus}
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
    )}
        </>
    );
};

export default Profile;