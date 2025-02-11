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
import UserContent from '../user_components/UserContent';
import profileSetupIcon from '../images/icons/settings.svg';
import aboutIcon from '../images/icons/info.svg';
import homeIcon from '../images/icons/home.svg';
import AdminContent from '../admin_components/AdminContent';

function Dashboard() {
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState(null);
  const [isAuthenticated, setIsAuthenticated] = useState(true);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
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

  const handleLogout = async () => {
    if (!window.confirm('Are you sure you want to log out?')) return;

    try {
      await axios.post('/auth/logout', {}, { withCredentials: true });
      localStorage.removeItem('token');
      setIsAuthenticated(false);
      navigate('/login');
    } catch (error) {
      console.error('Logout failed:', error.message);
      alert('Logout failed. Please try again later.');
    }
  };
  

  const toggleMenu = () => {
    setIsMenuOpen((prev) => !prev);
  };

  if (loading) {
    return <div>Loading...</div>;
  }

  if (!isAuthenticated) {
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
        </div>
      </div>
      <div className={`nav-container ${isMenuOpen ? 'active' : ''}`}>
        <div className="close-btn" onClick={toggleMenu}>
          <img className="close-btn-img"  src={menuCloseIcon} alt="Close" />
        </div>
        <div className="nav-menu-button-container">
          <div className="nav-menu-button" >
          <img className="nav-menu-icon" src={homeIcon} alt="Logout" /><a>Home</a>
        </div>
        <div  className="nav-menu-button" >
          <img className="nav-menu-icon" src={profileSetupIcon} alt="Logout" /><a>Profile and Settings</a>
        </div>
        
        
        <div className="nav-menu-button">
          <img className="nav-menu-icon" src={aboutIcon} alt="Logout" /><a>About us</a>
        </div>
        <div className="nav-menu-button" onClick={handleLogout}>
          <img className="nav-menu-icon" src={powerOpt} alt="Logout" /><a>Logout</a>
        </div>
        </div>
        <nav className="nav-menu"></nav>
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