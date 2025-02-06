import React, { useState } from 'react';
import './index.css';

const WORD_LIST = ['mango', 'pearl', 'candy', 'grape', 'melon'];

const getRandomWord = () => WORD_LIST[Math.floor(Math.random() * WORD_LIST.length)];

const getFeedback = (guess, target) => {
  return guess.split('').map((letter, index) => {
    if (letter === target[index]) return 'green';
    if (target.includes(letter)) return 'yellow';
    return 'gray';
  });
};

const GuessRow = ({ guess, feedback }) => (
  <div className="guess-row">
    {guess.split('').map((letter, i) => (
      <div key={i} className={`letter-box ${feedback[i]}`}> {letter.toUpperCase()} </div>
    ))}
  </div>
);

const Home = () => {
  const maxAttempts = 6;  // Maximum number of attempts
  const [targetWord, setTargetWord] = useState(getRandomWord());
  const [guess, setGuess] = useState('');
  const [history, setHistory] = useState([]);
  const [message, setMessage] = useState('');
  const [gameOver, setGameOver] = useState(false);
  const [darkMode, setDarkMode] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (gameOver) return;

    if (guess.length !== 5) {
      setMessage('⚠️ Please enter a 5-letter word.');
      return;
    }
    if (!WORD_LIST.includes(guess.toLowerCase())) {
      setMessage('🚫 Invalid word. Try again.');
      return;
    }

    const feedback = getFeedback(guess.toLowerCase(), targetWord);
    const newHistory = [...history, { guess, feedback }];
    setHistory(newHistory);
    setGuess('');

    if (guess.toLowerCase() === targetWord) {
      setMessage('🏆 Winner! You got the word! 🎉');
      setGameOver(true);
    } else if (newHistory.length >= maxAttempts) {
      setMessage(`❌ Game Over! The word was "${targetWord.toUpperCase()}". 😞`);
      setGameOver(true);
    } else {
      setMessage(`❗ Try again! 🤔 (${maxAttempts - newHistory.length} attempts left)`);
    }
  };

  const handleNewGame = () => {
    setTargetWord(getRandomWord());
    setGuess('');
    setHistory([]);
    setMessage('');
    setGameOver(false);
  };

  return (
    <>
      <div className={`home-main-div ${darkMode ? 'dark-mode' : ''}`}>
        <h1 className="game-h1">Wordle Clone</h1>

        <button className="dark-mode-toggle" onClick={() => setDarkMode(!darkMode)}>
          {darkMode ? '🌞 Light Mode' : '🌙 Dark Mode'}
        </button>

        <form onSubmit={handleSubmit} className="guess-form">
          <input
            type="text"
            placeholder="Enter 5-letter word"
            onChange={(e) => setGuess(e.target.value)}
            value={guess}
            maxLength={5}
            disabled={gameOver}
            className="guess-input"
          />
          <button type="submit" className="submit-btn" disabled={gameOver}>
          Guess
          </button>
        </form>

        {message && <p className={`game-message ${gameOver ? 'correct' : 'try-again'}`}>{message}</p>}

        <p className="attempts-left">
          🕒 Attempts Left: {gameOver ? 0 : maxAttempts - history.length}
        </p>

        <div className="guess-grid">
          {history.map((item, index) => (
            <GuessRow key={index} guess={item.guess} feedback={item.feedback} />
          ))}
        </div>

        {gameOver && (
          <button onClick={handleNewGame} className="new-game-btn">
            🔄 New Game
          </button>
        )}
      </div>
    </>
  );
};


export default Home;
