import React, { useEffect, useState} from 'react';
import { Navigate, useNavigate } from 'react-router-dom';
import { LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer } from "recharts";
import "../profile.css";
import ProfilePic from '../images/profile/boy.png';
import Sidebar from "./Sidebar";
const Profile = () => {
    const [darkMode, setDarkMode] = useState(false);
    const [notifications, setNotifications] = useState(true);
    const [userData, setProfileDetails] = useState([]);
    const [loading, setLoading] = useState(true);
    const [isAuthenticated, setIsAuthenticated] = useState(true);
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
    const fetchProfile = async () => {
        const token = localStorage.getItem('token');
        setLoading(true);
        try {
            const response = await fetch('/auth/fetch-user-profile', {
                headers: { Authorization: `Bearer ${token}` },
              });
              if (!response.ok) {
                alert("Error fetching Profile");
                const errorData = await response.json();
                throw new Error(errorData.message || 'Failed to fetch Profile.');
              }
              const data = await response.json();
              setProfileDetails(data);
        }
        catch (error) {
            console.error('Error fetching user details:', error.message);
            setIsAuthenticated(false);
        }
        finally {
            setLoading(false);
        }
    }
    useEffect(() => {
        const token = localStorage.getItem('token');
        setLoading(true);
        if (!token) {
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
        fetchProfile();
      }, []);
      if (!isAuthenticated) {
        return <Navigate to="/login" />;
      }

      if(loading) {
        return <div>Loading...</div>
      }

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
                    <p><strong>Country:</strong> {user.country}</p>
                </div>
            </div>

            {/* Account Cards */}
            <div className="cards">
                <div className="card">
                    <h3>Account Balance</h3>
                    <p className="balance">KSH. {userData.wallet.wallet_balance}</p>
                </div>
                <div className="card">
                    <h3>Account Status</h3>
                    <p className={`status ${userData.profile.profile_status === "active" ? "active": userData.profile.profile_status === "pending" ?  "pending" : userData.profile.profile_status === "suspended" ? "suspended" : "inactive"}`}>
                        {userData.profile.profile_status}
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