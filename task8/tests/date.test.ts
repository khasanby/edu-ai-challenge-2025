import { Schema } from '../src/schema';
import { date } from '../src/validators/date';

function assert(condition: boolean, message: string) {
  if (!condition) throw new Error(message);
}

// Test: valid date
let result = Schema.date().validate(new Date());
assert(result.valid, 'Should validate a date');

// Test: invalid date
result = Schema.date().validate('2020-01-01');
assert(!result.valid, 'Should fail for non-date');

// Test: optional
result = Schema.date().optional().validate(undefined);
assert(result.valid, 'Should allow optional');

console.log('All date validator tests passed.');

describe('DateValidator', () => {
  describe('valid values', () => {
    it('accepts a valid Date object', () => {
      const validator = date();
      expect(validator.validate(new Date())).toEqual({ valid: true, errors: [] });
    });
    it('accepts a valid ISO string converted to Date', () => {
      const validator = date();
      const iso = '2024-01-01T00:00:00.000Z';
      expect(validator.validate(new Date(iso))).toEqual({ valid: true, errors: [] });
    });
  });

  describe('invalid values', () => {
    it('rejects a plain string', () => {
      const validator = date();
      expect(validator.validate('2024-01-01')).toEqual({ valid: false, errors: ['Value must be a valid Date'] });
    });
    it('rejects null', () => {
      const validator = date();
      expect(validator.validate(null)).toEqual({ valid: false, errors: ['Value is required'] });
    });
    it('rejects undefined', () => {
      const validator = date();
      expect(validator.validate(undefined)).toEqual({ valid: false, errors: ['Value is required'] });
    });
  });

  describe('edge cases', () => {
    it('rejects an invalid Date object', () => {
      const validator = date();
      expect(validator.validate(new Date('not-a-date'))).toEqual({ valid: false, errors: ['Value must be a valid Date'] });
    });
    it('accepts undefined/null if optional', () => {
      const validator = date().optional();
      expect(validator.validate(undefined)).toEqual({ valid: true, errors: [] });
      expect(validator.validate(null)).toEqual({ valid: true, errors: [] });
    });
    it('still validates value if present and optional', () => {
      const validator = date().optional();
      expect(validator.validate(new Date())).toEqual({ valid: true, errors: [] });
      expect(validator.validate('not-a-date')).toEqual({ valid: false, errors: ['Value must be a valid Date'] });
    });
  });

  describe('basic validation', () => {
    it('validates valid dates', () => {
      const validator = date();
      expect(validator.validate(new Date())).toEqual({ valid: true, errors: [] });
      expect(validator.validate(new Date('2024-01-01'))).toEqual({ valid: true, errors: [] });
    });

    it('rejects invalid types', () => {
      const validator = date();
      expect(validator.validate(123)).toEqual({
        valid: false,
        errors: ['Value must be a valid Date']
      });
      expect(validator.validate({})).toEqual({
        valid: false,
        errors: ['Value must be a valid Date']
      });
    });

    it('rejects invalid dates', () => {
      const validator = date();
      const invalidDate = new Date('invalid');
      expect(validator.validate(invalidDate)).toEqual({
        valid: false,
        errors: ['Value must be a valid Date']
      });
    });
  });

  describe('optional()', () => {
    it('allows undefined and null when optional', () => {
      const validator = date().optional();
      expect(validator.validate(undefined)).toEqual({ valid: true, errors: [] });
      expect(validator.validate(null)).toEqual({ valid: true, errors: [] });
    });

    it('still validates non-null values when optional', () => {
      const validator = date().optional();
      expect(validator.validate(new Date())).toEqual({ valid: true, errors: [] });
      expect(validator.validate('not a date')).toEqual({
        valid: false,
        errors: ['Value must be a valid Date']
      });
    });
  });

  describe('withMessage()', () => {
    it('overrides default error message', () => {
      const validator = date().withMessage('Please provide a valid date');
      expect(validator.validate('not a date')).toEqual({
        valid: false,
        errors: ['Please provide a valid date']
      });
    });

    it('overrides required error message', () => {
      const validator = date().withMessage('Date is required');
      expect(validator.validate(null)).toEqual({
        valid: false,
        errors: ['Date is required']
      });
    });

    it('preserves custom message when optional', () => {
      const validator = date().optional().withMessage('Invalid date format');
      expect(validator.validate('not a date')).toEqual({
        valid: false,
        errors: ['Invalid date format']
      });
    });
  });
}); 