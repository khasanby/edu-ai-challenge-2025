import { arrayOf, withLength } from '../src/validators/arrays.js';
import { isString, isNumber } from '../src/validators/primitives.js';

describe('Array Validators', () => {
  describe('arrayOf', () => {
    test('validates array of strings', () => {
      const stringArray = arrayOf(isString);
      expect(stringArray(['hello', 'world'])).toEqual({ valid: true, errors: [] });
    });

    test('rejects non-array values', () => {
      const stringArray = arrayOf(isString);
      expect(stringArray('not an array')).toEqual({ valid: false, errors: ['Value must be an array'] });
    });

    test('rejects array with invalid items', () => {
      const stringArray = arrayOf(isString);
      expect(stringArray(['hello', 123])).toEqual({
        valid: false,
        errors: ['Index 1: Value must be a string']
      });
    });

    test('rejects null/undefined', () => {
      const stringArray = arrayOf(isString);
      expect(stringArray(null)).toEqual({ valid: false, errors: ['Value is required'] });
      expect(stringArray(undefined)).toEqual({ valid: false, errors: ['Value is required'] });
    });
  });

  describe('withLength', () => {
    test('validates array length constraints', () => {
      const numberArray = withLength(arrayOf(isNumber), 2, 4);
      expect(numberArray([1, 2, 3])).toEqual({ valid: true, errors: [] });
    });

    test('rejects array that is too short', () => {
      const numberArray = withLength(arrayOf(isNumber), 2, 4);
      expect(numberArray([1])).toEqual({
        valid: false,
        errors: ['Array must have at least 2 items']
      });
    });

    test('rejects array that is too long', () => {
      const numberArray = withLength(arrayOf(isNumber), 2, 4);
      expect(numberArray([1, 2, 3, 4, 5])).toEqual({
        valid: false,
        errors: ['Array must have at most 4 items']
      });
    });

    test('combines length errors with item validation errors', () => {
      const numberArray = withLength(arrayOf(isNumber), 2, 4);
      expect(numberArray(['invalid', 2])).toEqual({
        valid: false,
        errors: ['Index 0: Value must be a number']
      });
    });
  });
}); 