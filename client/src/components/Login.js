import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';  // Import useNavigate from React Router
import '../styles/Login.css'; // Importing the CSS file for styling

function Login() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  
  const navigate = useNavigate();  // Initialize useNavigate for navigation

  const handleLogin = async (e) => {
    e.preventDefault();
  
    try {
      const response = await axios.post('http://localhost:5000/api/auth/login', {
        username,
        password,
      });
  
      // Store the token in localStorage upon successful login
      localStorage.setItem('token', response.data.token);
  
      // Redirect to the game or dashboard after successful login
      navigate('/game'); // Use navigate to redirect to the game
    } catch (error) {
      console.error('Login failed:', error);
      alert('Login failed! Check your credentials.');
    }
  };

  // Handle the redirection to the Register page
  const handleRegisterRedirect = () => {
    navigate('/register'); // Redirect to the Register page
  };

  return (
    <div className="login-container">
      <div className="form-container">
        <h2 className="form-title">Welcome Back</h2>
        <form onSubmit={handleLogin}>
          <input 
            className="login-input"
            type="text" 
            value={username} 
            onChange={(e) => setUsername(e.target.value)} 
            placeholder="Username" 
          />
          <input 
            className="login-input"
            type="password" 
            value={password} 
            onChange={(e) => setPassword(e.target.value)} 
            placeholder="Password" 
          />
          <button className="login-btn" type="submit">Login</button>
        </form>
        
        {/* Register Button */}
        <button className="register-btn" onClick={handleRegisterRedirect}>Register</button>
      </div>
    </div>
  );
}

export default Login;
