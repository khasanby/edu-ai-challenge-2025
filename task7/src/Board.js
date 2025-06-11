import { Ship } from './Ship.js';
import { GAME_CONFIG, getRandomCoordinates, getRandomOrientation, formatLocation, parseLocation } from './utils.js';

/**
 * Represents a game board for Sea Battle
 */
export class Board {
    /**
     * Create a new game board
     * @param {number} size - Size of the board (default: 10)
     * @param {boolean} isPlayerBoard - Whether this is the player's board (shows ships)
     */
    constructor(size = GAME_CONFIG.BOARD_SIZE, isPlayerBoard = false) {
        this.size = size;
        this.grid = this.createGrid();
        this.ships = [];
        this.guesses = new Set();
        this.isPlayerBoard = isPlayerBoard;
    }

    /**
     * Create an empty grid filled with water symbols
     * @returns {string[][]} 2D array representing the game board
     */
    createGrid() {
        return Array(this.size).fill().map(() => 
            Array(this.size).fill(GAME_CONFIG.SYMBOLS.WATER)
        );
    }

    /**
     * Check if a position is within board boundaries
     * @param {number} row - Row coordinate
     * @param {number} col - Column coordinate
     * @returns {boolean} True if position is valid
     */
    isValidPosition(row, col) {
        return row >= 0 && row < this.size && col >= 0 && col < this.size;
    }

    /**
     * Format location coordinates into string representation
     * @param {number} row - Row coordinate
     * @param {number} col - Column coordinate
     * @returns {string} Formatted location string
     */
    formatLocation(row, col) {
        return formatLocation(row, col);
    }

    /**
     * Parse location string into coordinates
     * @param {string} location - Location string
     * @returns {{row: number, col: number}} Parsed coordinates
     */
    parseLocation(location) {
        return parseLocation(location);
    }

    /**
     * Check if a ship can be placed at the specified position
     * @param {number} startRow - Starting row
     * @param {number} startCol - Starting column
     * @param {number} length - Ship length
     * @param {string} orientation - 'horizontal' or 'vertical'
     * @returns {boolean} True if ship can be placed
     */
    canPlaceShip(startRow, startCol, length, orientation) {
        const positions = this.getShipPositions(startRow, startCol, length, orientation);
        
        return positions.every(pos => {
            const { row, col } = this.parseLocation(pos);
            return this.isValidPosition(row, col) && 
                   this.grid[row][col] === GAME_CONFIG.SYMBOLS.WATER;
        });
    }

    /**
     * Get all positions a ship would occupy
     * @param {number} startRow - Starting row
     * @param {number} startCol - Starting column
     * @param {number} length - Ship length
     * @param {string} orientation - 'horizontal' or 'vertical'
     * @returns {string[]} Array of position strings
     */
    getShipPositions(startRow, startCol, length, orientation) {
        const positions = [];
        for (let i = 0; i < length; i++) {
            const row = orientation === 'horizontal' ? startRow : startRow + i;
            const col = orientation === 'horizontal' ? startCol + i : startCol;
            positions.push(this.formatLocation(row, col));
        }
        return positions;
    }

    /**
     * Place a ship on the board
     * @param {number} startRow - Starting row
     * @param {number} startCol - Starting column
     * @param {number} length - Ship length
     * @param {string} orientation - 'horizontal' or 'vertical'
     * @returns {boolean} True if ship was successfully placed
     */
    placeShip(startRow, startCol, length, orientation) {
        if (!this.canPlaceShip(startRow, startCol, length, orientation)) {
            return false;
        }

        const positions = this.getShipPositions(startRow, startCol, length, orientation);
        const ship = new Ship(positions);
        this.ships.push(ship);

        // Show ships only on player's board
        if (this.isPlayerBoard) {
            positions.forEach(pos => {
                const { row, col } = this.parseLocation(pos);
                this.grid[row][col] = GAME_CONFIG.SYMBOLS.SHIP;
            });
        }

        return true;
    }

    /**
     * Place ships randomly on the board
     * @param {number} numShips - Number of ships to place
     * @param {number} shipLength - Length of each ship
     * @returns {boolean} True if all ships were successfully placed
     */
    placeShipsRandomly(numShips, shipLength) {
        let placed = 0;
        const maxAttempts = 1000;
        let attempts = 0;

        while (placed < numShips && attempts < maxAttempts) {
            const orientation = getRandomOrientation();
            const maxRow = orientation === 'horizontal' ? this.size : this.size - shipLength + 1;
            const maxCol = orientation === 'horizontal' ? this.size - shipLength + 1 : this.size;
            
            const { row: startRow, col: startCol } = getRandomCoordinates(maxRow, maxCol);

            if (this.placeShip(startRow, startCol, shipLength, orientation)) {
                placed++;
            }
            attempts++;
        }

        return placed === numShips;
    }

    /**
     * Process a guess made on this board
     * @param {string} location - Location string to guess
     * @returns {{valid: boolean, hit?: boolean, sunk?: boolean, location?: string, reason?: string}} Guess result
     */
    processGuess(location) {
        if (this.guesses.has(location)) {
            return { valid: false, reason: 'Already guessed' };
        }

        this.guesses.add(location);
        const { row, col } = this.parseLocation(location);

        for (const ship of this.ships) {
            if (ship.hit(location)) {
                this.grid[row][col] = GAME_CONFIG.SYMBOLS.HIT;
                return {
                    valid: true,
                    hit: true,
                    sunk: ship.isSunk(),
                    location
                };
            }
        }

        this.grid[row][col] = GAME_CONFIG.SYMBOLS.MISS;
        return { valid: true, hit: false, location };
    }

    /**
     * Get the number of ships still alive (not sunk)
     * @returns {number} Number of alive ships
     */
    getAliveShips() {
        return this.ships.filter(ship => !ship.isSunk()).length;
    }

    /**
     * Get a string representation of the board for display
     * @returns {string} Board display string
     */
    display() {
        let output = '  ';
        for (let i = 0; i < this.size; i++) {
            output += i + ' ';
        }
        output += '\n';

        for (let i = 0; i < this.size; i++) {
            output += i + ' ';
            for (let j = 0; j < this.size; j++) {
                output += this.grid[i][j] + ' ';
            }
            output += '\n';
        }
        return output;
    }

    /**
     * Get board statistics
     * @returns {{totalShips: number, aliveShips: number, sunkShips: number, totalGuesses: number}}
     */
    getStats() {
        const aliveShips = this.getAliveShips();
        return {
            totalShips: this.ships.length,
            aliveShips,
            sunkShips: this.ships.length - aliveShips,
            totalGuesses: this.guesses.size
        };
    }
} 