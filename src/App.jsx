import React from "react";
import Die from "./Die";
import { nanoid } from "nanoid";
import Confetti from "react-confetti";
import "./App.css";
export default function App() {
  const [dice, setDice] = React.useState(allNewDice());
  const [tenzies, setTenzies] = React.useState(false);
  const [highScore, setHighScore] = React.useState({ score: 0 });
  React.useEffect(() => {
    const firstDieValue = dice[0].value;
    if (
      dice.every((die) => die.value === firstDieValue) &&
      dice.every((die) => die.isHeld)
    ) {
      setTenzies(true);
      if (localStorage.getItem("highScore") === null) {
        localStorage.setItem("highScore", JSON.stringify(highScore));
      } else {
        const oldHighScore = JSON.parse(localStorage.getItem("highScore"));
        if (oldHighScore.score > highScore.score) {
          localStorage.setItem("highScore", JSON.stringify(highScore));
        }
      }
    }
  }, [dice]);

  function generateNewDie() {
    return {
      value: Math.ceil(Math.random() * 6),
      isHeld: false,
      id: nanoid(),
    };
  }

  function allNewDice() {
    const newDice = [];
    for (let i = 0; i < 10; i++) {
      newDice.push(generateNewDie());
    }
    return newDice;
  }

  function rollDice() {
    if (!tenzies) {
      setDice((oldDice) =>
        oldDice.map((die) => {
          return die.isHeld ? die : generateNewDie();
        })
      );
      setHighScore((oldHighScore) => ({
        ...oldHighScore,
        score: oldHighScore.score + 1,
      }));
    } else {
      setTenzies(false);
      setHighScore({ score: 0 });
      setDice(allNewDice());
    }
  }

  function holdDice(id) {
    setDice((oldDice) =>
      oldDice.map((die) => {
        return die.id === id ? { ...die, isHeld: !die.isHeld } : die;
      })
    );
  }

  const diceElements = dice.map((die) => (
    <Die
      key={die.id}
      value={die.value}
      isHeld={die.isHeld}
      holdDice={() => holdDice(die.id)}
    />
  ));
  // getting the high score from local storage and parsing it to make it an object
  let locallyStoredHighScore = JSON.parse(localStorage.getItem("highScore"));
  return (
    <>
      {tenzies && <Confetti />}
      <div className="score">
        <h2>Rolls: {highScore.score}</h2>
        <h3>
          Best Min Rolls:{" "}
          {locallyStoredHighScore && locallyStoredHighScore.score}
        </h3>
      </div>
      <main>
        <h1 className="title">Tenzies</h1>
        <p className="instructions">
          Roll until all dice are the same. Click each die to freeze it at its
          current value between rolls.
        </p>
        <div className="dice-container">{diceElements}</div>
        <button className="roll-dice" onClick={rollDice}>
          {tenzies ? "New Game" : "Roll"}
        </button>
      </main>
    </>
  );
}
