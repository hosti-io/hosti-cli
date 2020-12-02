"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.InvalidRequestException = void 0;
class InvalidRequestException extends Error {
    constructor(statusCode, message) {
        super();
        this.toString = () => {
            return `Request failed with status code (${this.statusCode}) and error message: ${this.message}`;
        };
        this.message = message;
        this.statusCode = statusCode;
    }
}
exports.InvalidRequestException = InvalidRequestException;