import { Board } from '../src/Board.js';
import { GAME_CONFIG } from '../src/utils.js';

describe('Board - Simple Tests', () => {
  let board;

  beforeEach(() => {
    board = new Board(10, false);
  });

  describe('constructor', () => {
    test('should create board with default settings', () => {
      expect(board.size).toBe(10);
      expect(board.ships).toEqual([]);
      expect(board.guesses.size).toBe(0);
      expect(board.isPlayerBoard).toBe(false);
    });
  });

  describe('createGrid', () => {
    test('should create grid filled with water symbols', () => {
      const grid = board.createGrid();
      expect(grid).toHaveLength(10);
      expect(grid[0]).toHaveLength(10);
      expect(grid[0][0]).toBe(GAME_CONFIG.SYMBOLS.WATER);
      expect(grid[9][9]).toBe(GAME_CONFIG.SYMBOLS.WATER);
    });
  });

  describe('isValidPosition', () => {
    test('should return true for valid positions', () => {
      expect(board.isValidPosition(0, 0)).toBe(true);
      expect(board.isValidPosition(5, 5)).toBe(true);
      expect(board.isValidPosition(9, 9)).toBe(true);
    });

    test('should return false for invalid positions', () => {
      expect(board.isValidPosition(-1, 0)).toBe(false);
      expect(board.isValidPosition(0, -1)).toBe(false);
      expect(board.isValidPosition(10, 0)).toBe(false);
      expect(board.isValidPosition(0, 10)).toBe(false);
    });
  });

  describe('placeShip', () => {
    test('should place ship horizontally', () => {
      const result = board.placeShip(0, 0, 3, 'horizontal');
      
      expect(result).toBe(true);
      expect(board.ships).toHaveLength(1);
      expect(board.ships[0].locations).toEqual(['00', '01', '02']);
    });

    test('should place ship vertically', () => {
      const result = board.placeShip(0, 0, 3, 'vertical');
      
      expect(result).toBe(true);
      expect(board.ships).toHaveLength(1);
      expect(board.ships[0].locations).toEqual(['00', '10', '20']);
    });

    test('should reject ship placement outside boundaries', () => {
      // Test various boundary violations
      
      // Horizontal placement that would go outside right boundary
      expect(board.placeShip(0, 8, 3, 'horizontal')).toBe(false); // positions would be 08, 09, 010 (invalid)
      expect(board.placeShip(0, 9, 2, 'horizontal')).toBe(false); // positions would be 09, 010 (invalid)
      
      // Vertical placement that would go outside bottom boundary  
      expect(board.placeShip(8, 0, 3, 'vertical')).toBe(false); // positions would be 80, 90, 100 (invalid)
      expect(board.placeShip(9, 0, 2, 'vertical')).toBe(false); // positions would be 90, 100 (invalid)
      
      expect(board.ships).toHaveLength(0);
    });
  });

  describe('processGuess', () => {
    beforeEach(() => {
      board.placeShip(5, 5, 3, 'horizontal'); // Ship at 55, 56, 57
    });

    test('should process hit correctly', () => {
      const result = board.processGuess('55');
      
      expect(result.valid).toBe(true);
      expect(result.hit).toBe(true);
      expect(result.sunk).toBe(false);
      expect(result.location).toBe('55');
      expect(board.grid[5][5]).toBe(GAME_CONFIG.SYMBOLS.HIT);
    });

    test('should process miss correctly', () => {
      const result = board.processGuess('00');
      
      expect(result.valid).toBe(true);
      expect(result.hit).toBe(false);
      expect(result.location).toBe('00');
      expect(board.grid[0][0]).toBe(GAME_CONFIG.SYMBOLS.MISS);
    });

    test('should detect sunk ship', () => {
      board.processGuess('55');
      board.processGuess('56');
      const result = board.processGuess('57');
      
      expect(result.valid).toBe(true);
      expect(result.hit).toBe(true);
      expect(result.sunk).toBe(true);
    });

    test('should reject duplicate guess', () => {
      board.processGuess('55');
      const result = board.processGuess('55');
      
      expect(result.valid).toBe(false);
      expect(result.reason).toBe('Already guessed');
    });
  });

  describe('getAliveShips', () => {
    test('should return 0 for empty board', () => {
      expect(board.getAliveShips()).toBe(0);
    });

    test('should return correct count for ships', () => {
      board.placeShip(0, 0, 2, 'horizontal');
      board.placeShip(3, 3, 2, 'horizontal');
      
      expect(board.getAliveShips()).toBe(2);
      
      // Sink one ship
      board.processGuess('00');
      board.processGuess('01');
      
      expect(board.getAliveShips()).toBe(1);
    });
  });
}); 