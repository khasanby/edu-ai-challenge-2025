"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ArrayValidator = void 0;
exports.array = array;
class ArrayValidator {
    constructor(validator) {
        this._isOptional = false;
        this._validator = validator;
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
        else if (!Array.isArray(value)) {
            errors.push(this._message || 'Value must be an array');
        }
        else {
            value.forEach((item, idx) => {
                const result = this._validator.validate(item);
                if (!result.valid) {
                    errors.push(...result.errors.map(e => `Index ${idx}: ${e}`));
                }
            });
        }
        return { valid: errors.length === 0, errors };
    }
}
exports.ArrayValidator = ArrayValidator;
function array(validator) {
    return new ArrayValidator(validator);
}
