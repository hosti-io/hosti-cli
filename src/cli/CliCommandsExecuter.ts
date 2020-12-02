import {ICliCommandsExecuter} from "./ICliCommandsExecuter";
import {ICliCommands} from "./ICliCommands";
import {InvalidRequestException} from "../errors/InvalidRequestException";
import {SupportedCommands} from "../types/answer-choise";

export class CliCommandsExecuter implements ICliCommandsExecuter {

    protected readonly cliCommands: ICliCommands;

    constructor(cliCommands: ICliCommands) {
        this.cliCommands = cliCommands;
    }

    async executeCommand(command: SupportedCommands): Promise<void> {
        try {
            console.log(command);
            switch (command) {
                case SupportedCommands.LIST_OF_SITES:
                    console.log('test');
                    await this.cliCommands.getUserSites();
                    break;
                default:
                    console.log(`Command not found`);
                    process.exit(1);
                    break;
            }
        }
        catch (e) {
            if(e instanceof InvalidRequestException) {
                console.error(e.toString());
            } else {
                console.error("Command failed. Error: " + e.message);
                process.exit(2);
            }
        }
    }
}
