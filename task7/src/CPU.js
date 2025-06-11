import { Player } from './Player.js';
import { GAME_CONFIG, getRandomCoordinates } from './utils.js';

/**
 * Represents a CPU player with AI logic for the Sea Battle game
 */
export class CPUPlayer extends Player {
    /**
     * Create a new CPU player
     * @param {string} name - CPU player's name
     * @param {Board} board - CPU player's board
     */
    constructor(name, board) {
        super(name, board);
        this.mode = 'hunt'; // 'hunt' or 'target'
        this.targetQueue = [];
        this.lastHit = null;
    }

    /**
     * Make an intelligent guess on the target board
     * @param {Board} targetBoard - The board to make a guess on
     * @returns {Object} Result of the guess
     */
    makeGuess(targetBoard) {
        let location;

        if (this.mode === 'target' && this.targetQueue.length > 0) {
            location = this.targetQueue.shift();
            if (targetBoard.guesses.has(location)) {
                if (this.targetQueue.length === 0) {
                    this.mode = 'hunt';
                }
                return this.makeGuess(targetBoard);
            }
        } else {
            location = this.getRandomLocation(targetBoard);
            this.mode = 'hunt';
        }

        const result = targetBoard.processGuess(location);
        this.processGuessResult(result, targetBoard);
        
        return result;
    }

    /**
     * Get a random valid location that hasn't been guessed
     * @param {Board} targetBoard - The target board
     * @returns {string} Random location string
     */
    getRandomLocation(targetBoard) {
        let location;
        do {
            const { row, col } = getRandomCoordinates(GAME_CONFIG.BOARD_SIZE, GAME_CONFIG.BOARD_SIZE);
            location = `${row}${col}`;
        } while (targetBoard.guesses.has(location));
        
        return location;
    }

    /**
     * Process the result of a guess and update AI strategy
     * @param {Object} result - Result of the guess
     * @param {Board} targetBoard - The target board
     */
    processGuessResult(result, targetBoard) {
        if (result.hit) {
            if (result.sunk) {
                this.mode = 'hunt';
                this.targetQueue = [];
                this.lastHit = null;
            } else {
                this.mode = 'target';
                this.addAdjacentTargets(result.location, targetBoard);
                this.lastHit = result.location;
            }
        } else if (this.mode === 'target' && this.targetQueue.length === 0) {
            this.mode = 'hunt';
        }
    }

    /**
     * Add adjacent cells to the target queue for focused attacking
     * @param {string} location - Location of the hit
     * @param {Board} targetBoard - The target board
     */
    addAdjacentTargets(location, targetBoard) {
        const { row, col } = targetBoard.parseLocation(location);
        const adjacent = [
            { row: row - 1, col },
            { row: row + 1, col },
            { row, col: col - 1 },
            { row, col: col + 1 }
        ];

        adjacent.forEach(pos => {
            if (targetBoard.isValidPosition(pos.row, pos.col)) {
                const adjLocation = targetBoard.formatLocation(pos.row, pos.col);
                if (!targetBoard.guesses.has(adjLocation) && 
                    !this.targetQueue.includes(adjLocation)) {
                    this.targetQueue.push(adjLocation);
                }
            }
        });
    }

    /**
     * Get CPU AI statistics
     * @returns {Object} CPU stats including AI state
     */
    getStats() {
        const baseStats = super.getStats();
        return {
            ...baseStats,
            ai: {
                mode: this.mode,
                targetQueueLength: this.targetQueue.length,
                lastHit: this.lastHit
            }
        };
    }

    /**
     * Reset AI state (useful for new games)
     */
    resetAI() {
        this.mode = 'hunt';
        this.targetQueue = [];
        this.lastHit = null;
    }
} 