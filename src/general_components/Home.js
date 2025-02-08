import React from 'react';
import { useNavigate } from 'react-router-dom';

function Home() {
  const navigate = useNavigate();
  const handleLogin = () => {
    navigate('/login');
  }

  return (
    <div className="home">
      <div className="navbar">
          <div className='profile-text'>
          </div>
      </div>
      <button className='form-button' onClick={handleLogin} style={{ cursor: 'pointer' }}>Login
            </button>
    </div>
  );
}

export default Home;