import { Schema } from '../src/validators/schema';

describe('Number Validator', () => {
  describe('basic validation', () => {
    test('validates number values', () => {
      const result = Schema.number().validate(42);
      expect(result).toEqual({ valid: true, errors: [] });
    });

    test('rejects non-number values', () => {
      const result = Schema.number().validate('42');
      expect(result).toEqual({
        valid: false,
        errors: ['Value must be a number']
      });
    });

    test('rejects NaN', () => {
      const result = Schema.number().validate(NaN);
      expect(result).toEqual({
        valid: false,
        errors: ['Value must be a number']
      });
    });

    test('rejects null/undefined', () => {
      expect(Schema.number().validate(null)).toEqual({
        valid: false,
        errors: ['Value is required']
      });
      expect(Schema.number().validate(undefined)).toEqual({
        valid: false,
        errors: ['Value is required']
      });
    });
  });

  describe('min()', () => {
    test('validates number greater than min', () => {
      const validator = Schema.number().min(10);
      expect(validator.validate(15)).toEqual({ valid: true, errors: [] });
    });

    test('rejects number less than min', () => {
      const validator = Schema.number().min(10);
      expect(validator.validate(5)).toEqual({
        valid: false,
        errors: ['Minimum value is 10']
      });
    });

    test('accepts number equal to min', () => {
      const validator = Schema.number().min(10);
      expect(validator.validate(10)).toEqual({ valid: true, errors: [] });
    });

    test('handles zero correctly', () => {
      const validator = Schema.number().min(0);
      expect(validator.validate(0)).toEqual({ valid: true, errors: [] });
      expect(validator.validate(-1)).toEqual({
        valid: false,
        errors: ['Minimum value is 0']
      });
    });
  });

  describe('max()', () => {
    test('validates number less than max', () => {
      const validator = Schema.number().max(10);
      expect(validator.validate(5)).toEqual({ valid: true, errors: [] });
    });

    test('rejects number greater than max', () => {
      const validator = Schema.number().max(10);
      expect(validator.validate(15)).toEqual({
        valid: false,
        errors: ['Value must be at most 10']
      });
    });

    test('accepts number equal to max', () => {
      const validator = Schema.number().max(10);
      expect(validator.validate(10)).toEqual({ valid: true, errors: [] });
    });

    test('handles zero correctly', () => {
      const validator = Schema.number().max(0);
      expect(validator.validate(0)).toEqual({ valid: true, errors: [] });
      expect(validator.validate(1)).toEqual({
        valid: false,
        errors: ['Value must be at most 0']
      });
    });
  });

  describe('integer()', () => {
    test('validates integer values', () => {
      const validator = Schema.number().integer();
      expect(validator.validate(42)).toEqual({ valid: true, errors: [] });
    });

    test('rejects non-integer values', () => {
      const validator = Schema.number().integer();
      expect(validator.validate(42.5)).toEqual({
        valid: false,
        errors: ['Value must be an integer']
      });
    });

    test('handles zero correctly', () => {
      const validator = Schema.number().integer();
      expect(validator.validate(0)).toEqual({ valid: true, errors: [] });
    });
  });

  describe('chaining validators', () => {
    test('combines min and max', () => {
      const validator = Schema.number().min(5).max(10);
      expect(validator.validate(7)).toEqual({ valid: true, errors: [] });
      expect(validator.validate(3)).toEqual({
        valid: false,
        errors: ['Minimum value is 5']
      });
      expect(validator.validate(12)).toEqual({
        valid: false,
        errors: ['Value must be at most 10']
      });
    });

    test('combines range and integer', () => {
      const validator = Schema.number().min(5).max(10).integer();
      expect(validator.validate(7)).toEqual({ valid: true, errors: [] });
      expect(validator.validate(7.5)).toEqual({
        valid: false,
        errors: ['Value must be an integer']
      });
    });
  });

  describe('optional()', () => {
    test('allows null/undefined when optional', () => {
      const validator = Schema.number().optional();
      expect(validator.validate(null)).toEqual({ valid: true, errors: [] });
      expect(validator.validate(undefined)).toEqual({ valid: true, errors: [] });
    });

    test('still validates non-null values', () => {
      const validator = Schema.number().optional();
      expect(validator.validate(42)).toEqual({ valid: true, errors: [] });
      expect(validator.validate('42')).toEqual({
        valid: false,
        errors: ['Value must be a number']
      });
    });
  });

  describe('withMessage()', () => {
    test('overrides error message', () => {
      const validator = Schema.number().withMessage('Custom error message');
      expect(validator.validate('42')).toEqual({
        valid: false,
        errors: ['Custom error message']
      });
    });

    test('overrides min error message', () => {
      const validator = Schema.number()
        .min(10)
        .withMessage('Number must be at least 10');
      expect(validator.validate(5)).toEqual({
        valid: false,
        errors: ['Number must be at least 10']
      });
    });
  });

  describe('min(), max(), integer() combinations and edge cases', () => {
    it('validates .min() only', () => {
      const validator = Schema.number().min(5);
      expect(validator.validate(5)).toEqual({ valid: true, errors: [] });
      expect(validator.validate(4)).toEqual({ valid: false, errors: ['Minimum value is 5'] });
    });

    it('validates .max() only', () => {
      const validator = Schema.number().max(10);
      expect(validator.validate(10)).toEqual({ valid: true, errors: [] });
      expect(validator.validate(11)).toEqual({ valid: false, errors: ['Value must be at most 10'] });
    });

    it('validates .integer() only', () => {
      const validator = Schema.number().integer();
      expect(validator.validate(3)).toEqual({ valid: true, errors: [] });
      expect(validator.validate(3.1)).toEqual({ valid: false, errors: ['Value must be an integer'] });
    });

    it('validates .min(), .max(), .integer() combined', () => {
      const validator = Schema.number().min(0).max(10).integer();
      expect(validator.validate(0)).toEqual({ valid: true, errors: [] });
      expect(validator.validate(10)).toEqual({ valid: true, errors: [] });
      expect(validator.validate(5.5)).toEqual({ valid: false, errors: ['Value must be an integer'] });
      expect(validator.validate(-1)).toEqual({ valid: false, errors: ['Minimum value is 0'] });
      expect(validator.validate(11)).toEqual({ valid: false, errors: ['Value must be at most 10'] });
    });

    it('handles NaN, null, undefined, string', () => {
      const validator = Schema.number();
      expect(validator.validate(NaN)).toEqual({ valid: false, errors: ['Value must be a number'] });
      expect(validator.validate(null)).toEqual({ valid: false, errors: ['Value is required'] });
      expect(validator.validate(undefined)).toEqual({ valid: false, errors: ['Value is required'] });
      expect(validator.validate('123')).toEqual({ valid: false, errors: ['Value must be a number'] });
    });

    it('validates negative values vs positive limits', () => {
      const validator = Schema.number().min(0);
      expect(validator.validate(-1)).toEqual({ valid: false, errors: ['Minimum value is 0'] });
      expect(validator.validate(0)).toEqual({ valid: true, errors: [] });
    });

    it('validates optional numbers', () => {
      const validator = Schema.number().optional();
      expect(validator.validate(undefined)).toEqual({ valid: true, errors: [] });
      expect(validator.validate(null)).toEqual({ valid: true, errors: [] });
      expect(validator.validate(5)).toEqual({ valid: true, errors: [] });
    });

    it('validates edge cases: 0 and Number.MAX_SAFE_INTEGER', () => {
      const validator = Schema.number().min(0).max(Number.MAX_SAFE_INTEGER);
      expect(validator.validate(0)).toEqual({ valid: true, errors: [] });
      expect(validator.validate(Number.MAX_SAFE_INTEGER)).toEqual({ valid: true, errors: [] });
      expect(validator.validate(Number.MAX_SAFE_INTEGER + 1)).toEqual({ valid: false, errors: [`Value must be at most ${Number.MAX_SAFE_INTEGER}`] });
    });
  });
}); 