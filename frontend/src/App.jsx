import Online from "./pages/Online";
import winner from "./logics/game";
import { useState, useEffect } from "react";
//import axios from "axios";
import Start from "./pages/Start";
import Playbot from "./pages/Playbot";


function App() {
  const [gameArr, setGameArr] = useState([0, 0, 0, 0, 0, 0, 0, 0, 0]);
  const [finishedState, setFinishedState] = useState([]);
  const [turn, setTurn] = useState(false);
  const [currentWinner, setCurrentWinner] = useState(null);
  const [draw, setDraw] = useState(false);
  const [started, setStarted] = useState(false);
  const [started2, setStarted2] = useState(false);
  const [playerName, setPlayerName] = useState("");
  const [opponentName, setOpponentName] = useState("");
  const [role, setRole] = useState("");

  // Compute winner based on latest gameArr
  useEffect(() => {
    const result = winner(gameArr, setFinishedState);
    if (result) {
      setCurrentWinner(result.winner);
      setDraw(result.state === "Draw");
    }
  }, [gameArr]);

  const [playBot, setPlayBot] = useState(false);
  const [playOnline, setPlayOnline] = useState(false);
  const [playFriend, setPlayFriend] = useState(false);
  if (playBot) {
    return (

        //<button onClick={() => setPlayBot(false)}>Back</button>
        <Playbot setCurrentWinner={setCurrentWinner} setFinishedState={setFinishedState} setDraw={setDraw} setStarted2={setStarted2} setTurn={setTurn} setGameArr={setGameArr} gameArr={gameArr} turn={turn} currentWinner={currentWinner} draw={draw} finishedState={finishedState} role={"X"} opponentName={opponentName} playerName={playerName} started2={started2}  setRole={setRole} setOpponentName={setOpponentName} setPlayerName={setPlayerName} setStarted={setStarted} setPlayBot={setPlayBot}/>

    )
  }

  if (playFriend) {
    return (
      <>
        <button onClick={() => setPlayFriend(false)}>Back</button>
        <div>Playing against a friend</div>
      </>
    )
  }

  if (playOnline) {
    return (
      <Online setCurrentWinner={setCurrentWinner} setFinishedState={setFinishedState} setDraw={setDraw} setStarted2={setStarted2} setTurn={setTurn} setGameArr={setGameArr} gameArr={gameArr} turn={turn} currentWinner={currentWinner} draw={draw} finishedState={finishedState} role={role} opponentName={opponentName} playerName={playerName} started2={started2} started={started} setRole={setRole} setOpponentName={setOpponentName} setPlayerName={setPlayerName} setStarted={setStarted} setPlayOnline={setPlayOnline}/>
    );
  }
  return <Start setPlayBot={setPlayBot} setPlayFriend={setPlayFriend} setPlayOnline={setPlayOnline}/>;
}

export default App;
