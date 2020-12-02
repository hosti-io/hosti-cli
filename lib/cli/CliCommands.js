"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.CliCommands = void 0;
const tslib_1 = require("tslib");
const dependencyResultionFactory_1 = require("../dependencyResultionFactory");
const logger_util_1 = require("../utils/logger.util");
class CliCommands {
    getUserSites() {
        return tslib_1.__awaiter(this, void 0, void 0, function* () {
            let siteResult = yield dependencyResultionFactory_1.siteService.getUserSites();
            logger_util_1.showListOfUserSites(siteResult);
        });
    }
}
exports.CliCommands = CliCommands;
