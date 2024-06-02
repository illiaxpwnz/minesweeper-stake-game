import React, { useState, useEffect } from 'react';
import random from 'random';
import './index.css';

const BOARD_SIZE = 5;
const POINT_REWARD = 100;

const App = () => {
  const [numberOfMines, setNumberOfMines] = useState('');
  const [playing, setPlaying] = useState(false);
  const [lost, setLost] = useState(false);
  const [multiplier, setMultiplier] = useState(0);
  const [scoreNumber, setScoreNumber] = useState(0.0000000);
  const [disableButton, setDisableButton] = useState(false);
  const [minesSelectedNumber, setMinesSelectedNumber] = useState([]);

  const finalPoints = multiplier * POINT_REWARD;

  const resetCss = () => {
    let boxes = document.getElementsByClassName('box');
    for (let i = 0; i < 25; i++) {
      boxes[i].style.backgroundImage = '';
    }
    setDisableButton(false);
  };

  const verifier = (nb) => {
    return minesSelectedNumber.includes(nb);
  };

  const importMinesNumber = () => {
    let newMinesSelectedNumber = [];
    let min = 1;
    let max = 25;
    for (let i = 0; i < parseInt(numberOfMines); i++) {
      let rNB = random.int(min, max);
      if (!newMinesSelectedNumber.includes(rNB)) {
        newMinesSelectedNumber.push(rNB);
      } else {
        i--;
      }
    }
    setMinesSelectedNumber(newMinesSelectedNumber);
  };

  const pickHandler = (e) => {
    const value = parseInt(e.target.value);
    const isMine = verifier(value);
    const boxClass = `box${value}`;
    const boxElement = document.getElementsByClassName(boxClass)[0];

    if (isMine) {
      boxElement.style.backgroundImage = "url('https://svgur.com/i/Y6x.svg')";
      setLost(true);
      setMultiplier(0);
      localStorage.setItem('score', 0);
    } else {
      boxElement.style.backgroundImage = "url('https://svgur.com/i/Y86.svg')";
      setMultiplier((prev) => prev + 2);
    }
  };

  const mineNumberHandler = (e) => {
    setNumberOfMines(e.target.value);
  };

  useEffect(() => {
    if (playing) {
      importMinesNumber();
    }
  }, [numberOfMines, playing]);

  useEffect(() => {
    if (lost) {
      showScore();
    }
  }, [lost]);

  const showScore = () => {
    if (lost) {
      const scoreHtml = document.getElementsByClassName('finish-score')[0];
      scoreHtml.style.display = 'block';
      setDisableButton(true);
      setMultiplier(0);
      localStorage.setItem('score', 0);
    }
  };

  const startCashout = () => {
    setPlaying((prev) => !prev);
    if (playing) {
      localStorage.setItem('score', finalPoints);
    } else {
      setLost(false);
      resetCss();
      const scoreHtml = document.getElementsByClassName('finish-score')[0];
      scoreHtml.style.display = 'none';
    }
  };

  return (
    <>
      <div className="score">
        <h4>SCORE:</h4> <h1>{scoreNumber}</h1>
      </div>
      <div className="wrapper">
        <div className="settings">
          <div className="btn-container">
            <div className="mineNumberSetting">
              <label className="mineNumberText">
                <span>Mines</span>
              </label>
              <select name="minesNumber" id="mineNumber" onChange={mineNumberHandler}>
                {Array.from({ length: 12 }, (_, i) => (
                  <option key={i + 1} value={i + 1}>
                    {i + 1}
                  </option>
                ))}
              </select>
            </div>
            <button className="btn" onClick={startCashout}>
              {playing ? 'CASHOUT' : 'Play'}
            </button>
          </div>
        </div>
        <div className="container">
          {Array.from({ length: 25 }, (_, i) => (
            <button
              key={i + 1}
              className={`box box${i + 1}`}
              onClick={pickHandler}
              value={i + 1}
              disabled={disableButton}
            ></button>
          ))}
          <button className="finish-score">
            <div className="finish-score center">
              <span> {multiplier}X</span>
              <p>{scoreNumber}</p>
            </div>
          </button>
        </div>
      </div>
    </>
  );
};

export default App;
