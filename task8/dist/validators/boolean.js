"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.BooleanValidator = void 0;
exports.boolean = boolean;
class BooleanValidator {
    constructor() {
        this._isOptional = false;
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
        else if (typeof value !== 'boolean') {
            errors.push(this._message || 'Value must be a boolean');
        }
        return { valid: errors.length === 0, errors };
    }
}
exports.BooleanValidator = BooleanValidator;
function boolean() {
    return new BooleanValidator();
}
