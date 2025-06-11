import { Board } from '../src/Board.js';
import { Ship } from '../src/Ship.js';
import { GAME_CONFIG } from '../src/utils.js';

import { getRandomCoordinates, getRandomOrientation } from '../src/utils.js';

// Mock the random functions to make tests deterministic
const mockGetRandomCoordinates = getRandomCoordinates;
const mockGetRandomOrientation = getRandomOrientation;

describe('Board', () => {
  let board;
  let playerBoard;

  beforeEach(() => {
    board = new Board(10, false);
    playerBoard = new Board(10, true);
    jest.clearAllMocks();
  });

  describe('constructor', () => {
    test('should create board with default size and settings', () => {
      expect(board.size).toBe(10);
      expect(board.ships).toEqual([]);
      expect(board.guesses.size).toBe(0);
      expect(board.isPlayerBoard).toBe(false);
    });

    test('should create board with custom size', () => {
      const customBoard = new Board(8, true);
      expect(customBoard.size).toBe(8);
      expect(customBoard.isPlayerBoard).toBe(true);
    });

    test('should create grid with correct dimensions', () => {
      expect(board.grid).toHaveLength(10);
      expect(board.grid[0]).toHaveLength(10);
      expect(board.grid[9][9]).toBe(GAME_CONFIG.SYMBOLS.WATER);
    });
  });

  describe('createGrid', () => {
    test('should create grid filled with water symbols', () => {
      const grid = board.createGrid();
      expect(grid).toHaveLength(10);
      expect(grid[0]).toHaveLength(10);
      
      // Check all cells are water
      for (let i = 0; i < 10; i++) {
        for (let j = 0; j < 10; j++) {
          expect(grid[i][j]).toBe(GAME_CONFIG.SYMBOLS.WATER);
        }
      }
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
      expect(board.isValidPosition(10, 10)).toBe(false);
    });
  });

  describe('canPlaceShip', () => {
    test('should allow placing ship in valid position horizontally', () => {
      expect(board.canPlaceShip(0, 0, 3, 'horizontal')).toBe(true);
      expect(board.canPlaceShip(5, 5, 3, 'horizontal')).toBe(true);
    });

    test('should allow placing ship in valid position vertically', () => {
      expect(board.canPlaceShip(0, 0, 3, 'vertical')).toBe(true);
      expect(board.canPlaceShip(5, 5, 3, 'vertical')).toBe(true);
    });

    test('should reject ship placement outside boundaries horizontally', () => {
      expect(board.canPlaceShip(0, 8, 3, 'horizontal')).toBe(false);
      expect(board.canPlaceShip(0, 9, 3, 'horizontal')).toBe(false);
    });

    test('should reject ship placement outside boundaries vertically', () => {
      expect(board.canPlaceShip(8, 0, 3, 'vertical')).toBe(false);
      expect(board.canPlaceShip(9, 0, 3, 'vertical')).toBe(false);
    });

    test('should reject ship placement on occupied cells', () => {
      // Place first ship
      board.placeShip(0, 0, 3, 'horizontal');
      
      // Try to place overlapping ship
      expect(board.canPlaceShip(0, 1, 3, 'horizontal')).toBe(false);
      expect(board.canPlaceShip(0, 0, 3, 'vertical')).toBe(false);
    });
  });

  describe('placeShip', () => {
    test('should place ship horizontally and add to ships array', () => {
      const result = board.placeShip(0, 0, 3, 'horizontal');
      
      expect(result).toBe(true);
      expect(board.ships).toHaveLength(1);
      expect(board.ships[0].locations).toEqual(['00', '01', '02']);
    });

    test('should place ship vertically and add to ships array', () => {
      const result = board.placeShip(0, 0, 3, 'vertical');
      
      expect(result).toBe(true);
      expect(board.ships).toHaveLength(1);
      expect(board.ships[0].locations).toEqual(['00', '10', '20']);
    });

    test('should show ships on player board', () => {
      playerBoard.placeShip(0, 0, 3, 'horizontal');
      
      expect(playerBoard.grid[0][0]).toBe(GAME_CONFIG.SYMBOLS.SHIP);
      expect(playerBoard.grid[0][1]).toBe(GAME_CONFIG.SYMBOLS.SHIP);
      expect(playerBoard.grid[0][2]).toBe(GAME_CONFIG.SYMBOLS.SHIP);
    });

    test('should not show ships on CPU board', () => {
      board.placeShip(0, 0, 3, 'horizontal');
      
      expect(board.grid[0][0]).toBe(GAME_CONFIG.SYMBOLS.WATER);
      expect(board.grid[0][1]).toBe(GAME_CONFIG.SYMBOLS.WATER);
      expect(board.grid[0][2]).toBe(GAME_CONFIG.SYMBOLS.WATER);
    });

    test('should reject invalid ship placement', () => {
      const result = board.placeShip(0, 8, 3, 'horizontal');
      
      expect(result).toBe(false);
      expect(board.ships).toHaveLength(0);
    });
  });

  describe('placeShipsRandomly', () => {
    beforeEach(() => {
      getRandomOrientation.mockReturnValue('horizontal');
      getRandomCoordinates.mockReturnValue({ row: 0, col: 0 });
    });

    test('should place all ships successfully', () => {
      const result = board.placeShipsRandomly(2, 3);
      
      expect(result).toBe(true);
      expect(board.ships).toHaveLength(2);
    });

    test('should return false if unable to place all ships', () => {
      // Mock to always return same position (will cause overlap)
      getRandomCoordinates.mockReturnValue({ row: 0, col: 0 });
      
      const result = board.placeShipsRandomly(5, 8); // Too many large ships
      
      expect(result).toBe(false);
    });

    test('should try different orientations and positions', () => {
      getRandomOrientation
        .mockReturnValueOnce('vertical')
        .mockReturnValueOnce('horizontal');
      getRandomCoordinates
        .mockReturnValueOnce({ row: 0, col: 0 })
        .mockReturnValueOnce({ row: 5, col: 5 });

      const result = board.placeShipsRandomly(2, 3);
      
      expect(result).toBe(true);
      expect(getRandomOrientation).toHaveBeenCalledTimes(2);
      expect(getRandomCoordinates).toHaveBeenCalledTimes(2);
    });
  });

  describe('processGuess', () => {
    beforeEach(() => {
      board.placeShip(0, 0, 3, 'horizontal');
    });

    test('should return invalid for duplicate guess', () => {
      board.processGuess('00');
      const result = board.processGuess('00');
      
      expect(result.valid).toBe(false);
      expect(result.reason).toBe('Already guessed');
    });

    test('should process hit correctly', () => {
      const result = board.processGuess('01');
      
      expect(result.valid).toBe(true);
      expect(result.hit).toBe(true);
      expect(result.sunk).toBe(false);
      expect(result.location).toBe('01');
      expect(board.grid[0][1]).toBe(GAME_CONFIG.SYMBOLS.HIT);
    });

    test('should process miss correctly', () => {
      const result = board.processGuess('55');
      
      expect(result.valid).toBe(true);
      expect(result.hit).toBe(false);
      expect(result.location).toBe('55');
      expect(board.grid[5][5]).toBe(GAME_CONFIG.SYMBOLS.MISS);
    });

    test('should detect sunk ship', () => {
      board.processGuess('00');
      board.processGuess('01');
      const result = board.processGuess('02');
      
      expect(result.valid).toBe(true);
      expect(result.hit).toBe(true);
      expect(result.sunk).toBe(true);
    });

    test('should add guess to guesses set', () => {
      board.processGuess('33');
      
      expect(board.guesses.has('33')).toBe(true);
      expect(board.guesses.size).toBe(1);
    });
  });

  describe('getAliveShips', () => {
    test('should return 0 for empty board', () => {
      expect(board.getAliveShips()).toBe(0);
    });

    test('should return correct count for unsunk ships', () => {
      board.placeShip(0, 0, 3, 'horizontal');
      board.placeShip(2, 0, 3, 'horizontal');
      
      expect(board.getAliveShips()).toBe(2);
    });

    test('should return correct count after sinking ships', () => {
      board.placeShip(0, 0, 3, 'horizontal');
      board.placeShip(2, 0, 3, 'horizontal');
      
      // Sink first ship
      board.processGuess('00');
      board.processGuess('01');
      board.processGuess('02');
      
      expect(board.getAliveShips()).toBe(1);
    });

    test('should return 0 when all ships sunk', () => {
      board.placeShip(0, 0, 2, 'horizontal');
      
      board.processGuess('00');
      board.processGuess('01');
      
      expect(board.getAliveShips()).toBe(0);
    });
  });

  describe('display', () => {
    test('should return string representation of board', () => {
      const display = board.display();
      
      expect(typeof display).toBe('string');
      expect(display).toContain('0 1 2 3 4 5 6 7 8 9');
      expect(display.split('\n')).toHaveLength(12); // Header + 10 rows + empty line
    });

    test('should show hits and misses in display', () => {
      board.placeShip(0, 0, 2, 'horizontal');
      board.processGuess('00'); // Hit
      board.processGuess('55'); // Miss
      
      const display = board.display();
      
      expect(display).toContain(GAME_CONFIG.SYMBOLS.HIT);
      expect(display).toContain(GAME_CONFIG.SYMBOLS.MISS);
    });
  });

  describe('getStats', () => {
    test('should return correct stats for empty board', () => {
      const stats = board.getStats();
      
      expect(stats).toEqual({
        totalShips: 0,
        aliveShips: 0,
        sunkShips: 0,
        totalGuesses: 0
      });
    });

    test('should return correct stats with ships and guesses', () => {
      board.placeShip(0, 0, 3, 'horizontal');
      board.placeShip(2, 0, 3, 'horizontal');
      board.processGuess('00');
      board.processGuess('55');
      
      const stats = board.getStats();
      
      expect(stats).toEqual({
        totalShips: 2,
        aliveShips: 2,
        sunkShips: 0,
        totalGuesses: 2
      });
    });
  });
}); 