import Phaser from 'phaser';

export default class GameScene extends Phaser.Scene {
  constructor() {
    super({ key: 'GameScene' });
    this.players = {};
    this.foods = {};
  }

  preload() {
    // Create simple colored sprites (no external assets needed)
    // Player sprite
    this.textures.generate('player', {
      data: ['33333', '32223', '33333', '32223', '33333'],
      pixelWidth: 8,
      pixelHeight: 8
    });
    
    // Food sprites
    this.textures.generate('pizza', {
      data: ['0000', '0FF0', '0FF0', '0000'],
      pixelWidth: 6,
      pixelHeight: 6
    });
    
    this.textures.generate('burger', {
      data: ['0000', '0BB0', '0BB0', '0000'],
      pixelWidth: 6,
      pixelHeight: 6
    });
  }

  create() {
    const socket = this.game.socket;

    // Create world
    this.add.text(400, 20, '🍕 FOOD FIGHT 🍔', {
      fontSize: '32px',
      fill: '#fff',
      fontStyle: 'bold'
    }).setOrigin(0.5);

    // Add game instructions
    this.add.text(400, 570, 'Arrow Keys/WASD: Move | Space: Throw Food', {
      fontSize: '16px',
      fill: '#fff'
    }).setOrigin(0.5);

    // Create player controls
    this.cursors = this.input.keyboard.createCursorKeys();
    this.wasd = {
      up: this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.W),
      down: this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.S),
      left: this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.A),
      right: this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.D)
    };
    this.spaceKey = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.SPACE);

    // Socket event handlers
    socket.on('currentPlayers', (players) => {
      Object.keys(players).forEach((id) => {
        if (id === socket.id) {
          this.addPlayer(id, players[id], true);
        } else {
          this.addPlayer(id, players[id], false);
        }
      });
    });

    socket.on('newPlayer', (playerInfo) => {
      this.addPlayer(playerInfo.id, playerInfo, false);
    });

    socket.on('playerMoved', (playerInfo) => {
      if (this.players[playerInfo.id]) {
        this.players[playerInfo.id].setPosition(playerInfo.x, playerInfo.y);
      }
    });

    socket.on('playerDisconnected', (playerId) => {
      if (this.players[playerId]) {
        this.players[playerId].destroy();
        delete this.players[playerId];
      }
    });

    socket.on('foodThrown', (foodData) => {
      this.throwFood(foodData);
    });

    socket.on('foodHit', (foodId) => {
      if (this.foods[foodId]) {
        this.foods[foodId].destroy();
        delete this.foods[foodId];
      }
    });
  }

  addPlayer(id, playerInfo, isCurrentPlayer) {
    const player = this.add.sprite(playerInfo.x, playerInfo.y, 'player');
    player.setScale(3);
    
    // Add player color
    if (isCurrentPlayer) {
      player.setTint(0x00ff00); // Green for current player
    } else {
      player.setTint(0xff0000); // Red for other players
    }

    // Add player name tag
    const nameTag = this.add.text(playerInfo.x, playerInfo.y - 30, playerInfo.name || 'Player', {
      fontSize: '14px',
      fill: '#fff',
      backgroundColor: '#000',
      padding: { x: 4, y: 2 }
    }).setOrigin(0.5);

    player.nameTag = nameTag;
    this.players[id] = player;

    if (isCurrentPlayer) {
      this.currentPlayer = player;
      this.currentPlayerId = id;
    }
  }

  throwFood(foodData) {
    const foodType = Math.random() > 0.5 ? 'pizza' : 'burger';
    const food = this.add.sprite(foodData.x, foodData.y, foodType);
    food.setScale(2);
    
    this.foods[foodData.id] = food;

    // Animate food movement
    this.tweens.add({
      targets: food,
      x: foodData.targetX,
      y: foodData.targetY,
      duration: 500,
      ease: 'Linear',
      onComplete: () => {
        food.destroy();
        delete this.foods[foodData.id];
      }
    });
  }

  update() {
    if (!this.currentPlayer) return;

    const socket = this.game.socket;
    const speed = 5;
    let moved = false;
    let newX = this.currentPlayer.x;
    let newY = this.currentPlayer.y;

    // Handle movement
    if (this.cursors.left.isDown || this.wasd.left.isDown) {
      newX -= speed;
      moved = true;
    } else if (this.cursors.right.isDown || this.wasd.right.isDown) {
      newX += speed;
      moved = true;
    }

    if (this.cursors.up.isDown || this.wasd.up.isDown) {
      newY -= speed;
      moved = true;
    } else if (this.cursors.down.isDown || this.wasd.down.isDown) {
      newY += speed;
      moved = true;
    }

    // Keep player in bounds
    newX = Phaser.Math.Clamp(newX, 20, 780);
    newY = Phaser.Math.Clamp(newY, 60, 540);

    if (moved) {
      this.currentPlayer.setPosition(newX, newY);
      this.currentPlayer.nameTag.setPosition(newX, newY - 30);
      
      socket.emit('playerMovement', {
        x: newX,
        y: newY
      });
    }

    // Handle food throwing
    if (Phaser.Input.Keyboard.JustDown(this.spaceKey)) {
      socket.emit('throwFood', {
        x: this.currentPlayer.x,
        y: this.currentPlayer.y
      });
    }

    // Update name tag positions for other players
    Object.keys(this.players).forEach((id) => {
      if (id !== this.currentPlayerId && this.players[id].nameTag) {
        this.players[id].nameTag.setPosition(
          this.players[id].x,
          this.players[id].y - 30
        );
      }
    });
  }
}
