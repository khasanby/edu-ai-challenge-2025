import { Ship } from '../src/Ship.js';

describe('Ship', () => {
  let ship;

  beforeEach(() => {
    ship = new Ship(['00', '01', '02']);
  });

  describe('constructor', () => {
    test('should create a ship with correct locations', () => {
      expect(ship.locations).toEqual(['00', '01', '02']);
      expect(ship.hits).toEqual([false, false, false]);
    });

    test('should handle single location ship', () => {
      const singleShip = new Ship(['55']);
      expect(singleShip.locations).toEqual(['55']);
      expect(singleShip.hits).toEqual([false]);
    });

    test('should handle empty locations array', () => {
      const emptyShip = new Ship([]);
      expect(emptyShip.locations).toEqual([]);
      expect(emptyShip.hits).toEqual([]);
    });
  });

  describe('hit', () => {
    test('should register hit on valid location', () => {
      const result = ship.hit('01');
      expect(result).toBe(true);
      expect(ship.hits[1]).toBe(true);
    });

    test('should return false for invalid location', () => {
      const result = ship.hit('99');
      expect(result).toBe(false);
      expect(ship.hits).toEqual([false, false, false]);
    });

    test('should allow multiple hits on same location', () => {
      ship.hit('00');
      const secondHit = ship.hit('00');
      expect(secondHit).toBe(true);
      expect(ship.hits[0]).toBe(true);
    });

    test('should handle all locations being hit', () => {
      ship.hit('00');
      ship.hit('01');
      ship.hit('02');
      expect(ship.hits).toEqual([true, true, true]);
    });
  });

  describe('isSunk', () => {
    test('should return false when no hits', () => {
      expect(ship.isSunk()).toBe(false);
    });

    test('should return false when partially hit', () => {
      ship.hit('00');
      expect(ship.isSunk()).toBe(false);
    });

    test('should return true when all locations hit', () => {
      ship.hit('00');
      ship.hit('01');
      ship.hit('02');
      expect(ship.isSunk()).toBe(true);
    });

    test('should return true for empty ship', () => {
      const emptyShip = new Ship([]);
      expect(emptyShip.isSunk()).toBe(true);
    });

    test('should return true for single location ship when hit', () => {
      const singleShip = new Ship(['33']);
      singleShip.hit('33');
      expect(singleShip.isSunk()).toBe(true);
    });
  });

  describe('isHit', () => {
    test('should return false for unhit location', () => {
      expect(ship.isHit('00')).toBe(false);
    });

    test('should return true for hit location', () => {
      ship.hit('01');
      expect(ship.isHit('01')).toBe(true);
    });

    test('should return false for invalid location', () => {
      expect(ship.isHit('99')).toBe(false);
    });

    test('should handle multiple locations correctly', () => {
      ship.hit('00');
      ship.hit('02');
      expect(ship.isHit('00')).toBe(true);
      expect(ship.isHit('01')).toBe(false);
      expect(ship.isHit('02')).toBe(true);
    });
  });

  describe('getStatus', () => {
    test('should return correct status for new ship', () => {
      const status = ship.getStatus();
      expect(status).toEqual({
        totalParts: 3,
        hitParts: 0,
        sunk: false
      });
    });

    test('should return correct status for partially hit ship', () => {
      ship.hit('00');
      ship.hit('02');
      const status = ship.getStatus();
      expect(status).toEqual({
        totalParts: 3,
        hitParts: 2,
        sunk: false
      });
    });

    test('should return correct status for sunk ship', () => {
      ship.hit('00');
      ship.hit('01');
      ship.hit('02');
      const status = ship.getStatus();
      expect(status).toEqual({
        totalParts: 3,
        hitParts: 3,
        sunk: true
      });
    });
  });
}); 