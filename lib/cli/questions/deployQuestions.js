"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.provideProjectId = exports.provideDeployLocation = void 0;
const tslib_1 = require("tslib");
const inquirer_1 = tslib_1.__importDefault(require("inquirer"));
function provideDeployLocation() {
    return tslib_1.__awaiter(this, void 0, void 0, function* () {
        return inquirer_1.default.prompt([{
                name: "deployLocation",
                type: 'input',
                default: process.cwd(),
                message: "Please provide the path to the site directory or press ENTER to select current location.",
            }]);
    });
}
exports.provideDeployLocation = provideDeployLocation;
function provideProjectId() {
    return tslib_1.__awaiter(this, void 0, void 0, function* () {
        return inquirer_1.default.prompt([{
                name: "deployProjectId",
                type: 'input',
                message: "Please enter current or new ProjectID from hosti (Project id is `hosti.site` subdomain, for example `{projectId}.hosti.site`)",
            }]);
    });
}
exports.provideProjectId = provideProjectId;
