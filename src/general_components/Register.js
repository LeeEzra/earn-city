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
          <option value="Algeria">Algeria</option>
          <option value="Niger">Niger</option>
          <option value="Angola">Angola</option>
          <option value="South Africa">South Africa</option>
          <option value="Uganda">Uganda</option>
          <option value="Cameroon">Cameroon</option>
          <option value="Botswana">Botswana</option>
          <option value="Eritrea">Eritrea</option>
          <option value="Namibia">Namibia</option>
          <option value="Djibouti">Djibouti</option>
          <option value="Lesotho">Lesotho</option>
          <option value="Eswatini">Eswatini</option>
          <option value="Nigeria">Nigeria</option>
          <option value="Kenya">Kenya</option>
          <option value="Tanzania">Tanzania</option>
          <option value="Ethiopia">Ethiopia</option>
          <option value="Sao Tome and Principe">São Tomé and Príncipe</option>
          <option value="Comoros">Comoros</option>
          <option value="Cabo Verde">Cabo Verde</option>
          <option value="Mauritius">Mauritius</option>
          <option value="Seychelles">Seychelles</option>
          <option value="Chad">Chad</option>
          <option value="Senegal">Senegal</option>
          <option value="Ghana">Ghana</option>
          <option value="Gabon">Gabon</option>
          <option value="Burkina Faso">Burkina Faso</option>
          <option value="Central African Republic">Central African Republic</option>
          <option value="Equatorial Guinea">Equatorial Guinea</option>
          <option value="Benin">Benin</option>
          <option value="Guinea">Guinea</option>
          <option value="Guinea-Bissau">Guinea-Bissau</option>
          <option value="Liberia">Liberia</option>
          <option value="Madagascar">Madagascar</option>
          <option value="Mali">Mali</option>
          <option value="Mauritania">Mauritania</option>
          <option value="Sierra Leone">Sierra Leone</option>
          <option value="Togo">Togo</option>
          <option value="Democratic Republic of the Congo">Democratic Republic of the Congo</option>
          <option value="Cote D'ivoire">Côte d'Ivoire</option>
          <option value="The Gambia">The Gambia</option>
          <option value="South Sudan">South Sudan</option>
          <option value="Burundi">Burundi</option>
          <option value="Malawi">Malawi</option>
          <option value="Mozambique">Mozambique</option>
          <option value="Rwanda">Rwanda</option>
          <option value="Zimbabwe">Zimbabwe</option>
          <option value="Zambia">Zambia</option>
          <option value="Morocco">Morocco</option>
          <option value="Egypt">Egypt</option>
          <option value="Libya">Libya</option>
          <option value="Somalia">Somalia</option>
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