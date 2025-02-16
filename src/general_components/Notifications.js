import React, { useEffect, useState } from 'react';
import { Navigate, useNavigate } from 'react-router-dom';
import profileMale from '../images/profile/boy.png';
import profileFemale from '../images/profile/woman.png';
import ProfileOther from '../images/profile/other.png';
import ThemeToggle from './ThemeToggle';
import axios from 'axios';
import dashBoardIcon from '../images/icons/dashboard.svg';
import Sidebar from './Sidebar';

function Notifcations() {
  const [loading, setLoading] = useState(true);
  const [notifications, setNotifications] = useState([]);
  const [user, setUser] = useState(null);
  const [isAuthenticated, setIsAuthenticated] = useState(true);
  const navigate = useNavigate();

const fetchNotifications = async () => {
    setLoading(true);
    const token = localStorage.getItem('token');
    try {
      const response = await fetch('/auth/notificationcenter', {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (!response.ok) {
        alert("Error fetching notifications");
        const errorData = await response.json();
        throw new Error(errorData.message || 'Failed to fetch notifications.');
      }
      const data = await response.json();
      setNotifications(data);
    }
    catch (error){
      console.error('Error fetching notifications', error);
      alert("Error fetching");
    }
    finally {
      setLoading(false);
    }
};

  useEffect(() => {
    const token = localStorage.getItem('token');
    fetchNotifications();

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

const marksAsRead = async () => {
  try {
    setLoading(true);
      const response = await fetch('/auth/mark-as-read', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${localStorage.getItem('token')}`,
      },
    });
    if (!response.ok) {
      const errorData = await response.json();
      console.error('Error submitting answers:', errorData.message);
      alert(`Error: ${errorData.message}`);
      return;
    }
    fetchNotifications();

  }
  catch (error) {
    console.error('Failed:', error.message);
    alert('Failed try again later');
  }
  finally {
    setLoading(false);
    
  }
}
const clearNotes = async () => {
  try {
    setLoading(true);
    await axios.delete('/auth/clear-notifications', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${localStorage.getItem('token')}`
      },
    });
    fetchNotifications();
  }
  catch (error) {
    console.error('Failed', error.message);
  }
  finally {
    setLoading(false);
  }
}
  const handleLogout = async () => {
    if (!window.confirm('Are you sure you want to log out?')) return;

    try {
      setLoading(true);
      await axios.post('/auth/logout', {}, { withCredentials: true });
      localStorage.removeItem('token');
      setIsAuthenticated(false);
      navigate('/login');
    }
    catch (error) {
      console.error('Logout failed:', error.message);
      alert('Logout failed. Please try again later.');
    }
    finally {
      setLoading(false);
    }

  };
  const goToDashboard = () => {
    navigate('/dashboard');
  }
  

  const toggleMenu = () => {
    setIsMenuOpen((prev) => !prev);
  };

  if (!isAuthenticated) {
    return <Navigate to="/login" />;
  }
  const countUnread = notifications.filter(fruit => fruit.status === 'unread').length;
  const Refresh = async () => {
    fetchNotifications();
  }

  return (
    <>
      <div className="navbar">
        {user && (
          <div className="profile">
            <div>
              <img
                src={
                  user.gender === 'male'
                    ? profileMale
                    : user.gender === 'female'
                    ? profileFemale
                    : ProfileOther
                }
                className="profile-img"
                alt={
                  user.gender === 'male'
                    ? 'Male Icon'
                    : user.gender === 'female'
                    ? 'Female Icon'
                    : 'Icon'
                }
              />
            </div>
            <div className="profile-info-old">
              <div className="profile-names">{user.firstName}</div>
              <div className="profile-adm">{user.role}</div>
            </div>
          </div>
        )}
        <div className="controls-btns">
          <Sidebar />
          <ThemeToggle />
          <div className='dashboard-button' onClick={goToDashboard}>
            <img className='dashboard-icon' src={dashBoardIcon} />
          </div>
        </div>
      </div>
      <main>
        <div className='notifications-body'>
            <h2>Notifications</h2>
            {
              loading ? (
                <div>Loading...</div>
              ) : (null)
            }
            {
               countUnread >= 1 ? (
                <button className='notificationa-card-mark-as-read-button' onClick={marksAsRead} ><a>Mark all as Read</a></button>
              ) : notifications.length === 0 ? (
                null
              ) : (
                  <button className='notification-card-delete-button' onClick={clearNotes}><a>Clear all</a></button>
              )
            }
            {
                notifications.length === 0 ? ( <>
                <p>You Do not have any unread notifications. Notifications will appear here</p>
                    <button onClick={Refresh}>Refresh</button>
                    </>
                ) : (

                    notifications.map((notif) => (
                        <div key={notif.id} className='notification-card'>
                          {
                            notif.status === 'unread' ? (
                              <div className='unread-notif-dot'></div>
                            ) : null
                          }
                            <p>{notif.notification}</p> {
                            }
                        </div>
                    ))
                )
            }
        </div>
      </main>
    </>
  );
}

export default Notifcations;