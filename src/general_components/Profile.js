import React, { useEffect, useState} from 'react';
import { Navigate, useNavigate } from 'react-router-dom';
import { LineChart, Line, XAxis, YAxis,Tooltip, ResponsiveContainer } from 'recharts';
import TransactionChart from './TransactionsChart';
import "../profile.css";
import ProfilePicBoy from '../images/profile/boy.png';
import ProfilePicGirl from '../images/profile/woman 2.png';
import Sidebar from "./Sidebar";
import Paymentcard from './Paymentcard';
const Profile = () => {
    const [darkMode, setDarkMode] = useState(false);
    const [notifications, setNotifications] = useState(true);
    const [userData, setProfileDetails] = useState([]);
    const [loading, setLoading] = useState(true);
    const [isAuthenticated, setIsAuthenticated] = useState(true);
    const [user, setUser] = useState(null);

    // Example user data
    const user2 = {
        bio: "No About",
        avatar: ProfilePicBoy,
        cover:'',
    };

    const graphData = [
        {name: "Dec, 2024", balance: 0, balance2: 0},
        { name: "Jan, 2025", balance: 0, balance2: 0 },
        { name: "Feb, 2025", balance: 5, balance2: 0},
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
      const currencyForamatter = (value) => {
        return value.toLocaleString('en-US', {style: 'currency', currency: 'USD'});
      };
      function capitalizer (str) {
        return str.charAt(0).toUpperCase() + str.slice(1);
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
                <img src={user.gender === 'male' ? ProfilePicBoy : ProfilePicGirl} alt="Profile" className="profile-avatar" />
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
                    <p className="balance">${(userData.wallet.wallet_balance).toLocaleString("en-US")}.00</p>
                </div>
                <div className="card">
                    <h3>Account Status</h3>
                    <p className={`status ${userData.profile.profile_status === "active" ? "active": userData.profile.profile_status === "pending" ?  "pending" : userData.profile.profile_status === "suspended" ? "suspended" : "inactive"}`}>{capitalizer(userData.profile.profile_status)}<br />{userData.profile.profile_status === 'pending' ? <Paymentcard /> : null}</p>
                </div>
            </div>

            {/* Graph */}
            <div className="graph-card">
                <h3>RECENT TRANSACTIONS</h3><br />
                <div className='graph-card-container'>
                    <ResponsiveContainer width="100%" height={250}>
                        <LineChart data={graphData}>
                            <XAxis dataKey='name' stroke='#8884d8' />
                            <YAxis tickFormatter={currencyForamatter}/>
                            <Line type='monotone' dataKey='balance' stroke='#007bff' strokeWidth={2} />
                            <Line type='monotone' dataKey='balance2' stroke='#000000' strokeWidth={2} />
                        </LineChart>
                    </ResponsiveContainer>
                </div>
                {userData.wallet.transactions.length > 0 ? (
                    <><div className='transactions-card-container'>{
                    userData.wallet.transactions.map(transaction => (
                        <div key={transaction.t_created_at} className='transaction-card'>
                            <p><strong>Transaction ID: </strong>{transaction.t_id}</p>
                            <p><strong>{capitalizer(transaction.t_type)}</strong> -{transaction.t_desc}</p>
                            <p className={`transaction-status ${transaction.t_status === "confirmed" ? "confirmed" : transaction.t_status === "pending" ? "pending" : "declined"}`}><strong>{capitalizer( transaction.t_status)}</strong></p>
                            <p><strong>Amount: </strong>${(transaction.t_amount).toLocaleString('en-US')}.00</p>
                            <p><strong>Date: </strong><code>{new Date(transaction.t_created_at).toLocaleString("en-US")}</code></p>
                        </div>
                    )) }</div>
                    </>
                ) : (
                    <p><center>No recent transactions</center></p>
                )}
            </div>
        </div>
    )}
        </>
    );
};

export default Profile;