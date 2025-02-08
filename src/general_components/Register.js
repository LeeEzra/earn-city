import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate, Link } from 'react-router-dom';
import loaderIcon from '../images/icons/settings.png';

function Register() {
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [gender, setGender] = useState('');
  const [idNumber, setIdNumber] = useState('');
  const [email, setEmail] = useState('');
  const [phoneNumber, setPhoneNumber] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  const handleNavigation = () => {
    navigate('/login');
  };

  useEffect(() => {
    const user = localStorage.getItem('user');
    if (user) {
      navigate('/dashboard');
    }
  }, [navigate]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    // Check if passwords match
    if (password !== confirmPassword) {
      setError("Passwords do not match");
      setLoading(false); // Stop loading
      return;
    }

    try {
      await axios.post('/auth/register', {
        email,
        phoneNumber,
        password,
        firstName,
        lastName,
        gender,
        idNumber
      });
      navigate('/login');
    } catch (error) {
      setError(error.response?.data || 'Registration failed, check your connection');
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <h2>Register</h2>
      {error && <p className='form-error-text'>{error}</p>} {/* Display error message */}
      
      <input
        type="text" name='firstname' id='firstname'
        value={firstName}
        onChange={(e) => setFirstName(e.target.value)}
        placeholder="Fisrt Name"
        required
      />
      <input
        type="text" name='lastname' id='lastname'
        value={lastName}
        onChange={(e) => setLastName(e.target.value)}
        placeholder="Last Name"
        required
      />
      <select
        type="text" name='gender' id='gender'
        value={gender}
        onChange={(e) => setGender(e.target.value)}
        required>
          <option value='' disabled>Gender</option>
          <option value='male'>Male</option>
          <option value='female'>Female</option>
          <option value='other'>Other</option>
        </select>
      <input
        type="text" name='idnumber' id='idnumber'
        value={idNumber}
        onChange={(e) => setIdNumber(e.target.value)}
        placeholder="Id Number"
        autoComplete='off'
        required
      />
      <input
        type="text" name='phonenumber' id='phonenumber'
        value={phoneNumber}
        onChange={(e) => setPhoneNumber(e.target.value)}
        placeholder="Phone Number"
        required
      />
      <input
        type="email" name='email' id='email'
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        placeholder="Email"
        autoComplete='username'
        required
      />
      <input
        type="password" name='password' id='password'
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        placeholder="Password"
        autoComplete='new-password'
        required
      />
      <input
        type="password" name='confirmPassword' id='confirmPassword'
        value={confirmPassword}
        onChange={(e) => setConfirmPassword(e.target.value)}
        placeholder="Confirm Password"
        autoComplete='new-password'
        required
      />
      
      <button className='form-button' type="submit" disabled={loading}>
        {loading ? <img className='loader-icon' src={loaderIcon} alt="loading icon" /> : 'Register'}
      </button>
      <hr />
      <br />
      <p className='form-text'>
        Already have an account?</p>
        <Link to='/login'>Login</Link>
    </form>
  );
}

export default Register;