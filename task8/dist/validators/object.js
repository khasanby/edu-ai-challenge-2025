"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ObjectValidator = void 0;
exports.object = object;
class ObjectValidator {
    constructor(shape) {
        this._isOptional = false;
        this._shape = shape;
    }
    optional() {
        this._isOptional = true;
        return this;
    }
    withMessage(message) {
        this._message = message;
        return this;
    }
    validate(value) {
        const errors = [];
        if (value === undefined || value === null) {
            if (!this._isOptional)
                errors.push(this._message || 'Value is required');
        }
        else if (typeof value !== 'object' || Array.isArray(value)) {
            errors.push(this._message || 'Value must be an object');
        }
        else {
            for (const key in this._shape) {
                const validator = this._shape[key];
                const result = validator.validate(value[key]);
                if (!result.valid) {
                    errors.push(...result.errors.map(e => `${key}: ${e}`));
                }
            }
        }
        return { valid: errors.length === 0, errors };
    }
}
exports.ObjectValidator = ObjectValidator;
function object(shape) {
    return new ObjectValidator(shape);
}
