"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.StringValidator = void 0;
exports.string = string;
class StringValidator {
    constructor() {
        this._isOptional = false;
    }
    optional() {
        this._isOptional = true;
        return this;
    }
    minLength(length) {
        this._minLength = length;
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
        else if (typeof value !== 'string') {
            errors.push(this._message || 'Value must be a string');
        }
        else {
            if (this._minLength !== undefined && value.length < this._minLength) {
                errors.push(this._message || `Minimum length is ${this._minLength}`);
            }
        }
        return { valid: errors.length === 0, errors };
    }
}
exports.StringValidator = StringValidator;
function string() {
    return new StringValidator();
}
