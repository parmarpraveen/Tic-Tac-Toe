import express from "express";
import { createServer } from "http";
import { Server } from "socket.io";
import path from "path";
import { fileURLToPath } from "url";

const app = express();
const httpServer = createServer(app);
const io = new Server(httpServer);
const PORT = 3000;

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

app.use(express.static(path.join(__dirname, "..")));

// app.get("/", (req, res) => {
//   res.sendFile(path.join(__dirname, "..", "index.html"));
// });

let waitingPlayer = null;
const gameRooms = new Map();

io.on("connection", (socket) => {
  console.log("A user connected:", socket.id);

  socket.on("join", (data) => {
    const { playerName } = data;

    if (waitingPlayer) {
      const roomId = `${waitingPlayer.socketId}-${socket.id}`;
      gameRooms.set(roomId, {
        players: [
          {
            socketId: waitingPlayer.socketId,
            playerName: waitingPlayer.playerName,
            role: "X",
          },
          { socketId: socket.id, playerName: playerName, role: "O" },
        ],
        createdAt: Date.now(),
      });

      //join sockets to room
      socket.join(roomId);
      io.sockets.sockets.get(waitingPlayer.socketId).join(roomId);

      //store info to sockets
      socket.roomId = roomId;
      io.sockets.sockets.get(waitingPlayer.socketId).roomId = roomId;

      const room = gameRooms.get(roomId);

      io.to(waitingPlayer.socketId).emit("start", {
        opponentName: playerName,
        role: "X",
        roomId: roomId,
      });

      io.to(socket.id).emit("start", {
        opponentName: waitingPlayer.playerName,
        role: "O",
        roomId: roomId,
      });

      console.log("game started with room id:", roomId);
      waitingPlayer = null;
    } else {
      waitingPlayer = {
        socketId: socket.id,
        playerName: playerName,
      };
      socket.emit("waiting", { message: "Waiting for an opponent..." });
      console.log("Waiting for opponent:", waitingPlayer);
    }
  });

  socket.on("moved", (data) => {
    console.log("Move received:", data);
    const roomId = socket.roomId;
    if (roomId) {
      socket.to(roomId).emit("moved", data);
    }
  });

  socket.on("reset", (data) => {
    resetGame(data, socket);
  });
  socket.on("disconnect", () => {
    console.log("A user disconnected:", socket.id);

    // Clean up waiting player if they disconnect
    if (waitingPlayer && waitingPlayer.socketId === socket.id) {
      waitingPlayer = null;
    }
    // Room cleanUp
    const roomId = socket.roomId;
    if (roomId) {
      gameRooms.delete(roomId);
      socket.to(roomId).emit("opponentLeft", {
        message: "Your opponent has disconnected.",
      });
      console.log(`Room ${roomId} closed due to disconnection.`);
    }
  });
});

httpServer.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});


function resetGame( data , socket) {
  const { playerName } = data;

    if (waitingPlayer && waitingPlayer.socketId !== socket.id) {
      const roomId = `${waitingPlayer.socketId}-${socket.id}`;
      gameRooms.set(roomId, {
        players: [
          {
            socketId: waitingPlayer.socketId,
            playerName: waitingPlayer.playerName,
            role: "X",
          },
          { socketId: socket.id, playerName: playerName, role: "O" },
        ],
        createdAt: Date.now(),
      });

      //join sockets to room
      socket.join(roomId);
      io.sockets.sockets.get(waitingPlayer.socketId).join(roomId);

      //store info to sockets
      socket.roomId = roomId;
      io.sockets.sockets.get(waitingPlayer.socketId).roomId = roomId;

      const room = gameRooms.get(roomId);

      io.to(waitingPlayer.socketId).emit("start", {
        opponentName: playerName,
        role: "X",
        roomId: roomId,
      });

      io.to(socket.id).emit("start", {
        opponentName: waitingPlayer.playerName,
        role: "O",
        roomId: roomId,
      });

      console.log("game started with room id:", roomId);
      waitingPlayer = null;
    } else {
      waitingPlayer = {
        socketId: socket.id,
        playerName: playerName,
      };
      socket.emit("waiting", { message: "Waiting for an opponent..." });
      console.log("Waiting for opponent:", waitingPlayer);
    }
}