import inquirer from "inquirer";
import {Answer, Choise, SupportedCommands} from "../../types/answer-choise";

export async function getCommandQuestion() : Promise<Answer> {
    const choices : Choise[] = [
        { name: "Get sites list", value: SupportedCommands.LIST_OF_SITES },
        { name: "Deploy new site", value: SupportedCommands.DEPLOY_SITE },
        { name: "Logout", value: SupportedCommands.DEPLOY_SITE },

    ];

    return inquirer.prompt([{
        name: "command",
        type: "list",
        message: "Select command",
        choices: choices
    }]);
}
