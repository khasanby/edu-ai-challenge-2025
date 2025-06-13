import { string } from './validators/string';
import { number } from './validators/number';
import { boolean } from './validators/boolean';
import { date } from './validators/date';
import { object } from './validators/object';
import { array } from './validators/array';
export declare const Schema: {
    string: typeof string;
    number: typeof number;
    boolean: typeof boolean;
    date: typeof date;
    object: typeof object;
    array: typeof array;
};
export default Schema;
