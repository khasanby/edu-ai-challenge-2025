import readline from 'readline';
import { Board } from './Board.js';
import { Player } from './Player.js';
import { CPUPlayer } from './CPU.js';
import { GAME_CONFIG } from './utils.js';

/**
 * Display utility class for game UI
 */
class GameDisplay {
    /**
     * Display both boards side by side
     * @param {Board} cpuBoard - CPU's board
     * @param {Board} playerBoard - Player's board
     */
    static displayBoards(cpuBoard, playerBoard) {
        console.log('\n   --- OPPONENT BOARD ---          --- YOUR BOARD ---');
        const cpuDisplay = cpuBoard.display().split('\n');
        const playerDisplay = playerBoard.display().split('\n');
        
        for (let i = 0; i < cpuDisplay.length; i++) {
            if (cpuDisplay[i] && playerDisplay[i]) {
                console.log(cpuDisplay[i] + '    ' + playerDisplay[i]);
            }
        }
        console.log();
    }

    /**
     * Display game result message
     * @param {string} winner - 'player' or 'cpu'
     */
    static displayGameResult(winner) {
        if (winner === 'player') {
            console.log('\n*** CONGRATULATIONS! You sunk all enemy battleships! ***');
        } else {
            console.log('\n*** GAME OVER! The CPU sunk all your battleships! ***');
        }
    }

    /**
     * Display game setup message
     */
    static displaySetup() {
        console.log('Setting up the game...');
        console.log(`${GAME_CONFIG.NUM_SHIPS} ships placed for both players.`);
        console.log(`\nLet's play Sea Battle!`);
        console.log(`Try to sink the ${GAME_CONFIG.NUM_SHIPS} enemy ships.`);
    }
}

/**
 * Main game controller for Sea Battle
 */
export class Game {
    /**
     * Create a new game instance
     */
    constructor() {
        this.playerBoard = new Board(GAME_CONFIG.BOARD_SIZE, true); // Player board shows ships
        this.cpuBoard = new Board(GAME_CONFIG.BOARD_SIZE, false);   // CPU board hides ships
        this.player = new Player('Human', this.playerBoard);
        this.cpu = new CPUPlayer('CPU', this.cpuBoard);
        this.rl = readline.createInterface({
            input: process.stdin,
            output: process.stdout,
        });
        this.gameOver = false;
    }

    /**
     * Initialize the game by placing ships on both boards
     * @throws {Error} If ship placement fails
     */
    initialize() {
        GameDisplay.displaySetup();
        
        // Place ships for both players
        const playerShipsPlaced = this.playerBoard.placeShipsRandomly(
            GAME_CONFIG.NUM_SHIPS, 
            GAME_CONFIG.SHIP_LENGTH
        );
        const cpuShipsPlaced = this.cpuBoard.placeShipsRandomly(
            GAME_CONFIG.NUM_SHIPS, 
            GAME_CONFIG.SHIP_LENGTH
        );

        if (!playerShipsPlaced || !cpuShipsPlaced) {
            throw new Error('Failed to place ships on the board');
        }
    }

    /**
     * Check if the game has ended
     * @returns {boolean} True if game is over
     */
    checkGameEnd() {
        const playerShipsLeft = this.playerBoard.getAliveShips();
        const cpuShipsLeft = this.cpuBoard.getAliveShips();

        if (cpuShipsLeft === 0) {
            GameDisplay.displayGameResult('player');
            this.gameOver = true;
            return true;
        }

        if (playerShipsLeft === 0) {
            GameDisplay.displayGameResult('cpu');
            this.gameOver = true;
            return true;
        }

        return false;
    }

    /**
     * Handle a player's turn
     * @returns {Promise<boolean>} True if player made a valid move
     */
    async playerTurn() {
        return new Promise((resolve) => {
            this.rl.question('Enter your guess (e.g., 00): ', (answer) => {
                const validation = this.player.validateInput(answer);
                
                if (!validation.valid) {
                    console.log(validation.reason);
                    resolve(false);
                    return;
                }

                const result = this.player.makeGuess(this.cpuBoard, validation.location);
                
                if (!result.valid) {
                    console.log(result.reason);
                    resolve(false);
                    return;
                }

                if (result.hit) {
                    console.log('PLAYER HIT!');
                    if (result.sunk) {
                        console.log('You sunk an enemy battleship!');
                    }
                } else {
                    console.log('PLAYER MISS.');
                }

                resolve(true);
            });
        });
    }

    /**
     * Handle CPU's turn
     */
    cpuTurn() {
        console.log("\n--- CPU's Turn ---");
        const result = this.cpu.makeGuess(this.playerBoard);
        
        if (result.hit) {
            console.log(`CPU HIT at ${result.location}!`);
            if (result.sunk) {
                console.log('CPU sunk your battleship!');
            }
        } else {
            console.log(`CPU MISS at ${result.location}.`);
        }
    }

    /**
     * Main game loop
     */
    async gameLoop() {
        while (!this.gameOver) {
            if (this.checkGameEnd()) {
                GameDisplay.displayBoards(this.cpuBoard, this.playerBoard);
                this.rl.close();
                return;
            }

            GameDisplay.displayBoards(this.cpuBoard, this.playerBoard);
            
            // Player turn
            const playerMoved = await this.playerTurn();
            if (!playerMoved) {
                continue;
            }

            if (this.checkGameEnd()) {
                GameDisplay.displayBoards(this.cpuBoard, this.playerBoard);
                this.rl.close();
                return;
            }

            // CPU turn
            this.cpuTurn();
        }
    }

    /**
     * Start the game
     */
    async start() {
        try {
            this.initialize();
            await this.gameLoop();
        } catch (error) {
            console.error('Game initialization failed:', error.message);
            this.rl.close();
        }
    }

    /**
     * Get current game statistics
     * @returns {Object} Game statistics
     */
    getGameStats() {
        return {
            player: this.player.getStats(),
            cpu: this.cpu.getStats(),
            gameOver: this.gameOver,
            turnCount: this.playerBoard.guesses.size + this.cpuBoard.guesses.size
        };
    }

    /**
     * Reset the game for a new round
     */
    reset() {
        this.playerBoard = new Board(GAME_CONFIG.BOARD_SIZE, true);
        this.cpuBoard = new Board(GAME_CONFIG.BOARD_SIZE, false);
        this.player.board = this.playerBoard;
        this.cpu.board = this.cpuBoard;
        this.cpu.resetAI();
        this.gameOver = false;
    }

    /**
     * Cleanup resources
     */
    cleanup() {
        if (this.rl) {
            this.rl.close();
        }
    }
} 