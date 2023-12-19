"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.SamtaegiError = void 0;
class SamtaegiError extends Error {
    constructor({ name, message, cause }) {
        super();
        this.name = name;
        this.message = message;
        this.cause = cause;
    }
}
exports.SamtaegiError = SamtaegiError;
