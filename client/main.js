import Phaser from 'phaser';
import { io } from 'socket.io-client';
import GameScene from './scenes/GameScene.js';

// Socket.io connection
const socket = io('http://localhost:3001');

// Phaser game configuration
const config = {
  type: Phaser.AUTO,
  width: 800,
  height: 600,
  parent: 'game-container',
  physics: {
    default: 'arcade',
    arcade: {
      gravity: { y: 0 },
      debug: false
    }
  },
  scene: [GameScene]
};

// Create the game instance
const game = new Phaser.Game(config);

// Pass socket to the game
game.socket = socket;

// Handle player count updates
socket.on('playerCount', (count) => {
  const playerCountElement = document.getElementById('player-count');
  if (playerCountElement) {
    playerCountElement.textContent = count;
  }
});

export { socket };
