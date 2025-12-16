
import { io } from "socket.io-client";
import { useEffect } from "react";
import Square from "../components/Square";
import Playertag from "../components/Playertag";
const socket = io();

socket.on("connect", () => {
  console.log("Connected to server", socket.id);
});

socket.on("connect_error", (error) => {
  console.log("Connection error:", error);
});

socket.on("disconnect", (reason) => {
  console.log("Disconnected from server:", reason);
});

function Online({setCurrentWinner, setFinishedState, setDraw, setStarted2, setTurn, setGameArr, gameArr, turn, currentWinner, draw, finishedState, role, opponentName, playerName, started2, started, setRole, setOpponentName, setPlayerName ,setStarted , setPlayOnline}) {
  useEffect(() => {
    // Listen for opponent's move
    socket.on("moved", (data) => {
      console.log("Opponent moved:", data);
      // Use functional updater to avoid stale closure over gameArr
      setGameArr((prev) => {
        const newGameArr = [...prev];
        newGameArr[data.index] = data.move;
        return newGameArr;
      });
      setTurn(true); // Now it's your turn
    });

    // Listen for game start
    socket.on("start", (data) => {
      console.log("Game starting:", data);
      setOpponentName(data.opponentName);
      setStarted2(true);
      // Set turn based on role (X goes first)
      if (data.role === "X") {
        setTurn(true);
        console.log("You start first as ", data.role);
        setRole(data.role);
      } else {
        setRole("O");
      }
    });

    socket.on("opponentLeft", () => {
      console.log("Your opponent has disconnected. The game will reset.");

      // Inline reset here to avoid adding handleReset as a dependency to the effect
      setGameArr([0, 0, 0, 0, 0, 0, 0, 0, 0]);
      setFinishedState([]);
      setCurrentWinner(null);
      setDraw(false);
      setStarted2(false);
      setTurn(false);
      console.log("game is reset (opponentLeft)");
    });

    socket.on("waiting", (data) => {
      console.log(data.message);
    });

    // (debug log removed)

    return () => {
      socket.off("moved");
      socket.off("start");
      socket.off("role");
      socket.off("opponentLeft");
      socket.off("waiting");
    };
  }, []);

  // Handle local player move
  function handleLocalMove(index) {
    // Only allow move if it's player's turn, cell is empty, and game not finished
    if (!turn || gameArr[index] !== 0 || currentWinner || draw) {
      return;
    }

    const newGameArr = [...gameArr];
    newGameArr[index] = role; // Use player's role (X or O)
    setGameArr(newGameArr);

    // Switch turn off after making move
    setTurn(false);

    // Emit move to server
    socket.emit("moved", { index, move: role });
    console.log("gamrarr", gameArr);
  }

  function handleStart(e) {
    e.preventDefault();
    if (!playerName.trim()) {
      alert("Please enter your name");
      return;
    }
    socket.emit("join", { playerName });
    setStarted(true);
  }

  function handleReset() {
    setGameArr([0, 0, 0, 0, 0, 0, 0, 0, 0]);
    setFinishedState([]);
    setCurrentWinner(null);
    setDraw(false);
    setStarted2(false);
    setTurn(false);
    console.log("game is reset");
    socket.emit("reset", { playerName });
  }

  return (
    <div className="App">
        <div>
            <button onClick={()=>setPlayOnline(false)}>Back</button>
        </div>
      {!started ? (
        <div className="start-screen">
          <h1>Tic Tac Toe - Multiplayer</h1>
          <form onSubmit={handleStart}>
            <input
              type="text"
              placeholder="Enter your name"
              value={playerName}
              onChange={(e) => setPlayerName(e.target.value)}
            />
            <button type="submit">Join Game</button>
          </form>
        </div>
      ) : !started2 ? (
        <div className="waiting-screen">
          <h2>Waiting for opponent...</h2>
          <p>Your name: {playerName}</p>
        </div>
      ) : (
        <div className="game-screen">
          <div className="flex justify-between">
            <Playertag role={role} playerName={playerName} turn={turn} />
            <Playertag
              role={role === "X" ? "O" : "X"}
              playerName={opponentName}
              turn={!turn}
            />
          </div>

          {currentWinner && (
            <div className="game-over">
              <h2>{currentWinner === role ? "You Win!" : "You Lose!"}</h2>
            </div>
          )}

          {draw && (
            <div className="game-over">
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
      )}
    </div>
  );
}

export default Online;
