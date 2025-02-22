import React from 'react';
import { useNavigate } from 'react-router-dom';
import Sidebar from './Sidebar';

function Settings() {
  const navigate = useNavigate();
  const handleLogin = () => {
    navigate('/login');
  }

  return (
    <div className="settings-card">
      <Sidebar />
    </div>
  );
}

export default Settings;