import { Validator } from '../types';
export declare class DateValidator implements Validator<Date> {
    private _isOptional;
    private _message?;
    optional(): Validator<Date>;
    withMessage(message: string): Validator<Date>;
    validate(value: any): {
        valid: boolean;
        errors: string[];
    };
}
export declare function date(): DateValidator;
