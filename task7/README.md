# 🚢 Sea Battle Game

A modern, modular implementation of the classic Battleship game built with ES6+ JavaScript. Features intelligent CPU AI, clean architecture, and CLI-based gameplay.

## 🏗️ Architecture

The game is built with a clean, modular architecture following modern JavaScript best practices:

### Module Structure

```
├── index.js      # Entry point and CLI interface
├── Game.js       # Main game controller and game loop
├── Board.js      # Game board management and ship placement
├── Player.js     # Human player input handling
├── CPU.js        # AI opponent with hunt/target strategy
├── Ship.js       # Ship representation and hit detection
└── utils.js      # Configuration constants and utilities
```

### Key Features

- ✅ **Modular Design**: Each component is self-contained with clear responsibilities
- ✅ **ES6+ Modern JavaScript**: Classes, modules, async/await, and modern syntax
- ✅ **Zero Global Variables**: Everything is properly encapsulated
- ✅ **Intelligent AI**: CPU uses hunt/target strategy for challenging gameplay
- ✅ **Clean Separation**: Game logic, display, and input handling are separated
- ✅ **Error Handling**: Robust error handling and graceful shutdown

## 🚀 Getting Started

### Prerequisites

- Node.js 14.0.0 or higher

### Installation

1. Clone or download the project files
2. Navigate to the project directory
3. Run the game:

```bash
npm start
# or
node index.js
```

### Making it executable globally:

```bash
npm link
sea-battle
```

## 🎮 How to Play

1. **Setup**: The game automatically places ships on both your board and the CPU's board
2. **Your Turn**: Enter coordinates as two digits (e.g., "34" for row 3, column 4)
3. **CPU Turn**: The AI makes its move using intelligent targeting
4. **Win Condition**: Sink all enemy ships before they sink yours!

### Game Symbols
- `~` = Water
- `S` = Your ship
- `X` = Hit
- `O` = Miss

### Input Format
- Enter coordinates as two digits: `00`, `34`, `95`
- First digit = row (0-9)
- Second digit = column (0-9)

## 📋 Module Details

### `utils.js`
Contains game configuration and utility functions:
- Game constants (board size, ship count, symbols)
- Coordinate utilities
- Random generation helpers

### `Ship.js`
Represents individual ships:
- Location tracking
- Hit detection
- Sink status checking

### `Board.js`
Manages the game board:
- Grid creation and management
- Ship placement (random and manual)
- Guess processing
- Display generation

### `Player.js`
Handles human player actions:
- Input validation
- Guess making
- Statistics tracking

### `CPU.js`
AI opponent implementation:
- Hunt mode: Random searching
- Target mode: Focus fire after hits
- Adjacent cell targeting
- Strategy state management

### `Game.js`
Main game controller:
- Game initialization
- Turn management
- Win condition checking
- Game loop orchestration
- Display coordination

### `index.js`
Entry point:
- Welcome screen
- Game startup
- Error handling
- Graceful shutdown

## 🔧 Configuration

Modify `utils.js` to customize game settings:

```javascript
export const GAME_CONFIG = {
    BOARD_SIZE: 10,    // Board dimensions
    NUM_SHIPS: 3,      // Number of ships per player
    SHIP_LENGTH: 3,    // Length of each ship
    SYMBOLS: {         // Display symbols
        WATER: '~',
        SHIP: 'S',
        HIT: 'X',
        MISS: 'O'
    }
};
```

## 🧪 Testing the Modules

Each module can be imported and tested independently:

```javascript
import { Ship } from './Ship.js';
import { Board } from './Board.js';
import { Player } from './Player.js';
import { CPUPlayer } from './CPU.js';

// Test ship functionality
const ship = new Ship(['00', '01', '02']);
console.log(ship.hit('01')); // true
console.log(ship.isSunk()); // false

// Test board functionality
const board = new Board(10, true);
board.placeShipsRandomly(3, 3);
console.log(board.display());
```

## 📊 Game Statistics

The game tracks various statistics accessible through:
- `game.getGameStats()` - Overall game statistics
- `player.getStats()` - Player-specific stats
- `cpu.getStats()` - CPU stats including AI state
- `board.getStats()` - Board-specific information

## 🎯 Future Enhancements

The modular architecture makes it easy to add new features:
- Different ship sizes
- Multiplayer support
- Web interface
- Save/load game state
- Different AI difficulty levels
- Tournament mode

## 🤝 Contributing

The modular structure makes contributions straightforward:
1. Each module has a single responsibility
2. Dependencies are clearly defined through imports
3. All functions are documented with JSDoc
4. No global state to manage

## 📄 License

MIT License - feel free to use and modify as needed.

---

## 🏆 Original vs Refactored

This modular version improves upon the original in several ways:

### Before (Legacy)
- All code in one file
- Global variables everywhere
- Mixed concerns
- Difficult to test
- Hard to extend

### After (Modular)
- Clean separation of concerns
- No global variables
- Modern ES6+ features
- Easily testable modules
- Extensible architecture
- Proper error handling
- Documentation

The game maintains all original functionality while providing a much cleaner, more maintainable codebase. 