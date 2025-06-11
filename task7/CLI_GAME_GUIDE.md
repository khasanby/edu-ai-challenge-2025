# 🚢 Sea Battle CLI Game - Player Guide

## 🚀 How to Run the Game

### Start the Game
```bash
# From the project root directory
node index.js

# Or make it executable (Linux/Mac)
chmod +x index.js
./index.js

# Or use npm script
npm start
```

## 🎮 Gameplay Walkthrough

### 1. **Game Startup**
When you run the game, you'll see:
```
==================================================
🚢  WELCOME TO SEA BATTLE  🚢
==================================================

📋 GAME RULES:
• Board size: 10x10
• Ships per player: 3
• Ship length: 3 cells
• Goal: Sink all enemy ships before they sink yours!

🎯 HOW TO PLAY:
• Enter coordinates as two digits (e.g., "00", "34", "95")
• First digit = row, second digit = column
• Both coordinates range from 0 to 9

🔤 SYMBOLS:
• ~ = Water
• S = Your ship
• X = Hit
• O = Miss

Good luck, Admiral! 🫡
```

### 2. **Board Display**
After setup, you'll see both boards side by side:
```
   --- OPPONENT BOARD ---          --- YOUR BOARD ---
  0 1 2 3 4 5 6 7 8 9     0 1 2 3 4 5 6 7 8 9
0 ~ ~ ~ ~ ~ ~ ~ ~ ~ ~    0 ~ ~ S S S ~ ~ ~ ~ ~
1 ~ ~ ~ ~ ~ ~ ~ ~ ~ ~    1 ~ ~ ~ ~ ~ ~ ~ ~ ~ ~
2 ~ ~ ~ ~ ~ ~ ~ ~ ~ ~    2 ~ ~ ~ ~ ~ ~ ~ ~ ~ ~
3 ~ ~ ~ ~ ~ ~ ~ ~ ~ ~    3 S ~ ~ ~ ~ ~ ~ ~ ~ ~
4 ~ ~ ~ ~ ~ ~ ~ ~ ~ ~    4 S ~ ~ ~ ~ ~ ~ ~ ~ ~
5 ~ ~ ~ ~ ~ ~ ~ ~ ~ ~    5 S ~ ~ ~ ~ ~ ~ ~ ~ ~
6 ~ ~ ~ ~ ~ ~ ~ ~ ~ ~    6 ~ ~ ~ ~ ~ ~ ~ ~ ~ ~
7 ~ ~ ~ ~ ~ ~ ~ ~ ~ ~    7 ~ ~ ~ ~ ~ ~ ~ ~ ~ ~
8 ~ ~ ~ ~ ~ ~ ~ ~ ~ ~    8 ~ ~ ~ S S S ~ ~ ~ ~
9 ~ ~ ~ ~ ~ ~ ~ ~ ~ ~    9 ~ ~ ~ ~ ~ ~ ~ ~ ~ ~
```

## 📝 **Input Examples**

### Valid Coordinate Inputs:
```bash
Enter your guess (e.g., 00): 00    # Top-left corner
Enter your guess (e.g., 00): 55    # Center of board
Enter your guess (e.g., 00): 99    # Bottom-right corner
Enter your guess (e.g., 00): 03    # Row 0, Column 3
Enter your guess (e.g., 00): 78    # Row 7, Column 8
```

### Invalid Inputs (will be rejected):
```bash
Enter your guess (e.g., 00): 0     # Too short
Enter your guess (e.g., 00): 123   # Too long
Enter your guess (e.g., 00): aa    # Non-numeric
Enter your guess (e.g., 00): 99    # Out of bounds (if > board size)
```

## 🎯 **Turn-by-Turn Gameplay**

### Player Turn Example:
```
Enter your guess (e.g., 00): 55
PLAYER HIT!

   --- OPPONENT BOARD ---          --- YOUR BOARD ---
  0 1 2 3 4 5 6 7 8 9     0 1 2 3 4 5 6 7 8 9
0 ~ ~ ~ ~ ~ ~ ~ ~ ~ ~    0 ~ ~ S S S ~ ~ ~ ~ ~
1 ~ ~ ~ ~ ~ ~ ~ ~ ~ ~    1 ~ ~ ~ ~ ~ ~ ~ ~ ~ ~
...
5 ~ ~ ~ ~ ~ X ~ ~ ~ ~    5 S ~ ~ ~ ~ ~ ~ ~ ~ ~
...
```

