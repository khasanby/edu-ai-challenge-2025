import { Validator } from '../types';
export declare class NumberValidator implements Validator<number> {
    private _isOptional;
    private _min?;
    private _message?;
    optional(): Validator<number>;
    min(min: number): this;
    withMessage(message: string): Validator<number>;
    validate(value: any): {
        valid: boolean;
        errors: string[];
    };
}
export declare function number(): NumberValidator;
