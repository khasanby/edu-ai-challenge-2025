import { CPUPlayer } from '../src/CPU.js';
import { Board } from '../src/Board.js';
import { GAME_CONFIG } from '../src/utils.js';

// Mock the random functions to make CPU behavior deterministic
jest.mock('../src/utils.js', () => ({
  ...jest.requireActual('../src/utils.js'),
  getRandomCoordinates: jest.fn()
}));

import { getRandomCoordinates } from '../src/utils.js';

describe('CPUPlayer', () => {
  let cpu;
  let cpuBoard;
  let targetBoard;

  beforeEach(() => {
    cpuBoard = new Board(10, false);
    cpu = new CPUPlayer('CPU', cpuBoard);
    targetBoard = new Board(10, true);
    
    // Place a ship on target board for testing
    targetBoard.placeShip(5, 5, 3, 'horizontal'); // Ship at 55, 56, 57
    
    jest.clearAllMocks();
  });

  describe('constructor', () => {
    test('should inherit from Player and initialize AI properties', () => {
      expect(cpu.name).toBe('CPU');
      expect(cpu.board).toBe(cpuBoard);
      expect(cpu.mode).toBe('hunt');
      expect(cpu.targetQueue).toEqual([]);
      expect(cpu.lastHit).toBeNull();
    });
  });

  describe('makeGuess in hunt mode', () => {
    beforeEach(() => {
      getRandomCoordinates.mockReturnValue({ row: 3, col: 3 });
    });

    test('should make random guess in hunt mode', () => {
      const result = cpu.makeGuess(targetBoard);
      
      expect(result.location).toBe('33');
      expect(cpu.mode).toBe('hunt');
      expect(getRandomCoordinates).toHaveBeenCalledWith(
        GAME_CONFIG.BOARD_SIZE,
        GAME_CONFIG.BOARD_SIZE
      );
    });

    test('should switch to target mode on hit', () => {
      getRandomCoordinates.mockReturnValue({ row: 5, col: 5 }); // Hit the ship
      
      const result = cpu.makeGuess(targetBoard);
      
      expect(result.hit).toBe(true);
      expect(cpu.mode).toBe('target');
      expect(cpu.lastHit).toBe('55');
      expect(cpu.targetQueue.length).toBeGreaterThan(0);
    });

    test('should stay in hunt mode on miss', () => {
      getRandomCoordinates.mockReturnValue({ row: 0, col: 0 }); // Miss
      
      const result = cpu.makeGuess(targetBoard);
      
      expect(result.hit).toBe(false);
      expect(cpu.mode).toBe('hunt');
      expect(cpu.lastHit).toBeNull();
      expect(cpu.targetQueue).toEqual([]);
    });

    test('should avoid already guessed locations', () => {
      // First guess
      getRandomCoordinates.mockReturnValueOnce({ row: 3, col: 3 });
      cpu.makeGuess(targetBoard);
      
      // Second guess - should avoid 33
      getRandomCoordinates
        .mockReturnValueOnce({ row: 3, col: 3 }) // Same as before (will be skipped)
        .mockReturnValueOnce({ row: 4, col: 4 }); // New location
      
      const result = cpu.makeGuess(targetBoard);
      
      expect(result.location).toBe('44');
    });
  });

  describe('makeGuess in target mode', () => {
    beforeEach(() => {
      // Set up CPU in target mode with adjacent targets
      cpu.mode = 'target';
      cpu.targetQueue = ['54', '56', '45', '65'];
      cpu.lastHit = '55';
    });

    test('should use target queue when in target mode', () => {
      const result = cpu.makeGuess(targetBoard);
      
      expect(result.location).toBe('54');
      expect(cpu.targetQueue).toEqual(['56', '45', '65']);
    });

    test('should switch back to hunt mode when ship is sunk', () => {
      // Hit all parts of the ship first
      targetBoard.processGuess('55');
      targetBoard.processGuess('56');
      
      // Set target queue to hit the last part
      cpu.targetQueue = ['57'];
      
      const result = cpu.makeGuess(targetBoard);
      
      expect(result.hit).toBe(true);
      expect(result.sunk).toBe(true);
      expect(cpu.mode).toBe('hunt');
      expect(cpu.targetQueue).toEqual([]);
      expect(cpu.lastHit).toBeNull();
    });

    test('should continue in target mode when hitting but not sinking', () => {
      cpu.targetQueue = ['56']; // Hit another part of ship
      
      const result = cpu.makeGuess(targetBoard);
      
      expect(result.hit).toBe(true);
      expect(result.sunk).toBe(false);
      expect(cpu.mode).toBe('target');
      expect(cpu.lastHit).toBe('56');
    });

    test('should handle target queue becoming empty on miss', () => {
      cpu.targetQueue = ['99']; // Miss
      
      const result = cpu.makeGuess(targetBoard);
      
      expect(result.hit).toBe(false);
      expect(cpu.mode).toBe('hunt');
      expect(cpu.targetQueue).toEqual([]);
    });

    test('should skip already guessed targets', () => {
      targetBoard.processGuess('54'); // Make this location already guessed
      cpu.targetQueue = ['54', '56'];
      
      const result = cpu.makeGuess(targetBoard);
      
      expect(result.location).toBe('56');
      expect(cpu.targetQueue).toEqual([]);
    });
  });

  describe('addAdjacentTargets', () => {
    test('should add valid adjacent targets', () => {
      cpu.addAdjacentTargets('55', targetBoard);
      
      expect(cpu.targetQueue).toEqual(
        expect.arrayContaining(['45', '65', '54', '56'])
      );
      expect(cpu.targetQueue).toHaveLength(4);
    });

    test('should not add targets outside board boundaries', () => {
      cpu.addAdjacentTargets('00', targetBoard);
      
      // Only down and right should be added
      expect(cpu.targetQueue).toEqual(
        expect.arrayContaining(['10', '01'])
      );
      expect(cpu.targetQueue).toHaveLength(2);
    });

    test('should not add targets at board edges', () => {
      cpu.addAdjacentTargets('99', targetBoard);
      
      // Only up and left should be added
      expect(cpu.targetQueue).toEqual(
        expect.arrayContaining(['89', '98'])
      );
      expect(cpu.targetQueue).toHaveLength(2);
    });

    test('should not add already guessed targets', () => {
      targetBoard.processGuess('45');
      targetBoard.processGuess('65');
      
      cpu.addAdjacentTargets('55', targetBoard);
      
      expect(cpu.targetQueue).toEqual(
        expect.arrayContaining(['54', '56'])
      );
      expect(cpu.targetQueue).toHaveLength(2);
    });

    test('should not add duplicate targets', () => {
      cpu.targetQueue = ['54'];
      cpu.addAdjacentTargets('55', targetBoard);
      
      // '54' should not be added again
      expect(cpu.targetQueue.filter(target => target === '54')).toHaveLength(1);
    });
  });

  describe('getRandomLocation', () => {
    test('should generate valid random location', () => {
      getRandomCoordinates.mockReturnValue({ row: 7, col: 8 });
      
      const location = cpu.getRandomLocation(targetBoard);
      
      expect(location).toBe('78');
    });

    test('should avoid already guessed locations', () => {
      targetBoard.processGuess('33');
      
      getRandomCoordinates
        .mockReturnValueOnce({ row: 3, col: 3 }) // Already guessed
        .mockReturnValueOnce({ row: 4, col: 4 }); // New location
      
      const location = cpu.getRandomLocation(targetBoard);
      
      expect(location).toBe('44');
      expect(getRandomCoordinates).toHaveBeenCalledTimes(2);
    });
  });

  describe('processGuessResult', () => {
    test('should handle hit result correctly', () => {
      const result = {
        hit: true,
        sunk: false,
        location: '55'
      };
      
      cpu.processGuessResult(result, targetBoard);
      
      expect(cpu.mode).toBe('target');
      expect(cpu.lastHit).toBe('55');
      expect(cpu.targetQueue.length).toBeGreaterThan(0);
    });

    test('should handle sunk result correctly', () => {
      const result = {
        hit: true,
        sunk: true,
        location: '55'
      };
      
      cpu.processGuessResult(result, targetBoard);
      
      expect(cpu.mode).toBe('hunt');
      expect(cpu.lastHit).toBeNull();
      expect(cpu.targetQueue).toEqual([]);
    });

    test('should handle miss in target mode', () => {
      cpu.mode = 'target';
      cpu.targetQueue = [];
      
      const result = {
        hit: false,
        location: '33'
      };
      
      cpu.processGuessResult(result, targetBoard);
      
      expect(cpu.mode).toBe('hunt');
    });

    test('should stay in target mode if targets remain', () => {
      cpu.mode = 'target';
      cpu.targetQueue = ['44'];
      
      const result = {
        hit: false,
        location: '33'
      };
      
      cpu.processGuessResult(result, targetBoard);
      
      expect(cpu.mode).toBe('target');
    });
  });

  describe('getStats', () => {
    test('should return stats including AI state', () => {
      cpu.mode = 'target';
      cpu.targetQueue = ['44', '55'];
      cpu.lastHit = '45';
      
      const stats = cpu.getStats();
      
      expect(stats).toEqual({
        name: 'CPU',
        board: expect.any(Object),
        ai: {
          mode: 'target',
          targetQueueLength: 2,
          lastHit: '45'
        }
      });
    });
  });

  describe('resetAI', () => {
    test('should reset AI state to initial values', () => {
      cpu.mode = 'target';
      cpu.targetQueue = ['44', '55'];
      cpu.lastHit = '45';
      
      cpu.resetAI();
      
      expect(cpu.mode).toBe('hunt');
      expect(cpu.targetQueue).toEqual([]);
      expect(cpu.lastHit).toBeNull();
    });
  });

  describe('integration scenarios', () => {
    test('should complete hunt-target-hunt cycle', () => {
      // Place ship at known location
      const testBoard = new Board(10, true);
      testBoard.placeShip(0, 0, 2, 'horizontal'); // Ship at 00, 01
      
      // Mock random to hit the ship
      getRandomCoordinates.mockReturnValue({ row: 0, col: 0 });
      
      // First guess - should hit and switch to target mode
      const result1 = cpu.makeGuess(testBoard);
      expect(result1.hit).toBe(true);
      expect(cpu.mode).toBe('target');
      
      // Set target queue to hit second part
      cpu.targetQueue = ['01'];
      
      // Second guess - should sink ship and return to hunt mode
      const result2 = cpu.makeGuess(testBoard);
      expect(result2.hit).toBe(true);
      expect(result2.sunk).toBe(true);
      expect(cpu.mode).toBe('hunt');
    });

    test('should handle multiple ships intelligently', () => {
      const testBoard = new Board(10, true);
      testBoard.placeShip(0, 0, 2, 'horizontal'); // Ship 1: 00, 01
      testBoard.placeShip(5, 5, 2, 'vertical');   // Ship 2: 55, 65
      
      // Hit first ship
      getRandomCoordinates.mockReturnValue({ row: 0, col: 0 });
      cpu.makeGuess(testBoard);
      expect(cpu.mode).toBe('target');
      
      // Sink first ship
      cpu.targetQueue = ['01'];
      cpu.makeGuess(testBoard);
      expect(cpu.mode).toBe('hunt');
      
      // Hit second ship
      getRandomCoordinates.mockReturnValue({ row: 5, col: 5 });
      cpu.makeGuess(testBoard);
      expect(cpu.mode).toBe('target');
    });
  });
}); 