/**
 * Represents a ship in the Sea Battle game
 */
export class Ship {
    /**
     * Create a ship with specified locations
     * @param {string[]} locations - Array of location strings (e.g., ["00", "01", "02"])
     */
    constructor(locations) {
        this.locations = locations;
        this.hits = new Array(locations.length).fill(false);
    }

    /**
     * Attempt to hit the ship at a specific location
     * @param {string} location - Location string to hit
     * @returns {boolean} True if hit was successful, false otherwise
     */
    hit(location) {
        const index = this.locations.indexOf(location);
        if (index >= 0) {
            this.hits[index] = true;
            return true;
        }
        return false;
    }

    /**
     * Check if the ship is completely sunk
     * @returns {boolean} True if all parts of the ship are hit
     */
    isSunk() {
        return this.hits.every(hit => hit);
    }

    /**
     * Check if a specific location on the ship has been hit
     * @param {string} location - Location string to check
     * @returns {boolean} True if the location has been hit
     */
    isHit(location) {
        const index = this.locations.indexOf(location);
        return index >= 0 && this.hits[index];
    }

    /**
     * Get the ship's health status
     * @returns {{totalParts: number, hitParts: number, sunk: boolean}}
     */
    getStatus() {
        const hitParts = this.hits.filter(hit => hit).length;
        return {
            totalParts: this.locations.length,
            hitParts,
            sunk: this.isSunk()
        };
    }
} 