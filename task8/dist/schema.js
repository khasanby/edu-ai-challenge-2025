"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Schema = void 0;
const string_1 = require("./validators/string");
const number_1 = require("./validators/number");
const boolean_1 = require("./validators/boolean");
const date_1 = require("./validators/date");
const object_1 = require("./validators/object");
const array_1 = require("./validators/array");
exports.Schema = {
    string: string_1.string,
    number: number_1.number,
    boolean: boolean_1.boolean,
    date: date_1.date,
    object: object_1.object,
    array: array_1.array,
};
exports.default = exports.Schema;
