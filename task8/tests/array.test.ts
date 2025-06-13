import { Schema } from '../src/schema';

describe('ArrayValidator', () => {
  it('validates array of numbers', () => {
    const arrSchema = Schema.array(Schema.number().min(0));
    expect(arrSchema.validate([1, 2, 3])).toEqual({ valid: true, errors: [] });
  });

  it('rejects array with invalid items', () => {
    const arrSchema = Schema.array(Schema.number().min(0));
    expect(arrSchema.validate([1, -2, 3])).toEqual({ valid: false, errors: ['Index 1: Minimum value is 0'] });
  });

  it('rejects non-array values', () => {
    const arrSchema = Schema.array(Schema.number());
    expect(arrSchema.validate('not an array')).toEqual({ valid: false, errors: ['Value must be an array'] });
    expect(arrSchema.validate(123)).toEqual({ valid: false, errors: ['Value must be an array'] });
    expect(arrSchema.validate({})).toEqual({ valid: false, errors: ['Value must be an array'] });
  });

  it('rejects null/undefined by default', () => {
    const arrSchema = Schema.array(Schema.number());
    expect(arrSchema.validate(null)).toEqual({ valid: false, errors: ['Value is required'] });
    expect(arrSchema.validate(undefined)).toEqual({ valid: false, errors: ['Value is required'] });
  });

  it('accepts null/undefined if optional', () => {
    const arrSchema = Schema.array(Schema.number()).optional();
    expect(arrSchema.validate(null)).toEqual({ valid: true, errors: [] });
    expect(arrSchema.validate(undefined)).toEqual({ valid: true, errors: [] });
  });

  it('validates empty array', () => {
    const arrSchema = Schema.array(Schema.number());
    expect(arrSchema.validate([])).toEqual({ valid: true, errors: [] });
  });

  it('overrides error message with withMessage()', () => {
    const arrSchema = Schema.array(Schema.number()).withMessage('Custom array error');
    expect(arrSchema.validate('not an array')).toEqual({ valid: false, errors: ['Custom array error'] });
    expect(arrSchema.validate(null)).toEqual({ valid: false, errors: ['Custom array error'] });
  });

  it('validates nested arrays', () => {
    const arrSchema = Schema.array(Schema.array(Schema.number().min(0)));
    expect(arrSchema.validate([[1, 2], [3, 4]])).toEqual({ valid: true, errors: [] });
    expect(arrSchema.validate([[1, -2], [3, 4]])).toEqual({ valid: false, errors: ['Index 0: Index 1: Minimum value is 0'] });
  });
}); 