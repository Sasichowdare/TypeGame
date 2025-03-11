//scoreRoutes.js

const express = require('express');
const { getScore, saveScore } = require('../controllers/scoreController'); // ✅ Ensure this is correct
const authenticate = require('../middlewares/authMiddleware');

const router = express.Router();
console.log('Loaded controllers in routes:', { getScore, saveScore });

router.get('/highscore', authenticate, getScore);  // ✅ Ensure getScore is passed correctly
router.get('/:userId', authenticate, getScore);  // ✅ Ensure getScore is passed correctly
router.post('/save', authenticate, saveScore);   // ✅ Ensure saveScore is passed correctly

module.exports = router;
