import { Validator } from '../types';
export declare class ArrayValidator implements Validator<any[]> {
    private _isOptional;
    private _message?;
    private _validator;
    constructor(validator: Validator<any>);
    optional(): Validator<any[]>;
    withMessage(message: string): Validator<any[]>;
    validate(value: any): {
        valid: boolean;
        errors: string[];
    };
}
export declare function array(validator: Validator<any>): ArrayValidator;
