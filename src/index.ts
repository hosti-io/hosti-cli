import {cliCommandsExecuter} from "./dependencyResultionFactory";
import {showError, showSuccess, showTitleAndBanner} from "./utils/logger.util";
import {getCommandQuestion} from "./cli/questions/commandQuestion";
import yargs, {Argv} from "yargs";
import {SupportedCommands} from "./types/answer-choise";
import {checkAndSaveAuthInteractive, prepopulateEnv, saveApiKey, validateAuth} from "./utils/cli-utils";
import {provideDeployLocation, provideProjectId} from "./cli/questions/deployQuestions";
import {readConfigurationFile} from "./utils/deploy-utils";


export async function index(): Promise<void> {
    showTitleAndBanner();
    await checkAndSaveAuthInteractive();
    const selectedCommand = await getCommandQuestion();
    switch (selectedCommand.command) {
        case SupportedCommands.DEPLOY_SITE:
            selectedCommand.deployLocation = (await provideDeployLocation()).deployLocation;
            if (await readConfigurationFile(selectedCommand.deployLocation) == null) {
                selectedCommand.deployProjectId = (await provideProjectId()).deployProjectId;
            }
            break;
    }
    await cliCommandsExecuter.executeCommand(selectedCommand);
}

export async function cliCommand(defaultDeployCommand?: boolean) {
    let argv = yargs.options({
        apiKey: {
            alias: ['key', 'k'],
            description: 'Hosti API KEY',
        }
    }).command(['login'], "Login to Hosti", async (yargs: Argv) => {
        if (yargs.argv.apiKey as string == null) {
            showError("Please pass API key via `-k` option");
            process.exit(1);
        }
        await validateAuth(yargs.argv.apiKey as string);
        await saveApiKey(yargs.argv.apiKey as string);
        showSuccess("Login details saved");
    }).command(['logout'], "Logout and clear authorization information from machine", async (yargs: Argv) => {
        await cliCommandsExecuter.executeCommand({command: SupportedCommands.LOG_OUT});
    }).command(['interactive', 'i'], "Run interactive mode", async (yargs: Argv) => {
        await prepopulateEnv(yargs.argv);
        await index();
    }).command(['sites'], "Get list of user sites", async (yargs: Argv) => {
        await prepopulateEnv(yargs.argv);
        await cliCommandsExecuter.executeCommand({command: SupportedCommands.LIST_OF_SITES});
    }).command({
        command: defaultDeployCommand === true ? ['deploy', '$0'] : ['deploy'] ,
        describe: 'Deploy new site',
        builder: {
            location: {
                describe: 'older or file location for deploy',
                type: 'string',
                default: process.cwd()
            },
            projectId: {
                describe: 'Project id on hosti',
                type: 'string'
            }
        },
        handler: async function (argv) {
            await prepopulateEnv(argv);
            await cliCommandsExecuter.executeCommand({
                command: SupportedCommands.DEPLOY_SITE,
                deployLocation: argv.location as string,
                deployProjectId: argv.projectId as string
            });
        }
    })
        .demandCommand()
        .help()
        .wrap(72)
        .argv;
}
