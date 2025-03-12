import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import '../styles/Register.css'; // Import the CSS file

function Register() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleRegister = async (e) => {
    e.preventDefault();

    try {
      // Make the POST request to the backend API with Axios
      const response = await axios.post(
        'https://server-production-9585.up.railway.app/api/auth/register',
        { username, password },
        { withCredentials: true }  // Include credentials (cookies, authorization) if needed
      );

      // Store the token in localStorage upon successful registration
      localStorage.setItem('token', response.data.token);

      // Redirect to the game or dashboard after successful registration
      window.location.href = '/'; // or any other route you need to navigate to

    } catch (error) {
      console.error('Registration failed:', error);
      alert('Registration failed! Please try again.');
    }
  };

  const handleLoginRedirect = () => {
    navigate('/login');
  };

  return (
    <div className="login-container">
      <div className="form-container">
        <h2 className="form-title">Register</h2>
        {error && <p style={{ color: 'red' }}>{error}</p>}
        <form onSubmit={handleRegister}>
          <input
            className="login-input"
            type="text"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            placeholder="Username"
            required
          />
          <input
            className="login-input"
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="Password"
            required
          />
          <button className="register-btn" type="submit">Register</button>
        </form>

        <button className="login-btn" onClick={handleLoginRedirect}>Login</button>
      </div>
    </div>
  );
}

export default Register;
