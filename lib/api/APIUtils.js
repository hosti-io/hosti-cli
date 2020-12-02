"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const tslib_1 = require("tslib");
const axios_1 = tslib_1.__importDefault(require("axios"));
const constants_1 = require("../constants");
axios_1.default.defaults.baseURL = constants_1.API_SERVER_URL;
axios_1.default.defaults.withCredentials = true;
axios_1.default.interceptors.request.use(function (config) {
    if (config.url != null && config.url.indexOf("/jwt-auth") == -1) {
        config.headers.Authorization = "";
    }
    return config;
});
exports.default = axios_1.default;
