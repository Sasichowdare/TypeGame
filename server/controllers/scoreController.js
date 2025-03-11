// controllers/scoreController.js

const pool = require('../models/db');

// Function to get the score for the authenticated user
const getScore = async (req, res) => {
  const userId = req.userId;  // This should come from the authenticate middleware
  
  try {
    // Fetch the user's highest score from the database
    const result = await pool.query(
      'SELECT score FROM scores WHERE user_id = $1 ORDER BY created_at DESC LIMIT 1',
      [userId]
    );

    if (result.rows.length > 0) {
      // Return the highest score if found
      res.json({ highest_score: result.rows[0].score });
    } else {
      res.status(404).json({ message: 'No scores found for this user' });
    }
  } catch (error) {
    console.error('Error fetching highest score:', error);
    res.status(500).json({ error: 'Error retrieving highest score' });
  }
};

// Function to save the score for the authenticated user
const saveScore = async (req, res) => {
  const { score } = req.body;
  const userId = req.userId;  // This should come from the authenticate middleware

  try {
    // Get the user's current highest score from the database
    const result = await pool.query(
      'SELECT score FROM scores WHERE user_id = $1 ORDER BY created_at DESC LIMIT 1', 
      [userId]
    );
    
    // If the user already has a score
    if (result.rows.length > 0) {
      const currentHighestScore = result.rows[0].score;
      
      // If the new score is higher than the current highest score, update it
      if (score > currentHighestScore) {
        await pool.query(
          'UPDATE scores SET score = $1 WHERE user_id = $2', 
          [score, userId]
        );
        return res.json({ message: 'Score updated successfully!' });
      } else {
        return res.json({ message: 'New score is not higher than the previous score.' });
      }
    } else {
      // If the user doesn't have any score, insert the new score
      await pool.query(
        'INSERT INTO scores (user_id, score) VALUES ($1, $2) RETURNING *',
        [userId, score]
      );
      return res.json({ message: 'Score saved successfully!' });
    }
  } catch (error) {
    console.error('Error saving score:', error);
    res.status(500).json({ error: 'Error saving score' });
  }
};

module.exports = { getScore, saveScore };
