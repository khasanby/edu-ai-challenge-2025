import { Validator } from './types';
import { StringValidator } from './string';
import { NumberValidator } from './number';
import { BooleanValidator } from './boolean';
import { DateValidator } from './date';
import { ObjectValidator } from './object';
import { ArrayValidator } from './array';
export declare const Schema: {
    string: () => StringValidator;
    number: () => NumberValidator;
    boolean: () => BooleanValidator;
    date: () => DateValidator;
    object: (shape: Record<string, Validator<any>>) => ObjectValidator;
    array: (validator: Validator<any>) => ArrayValidator;
};
