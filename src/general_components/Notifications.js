import React, { useEffect, useState } from 'react';
import { Navigate, useNavigate } from 'react-router-dom';
import profileMale from '../images/profile/boy.png';
import profileFemale from '../images/profile/woman.png';
import ProfileOther from '../images/profile/other.png';
import menuIcon from '../images/icons/menu.svg';
import menuCloseIcon from '../images/icons/close.svg';
import powerOpt from '../images/icons/power_settings.svg';
import ThemeToggle from './ThemeToggle';
import axios from 'axios';
import profileSetupIcon from '../images/icons/settings.svg';
import aboutIcon from '../images/icons/info.svg';
import dashBoardIcon from '../images/icons/dashboard.svg';

function Notifcations() {
  const [loading, setLoading] = useState(true);
  const [notifications, setNotifications] = useState([]);
  const [user, setUser] = useState(null);
  const [isAuthenticated, setIsAuthenticated] = useState(true);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const navigate = useNavigate();

  const fetchNotifications = async () => {
    setLoading(true);
    const token = localStorage.getItem('token');
    try {
      const response = await fetch('/auth/notificationcenter', {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Failed to fetch notifications.');
      }
      const data = await response.json();
      setNotifications(data);
    }
    catch (error){
      console.error('Error fetching notifications', error);
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
      await fetch('/auth/mark-as-read', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${localStorage.getItem('token')}`,
      },
    });
    alert('Marked as Read! You can delete the messages if you want');
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
    const response = axios.delete('/auth//clear-notifcations', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${localStorage.getItem('token')}`
      },
    });
    alert("Cleared successfully");
    fetchNotifications();
  }
  catch (error) {
    console.error('Failed', error.message);
    alert('Failed try again later');
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
            <div className="profile-info">
              <div className="profile-names">{user.firstName}</div>
              <div className="profile-adm">{user.role}</div>
            </div>
          </div>
        )}
        <div className="controls-btns">
          <div className="nav-toggle" onClick={toggleMenu}>
            <img className="nav-toggle-icon" src={menuIcon} alt="Menu" />
          </div>
          <ThemeToggle />
          <div className='dashboard-button' onClick={goToDashboard}>
            <img className='dashboard-icon' src={dashBoardIcon} />
          </div>
        </div>
      </div>
      <div className={`nav-container ${isMenuOpen ? 'active' : ''}`}>
        <div className="close-btn" onClick={toggleMenu}>
          <img className="close-btn-img"  src={menuCloseIcon} alt="Close" />
        </div>
        <div className="nav-menu-button-container">
          <div className="nav-menu-button" onClick={goToDashboard}>
            <img className="nav-menu-icon" src={dashBoardIcon} alt="Dashboard" /><a>Dashboard</a>
          </div>
          <div  className="nav-menu-button" >
            <img className="nav-menu-icon" src={profileSetupIcon} alt="Profile" /><a>Profile and Settings</a>
          </div>
          <div className="nav-menu-button">
            <img className="nav-menu-icon" src={aboutIcon} alt="About" /><a>About us</a>
          </div>
          <div className="nav-menu-button" onClick={handleLogout}>
            <img className="nav-menu-icon" src={powerOpt} alt="Logout" /><a>Logout</a>
          </div>
        </div>
        <nav className="nav-menu"></nav>
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
                  <button className='notification-card-delete-button' onClick={clearNotes}><a>Delete all</a></button>
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