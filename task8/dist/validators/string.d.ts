import { Validator } from '../types';
export declare class StringValidator implements Validator<string> {
    private _isOptional;
    private _minLength?;
    private _message?;
    optional(): Validator<string>;
    minLength(length: number): this;
    withMessage(message: string): Validator<string>;
    validate(value: any): {
        valid: boolean;
        errors: string[];
    };
}
export declare function string(): StringValidator;
