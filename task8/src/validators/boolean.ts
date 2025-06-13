import { Validator } from '../types';

export class BooleanValidator implements Validator<boolean> {
  private _isOptional = false;
  private _message?: string;

  optional(): Validator<boolean> {
    this._isOptional = true;
    return this;
  }

  withMessage(message: string): Validator<boolean> {
    this._message = message;
    return this;
  }

  validate(value: any) {
    const errors: string[] = [];
    if (value === undefined || value === null) {
      if (!this._isOptional) errors.push(this._message || 'Value is required');
    } else if (typeof value !== 'boolean') {
      errors.push(this._message || 'Value must be a boolean');
    }
    return { valid: errors.length === 0, errors };
  }
}

export function boolean() {
  return new BooleanValidator();
} 