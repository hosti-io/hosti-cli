"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.authJWT = void 0;
const tslib_1 = require("tslib");
const APIUtils_1 = tslib_1.__importDefault(require("./APIUtils"));
function authJWT(token) {
    return APIUtils_1.default.get(`/jwt-auth`, { headers: {
            "Authorization": "Bearer " + token
        } });
}
exports.authJWT = authJWT;
