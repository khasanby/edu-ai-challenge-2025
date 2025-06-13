import { Schema } from '../src/schema';

describe('StringValidator', () => {
  it('validates normal strings', () => {
    expect(Schema.string().validate('hello')).toEqual({ valid: true, errors: [] });
    expect(Schema.string().validate('')).toEqual({ valid: true, errors: [] });
  });

  it('rejects non-string values', () => {
    expect(Schema.string().validate(123)).toEqual({ valid: false, errors: ['Value must be a string'] });
    expect(Schema.string().validate({})).toEqual({ valid: false, errors: ['Value must be a string'] });
    expect(Schema.string().validate([])).toEqual({ valid: false, errors: ['Value must be a string'] });
  });

  it('rejects null/undefined by default', () => {
    expect(Schema.string().validate(null)).toEqual({ valid: false, errors: ['Value is required'] });
    expect(Schema.string().validate(undefined)).toEqual({ valid: false, errors: ['Value is required'] });
  });

  it('accepts null/undefined if optional', () => {
    const validator = Schema.string().optional();
    expect(validator.validate(null)).toEqual({ valid: true, errors: [] });
    expect(validator.validate(undefined)).toEqual({ valid: true, errors: [] });
  });

  it('still validates non-null values when optional', () => {
    const validator = Schema.string().optional();
    expect(validator.validate('hello')).toEqual({ valid: true, errors: [] });
    expect(validator.validate(123)).toEqual({ valid: false, errors: ['Value must be a string'] });
  });

  it('validates minLength', () => {
    const validator = Schema.string().minLength(3);
    expect(validator.validate('hi')).toEqual({ valid: false, errors: ['Minimum length is 3'] });
    expect(validator.validate('hey')).toEqual({ valid: true, errors: [] });
  });

  it('overrides error message with withMessage()', () => {
    const validator = Schema.string().withMessage('Custom error');
    expect(validator.validate(123)).toEqual({ valid: false, errors: ['Custom error'] });
    expect(validator.validate(null)).toEqual({ valid: false, errors: ['Custom error'] });
  });

  it('overrides minLength error message with withMessage()', () => {
    const validator = Schema.string().minLength(5).withMessage('Too short!');
    expect(validator.validate('hi')).toEqual({ valid: false, errors: ['Too short!'] });
  });

  it('validates empty string', () => {
    expect(Schema.string().validate('')).toEqual({ valid: true, errors: [] });
    expect(Schema.string().minLength(0).validate('')).toEqual({ valid: true, errors: [] });
  });

  // If .pattern() is implemented, add tests here
  // it('validates pattern', () => {
  //   const validator = Schema.string().pattern(/^h/);
  //   expect(validator.validate('hello')).toEqual({ valid: true, errors: [] });
  //   expect(validator.validate('ello')).toEqual({ valid: false, errors: ['Value does not match pattern'] });
  // });
}); 