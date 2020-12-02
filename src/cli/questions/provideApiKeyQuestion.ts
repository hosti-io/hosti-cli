import inquirer from "inquirer";
import {Answer, Choise, SupportedCommands} from "../../types/answer-choise";

export async function provideApiKeyQuestion() : Promise<Answer> {
    return inquirer.prompt([{
        name: "apiKey",
        type: 'input',
        message: "Please provide your API_KEY from hosti.io. Just visit your hosti.io dashboard -> profile and get the key here",
    }]);
}
