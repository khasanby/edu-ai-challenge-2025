import { isString, isNumber, isBoolean, optional, withMessage } from '../src/validators/primitives.js';

describe('Primitive Validators', () => {
  describe('isString', () => {
    test('validates string values', () => {
      expect(isString('hello')).toEqual({ valid: true, errors: [] });
    });

    test('rejects non-string values', () => {
      expect(isString(123)).toEqual({ valid: false, errors: ['Value must be a string'] });
    });

    test('rejects null/undefined', () => {
      expect(isString(null)).toEqual({ valid: false, errors: ['Value is required'] });
      expect(isString(undefined)).toEqual({ valid: false, errors: ['Value is required'] });
    });
  });

  describe('isNumber', () => {
    test('validates number values', () => {
      expect(isNumber(123)).toEqual({ valid: true, errors: [] });
    });

    test('rejects non-number values', () => {
      expect(isNumber('123')).toEqual({ valid: false, errors: ['Value must be a number'] });
      expect(isNumber(NaN)).toEqual({ valid: false, errors: ['Value must be a number'] });
    });

    test('rejects null/undefined', () => {
      expect(isNumber(null)).toEqual({ valid: false, errors: ['Value is required'] });
      expect(isNumber(undefined)).toEqual({ valid: false, errors: ['Value is required'] });
    });
  });

  describe('isBoolean', () => {
    test('validates boolean values', () => {
      expect(isBoolean(true)).toEqual({ valid: true, errors: [] });
      expect(isBoolean(false)).toEqual({ valid: true, errors: [] });
    });

    test('rejects non-boolean values', () => {
      expect(isBoolean('true')).toEqual({ valid: false, errors: ['Value must be a boolean'] });
    });

    test('rejects null/undefined', () => {
      expect(isBoolean(null)).toEqual({ valid: false, errors: ['Value is required'] });
      expect(isBoolean(undefined)).toEqual({ valid: false, errors: ['Value is required'] });
    });
  });

  describe('optional', () => {
    test('allows null/undefined values', () => {
      const optionalString = optional(isString);
      expect(optionalString(null)).toEqual({ valid: true, errors: [] });
      expect(optionalString(undefined)).toEqual({ valid: true, errors: [] });
    });

    test('validates non-null values', () => {
      const optionalString = optional(isString);
      expect(optionalString('hello')).toEqual({ valid: true, errors: [] });
      expect(optionalString(123)).toEqual({ valid: false, errors: ['Value must be a string'] });
    });
  });

  describe('withMessage', () => {
    test('overrides error message', () => {
      const customString = withMessage(isString, 'Custom error message');
      expect(customString(123)).toEqual({ valid: false, errors: ['Custom error message'] });
    });
  });
}); 