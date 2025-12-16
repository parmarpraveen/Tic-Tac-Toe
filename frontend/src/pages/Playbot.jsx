import React, {  useEffect } from "react";
import Square from "../components/Square";
import Playertag from "../components/Playertag";
import findBestMove from "../logics/botMove";

function Playbot({
  role,
  opponentName,
  turn,
  gameArr,
  currentWinner,
  draw,
  finishedState,
  setPlayBot,
  setGameArr,
  setFinishedState,
  setCurrentWinner,
  setDraw,
  setStarted2,
  setTurn,
}) {

    const botRole = role === "X" ? "O" : "X";

  // ✅ Handle player's move
  function handleLocalMove(index) {
    if (gameArr[index] !== 0 || currentWinner || draw || !turn) return;

    const newGameArr = [...gameArr];
    newGameArr[index] = role;
    setGameArr(newGameArr);
    setTurn(false); // Player done → now bot’s turn
  }

  // ✅ Bot makes its move automatically when it’s its turn
  useEffect(() => {
    if (!turn && !currentWinner && !draw) {
      const timer = setTimeout(() => {
        const botMove = findBestMove(gameArr, botRole);
        if (botMove !== -1) {
          const newGameArr = [...gameArr];
          newGameArr[botMove] = botRole;
          setGameArr(newGameArr);
        }
        setTurn(true); // Switch turn back to player
      }, 500); // slight delay for realism
      return () => clearTimeout(timer);
    }
  }, [ handleLocalMove]);

  function handleReset() {
    setGameArr([0, 0, 0, 0, 0, 0, 0, 0, 0]);
    setFinishedState([]);
    setCurrentWinner(null);
    setDraw(false);
    setStarted2(false);
    setTurn(role === "X"); // X always starts
    console.log("game is reset");
  }

  return (
    <div className="game-screen">
      <button className="absolute top-4 left-4 text-3xl" onClick={() => setPlayBot(false)}>
        Back
      </button>

      <div className="flex justify-between">
        <Playertag role={role} playerName={"You"} turn={turn} />
        <Playertag role={botRole} playerName={opponentName} turn={!turn} />
      </div>

      {currentWinner && (
        <div className="flex m-2 justify-center text-3xl font-bold text-yellow-600">
          <h2>{currentWinner === role ? "You Win!" : "You Lose!"}</h2>
        </div>
      )}

      {draw && (
        <div className="flex m-2 justify-center text-3xl font-bold text-yellow-600">
          <h2>It's a Draw!</h2>
        </div>
      )}

      <div className="grid grid-cols-3 gap-1 justify-center my-4">
        {gameArr.map((value, index) => (
          <Square
            key={index}
            index={index}
            value={value}
            turn={turn}
            handleLocalMove={handleLocalMove}
            finishedState={finishedState}
            winner={currentWinner}
          />
        ))}
      </div>

      {(currentWinner || draw) && (
        <button onClick={handleReset}>Play Again</button>
      )}
    </div>
  );
}

export default Playbot;
