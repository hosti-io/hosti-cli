import {Answer} from "../types/answer-choise";

export interface ICliCommandsExecuter {
    executeCommand(command: Answer) : Promise<void>;
}
