import { Validator } from './types';
import { StringValidator } from './string';
import { NumberValidator } from './number';
import { BooleanValidator } from './boolean';
import { DateValidator } from './date';
import { ObjectValidator } from './object';
import { ArrayValidator } from './array';

export const Schema = {
  string: () => new StringValidator(),
  number: () => new NumberValidator(),
  boolean: () => new BooleanValidator(),
  date: () => new DateValidator(),
  object: (shape: Record<string, Validator<any>>) => new ObjectValidator(shape),
  array: (validator: Validator<any>) => new ArrayValidator(validator)
}; 