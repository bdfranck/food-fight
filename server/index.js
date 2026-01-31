import express from 'express';
import { createServer } from 'http';
import { Server } from 'socket.io';

const app = express();
const httpServer = createServer(app);
const io = new Server(httpServer, {
  cors: {
    origin: '*',
    methods: ['GET', 'POST']
  }
});

const PORT = process.env.PORT || 3001;

// Game state
const players = {};
let foodIdCounter = 0;

// Random player names
const playerNames = [
  'Chef Mario', 'Baker Bob', 'Cook Charlie', 'Waiter Wendy',
  'Sous Sarah', 'Grill Master', 'Pizza Pete', 'Burger Beth'
];

function getRandomName() {
  return playerNames[Math.floor(Math.random() * playerNames.length)];
}

// Socket.io connection handling
io.on('connection', (socket) => {
  console.log(`New player connected: ${socket.id}`);

  // Create a new player
  players[socket.id] = {
    id: socket.id,
    x: Math.floor(Math.random() * 700) + 50,
    y: Math.floor(Math.random() * 400) + 100,
    name: getRandomName(),
    score: 0
  };

  // Send all current players to the new player
  socket.emit('currentPlayers', players);

  // Broadcast new player to all other players
  socket.broadcast.emit('newPlayer', players[socket.id]);

  // Send player count to all clients
  io.emit('playerCount', Object.keys(players).length);

  // Handle player movement
  socket.on('playerMovement', (movementData) => {
    if (players[socket.id]) {
      players[socket.id].x = movementData.x;
      players[socket.id].y = movementData.y;
      
      // Broadcast to all other players
      socket.broadcast.emit('playerMoved', {
        id: socket.id,
        x: movementData.x,
        y: movementData.y
      });
    }
  });

  // Handle food throwing
  socket.on('throwFood', (foodData) => {
    if (players[socket.id]) {
      const foodId = `food_${foodIdCounter++}`;
      
      // Random target within game bounds
      const targetX = Math.floor(Math.random() * 700) + 50;
      const targetY = Math.floor(Math.random() * 400) + 100;
      
      const foodInfo = {
        id: foodId,
        playerId: socket.id,
        x: foodData.x,
        y: foodData.y,
        targetX: targetX,
        targetY: targetY
      };

      // Broadcast to all players including sender
      io.emit('foodThrown', foodInfo);

      // Simulate food hit after 500ms (matches client animation)
      setTimeout(() => {
        io.emit('foodHit', foodId);
      }, 500);
    }
  });

  // Handle player disconnect
  socket.on('disconnect', () => {
    console.log(`Player disconnected: ${socket.id}`);
    delete players[socket.id];
    
    // Broadcast to all remaining players
    io.emit('playerDisconnected', socket.id);
    io.emit('playerCount', Object.keys(players).length);
  });
});

// Start server
httpServer.listen(PORT, () => {
  console.log(`🍕 Food Fight Server is running on port ${PORT}`);
  console.log(`Ready for players to join!`);
});
