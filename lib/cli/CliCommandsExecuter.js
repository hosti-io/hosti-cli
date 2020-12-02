"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.CliCommandsExecuter = void 0;
const tslib_1 = require("tslib");
const InvalidRequestException_1 = require("../errors/InvalidRequestException");
const answer_choise_1 = require("../types/answer-choise");
class CliCommandsExecuter {
    constructor(cliCommands) {
        this.cliCommands = cliCommands;
    }
    executeCommand(command) {
        return tslib_1.__awaiter(this, void 0, void 0, function* () {
            try {
                console.log(command);
                switch (command) {
                    case answer_choise_1.SupportedCommands.LIST_OF_SITES:
                        console.log('test');
                        yield this.cliCommands.getUserSites();
                        break;
                    default:
                        console.log(`Command not found`);
                        process.exit(1);
                        break;
                }
            }
            catch (e) {
                if (e instanceof InvalidRequestException_1.InvalidRequestException) {
                    console.error(e.toString());
                }
                else {
                    console.error("Command failed. Error: " + e.message);
                    process.exit(2);
                }
            }
        });
    }
}
exports.CliCommandsExecuter = CliCommandsExecuter;
