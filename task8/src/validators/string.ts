import { Validator } from '../types';

export class StringValidator implements Validator<string> {
  private _isOptional = false;
  private _minLength?: number;
  private _message?: string;

  optional(): Validator<string> {
    this._isOptional = true;
    return this;
  }

  minLength(length: number): this {
    this._minLength = length;
    return this;
  }

  withMessage(message: string): Validator<string> {
    this._message = message;
    return this;
  }

  validate(value: any) {
    const errors: string[] = [];
    if (value === undefined || value === null) {
      if (!this._isOptional) errors.push(this._message || 'Value is required');
    } else if (typeof value !== 'string') {
      errors.push(this._message || 'Value must be a string');
    } else {
      if (this._minLength !== undefined && value.length < this._minLength) {
        errors.push(this._message || `Minimum length is ${this._minLength}`);
      }
    }
    return { valid: errors.length === 0, errors };
  }
}

export function string() {
  return new StringValidator();
} 