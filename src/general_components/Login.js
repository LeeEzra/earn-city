import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate, Link } from 'react-router-dom';

function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (!token) return;

    try {
      const parts = token.split('.');
      if (parts.length !== 3) {
        console.error('Invalid  session');
        return;
      }

      const decodedToken = JSON.parse(atob(parts[1]));
      if (decodedToken.exp < Date.now() / 1000) {
        console.error('session expired');
        return;
      }

      navigate('/dashboard');
    } catch (error) {
      console.error('Error decoding the token in Login:', error);
    }
  }, [navigate]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      const response = await axios.post('/auth/login', { email, password });

      if (response.status === 200) {
        const { token } = response.data;

        localStorage.setItem('token', token);
        navigate('/dashboard');
      }
    } catch (error) {
      setError('Login failed, Check your connection');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="login-body-container">
      <form onSubmit={handleSubmit}>
        <h2>Login to your account</h2>
        {error && <p className="form-error-text">{error}</p>}
        <input
          type="text"
          name="email"
          id="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="Email"
          autoComplete='email'
          required
        />
        <input
          type="password"
          name="password"
          id="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          placeholder="Password"
          autoComplete='password'
          required
        />
        <button className="form-button" type="submit" disabled={loading}>
          {loading ? (
            "Logging in..."
          ) : (
            'Login'
          )}
        </button>

        <hr />
        <br />

        <p className="form-text">Don't have an account?</p>
        <Link to="/register">Sign Up</Link>
      </form>
      <p className="form-text">
        <Link to="/NotFound">Forgot Password?</Link>
      </p>
    </div>
  );
}

export default Login;