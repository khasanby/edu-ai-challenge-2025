import { Validator } from '../types';
export declare class BooleanValidator implements Validator<boolean> {
    private _isOptional;
    private _message?;
    optional(): Validator<boolean>;
    withMessage(message: string): Validator<boolean>;
    validate(value: any): {
        valid: boolean;
        errors: string[];
    };
}
export declare function boolean(): BooleanValidator;
