"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.DateValidator = void 0;
exports.date = date;
class DateValidator {
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
        else if (!(value instanceof Date) || isNaN(value.getTime())) {
            errors.push(this._message || 'Value must be a valid Date');
        }
        return { valid: errors.length === 0, errors };
    }
}
exports.DateValidator = DateValidator;
function date() {
    return new DateValidator();
}
