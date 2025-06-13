"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.NumberValidator = void 0;
exports.number = number;
class NumberValidator {
    constructor() {
        this._isOptional = false;
    }
    optional() {
        this._isOptional = true;
        return this;
    }
    min(min) {
        this._min = min;
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
        else if (typeof value !== 'number' || isNaN(value)) {
            errors.push(this._message || 'Value must be a number');
        }
        else {
            if (this._min !== undefined && value < this._min) {
                errors.push(this._message || `Minimum value is ${this._min}`);
            }
        }
        return { valid: errors.length === 0, errors };
    }
}
exports.NumberValidator = NumberValidator;
function number() {
    return new NumberValidator();
}
