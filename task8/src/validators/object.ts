import { Validator } from '../types';

export type ObjectShape = { [key: string]: Validator<any> };

export class ObjectValidator implements Validator<any> {
  private _isOptional = false;
  private _message?: string;
  private _shape: ObjectShape;

  constructor(shape: ObjectShape) {
    this._shape = shape;
  }

  optional(): Validator<any> {
    this._isOptional = true;
    return this;
  }

  withMessage(message: string): Validator<any> {
    this._message = message;
    return this;
  }

  validate(value: any) {
    const errors: string[] = [];
    if (value === undefined || value === null) {
      if (!this._isOptional) errors.push(this._message || 'Value is required');
    } else if (typeof value !== 'object' || Array.isArray(value)) {
      errors.push(this._message || 'Value must be an object');
    } else {
      for (const key in this._shape) {
        const validator = this._shape[key];
        const result = validator.validate(value[key]);
        if (!result.valid) {
          errors.push(...result.errors.map(e => `${key}: ${e}`));
        }
      }
    }
    return { valid: errors.length === 0, errors };
  }
}

export function object(shape: ObjectShape) {
  return new ObjectValidator(shape);
} 