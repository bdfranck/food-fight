# 🍕 Food Fight - 2D Multiplayer Browser Game

A real-time multiplayer web browser game inspired by the classic 1986 "Food Fight" game for the Atari 7800. Players throw food at each other in a fun, chaotic arcade-style battle!

## 🎮 Game Features

- **Real-time Multiplayer**: Play with multiple players simultaneously
- **Simple Controls**: Arrow keys or WASD to move, Space to throw food
- **Browser-based**: No installation required, runs directly in your web browser
- **Responsive**: Works on different screen sizes

## 🛠️ Technology Stack

This project uses modern web development frameworks and libraries:

### Frontend
- **[Phaser 3](https://phaser.io/)**: A powerful 2D game framework for HTML5
  - Handles game rendering, physics, and animations
  - Built-in arcade physics system
  - Excellent documentation and community support
  
### Backend  
- **[Socket.io](https://socket.io/)**: Real-time bidirectional event-based communication
  - Enables multiplayer functionality
  - Automatic reconnection
  - Cross-browser compatible

### Development Tools
- **[Vite](https://vitejs.dev/)**: Fast build tool and development server
  - Lightning-fast Hot Module Replacement (HMR)
  - Optimized production builds
  - Modern ES modules support
  
- **[Node.js](https://nodejs.org/)**: JavaScript runtime for the server
- **[Express](https://expressjs.com/)**: Minimal web framework for Node.js

## 📋 Prerequisites

- [Node.js](https://nodejs.org/) (version 16 or higher)
- npm (comes with Node.js)

## 🚀 Getting Started

### Installation

1. Clone the repository:
```bash
git clone https://github.com/bdfranck/food-fight.git
cd food-fight
```

2. Install dependencies:
```bash
npm install
```

### Running the Game

#### Development Mode (Recommended)

Run both the server and client simultaneously:
```bash
npm run dev
```

This will start:
- Game server on `http://localhost:3001`
- Client development server on `http://localhost:3000`

Open your browser to `http://localhost:3000` to play!

#### Production Mode

1. Build the client:
```bash
npm run build
```

2. Run the server:
```bash
npm run server
```

3. Serve the built files (you'll need to set up a static file server)

### Running Separately

If you need to run the server and client separately:

**Server only:**
```bash
npm run server
```

**Client only:**
```bash
npm run client
```

## 🎯 How to Play

1. Open the game in your browser at `http://localhost:3000`
2. You'll see your player (green) and other players (red)
3. Use **Arrow Keys** or **WASD** to move your character
4. Press **Space** to throw food at random locations
5. Try to hit other players with food!

## 🏗️ Project Structure

```
food-fight/
├── client/                 # Client-side code
│   ├── scenes/            # Phaser game scenes
│   │   └── GameScene.js   # Main game scene
│   └── main.js            # Client entry point
├── server/                # Server-side code
│   └── index.js           # Socket.io server
├── index.html             # Main HTML file
├── vite.config.js         # Vite configuration
├── package.json           # Project dependencies
└── README.md              # This file
```

## 🔧 Configuration

### Server Port

The server runs on port 3001 by default. To change it, set the `PORT` environment variable:

```bash
PORT=8080 npm run server
```

### Client Port

The client runs on port 3000 by default. To change it, modify `vite.config.js`:

```javascript
server: {
  port: 8080  // Change to desired port
}
```

## 🌐 Multiplayer Testing

To test multiplayer functionality:

1. Start the game (`npm run dev`)
2. Open multiple browser windows/tabs to `http://localhost:3000`
3. Each window represents a different player
4. You can also test on different devices on the same network by using your local IP address

## 🎨 Game Mechanics

### Current Features
- Player movement with collision boundaries
- Food throwing with animated projectiles
- Multiple player support
- Real-time synchronization
- Player name tags
- Player count display

### Potential Enhancements
- Score tracking
- Food collision detection with players
- Power-ups
- Different food types with unique effects
- Obstacles and barriers
- Sound effects
- Better graphics/sprites
- Game lobby system
- Chat functionality

## 📚 Why These Frameworks?

### Phaser 3
- **Mature & Stable**: Well-established framework with extensive documentation
- **Performance**: Optimized for 2D games with WebGL and Canvas rendering
- **Feature-Rich**: Built-in physics, sprites, animations, input handling
- **Active Community**: Large community with many tutorials and examples

### Socket.io
- **Industry Standard**: Most popular real-time communication library
- **Reliability**: Automatic reconnection and fallback mechanisms
- **Easy to Use**: Simple API for both client and server
- **Scalable**: Can handle many concurrent connections

### Vite
- **Speed**: Extremely fast development server with instant HMR
- **Modern**: Uses native ES modules for better performance
- **Zero Config**: Works out of the box with sensible defaults
- **Production Ready**: Optimized builds with code splitting

## 🤝 Contributing

Contributions are welcome! Feel free to:
- Report bugs
- Suggest new features
- Submit pull requests

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- Inspired by the classic 1986 "Food Fight" arcade game for Atari 7800
- Built with modern web technologies

## 📞 Support

For questions or issues, please open an issue on GitHub.

---

**Happy Food Fighting! 🍔🍕🌮**