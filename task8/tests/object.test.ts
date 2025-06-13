import { object } from '../src/validators/object';
import { string } from '../src/validators/string';
import { number } from '../src/validators/number';
import { boolean } from '../src/validators/boolean';
import { Schema } from '../src/schema';

describe('ObjectValidator', () => {
  describe('basic validation', () => {
    it('validates valid objects', () => {
      const validator = object({
        name: string(),
        age: number(),
        isActive: boolean()
      });

      expect(validator.validate({
        name: 'John',
        age: 30,
        isActive: true
      })).toEqual({ valid: true, errors: [] });
    });

    it('rejects non-object values', () => {
      const validator = object({
        name: string()
      });

      expect(validator.validate('not an object')).toEqual({
        valid: false,
        errors: ['Value must be an object']
      });

      expect(validator.validate(123)).toEqual({
        valid: false,
        errors: ['Value must be an object']
      });

      expect(validator.validate([])).toEqual({
        valid: false,
        errors: ['Value must be an object']
      });
    });
  });

  describe('required fields', () => {
    it('rejects objects with missing required fields', () => {
      const validator = object({
        name: string(),
        age: number()
      });

      expect(validator.validate({ name: 'John' })).toEqual({
        valid: false,
        errors: ['age: Value is required']
      });

      expect(validator.validate({ age: 30 })).toEqual({
        valid: false,
        errors: ['name: Value is required']
      });
    });

    it('validates nested objects', () => {
      const validator = object({
        user: object({
          name: string(),
          age: number()
        })
      });

      expect(validator.validate({
        user: { name: 'John', age: 30 }
      })).toEqual({ valid: true, errors: [] });

      expect(validator.validate({
        user: { name: 'John' }
      })).toEqual({
        valid: false,
        errors: ['user: age: Value is required']
      });
    });
  });

  describe('optional fields', () => {
    it('allows missing optional fields', () => {
      const validator = object({
        name: string(),
        age: number().optional()
      });

      expect(validator.validate({ name: 'John' })).toEqual({ valid: true, errors: [] });
      expect(validator.validate({ name: 'John', age: 30 })).toEqual({ valid: true, errors: [] });
    });

    it('validates optional fields when present', () => {
      const validator = object({
        name: string(),
        age: number().optional()
      });

      expect(validator.validate({ name: 'John', age: 'invalid' })).toEqual({
        valid: false,
        errors: ['age: Value must be a number']
      });
    });
  });

  describe('type validation', () => {
    it('validates field types', () => {
      const validator = object({
        name: string(),
        age: number(),
        isActive: boolean()
      });

      expect(validator.validate({
        name: 123,
        age: '30',
        isActive: 'true'
      })).toEqual({
        valid: false,
        errors: [
          'name: Value must be a string',
          'age: Value must be a number',
          'isActive: Value must be a boolean'
        ]
      });
    });
  });

  describe('withMessage()', () => {
    it('overrides default error message', () => {
      const validator = object({
        name: string()
      }).withMessage('Invalid user data');

      expect(validator.validate('not an object')).toEqual({
        valid: false,
        errors: ['Invalid user data']
      });
    });
  });

  describe('Schema.object()', () => {
    it('validates objects using Schema.object()', () => {
      const schema = Schema.object({
        user: Schema.object({
          name: Schema.string(),
          age: Schema.number()
        })
      });

      expect(schema.validate({
        user: { name: 'John', age: 30 }
      })).toEqual({ valid: true, errors: [] });

      expect(schema.validate({
        user: { name: 123, age: '30' }
      })).toEqual({
        valid: false,
        errors: [
          'user: name: Value must be a string',
          'user: age: Value must be a number'
        ]
      });
    });
  });

  describe('edge cases and coverage', () => {
    it('validates empty object shape', () => {
      const validator = object({});
      expect(validator.validate({})).toEqual({ valid: true, errors: [] });
      expect(validator.validate({ any: 'value' })).toEqual({ valid: true, errors: [] });
    });

    it('returns valid for undefined/null if optional is set', () => {
      const validator = object({}).optional();
      expect(validator.validate(undefined)).toEqual({ valid: true, errors: [] });
      expect(validator.validate(null)).toEqual({ valid: true, errors: [] });
    });

    it('returns custom message for undefined/null if not optional', () => {
      const validator = object({}).withMessage('Custom required');
      expect(validator.validate(undefined)).toEqual({ valid: false, errors: ['Custom required'] });
      expect(validator.validate(null)).toEqual({ valid: false, errors: ['Custom required'] });
    });

    it('optional() and withMessage() can be chained', () => {
      const validator = object({}).optional().withMessage('Custom required');
      expect(validator.validate(undefined)).toEqual({ valid: true, errors: [] });
      expect(validator.validate(null)).toEqual({ valid: true, errors: [] });
    });
  });
}); 