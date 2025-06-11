#!/usr/bin/env node

/**
 * Sea Battle Game - CLI Demo Script
 * 
 * This script demonstrates what the actual CLI gameplay looks like
 * with sample inputs and outputs.
 */

console.log(`
🚢 SEA BATTLE CLI GAME DEMONSTRATION 🚢
=====================================

This shows what the actual gameplay looks like when you run:
$ node index.js

`);

console.log(`
🎮 1. GAME STARTUP
=================

$ node index.js

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

Setting up the game...
3 ships placed for both players.

Let's play Sea Battle!
Try to sink the 3 enemy ships.
`);

console.log(`
🎯 2. INITIAL BOARD STATE
========================

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

`);

console.log(`
📝 3. PLAYER TURN EXAMPLES
=========================

Enter your guess (e.g., 00): 03
PLAYER MISS.

   --- OPPONENT BOARD ---          --- YOUR BOARD ---
  0 1 2 3 4 5 6 7 8 9     0 1 2 3 4 5 6 7 8 9
0 ~ ~ ~ O ~ ~ ~ ~ ~ ~    0 ~ ~ S S S ~ ~ ~ ~ ~
1 ~ ~ ~ ~ ~ ~ ~ ~ ~ ~    1 ~ ~ ~ ~ ~ ~ ~ ~ ~ ~
2 ~ ~ ~ ~ ~ ~ ~ ~ ~ ~    2 ~ ~ ~ ~ ~ ~ ~ ~ ~ ~
3 ~ ~ ~ ~ ~ ~ ~ ~ ~ ~    3 S ~ ~ ~ ~ ~ ~ ~ ~ ~
4 ~ ~ ~ ~ ~ ~ ~ ~ ~ ~    4 S ~ ~ ~ ~ ~ ~ ~ ~ ~
5 ~ ~ ~ ~ ~ ~ ~ ~ ~ ~    5 S ~ ~ ~ ~ ~ ~ ~ ~ ~
6 ~ ~ ~ ~ ~ ~ ~ ~ ~ ~    6 ~ ~ ~ ~ ~ ~ ~ ~ ~ ~
7 ~ ~ ~ ~ ~ ~ ~ ~ ~ ~    7 ~ ~ ~ S S S ~ ~ ~ ~
8 ~ ~ ~ ~ ~ ~ ~ ~ ~ ~    8 ~ ~ ~ ~ ~ ~ ~ ~ ~ ~
9 ~ ~ ~ ~ ~ ~ ~ ~ ~ ~    9 ~ ~ ~ ~ ~ ~ ~ ~ ~ ~

--- CPU's Turn ---
CPU MISS at 12.

Enter your guess (e.g., 00): 55
PLAYER HIT!

   --- OPPONENT BOARD ---          --- YOUR BOARD ---
  0 1 2 3 4 5 6 7 8 9     0 1 2 3 4 5 6 7 8 9
0 ~ ~ ~ O ~ ~ ~ ~ ~ ~    0 ~ ~ S S S ~ ~ ~ ~ ~
1 ~ ~ O ~ ~ ~ ~ ~ ~ ~    1 ~ ~ O ~ ~ ~ ~ ~ ~ ~
2 ~ ~ ~ ~ ~ ~ ~ ~ ~ ~    2 ~ ~ ~ ~ ~ ~ ~ ~ ~ ~
3 ~ ~ ~ ~ ~ ~ ~ ~ ~ ~    3 S ~ ~ ~ ~ ~ ~ ~ ~ ~
4 ~ ~ ~ ~ ~ ~ ~ ~ ~ ~    4 S ~ ~ ~ ~ ~ ~ ~ ~ ~
5 ~ ~ ~ ~ ~ X ~ ~ ~ ~    5 S ~ ~ ~ ~ ~ ~ ~ ~ ~
6 ~ ~ ~ ~ ~ ~ ~ ~ ~ ~    6 ~ ~ ~ ~ ~ ~ ~ ~ ~ ~
7 ~ ~ ~ ~ ~ ~ ~ ~ ~ ~    7 ~ ~ ~ S S S ~ ~ ~ ~
8 ~ ~ ~ ~ ~ ~ ~ ~ ~ ~    8 ~ ~ ~ ~ ~ ~ ~ ~ ~ ~
9 ~ ~ ~ ~ ~ ~ ~ ~ ~ ~    9 ~ ~ ~ ~ ~ ~ ~ ~ ~ ~

--- CPU's Turn ---
CPU HIT at 30!

Enter your guess (e.g., 00): 56
PLAYER HIT!

Enter your guess (e.g., 00): 57
PLAYER HIT!
You sunk an enemy battleship!

`);

console.log(`
🏆 4. GAME END SCENARIOS
=======================

Option A - Player Wins:
*** CONGRATULATIONS! You sunk all enemy battleships! ***

🎮 Would you like to play again? (y/N): y

🔄 Starting new game...

Option B - CPU Wins:
*** GAME OVER! The CPU sunk all your battleships! ***

🎮 Would you like to play again? (y/N): n

👋 Thanks for playing Sea Battle! Goodbye! 🚢

Option C - Exit During Game:
Enter your guess (e.g., 00): ^C
👋 Thanks for playing Sea Battle!

`);

console.log(`
🚨 5. INPUT VALIDATION EXAMPLES
==============================

Enter your guess (e.g., 00): a
Input must be exactly two digits (e.g., 00, 34, 98).

Enter your guess (e.g., 00): 123
Input must be exactly two digits (e.g., 00, 34, 98).

Enter your guess (e.g., 00): aa
Enter valid numbers between 0 and 9

Enter your guess (e.g., 00): 55
You already guessed that location!

Enter your guess (e.g., 00): 78
PLAYER HIT!

`);

console.log(`
⚡ 6. QUICK START COMMANDS
=========================

# Start playing immediately:
$ node index.js

# Run with debugging:
$ node --inspect index.js

# Test the game components:
$ npm test

# Run a specific test:
$ npm test -- tests/Player.test.js

# Check test coverage:
$ npm run test:coverage

`);

console.log(`
🎯 7. PRO GAMEPLAY TIPS
======================

Strategic Play:
• After hitting a ship (X), try adjacent cells: up, down, left, right
• Ships are 3 cells long - find the pattern!
• Watch the CPU - it gets smarter after hitting your ships

Example Strategy:
1. Hit at 55 → Try 54, 56, 45, 65
2. Hit at 56 → Now try 57 (likely horizontal ship)
3. Hit at 57 → Ship sunk! Back to random search

CPU AI Behavior:
• Hunt mode: Random guessing
• Target mode: Smart adjacent targeting after hits
• Returns to hunt mode after sinking ships

`);

console.log(`
🚀 READY TO PLAY?
================

Run this command to start your Sea Battle adventure:

$ node index.js

Have fun, Admiral! 🚢⚓
`); 