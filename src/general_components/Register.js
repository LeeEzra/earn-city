import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate, Link } from 'react-router-dom';
import loaderIcon from '../images/icons/settings.svg';

function Register() {
  const [firstName, setFirstName] = useState('');
  const [middleName, setMiddleName] = useState('');
  const [lastName, setLastName] = useState('');
  const [gender, setGender] = useState('');
  const [country, setCountry] = useState('');
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
        country,
        middleName
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
        type="text" name='middlename' id='middlename'
        value={middleName}
        onChange={(e) => setMiddleName(e.target.value)}
        placeholder="Middle Name(Optional)"
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
        </select>
        <select type="text" name='country' id='country' value={country} onChange={(e) => setCountry(e.target.value)} required>
          <option value="" disabled selected>Select Country</option>
          <option value="algeria">Algeria</option>
          <option value="niger">Niger</option>
          <option value="angola">Angola</option>
          <option value="south-africa">South Africa</option>
          <option value="uganda">Uganda</option>
          <option value="cameroon">Cameroon</option>
          <option value="botswana">Botswana</option>
          <option value="eritrea">Eritrea</option>
          <option value="namibia">Namibia</option>
          <option value="djibouti">Djibouti</option>
          <option value="lesotho">Lesotho</option>
          <option value="eswatini">Eswatini</option>
          <option value="nigeria">Nigeria</option>
          <option value="kenya">Kenya</option>
          <option value="tanzania">Tanzania</option>
          <option value="ethiopia">Ethiopia</option>
          <option value="sao-tome-and-principe">São Tomé and Príncipe</option>
          <option value="comoros">Comoros</option>
          <option value="cabo-verde">Cabo Verde</option>
          <option value="mauritius">Mauritius</option>
          <option value="seychelles">Seychelles</option>
          <option value="chad">Chad</option>
          <option value="senegal">Senegal</option>
          <option value="ghana">Ghana</option>
          <option value="gabon">Gabon</option>
          <option value="burkina-faso">Burkina Faso</option>
          <option value="central-african-republic">Central African Republic</option>
          <option value="equatorial-guinea">Equatorial Guinea</option>
          <option value="benin">Benin</option>
          <option value="guinea">Guinea</option>
          <option value="guinea-bissau">Guinea-Bissau</option>
          <option value="liberia">Liberia</option>
          <option value="madagascar">Madagascar</option>
          <option value="mali">Mali</option>
          <option value="mauritania">Mauritania</option>
          <option value="sierra-leone">Sierra Leone</option>
          <option value="togo">Togo</option>
          <option value="democratic-republic-of-the-congo">Democratic Republic of the Congo</option>
          <option value="cote-divoire">Côte d'Ivoire</option>
          <option value="the-gambia">The Gambia</option>
          <option value="south-sudan">South Sudan</option>
          <option value="burundi">Burundi</option>
          <option value="malawi">Malawi</option>
          <option value="mozambique">Mozambique</option>
          <option value="rwanda">Rwanda</option>
          <option value="zimbabwe">Zimbabwe</option>
          <option value="zambia">Zambia</option>
          <option value="morocco">Morocco</option>
          <option value="egypt">Egypt</option>
          <option value="libya">Libya</option>
          <option value="somalia">Somalia</option>
        </select>
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