import { Validator } from '../types';

export class ArrayValidator implements Validator<any[]> {
  private _isOptional = false;
  private _message?: string;
  private _validator: Validator<any>;

  constructor(validator: Validator<any>) {
    this._validator = validator;
  }

  optional(): Validator<any[]> {
    this._isOptional = true;
    return this;
  }

  withMessage(message: string): Validator<any[]> {
    this._message = message;
    return this;
  }

  validate(value: any) {
    const errors: string[] = [];
    if (value === undefined || value === null) {
      if (!this._isOptional) errors.push(this._message || 'Value is required');
    } else if (!Array.isArray(value)) {
      errors.push(this._message || 'Value must be an array');
    } else {
      value.forEach((item, idx) => {
        const result = this._validator.validate(item);
        if (!result.valid) {
          errors.push(...result.errors.map(e => `Index ${idx}: ${e}`));
        }
      });
    }
    return { valid: errors.length === 0, errors };
  }
}

export function array(validator: Validator<any>) {
  return new ArrayValidator(validator);
} 