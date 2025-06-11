import { Game } from '../src/Game.js';
import { Board } from '../src/Board.js';
import { Player } from '../src/Player.js';
import { CPUPlayer } from '../src/CPU.js';
import { GAME_CONFIG } from '../src/utils.js';

// Mock readline for testing user input
jest.mock('readline', () => ({
  createInterface: jest.fn(() => ({
    question: jest.fn(),
    close: jest.fn()
  }))
}));

// Mock the random functions to make ship placement deterministic
jest.mock('../src/utils.js', () => ({
  ...jest.requireActual('../src/utils.js'),
  getRandomCoordinates: jest.fn(),
  getRandomOrientation: jest.fn()
}));

import { getRandomCoordinates, getRandomOrientation } from '../src/utils.js';

describe('Game', () => {
  let game;
  
  beforeEach(() => {
    game = new Game();
    jest.clearAllMocks();
    
    // Mock console methods to avoid cluttering test output
    jest.spyOn(console, 'log').mockImplementation(() => {});
    jest.spyOn(console, 'error').mockImplementation(() => {});
  });

  afterEach(() => {
    // Clean up any readline interfaces
    if (game.rl) {
      game.rl.close();
    }
    jest.restoreAllMocks();
  });

  describe('constructor', () => {
    test('should initialize game with correct boards and players', () => {
      expect(game.playerBoard).toBeInstanceOf(Board);
      expect(game.cpuBoard).toBeInstanceOf(Board);
      expect(game.player).toBeInstanceOf(Player);
      expect(game.cpu).toBeInstanceOf(CPUPlayer);
      expect(game.gameOver).toBe(false);
    });

    test('should create player board that shows ships', () => {
      expect(game.playerBoard.isPlayerBoard).toBe(true);
    });

    test('should create CPU board that hides ships', () => {
      expect(game.cpuBoard.isPlayerBoard).toBe(false);
    });
  });

  describe('checkGameEnd', () => {
    beforeEach(() => {
      // Initialize game with ships
      game.playerBoard.placeShip(0, 0, 2, 'horizontal');
      game.cpuBoard.placeShip(5, 5, 2, 'horizontal');
    });

    test('should return false when both players have ships alive', () => {
      const gameEnded = game.checkGameEnd();
      
      expect(gameEnded).toBe(false);
      expect(game.gameOver).toBe(false);
    });

    test('should detect player victory', () => {
      // Sink all CPU ships
      game.cpuBoard.processGuess('55');
      game.cpuBoard.processGuess('56');
      
      const gameEnded = game.checkGameEnd();
      
      expect(gameEnded).toBe(true);
      expect(game.gameOver).toBe(true);
    });

    test('should detect CPU victory', () => {
      // Sink all player ships
      game.playerBoard.processGuess('00');
      game.playerBoard.processGuess('01');
      
      const gameEnded = game.checkGameEnd();
      
      expect(gameEnded).toBe(true);
      expect(game.gameOver).toBe(true);
    });
  });

  describe('getGameStats', () => {
    test('should return comprehensive game statistics', () => {
      const stats = game.getGameStats();
      
      expect(stats).toHaveProperty('player');
      expect(stats).toHaveProperty('cpu');
      expect(stats).toHaveProperty('gameOver');
      expect(stats).toHaveProperty('turnCount');
      expect(stats.gameOver).toBe(false);
      expect(stats.turnCount).toBe(0);
    });

    test('should track turn count correctly', () => {
      game.playerBoard.processGuess('00');
      game.cpuBoard.processGuess('55');
      
      const stats = game.getGameStats();
      
      expect(stats.turnCount).toBe(2);
    });
  });

  describe('reset', () => {
    test('should reset game to initial state', () => {
      // Modify game state
      game.gameOver = true;
      game.playerBoard.processGuess('00');
      game.cpuBoard.processGuess('55');
      
      game.reset();
      
      expect(game.gameOver).toBe(false);
      expect(game.playerBoard.guesses.size).toBe(0);
      expect(game.cpuBoard.guesses.size).toBe(0);
      expect(game.cpu.mode).toBe('hunt');
    });

    test('should create new boards', () => {
      const oldPlayerBoard = game.playerBoard;
      const oldCpuBoard = game.cpuBoard;
      
      game.reset();
      
      expect(game.playerBoard).not.toBe(oldPlayerBoard);
      expect(game.cpuBoard).not.toBe(oldCpuBoard);
    });
  });

  describe('cleanup', () => {
    test('should close readline interface', () => {
      const closeSpy = jest.spyOn(game.rl, 'close');
      
      game.cleanup();
      
      expect(closeSpy).toHaveBeenCalled();
    });

    test('should handle missing readline interface gracefully', () => {
      game.rl = null;
      
      expect(() => game.cleanup()).not.toThrow();
    });
  });
}); 