import inquirer from "inquirer";
import {Answer, Choise, SupportedCommands} from "../../types/answer-choise";

export async function getCommandQuestion() : Promise<Answer> {
    const choices : Choise[] = [
        { name: "Get sites list", value: SupportedCommands.LIST_OF_SITES },
        { name: "Create new site", value: SupportedCommands.DEPLOY_NEW_SITE },
        { name: "Update exist site", value: SupportedCommands.UPDATE_SITE },
        { name: "Update or create site", value: SupportedCommands.DEPLOY_OR_UPDATE_SITE },
    ];

    return inquirer.prompt([{
        name: "command",
        type: "list",
        message: "Select command",
        choices: choices
    }]);
}
