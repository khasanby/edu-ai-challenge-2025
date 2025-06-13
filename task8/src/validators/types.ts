export interface Validator<T> {
  validate(value: any): { valid: boolean; errors: string[] };
  optional(): Validator<T>;
  withMessage(message: string): Validator<T>;
} 