### CPU Turn Example:
```
--- CPU's Turn ---
CPU HIT at 30!

   --- OPPONENT BOARD ---          --- YOUR BOARD ---
  0 1 2 3 4 5 6 7 8 9     0 1 2 3 4 5 6 7 8 9
0 ~ ~ ~ ~ ~ ~ ~ ~ ~ ~    0 ~ ~ S S S ~ ~ ~ ~ ~
1 ~ ~ ~ ~ ~ ~ ~ ~ ~ ~    1 ~ ~ ~ ~ ~ ~ ~ ~ ~ ~
2 ~ ~ ~ ~ ~ ~ ~ ~ ~ ~    2 ~ ~ ~ ~ ~ ~ ~ ~ ~ ~
3 X ~ ~ ~ ~ ~ ~ ~ ~ ~    3 X ~ ~ ~ ~ ~ ~ ~ ~ ~
...
```

### Ship Sinking:
```
Enter your guess (e.g., 00): 56
PLAYER HIT!
You sunk an enemy battleship!
```

## 🏆 **Game End Scenarios**

### Player Victory:
```
*** CONGRATULATIONS! You sunk all enemy battleships! ***

Final Board State:
   --- OPPONENT BOARD ---          --- YOUR BOARD ---
  0 1 2 3 4 5 6 7 8 9     0 1 2 3 4 5 6 7 8 9
0 ~ O ~ X X X ~ ~ ~ ~    0 ~ ~ S S S ~ ~ ~ ~ ~
1 ~ ~ ~ ~ ~ ~ ~ ~ ~ ~    1 ~ ~ ~ ~ ~ ~ ~ ~ ~ ~
2 O ~ ~ ~ ~ ~ ~ ~ ~ ~    2 ~ ~ ~ ~ ~ ~ ~ ~ ~ ~
3 X X X ~ ~ ~ ~ ~ ~ ~    3 S ~ ~ ~ ~ ~ ~ ~ ~ ~
...

👋 Thanks for playing Sea Battle!
```

### CPU Victory:
```
*** GAME OVER! The CPU sunk all your battleships! ***

👋 Thanks for playing Sea Battle!
```

## ⌨️ **Keyboard Controls**

### During Gameplay:
- **Enter coordinates**: Type two digits (e.g., `03`, `78`) and press Enter
- **Ctrl+C**: Exit the game at any time
- **Invalid input**: Game will prompt for valid input, doesn't exit

### Game Flow:
1. **Setup Phase**: Ships are automatically placed randomly
2. **Battle Phase**: Alternating turns between player and CPU
3. **End Phase**: Game announces winner and exits

## 🔧 **Advanced Usage**

### Running with Debug Info:
```bash
# Run with Node.js debugging
node --inspect index.js

# Run with development logging
npm run dev
```

### Testing the Game Components:
```bash
# Run unit tests
npm test

# Run specific test suites
npm test -- tests/Ship.test.js
npm test -- tests/Player.test.js

# Run with coverage
npm run test:coverage
```

## 🎮 **Sample Complete Game Session**

