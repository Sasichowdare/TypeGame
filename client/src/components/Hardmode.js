import React, { useState, useEffect, useRef } from 'react';
import axios from 'axios';
import Game from './Game';
import '../styles/Game.css';

function HardGame() {
  const [score, setScore] = useState(0);
  const [timer, setTimer] = useState(30);
  const [isGameOver, setIsGameOver] = useState(false);
  const [gameStarted, setGameStarted] = useState(false);
  const [highestScore, setHighestScore] = useState(null);
  const [isEasyMode, setIsEasyMode] = useState(false);
  const [letterPosition, setLetterPosition] = useState({ top: '50%', left: '50%' });

  const currentLetterRef = useRef('');

  const generateRandomLetter = () => {
    const letter = String.fromCharCode(97 + Math.floor(Math.random() * 26));
    currentLetterRef.current = letter;
    setLetterPosition({
      top: `${Math.random() * 80 + 10}%`,
      left: `${Math.random() * 80 + 10}%`
    });
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
        'http://localhost:5000/api/score/save',
        { score: newScore },
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      setHighestScore(newScore);
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
      const response = await axios.get('http://localhost:5000/api/score/highscore', {
        headers: { Authorization: `Bearer ${token}` },
      });

      // Handle null highest score (new players will have no score saved yet)
      if (response.data.highest_score === null) {
        setHighestScore(0);  // Set highest score to 0 if there's no score saved
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

  // If Easy Mode is activated, render the EasyGame component
  if (isEasyMode) {
    return <Game setIsEasyMode={setIsEasyMode} />;
  }

  return (
    <div className="game-container">
      <h1>Score: {score}</h1>
      <h2>Time Left: {timer} seconds</h2>
      {/* Display a user-friendly message when there is no highest score */}
      <h4>Highest Score: {highestScore !== null ? highestScore : 'No score yet, start playing!'}</h4>

      <div 
        className="letter-display"
        style={{ position: 'absolute', top: letterPosition.top, left: letterPosition.left }}
      >
        {currentLetterRef.current}
      </div>

      {!gameStarted ? (
        <div>
          <p>Click Start to Begin the Game!</p>
          <button className="new-game-btn" onClick={startNewGame}>Start Game</button>
          <button className="logout-btn" onClick={() => { localStorage.removeItem('token'); window.location.href = '/login'; }}>
            Logout
          </button>
          <button className="easy-mode-btn" onClick={() => setIsEasyMode(true)}>
            Easy Mode
          </button>
        </div>
      ) : null}

      {isGameOver ? (
        <div className="game-over-container">
          <p className="game-over-message">Game Over! Your score is: {score}</p>
          <button className="new-game-btn" onClick={startNewGame}>Start New Game</button>
          <button className="logout-btn" onClick={() => { localStorage.removeItem('token'); window.location.href = '/login'; }}>
            Logout
          </button>
          <button className="easy-mode-btn" onClick={() => setIsEasyMode(true)}>
            Easy Mode
          </button>
        </div>
      ) : (
        <p>Press the correct letter on your keyboard!</p>
      )}
    </div>
  );  
}

export default HardGame;
