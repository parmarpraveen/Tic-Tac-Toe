import React from "react";

function Start({ setPlayBot , setPlayOnline, setPlayFriend }) {
  return (
    <div>
      <div className="text-center text-6xl font-bold text-blue-500 mb-10">Tic Tac Toe</div>
      <div className="flex flex-col gap-2 justify-center font-bold text-4xl">
        <button className="bg-blue-500 hover:bg-blue-600 text-white py-2 px-4 rounded" onClick={() => setPlayOnline(true)}>Play Online</button>
        <button className="bg-blue-500 hover:bg-blue-600 text-white py-2 px-4 rounded" onClick={() => setPlayFriend(true)}>Play a Friend</button>
        <button className="bg-blue-500 hover:bg-blue-600 text-white py-2 px-4 rounded" onClick={() => setPlayBot(true)}>Play Bots</button>
      </div>
    </div>
  );
}

export default Start;
