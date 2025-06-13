import { Validator } from '../types';
export type ObjectShape = {
    [key: string]: Validator<any>;
};
export declare class ObjectValidator implements Validator<any> {
    private _isOptional;
    private _message?;
    private _shape;
    constructor(shape: ObjectShape);
    optional(): Validator<any>;
    withMessage(message: string): Validator<any>;
    validate(value: any): {
        valid: boolean;
        errors: string[];
    };
}
export declare function object(shape: ObjectShape): ObjectValidator;
