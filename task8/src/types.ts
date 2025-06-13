export interface Validator<T> {
  optional(): Validator<T>;
  withMessage(message: string): Validator<T>;
  validate(value: any): { valid: boolean; errors: string[] };
} 