```bash
$ node index.js

==================================================
🚢  WELCOME TO SEA BATTLE  🚢
==================================================
[Game rules displayed...]

Setting up the game...
3 ships placed for both players.

Let's play Sea Battle!
Try to sink the 3 enemy ships.

   --- OPPONENT BOARD ---          --- YOUR BOARD ---
  0 1 2 3 4 5 6 7 8 9     0 1 2 3 4 5 6 7 8 9
0 ~ ~ ~ ~ ~ ~ ~ ~ ~ ~    0 ~ ~ S S S ~ ~ ~ ~ ~
1 ~ ~ ~ ~ ~ ~ ~ ~ ~ ~    1 ~ ~ ~ ~ ~ ~ ~ ~ ~ ~
2 ~ ~ ~ ~ ~ ~ ~ ~ ~ ~    2 ~ ~ ~ ~ ~ ~ ~ ~ ~ ~
3 ~ ~ ~ ~ ~ ~ ~ ~ ~ ~    3 S ~ ~ ~ ~ ~ ~ ~ ~ ~
4 ~ ~ ~ ~ ~ ~ ~ ~ ~ ~    4 S ~ ~ ~ ~ ~ ~ ~ ~ ~
5 ~ ~ ~ ~ ~ ~ ~ ~ ~ ~    5 S ~ ~ ~ ~ ~ ~ ~ ~ ~
6 ~ ~ ~ ~ ~ ~ ~ ~ ~ ~    6 ~ ~ ~ ~ ~ ~ ~ ~ ~ ~
7 ~ ~ ~ ~ ~ ~ ~ ~ ~ ~    7 ~ ~ ~ S S S ~ ~ ~ ~
8 ~ ~ ~ ~ ~ ~ ~ ~ ~ ~    8 ~ ~ ~ ~ ~ ~ ~ ~ ~ ~
9 ~ ~ ~ ~ ~ ~ ~ ~ ~ ~    9 ~ ~ ~ ~ ~ ~ ~ ~ ~ ~

Enter your guess (e.g., 00): 55
PLAYER HIT!

--- CPU's Turn ---
CPU MISS at 12.

   --- OPPONENT BOARD ---          --- YOUR BOARD ---
  0 1 2 3 4 5 6 7 8 9     0 1 2 3 4 5 6 7 8 9
0 ~ ~ ~ ~ ~ ~ ~ ~ ~ ~    0 ~ ~ S S S ~ ~ ~ ~ ~
1 ~ ~ O ~ ~ ~ ~ ~ ~ ~    1 ~ ~ O ~ ~ ~ ~ ~ ~ ~
2 ~ ~ ~ ~ ~ ~ ~ ~ ~ ~    2 ~ ~ ~ ~ ~ ~ ~ ~ ~ ~
3 ~ ~ ~ ~ ~ ~ ~ ~ ~ ~    3 S ~ ~ ~ ~ ~ ~ ~ ~ ~
4 ~ ~ ~ ~ ~ ~ ~ ~ ~ ~    4 S ~ ~ ~ ~ ~ ~ ~ ~ ~
5 ~ ~ ~ ~ ~ X ~ ~ ~ ~    5 S ~ ~ ~ ~ ~ ~ ~ ~ ~
6 ~ ~ ~ ~ ~ ~ ~ ~ ~ ~    6 ~ ~ ~ ~ ~ ~ ~ ~ ~ ~
7 ~ ~ ~ ~ ~ ~ ~ ~ ~ ~    7 ~ ~ ~ S S S ~ ~ ~ ~
8 ~ ~ ~ ~ ~ ~ ~ ~ ~ ~    8 ~ ~ ~ ~ ~ ~ ~ ~ ~ ~
9 ~ ~ ~ ~ ~ ~ ~ ~ ~ ~    9 ~ ~ ~ ~ ~ ~ ~ ~ ~ ~

Enter your guess (e.g., 00): 56
PLAYER HIT!

--- CPU's Turn ---
CPU HIT at 30!
[... game continues until someone wins ...]

*** CONGRATULATIONS! You sunk all enemy battleships! ***

👋 Thanks for playing Sea Battle!
```

## 🚨 **Troubleshooting**

### Common Issues:

1. **"Cannot find module" error:**
   ```bash
   # Make sure you're in the right directory
   cd /path/to/your/sea-battle-game
   
   # Check if src/ directory exists with Game.js, Board.js, etc.
   ls src/
   ```

2. **"Syntax error" or "Unexpected token":**
   ```bash
   # Make sure you're using Node.js 14+ for ES modules
   node --version
   
   # Check package.json has "type": "module"
   ```

3. **Game doesn't respond to input:**
   - Press Ctrl+C to exit
   - Make sure you're entering exactly 2 digits
   - Try running `node index.js` again

4. **Game crashes:**
   - Check the error message
   - Run tests: `npm test`
   - Try: `node --trace-warnings index.js`

## 🎯 **Pro Tips**

1. **Strategic Playing:**
   - Look for patterns in your hits
   - Ships are 3 cells long, so if you hit once, try adjacent cells
   - The CPU uses hunt/target strategy, so be strategic about ship placement

2. **Quick Testing:**
   - Start multiple games to test different scenarios
   - Use Ctrl+C to exit and restart quickly
   - Watch CPU behavior - it gets smarter after hitting your ships!

3. **Development:**
   - Modify `src/utils.js` to change board size or ship count
   - Run tests after changes: `npm test`
   - Check test coverage: `npm run test:coverage`

---

**Enjoy your Sea Battle game! ⚓🎮** 