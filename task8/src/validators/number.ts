import { Validator } from '../types';

export class NumberValidator implements Validator<number> {
  private _isOptional = false;
  private _min?: number;
  private _max?: number;
  private _isInteger = false;
  private _message?: string;

  optional(): Validator<number> {
    this._isOptional = true;
    return this;
  }

  min(min: number): this {
    this._min = min;
    return this;
  }

  max(max: number): this {
    this._max = max;
    return this;
  }

  integer(): this {
    this._isInteger = true;
    return this;
  }

  withMessage(message: string): Validator<number> {
    this._message = message;
    return this;
  }

  validate(value: any) {
    const errors: string[] = [];
    if (value === undefined || value === null) {
      if (!this._isOptional) errors.push(this._message || 'Value is required');
    } else if (typeof value !== 'number' || isNaN(value)) {
      errors.push(this._message || 'Value must be a number');
    } else {
      if (this._min !== undefined && value < this._min) {
        errors.push(this._message || `Minimum value is ${this._min}`);
      }
      if (this._max !== undefined && value > this._max) {
        errors.push(this._message || `Value must be at most ${this._max}`);
      }
      if (this._isInteger && !Number.isInteger(value)) {
        errors.push(this._message || 'Value must be an integer');
      }
    }
    return { valid: errors.length === 0, errors };
  }
}

export function number() {
  return new NumberValidator();
} 