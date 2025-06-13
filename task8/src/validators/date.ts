import { Validator } from '../types';

export class DateValidator implements Validator<Date> {
  private _isOptional = false;
  private _message?: string;

  optional(): Validator<Date> {
    this._isOptional = true;
    return this;
  }

  withMessage(message: string): Validator<Date> {
    this._message = message;
    return this;
  }

  validate(value: any) {
    const errors: string[] = [];
    if (value === undefined || value === null) {
      if (!this._isOptional) errors.push(this._message || 'Value is required');
    } else if (!(value instanceof Date) || isNaN(value.getTime())) {
      errors.push(this._message || 'Value must be a valid Date');
    }
    return { valid: errors.length === 0, errors };
  }
}

export function date() {
  return new DateValidator();
} 