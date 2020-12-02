import {SupportedCommands} from "../types/answer-choise";

export interface ICliCommandsExecuter {
    executeCommand(command: SupportedCommands) : Promise<void>;
}
