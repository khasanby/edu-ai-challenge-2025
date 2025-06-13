import { object, partial } from '../src/validators/objects.js';
import { isString, isNumber, isBoolean } from '../src/validators/primitives.js';

describe('Object Validators', () => {
  describe('object', () => {
    const userSchema = object({
      name: isString,
      age: isNumber,
      isActive: isBoolean
    });

    test('validates valid object', () => {
      const user = {
        name: 'John',
        age: 30,
        isActive: true
      };
      expect(userSchema(user)).toEqual({ valid: true, errors: [] });
    });

    test('rejects non-object values', () => {
      expect(userSchema('not an object')).toEqual({
        valid: false,
        errors: ['Value must be an object']
      });
    });

    test('rejects object with invalid properties', () => {
      const user = {
        name: 123,
        age: '30',
        isActive: 'true'
      };
      expect(userSchema(user)).toEqual({
        valid: false,
        errors: [
          'name: Value must be a string',
          'age: Value must be a number',
          'isActive: Value must be a boolean'
        ]
      });
    });

    test('rejects object with missing properties', () => {
      const user = {
        name: 'John'
      };
      expect(userSchema(user)).toEqual({
        valid: false,
        errors: [
          'age: Value is required',
          'isActive: Value is required'
        ]
      });
    });

    test('rejects object with extra properties', () => {
      const user = {
        name: 'John',
        age: 30,
        isActive: true,
        extra: 'property'
      };
      expect(userSchema(user)).toEqual({
        valid: false,
        errors: ['Unexpected property: extra']
      });
    });

    test('rejects null/undefined', () => {
      expect(userSchema(null)).toEqual({ valid: false, errors: ['Value is required'] });
      expect(userSchema(undefined)).toEqual({ valid: false, errors: ['Value is required'] });
    });
  });

  describe('partial', () => {
    const partialUserSchema = partial({
      name: isString,
      age: isNumber,
      isActive: isBoolean
    });

    test('validates object with optional properties', () => {
      const user = {
        name: 'John'
      };
      expect(partialUserSchema(user)).toEqual({ valid: true, errors: [] });
    });

    test('validates complete object', () => {
      const user = {
        name: 'John',
        age: 30,
        isActive: true
      };
      expect(partialUserSchema(user)).toEqual({ valid: true, errors: [] });
    });

    test('rejects object with invalid properties', () => {
      const user = {
        name: 123,
        age: '30'
      };
      expect(partialUserSchema(user)).toEqual({
        valid: false,
        errors: [
          'name: Value must be a string',
          'age: Value must be a number'
        ]
      });
    });
  });
}); 