import React, { useState, useEffect, useRef } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom'; 
import HardGame from './Hardmode'; 
import '../styles/Game.css';

function Game() {
  const [score, setScore] = useState(0);
  const [timer, setTimer] = useState(30);
  const [isGameOver, setIsGameOver] = useState(false);
  const [gameStarted, setGameStarted] = useState(false);
  const [highestScore, setHighestScore] = useState(null);
  const [isHardMode, setIsHardMode] = useState(false); 
  const SERVER_URL = 'https://server-production-9585.up.railway.app';


  const currentLetterRef = useRef('');
  const navigate = useNavigate(); 

  const generateRandomLetter = () => {
    const letter = String.fromCharCode(97 + Math.floor(Math.random() * 26));
    currentLetterRef.current = letter;
    console.log('Generated Letter:', letter);
  };

  const startNewGame = () => {
    setScore(0);
    setTimer(30);
    setIsGameOver(false);
    setGameStarted(true);
    generateRandomLetter();
  };

  const handleKeyPress = (e) => {
    if (isGameOver || !gameStarted) return;

    const pressedLetter = e.key.toLowerCase();
    console.log(`Pressed Key: ${pressedLetter}, Current Letter: ${currentLetterRef.current}`);

    if (pressedLetter === currentLetterRef.current) {
      setScore((prevScore) => {
        const newScore = prevScore + 1;
        if (newScore > highestScore) {
          saveScore(newScore);
        }
        return newScore;
      });
      generateRandomLetter();
    }
  };

  const saveScore = async (newScore) => {
    const token = localStorage.getItem('token');
    
    if (!token) {
      alert('You must be logged in to save your score.');
      return;
    }
  
    try {
      await axios.post(
        `${SERVER_URL}/api/score/save`,
        { score: newScore },
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      setHighestScore(newScore);  // update highest score immediately after saving
    } catch (error) {
      console.error('Error saving score:', error);
      alert('Error saving score');
    }
  };

  const getHighestScore = async () => {
    const token = localStorage.getItem('token');

    if (!token) {
      alert('You must be logged in to view the highest score.');
      return;
    }

    try {
      const response = await axios.get(`${SERVER_URL}/api/score/highscore`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      // Handle null highest score
      if (response.data.highest_score === null) {
        setHighestScore(0);  // No score saved yet, display 0
      } else {
        setHighestScore(response.data.highest_score);
      }
    } catch (error) {
      console.error('Error fetching highest score:', error);
      //alert('Error fetching highest score');
    }
  };

  useEffect(() => {
    if (gameStarted && timer > 0) {
      const interval = setInterval(() => {
        setTimer((prevTimer) => prevTimer - 1);
      }, 1000);

      return () => clearInterval(interval);
    }

    if (timer === 0 && !isGameOver) {
      setIsGameOver(true);
    }
  }, [gameStarted, timer, isGameOver]);

  useEffect(() => {
    const handleKeyPressListener = (e) => {
      handleKeyPress(e);
    };

    window.addEventListener('keydown', handleKeyPressListener);

    return () => {
      window.removeEventListener('keydown', handleKeyPressListener);
    };
  }, [gameStarted, isGameOver]);

  useEffect(() => {
    getHighestScore();
  }, []);

  if (isHardMode) {
    return <HardGame setIsHardMode={setIsHardMode} />;
  }

  return (
    <div className="game-container">
      <h1>Score: {score}</h1>
      <h2>Time Left: {timer} seconds</h2>
      <h3 className="letter-display">Current Letter: {currentLetterRef.current}</h3>
      <h4>Highest Score: {highestScore !== null ? highestScore : 'No score yet, start playing!'}</h4>

      {!gameStarted ? (
        <div>
          <p>Click Start to Begin the Game!</p>
          <button className="new-game-btn" onClick={startNewGame}>Start Game</button>
          <button className="logout-btn" onClick={() => { localStorage.removeItem('token'); navigate('/login'); }}>Logout</button>
          <button className="hard-mode-btn" onClick={() => setIsHardMode(true)}>Hard Mode</button>
        </div>
      ) : null}

      {isGameOver ? (
        <div className="game-over-container">
          <p className="game-over-message">Game Over! Your score is: {score}</p>
          <button className="new-game-btn" onClick={startNewGame}>Start New Game</button>
          <button className="logout-btn" onClick={() => { localStorage.removeItem('token'); navigate('/login'); }}>
            Logout
          </button>
          <button className="hard-mode-btn" onClick={() => setIsHardMode(true)}>
            Hard Mode
          </button>
        </div>
      ) : (
        <p>Press the correct letter on your keyboard!</p>
      )}
    </div>
  );
}

export default Game;
