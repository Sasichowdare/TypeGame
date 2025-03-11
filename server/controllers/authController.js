const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const pool = require('../models/db');

// Register User
const register = async (req, res) => {
  const { username, password } = req.body;

  if (!username || !password) {
    return res.status(400).json({ error: 'Username and password are required' });
  }

  console.log('Received registration request for username:', username);

  const hashedPassword = await bcrypt.hash(password, 10);

  try {
    console.log('Attempting to insert user into the database...');
    const result = await pool.query(
      'INSERT INTO users (username, password) VALUES ($1, $2) RETURNING *',
      [username, hashedPassword]
    );
    
    console.log('Database insertion successful:', result.rows[0]);

    const user = result.rows[0];
    const token = jwt.sign({ id: user.id }, 'your_jwt_secret', { expiresIn: '1h' });
    res.json({ token });

  } catch (error) {
    console.error('Error during registration:', error);  // Log the actual error
    res.status(500).json({ error: 'Error registering user', details: error.message });
  }
};


// Login User
const login = async (req, res) => {
  const { username, password } = req.body;

  try {
    const result = await pool.query('SELECT * FROM users WHERE username = $1', [username]);
    const user = result.rows[0];

    if (user && await bcrypt.compare(password, user.password)) {
      const token = jwt.sign({ id: user.id }, 'your_jwt_secret', { expiresIn: '1h' });
      res.json({ token });
    } else {
      res.status(401).json({ error: 'Invalid credentials' });
    }
  } catch (error) {
    res.status(500).json({ error: 'Error logging in' });
  }
};

const blacklist = new Set(); // Store blacklisted tokens (temporary solution)

const logout = (req, res) => {
  const token = req.headers.authorization?.split(' ')[1]; 

  if (!token) {
    return res.status(400).json({ error: 'No token provided' });
  }

  blacklist.add(token); // Add token to the blacklist
  res.json({ message: 'Logged out successfully' });
};

const isTokenBlacklisted = (token) => blacklist.has(token);

module.exports = { register, login,logout, isTokenBlacklisted };
