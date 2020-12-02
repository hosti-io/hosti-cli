import {Answer} from "../../types/answer-choise";
import inquirer from "inquirer";

export async function provideDeployLocation(): Promise<Answer> {
    return inquirer.prompt([{
        name: "deployLocation",
        type: 'input',
        default: process.cwd(),
        message: "Please provide the path to the site directory or press ENTER to select current location: ",
    }]);
}

export async function provideProjectId(): Promise<Answer> {
    return inquirer.prompt([{
        name: "deployProjectId",
        type: 'input',
        message: "Please enter current or new ProjectID from hosti (Project id is `hosti.site` subdomain, for example `{projectId}.hosti.site`): ",
    }]);
}
