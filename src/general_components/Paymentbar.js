import React, { useState, useRef, useEffect } from "react";
import { Navigate, useNavigate } from 'react-router-dom';
import "../sidebar.css";
import menuCloseIcon from '../images/icons/close.svg';
import axios from 'axios';
import menuOpenIcon from '../images/icons/menu.svg';
import dashBoardIcon from '../images/icons/dashboard.svg';
import profileSetupIcon from '../images/icons/settings.svg';
import aboutIcon from '../images/icons/info.svg';
import powerOpt from '../images/icons/power_settings.svg';

const Sidebar = () => {
    const [isOpen, setIsOpen] = useState(false);
    const sidebarRef = useRef(null);
    const navigate = useNavigate();
    const [isAuthenticated, setIsAuthenticated] = useState(true);
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
        <div className="profile-">

        </div>
        </>
    );
};

export default Sidebar;