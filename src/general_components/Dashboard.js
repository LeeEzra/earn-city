import React, { useEffect, useState } from 'react';
import { Navigate, useNavigate } from 'react-router-dom';
import profileMale from '../images/profile/boy.png';
import profileFemale from '../images/profile/woman.png';
import ProfileOther from '../images/profile/other.png';
import ThemeToggle from './ThemeToggle';
import UserContent from '../user_components/UserContent';
import AdminContent from '../admin_components/AdminContent';
import notifcationIcon from '../images/icons/notifications.svg';
import Sidebar from './Sidebar';

function Dashboard() {
  const [loading, setLoading] = useState(true);
  const [notificationi, setNotifications] = useState([]);
  const [user, setUser] = useState(null);
  const [isAuthenticated, setIsAuthenticated] = useState(true);
  const navigate = useNavigate();

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
        alert("Session expired please log in again");
        throw new Error('Session expired');
      }
      setUser(decodedToken);
    } catch (error) {
      console.error('Error decoding session:', error.message);
      setIsAuthenticated(false);
    } finally {
      setLoading(false);
    }
    const fetchNotifications = async () => {
      const response = await fetch('/auth/notificationcenter', {
          headers: { Authorization: `Bearer ${token}` },
        });
        if (!response.ok) {
          const errorData = await response.json();
          throw new Error(errorData.message || 'Failed to fetch notifications.');
        }
        const data = await response.json();
      setNotifications(data);
  }; fetchNotifications();
  }, []);
  const notifications = () => {
    navigate('/notifications');
  }
  if (loading) {
    return <div>Loading...</div>;
  }

  if (!isAuthenticated) {
    alert("Please login");
    return <Navigate to="/login" />;
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
          <div className='notify-div' onClick={notifications}>
            {
              notificationi.length === 0 ? null : (
                <div className='small-red-notify-dot'></div>
              )
            }
            <img className='notifications-icon' src={notifcationIcon} />
          </div>
        </div>
      </div>
      <main>
        <section id="dashboard">
          {user && user.role === 'admin' ? <AdminContent /> : <UserContent />}
        </section>
      </main>
    </>
  );
}

export default Dashboard;