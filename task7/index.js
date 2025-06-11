#!/usr/bin/env node

/**
 * Sea Battle Game - CLI Entry Point
 * 
 * A modular implementation of the classic Battleship game with:
 * - Human vs CPU gameplay
 * - Intelligent CPU AI with hunt/target strategy
 * - Clean separation of concerns across modules
 * - Modern ES6+ JavaScript architecture
 */

import { Game } from './src/Game.js';
import { GAME_CONFIG } from './src/utils.js';
import readline from 'readline';

/**
 * Display welcome message and game instructions
 */
function displayWelcome() {
    console.log('='.repeat(50));
    console.log('🚢  WELCOME TO SEA BATTLE  🚢');
    console.log('='.repeat(50));
    console.log(`
📋 GAME RULES:
• Board size: ${GAME_CONFIG.BOARD_SIZE}x${GAME_CONFIG.BOARD_SIZE}
• Ships per player: ${GAME_CONFIG.NUM_SHIPS}
• Ship length: ${GAME_CONFIG.SHIP_LENGTH} cells
• Goal: Sink all enemy ships before they sink yours!

🎯 HOW TO PLAY:
• Enter coordinates as two digits (e.g., "00", "34", "95")
• First digit = row, second digit = column
• Both coordinates range from 0 to ${GAME_CONFIG.BOARD_SIZE - 1}

🔤 SYMBOLS:
• ${GAME_CONFIG.SYMBOLS.WATER} = Water
• ${GAME_CONFIG.SYMBOLS.SHIP} = Your ship
• ${GAME_CONFIG.SYMBOLS.HIT} = Hit
• ${GAME_CONFIG.SYMBOLS.MISS} = Miss

Good luck, Admiral! 🫡
`);
}

/**
 * Ask player if they want to play again
 */
async function askPlayAgain() {
    const rl = readline.createInterface({
        input: process.stdin,
        output: process.stdout,
    });

    return new Promise((resolve) => {
        rl.question('\n🎮 Would you like to play again? (y/N): ', (answer) => {
            rl.close();
            const playAgain = answer.toLowerCase().trim();
            resolve(playAgain === 'y' || playAgain === 'yes');
        });
    });
}

/**
 * Handle graceful shutdown
 */
function setupGracefulShutdown(game) {
    const cleanup = () => {
        console.log('\n\n👋 Thanks for playing Sea Battle!');
        if (game) game.cleanup();
        process.exit(0);
    };

    process.on('SIGINT', cleanup);
    process.on('SIGTERM', cleanup);
    process.on('uncaughtException', (error) => {
        console.error('\n❌ An unexpected error occurred:', error.message);
        if (game) game.cleanup();
        process.exit(1);
    });
}

/**
 * Play a single game
 */
async function playGame() {
    const game = new Game();
    setupGracefulShutdown(game);
    
    try {
        await game.start();
        return true; // Game completed normally
    } catch (error) {
        console.error('❌ Game error:', error.message);
        return false; // Game failed
    }
}

/**
 * Main game loop with restart functionality
 */
async function main() {
    try {
        displayWelcome();
        
        let playAgain = true;
        
        while (playAgain) {
            const gameCompleted = await playGame();
            
            if (gameCompleted) {
                // Only ask to play again if game completed normally
                playAgain = await askPlayAgain();
                
                if (playAgain) {
                    console.clear(); // Clear screen for new game
                    console.log('\n🔄 Starting new game...\n');
                }
            } else {
                // If game failed, don't ask to play again
                playAgain = false;
            }
        }
        
        console.log('\n👋 Thanks for playing Sea Battle! Goodbye! 🚢');
        
    } catch (error) {
        console.error('❌ Failed to start the game:', error.message);
        process.exit(1);
    }
}

// Start the game if this file is run directly
if (import.meta.url === `file://${process.argv[1]}`) {
    main();
}

export { main };
