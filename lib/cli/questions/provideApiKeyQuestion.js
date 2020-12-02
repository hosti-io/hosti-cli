"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.provideApiKeyQuestion = void 0;
const tslib_1 = require("tslib");
const inquirer_1 = tslib_1.__importDefault(require("inquirer"));
function provideApiKeyQuestion() {
    return tslib_1.__awaiter(this, void 0, void 0, function* () {
        return inquirer_1.default.prompt([{
                name: "apiKey",
                type: 'input',
                message: "Please provide your API_KEY from hosti.io. Just visit your hosti.io dashboard -> profile and get the key here",
            }]);
    });
}
exports.provideApiKeyQuestion = provideApiKeyQuestion;
