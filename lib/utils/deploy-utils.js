"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.writeConfigurationFile = exports.readConfigurationFile = void 0;
const tslib_1 = require("tslib");
const fs_1 = require("fs");
function readConfigurationFile(deployLocation) {
    return tslib_1.__awaiter(this, void 0, void 0, function* () {
        try {
            if (yield fs_1.promises.stat(deployLocation + "/hosti.json")) {
                let file = yield fs_1.promises.readFile(deployLocation + "/hosti.json", { encoding: "utf8" });
                return JSON.parse(file);
            }
            return undefined;
        }
        catch (e) {
            return undefined;
        }
    });
}
exports.readConfigurationFile = readConfigurationFile;
function writeConfigurationFile(deployLocation, config) {
    return tslib_1.__awaiter(this, void 0, void 0, function* () {
        yield fs_1.promises.writeFile(deployLocation + "/hosti.json", JSON.stringify(config, null, 4), { encoding: "utf8" });
    });
}
exports.writeConfigurationFile = writeConfigurationFile;
