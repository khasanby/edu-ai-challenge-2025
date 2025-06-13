"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Schema = void 0;
const string_1 = require("./string");
const number_1 = require("./number");
const boolean_1 = require("./boolean");
const date_1 = require("./date");
const object_1 = require("./object");
const array_1 = require("./array");
exports.Schema = {
    string: () => new string_1.StringValidator(),
    number: () => new number_1.NumberValidator(),
    boolean: () => new boolean_1.BooleanValidator(),
    date: () => new date_1.DateValidator(),
    object: (shape) => new object_1.ObjectValidator(shape),
    array: (validator) => new array_1.ArrayValidator(validator)
};
