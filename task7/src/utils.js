// Configuration constants
export const GAME_CONFIG = {
    BOARD_SIZE: 10,
    NUM_SHIPS: 3,
    SHIP_LENGTH: 3,
    SYMBOLS: {
        WATER: '~',
        SHIP: 'S',
        HIT: 'X',
        MISS: 'O'
    }
};

/**
 * Generate random coordinates within board bounds
 * @param {number} maxRow - Maximum row value
 * @param {number} maxCol - Maximum column value
 * @returns {{row: number, col: number}} Random coordinates
 */
export function getRandomCoordinates(maxRow, maxCol) {
    return {
        row: Math.floor(Math.random() * maxRow),
        col: Math.floor(Math.random() * maxCol)
    };
}

/**
 * Get random orientation for ship placement
 * @returns {string} Either 'horizontal' or 'vertical'
 */
export function getRandomOrientation() {
    return Math.random() < 0.5 ? 'horizontal' : 'vertical';
}

/**
 * Format location coordinates into string representation
 * @param {number} row - Row coordinate
 * @param {number} col - Column coordinate
 * @returns {string} Formatted location string
 */
export function formatLocation(row, col) {
    return `${row}${col}`;
}

/**
 * Parse location string into row and column coordinates
 * @param {string} location - Location string (e.g., "34")
 * @returns {{row: number, col: number}} Parsed coordinates
 */
export function parseLocation(location) {
    return {
        row: parseInt(location[0]),
        col: parseInt(location[1])
    };
} 