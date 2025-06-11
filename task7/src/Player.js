import { GAME_CONFIG } from './utils.js';

/**
 * Represents a human player in the Sea Battle game
 */
export class Player {
    /**
     * Create a new player
     * @param {string} name - Player's name
     * @param {Board} board - Player's board
     */
    constructor(name, board) {
        this.name = name;
        this.board = board;
    }

    /**
     * Make a guess on the target board
     * @param {Board} targetBoard - The board to make a guess on
     * @param {string} location - Location to guess
     * @returns {Object} Result of the guess
     */
    makeGuess(targetBoard, location) {
        return targetBoard.processGuess(location);
    }

    /**
     * Validate user input for coordinates
     * @param {string} input - User input string
     * @returns {{valid: boolean, location?: string, reason?: string}} Validation result
     */
    validateInput(input) {
        if (!input || input.length !== 2) {
            return { valid: false, reason: 'Input must be exactly two digits (e.g., 00, 34, 98)' };
        }

        const row = parseInt(input[0]);
        const col = parseInt(input[1]);

        if (isNaN(row) || isNaN(col) || row < 0 || row >= GAME_CONFIG.BOARD_SIZE || 
            col < 0 || col >= GAME_CONFIG.BOARD_SIZE) {
            return { 
                valid: false, 
                reason: `Enter valid numbers between 0 and ${GAME_CONFIG.BOARD_SIZE - 1}` 
            };
        }

        return { valid: true, location: input };
    }

    /**
     * Get player statistics
     * @returns {{name: string, board: Object}} Player stats
     */
    getStats() {
        return {
            name: this.name,
            board: this.board.getStats()
        };
    }
} 