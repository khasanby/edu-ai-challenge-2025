import { Schema } from '../src/validators/schema';

describe('Schema Builder', () => {
  describe('string()', () => {
    test('validates string values', () => {
      const result = Schema.string().validate('test');
      expect(result).toEqual({ valid: true, errors: [] });
    });

    test('rejects non-string values', () => {
      const result = Schema.string().validate(123);
      expect(result).toEqual({
        valid: false,
        errors: ['Value must be a string']
      });
    });

    test('validates with minLength', () => {
      const validator = Schema.string().minLength(3);
      expect(validator.validate('test')).toEqual({ valid: true, errors: [] });
      expect(validator.validate('hi')).toEqual({
        valid: false,
        errors: ['Minimum length is 3']
      });
    });
  });

  describe('number()', () => {
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
  });

  describe('boolean()', () => {
    test('validates boolean values', () => {
      expect(Schema.boolean().validate(true)).toEqual({ valid: true, errors: [] });
      expect(Schema.boolean().validate(false)).toEqual({ valid: true, errors: [] });
    });

    test('rejects non-boolean values', () => {
      const result = Schema.boolean().validate('true');
      expect(result).toEqual({
        valid: false,
        errors: ['Value must be a boolean']
      });
    });
  });

  describe('object()', () => {
    test('validates object with schema', () => {
      const userSchema = Schema.object({
        name: Schema.string(),
        age: Schema.number()
      });

      const result = userSchema.validate({
        name: 'John',
        age: 30
      });

      expect(result).toEqual({ valid: true, errors: [] });
    });

    test('rejects invalid object properties', () => {
      const userSchema = Schema.object({
        name: Schema.string(),
        age: Schema.number()
      });

      const result = userSchema.validate({
        name: 123,
        age: '30'
      });

      expect(result.valid).toBe(false);
      expect(result.errors).toContain('name: Value must be a string');
      expect(result.errors).toContain('age: Value must be a number');
    });
  });

  describe('array()', () => {
    test('validates array of type', () => {
      const stringArray = Schema.array(Schema.string());
      const result = stringArray.validate(['hello', 'world']);
      expect(result).toEqual({ valid: true, errors: [] });
    });

    test('rejects array with invalid items', () => {
      const stringArray = Schema.array(Schema.string());
      const result = stringArray.validate(['hello', 123]);
      expect(result.valid).toBe(false);
      expect(result.errors).toContain('Index 1: Value must be a string');
    });
  });
}); 