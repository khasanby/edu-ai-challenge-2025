import { Schema } from '../src/schema';

describe('BooleanValidator', () => {
  it('validates true/false', () => {
    expect(Schema.boolean().validate(true)).toEqual({ valid: true, errors: [] });
    expect(Schema.boolean().validate(false)).toEqual({ valid: true, errors: [] });
  });

  it('rejects non-boolean values', () => {
    expect(Schema.boolean().validate('true')).toEqual({ valid: false, errors: ['Value must be a boolean'] });
    expect(Schema.boolean().validate(1)).toEqual({ valid: false, errors: ['Value must be a boolean'] });
    expect(Schema.boolean().validate({})).toEqual({ valid: false, errors: ['Value must be a boolean'] });
  });

  it('rejects null/undefined by default', () => {
    expect(Schema.boolean().validate(null)).toEqual({ valid: false, errors: ['Value is required'] });
    expect(Schema.boolean().validate(undefined)).toEqual({ valid: false, errors: ['Value is required'] });
  });

  it('accepts null/undefined if optional', () => {
    const validator = Schema.boolean().optional();
    expect(validator.validate(null)).toEqual({ valid: true, errors: [] });
    expect(validator.validate(undefined)).toEqual({ valid: true, errors: [] });
  });

  it('still validates non-null values when optional', () => {
    const validator = Schema.boolean().optional();
    expect(validator.validate(true)).toEqual({ valid: true, errors: [] });
    expect(validator.validate('no')).toEqual({ valid: false, errors: ['Value must be a boolean'] });
  });

  it('overrides error message with withMessage()', () => {
    const validator = Schema.boolean().withMessage('Custom error');
    expect(validator.validate('no')).toEqual({ valid: false, errors: ['Custom error'] });
    expect(validator.validate(null)).toEqual({ valid: false, errors: ['Custom error'] });
  });
}); 