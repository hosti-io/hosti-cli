import {ICliCommandsExecuter} from "./ICliCommandsExecuter";
import {ICliCommands} from "./ICliCommands";
import {InvalidRequestException} from "../errors/InvalidRequestException";
import {Answer, SupportedCommands} from "../types/answer-choise";
import {showError, showInfo} from "../utils/logger.util";

export class CliCommandsExecuter implements ICliCommandsExecuter {

    protected readonly cliCommands: ICliCommands;

    constructor(cliCommands: ICliCommands) {
        this.cliCommands = cliCommands;
    }

    async executeCommand(answer: Answer): Promise<void> {
        try {
            switch (answer.command) {
                case SupportedCommands.LIST_OF_SITES:
                    showInfo("Fetching site information...");
                    await this.cliCommands.getUserSites();
                    break;
                case SupportedCommands.LOG_OUT:
                    await this.cliCommands.logout();
                    break;
                case SupportedCommands.DEPLOY_SITE:
                    showInfo("Start site deployment preparation...");
                    showInfo(`Start project deploy from " ${answer.deployLocation} " location`);
                    await this.cliCommands.deploySite(answer.deployLocation, answer.deployProjectId);
                    break;
                default:
                    showError(`Command not found`);
                    process.exit(1);
                    break;
            }
        } catch (e) {
            if (e instanceof InvalidRequestException) {
                showError(e.toString());
            } else {
                showError("Command failed. Error: " + e.message);
                process.exit(2);
            }
        }
    }
}
