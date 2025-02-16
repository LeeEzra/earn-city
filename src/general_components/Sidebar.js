import React, { useState, useRef, useEffect } from "react";
import { Navigate, useNavigate } from 'react-router-dom';
import "../sidebar.css";
import menuCloseIcon from '../images/icons/close.svg';
import menuOpenIcon from '../images/icons/menu.svg';
import dashBoardIcon from '../images/icons/dashboard.svg';
import profileSetupIcon from '../images/icons/settings.svg';
import aboutIcon from '../images/icons/info.svg';
import powerOpt from '../images/icons/power_settings.svg';

const Sidebar = () => {
    const [isOpen, setIsOpen] = useState(false);
    const sidebarRef = useRef(null);
    const navigate = useNavigate();
    const [loading, setLoading] = useState(true);

    // Toggle sidebar visibility
    const toggleMenu = () => setIsOpen(!isOpen);

    // Close sidebar when clicking outside
    useEffect(() => {
        const handleClickOutside = (event) => {
            if (sidebarRef.current && !sidebarRef.current.contains(event.target)) {
                setIsOpen(false);
            }
        };

        const handleKeyDown = (event) => {
            if (event.key === "Escape") {
                setIsOpen(false);
            }
        };

        document.addEventListener("mousedown", handleClickOutside);
        document.addEventListener("keydown", handleKeyDown);

        return () => {
            document.removeEventListener("mousedown", handleClickOutside);
            document.removeEventListener("keydown", handleKeyDown);
        };
    }, []);
    const goToDashboard = () => {
        navigate('/dashboard');
      }
    const goToProfile = () => {
        navigate('/profile');
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

    return (
        <>
            {/* Button to open sidebar */}
            <div className="menu-open-btn" onClick={toggleMenu}>
                <img className="nav-toggle-icon"  src={menuOpenIcon} alt="Close" />
            </div>

            {/* Backdrop (clicking it closes the sidebar) */}
            {isOpen && <div className="backdrop" onClick={() => setIsOpen(false)}></div>}

            {/* Sidebar */}
            <div ref={sidebarRef} className={`sidebar ${isOpen ? "open" : ""}`}>
            <div className="close-btn" onClick={toggleMenu}>
                <img className="close-btn-img"  src={menuCloseIcon} alt="Close" />
            </div>
            <div className="nav-menu-button-container">
          <div className="nav-menu-button" onClick={goToDashboard}>
            <img className="nav-menu-icon" src={dashBoardIcon} alt="Dashboard" /><a>Dashboard</a>
          </div>
          <div  className="nav-menu-button" onClick={goToProfile}>
            <img className="nav-menu-icon" src={profileSetupIcon} alt="Profile" /><a>Profile and Settings</a>
          </div>
          <div className="nav-menu-button">
            <img className="nav-menu-icon" src={aboutIcon} alt="About" /><a>About us</a>
          </div>
          <div className="nav-menu-button" onClick={handleLogout}>
            <img className="nav-menu-icon" src={powerOpt} alt="Logout" /><a>Logout</a>
          </div>
        </div>
            </div>
        </>
    );
};

export default Sidebar;