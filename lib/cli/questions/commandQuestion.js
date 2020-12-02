"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getCommandQuestion = void 0;
const tslib_1 = require("tslib");
const inquirer_1 = tslib_1.__importDefault(require("inquirer"));
const answer_choise_1 = require("../../types/answer-choise");
function getCommandQuestion() {
    return tslib_1.__awaiter(this, void 0, void 0, function* () {
        const choices = [
            { name: "Get sites list", value: answer_choise_1.SupportedCommands.LIST_OF_SITES },
            { name: "Deploy new site", value: answer_choise_1.SupportedCommands.DEPLOY_SITE },
            { name: "Logout", value: answer_choise_1.SupportedCommands.DEPLOY_SITE },
        ];
        return inquirer_1.default.prompt([{
                name: "command",
                type: "list",
                message: "Select command",
                choices: choices
            }]);
    });
}
exports.getCommandQuestion = getCommandQuestion;
