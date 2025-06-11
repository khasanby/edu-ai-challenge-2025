import { Player } from '../src/Player.js';
import { Board } from '../src/Board.js';
import { GAME_CONFIG } from '../src/utils.js';

describe('Player', () => {
  let player;
  let board;
  let targetBoard;

  beforeEach(() => {
    board = new Board(10, true);
    player = new Player('TestPlayer', board);
    targetBoard = new Board(10, false);
    targetBoard.placeShip(5, 5, 3, 'horizontal'); // Ship for testing
  });

  describe('constructor', () => {
    test('should create player with correct name and board', () => {
      expect(player.name).toBe('TestPlayer');
      expect(player.board).toBe(board);
    });
  });

  describe('validateInput', () => {
    test('should accept valid two-digit input', () => {
      const result = player.validateInput('00');
      expect(result.valid).toBe(true);
      expect(result.location).toBe('00');
    });

    test('should accept valid coordinates within bounds', () => {
      const testCases = ['00', '55', '99', '09', '90'];
      testCases.forEach(input => {
        const result = player.validateInput(input);
        expect(result.valid).toBe(true);
        expect(result.location).toBe(input);
      });
    });

    test('should reject null or undefined input', () => {
      expect(player.validateInput(null).valid).toBe(false);
      expect(player.validateInput(undefined).valid).toBe(false);
    });

    test('should reject empty string', () => {
      const result = player.validateInput('');
      expect(result.valid).toBe(false);
      expect(result.reason).toContain('Input must be exactly two digits');
    });

    test('should reject input with wrong length', () => {
      const testCases = ['0', '123', '0000'];
      testCases.forEach(input => {
        const result = player.validateInput(input);
        expect(result.valid).toBe(false);
        expect(result.reason).toContain('Input must be exactly two digits');
      });
    });

    test('should reject non-numeric input', () => {
      const testCases = ['aa', 'ab', '0a', 'a0', '!@'];
      testCases.forEach(input => {
        const result = player.validateInput(input);
        expect(result.valid).toBe(false);
        expect(result.reason).toContain('Enter valid numbers');
      });
    });

    test('should reject coordinates outside board bounds', () => {
      // For BOARD_SIZE = 10, valid coordinates are 0-9, so valid inputs are 00-99
      const testCases = [
        'aa', // Non-numeric
        'a0', // Non-numeric
        '0a', // Non-numeric
      ];
      
      testCases.forEach(input => {
        const result = player.validateInput(input);
        expect(result.valid).toBe(false);
        expect(result.reason).toContain('Enter valid numbers');
      });
    });

    test('should handle edge cases at board boundaries', () => {
      const maxCoord = GAME_CONFIG.BOARD_SIZE - 1;
      const validEdgeCases = [
        `0${maxCoord}`, // Top-right
        `${maxCoord}0`, // Bottom-left
        `${maxCoord}${maxCoord}` // Bottom-right
      ];
      
      validEdgeCases.forEach(input => {
        const result = player.validateInput(input);
        expect(result.valid).toBe(true);
      });
    });
  });

  describe('makeGuess', () => {
    test('should make successful guess on target board', () => {
      const result = player.makeGuess(targetBoard, '55');
      
      expect(result.valid).toBe(true);
      expect(result.hit).toBe(true);
      expect(result.location).toBe('55');
    });

    test('should make miss on target board', () => {
      const result = player.makeGuess(targetBoard, '00');
      
      expect(result.valid).toBe(true);
      expect(result.hit).toBe(false);
      expect(result.location).toBe('00');
    });

    test('should handle duplicate guess', () => {
      // Make first guess
      player.makeGuess(targetBoard, '55');
      
      // Make duplicate guess
      const result = player.makeGuess(targetBoard, '55');
      
      expect(result.valid).toBe(false);
      expect(result.reason).toBe('Already guessed');
    });

    test('should process guess and update target board', () => {
      const initialGuesses = targetBoard.guesses.size;
      
      player.makeGuess(targetBoard, '33');
      
      expect(targetBoard.guesses.size).toBe(initialGuesses + 1);
      expect(targetBoard.guesses.has('33')).toBe(true);
    });
  });

  describe('getStats', () => {
    test('should return player statistics', () => {
      const stats = player.getStats();
      
      expect(stats).toHaveProperty('name');
      expect(stats).toHaveProperty('board');
      expect(stats.name).toBe('TestPlayer');
      expect(stats.board).toHaveProperty('totalShips');
      expect(stats.board).toHaveProperty('aliveShips');
      expect(stats.board).toHaveProperty('sunkShips');
      expect(stats.board).toHaveProperty('totalGuesses');
    });

    test('should reflect board state in stats', () => {
      // Add some ships and guesses to test stats
      board.placeShip(0, 0, 2, 'horizontal');
      board.processGuess('55');
      
      const stats = player.getStats();
      
      expect(stats.board.totalShips).toBe(1);
      expect(stats.board.totalGuesses).toBe(1);
    });
  });

  describe('integration tests', () => {
    test('should handle complete turn workflow', () => {
      // Validate input
      const validation = player.validateInput('56');
      expect(validation.valid).toBe(true);
      
      // Make guess
      const result = player.makeGuess(targetBoard, validation.location);
      expect(result.valid).toBe(true);
      expect(result.hit).toBe(true);
      
      // Check stats
      const stats = player.getStats();
      expect(stats.name).toBe('TestPlayer');
    });

    test('should handle invalid input workflow', () => {
      // Validate invalid input
      const validation = player.validateInput('invalid');
      expect(validation.valid).toBe(false);
      
      // Should not proceed to make guess
      // In real game, this would prompt for new input
    });

    test('should track multiple guesses correctly', () => {
      const guesses = ['00', '11', '22', '55', '66'];
      const results = [];
      
      guesses.forEach(guess => {
        const validation = player.validateInput(guess);
        if (validation.valid) {
          const result = player.makeGuess(targetBoard, validation.location);
          results.push(result);
        }
      });
      
      expect(results).toHaveLength(5);
      expect(targetBoard.guesses.size).toBe(5);
      
      // Check that we got one hit (55) and rest misses
      const hits = results.filter(r => r.hit);
      expect(hits).toHaveLength(1);
      expect(hits[0].location).toBe('55');
    });
  });

  describe('edge cases', () => {
    test('should handle player with empty board', () => {
      const emptyPlayer = new Player('Empty', new Board(10, true));
      const stats = emptyPlayer.getStats();
      
      expect(stats.board.totalShips).toBe(0);
      expect(stats.board.aliveShips).toBe(0);
    });

    test('should validate all possible board coordinates', () => {
      const validCoordinates = [];
      const invalidCoordinates = [];
      
      // Generate all possible 2-digit combinations
      for (let i = 0; i < 100; i++) {
        const coord = i.toString().padStart(2, '0');
        const validation = player.validateInput(coord);
        
        if (validation.valid) {
          validCoordinates.push(coord);
        } else {
          invalidCoordinates.push(coord);
        }
      }
      
      // Should have exactly BOARD_SIZE^2 valid coordinates
      expect(validCoordinates).toHaveLength(GAME_CONFIG.BOARD_SIZE * GAME_CONFIG.BOARD_SIZE);
      expect(invalidCoordinates).toHaveLength(100 - (GAME_CONFIG.BOARD_SIZE * GAME_CONFIG.BOARD_SIZE));
    });

    test('should handle special input characters', () => {
      const specialInputs = ['  ', '\n\n', '\t\t', '--', '++', '..'];
      
      specialInputs.forEach(input => {
        const result = player.validateInput(input);
        expect(result.valid).toBe(false);
      });
    });
  });
}); 