"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.cliCommand = exports.index = void 0;
const tslib_1 = require("tslib");
const dependencyResultionFactory_1 = require("./dependencyResultionFactory");
const logger_util_1 = require("./utils/logger.util");
const commandQuestion_1 = require("./cli/questions/commandQuestion");
const yargs_1 = tslib_1.__importDefault(require("yargs"));
const answer_choise_1 = require("./types/answer-choise");
const cli_utils_1 = require("./utils/cli-utils");
const deployQuestions_1 = require("./cli/questions/deployQuestions");
const deploy_utils_1 = require("./utils/deploy-utils");
function index() {
    return tslib_1.__awaiter(this, void 0, void 0, function* () {
        logger_util_1.showTitleAndBanner();
        yield cli_utils_1.checkAndSaveAuthInteractive();
        const selectedCommand = yield commandQuestion_1.getCommandQuestion();
        switch (selectedCommand.command) {
            case answer_choise_1.SupportedCommands.DEPLOY_SITE:
                selectedCommand.deployLocation = (yield deployQuestions_1.provideDeployLocation()).deployLocation;
                if ((yield deploy_utils_1.readConfigurationFile(selectedCommand.deployLocation)) == null) {
                    selectedCommand.deployProjectId = (yield deployQuestions_1.provideProjectId()).deployProjectId;
                }
                break;
        }
        yield dependencyResultionFactory_1.cliCommandsExecuter.executeCommand(selectedCommand);
    });
}
exports.index = index;
function cliCommand() {
    return tslib_1.__awaiter(this, void 0, void 0, function* () {
        let argv = yargs_1.default.options({
            apiKey: {
                alias: ['key', 'k'],
                description: 'Hosti API KEY',
            }
        }).command(['login'], "Login to Hosti", (yargs) => tslib_1.__awaiter(this, void 0, void 0, function* () {
            if (yargs.argv.apiKey == null) {
                console.error("Please pass API key via `-k` option");
                process.exit(1);
            }
            yield cli_utils_1.validateAuth(yargs.argv.apiKey);
            yield cli_utils_1.saveApiKey(yargs.argv.apiKey);
            logger_util_1.showSuccess("Login details saved");
        })).command(['logout'], "Logout and clear authorization information from machine", (yargs) => tslib_1.__awaiter(this, void 0, void 0, function* () {
            yield dependencyResultionFactory_1.cliCommandsExecuter.executeCommand({ command: answer_choise_1.SupportedCommands.LOG_OUT });
        })).command(['interactive', 'i'], "Run interactive mode", (yargs) => tslib_1.__awaiter(this, void 0, void 0, function* () {
            yield cli_utils_1.prepopulateEnv(yargs.argv);
            yield index();
        })).command(['sites'], "Get list of user sites", (yargs) => tslib_1.__awaiter(this, void 0, void 0, function* () {
            yield cli_utils_1.prepopulateEnv(yargs.argv);
            yield dependencyResultionFactory_1.cliCommandsExecuter.executeCommand({ command: answer_choise_1.SupportedCommands.LIST_OF_SITES });
        })).command({
            command: 'deploy',
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
            handler: function (argv) {
                return tslib_1.__awaiter(this, void 0, void 0, function* () {
                    yield cli_utils_1.prepopulateEnv(argv);
                    yield dependencyResultionFactory_1.cliCommandsExecuter.executeCommand({ command: answer_choise_1.SupportedCommands.DEPLOY_SITE, deployLocation: argv.location, deployProjectId: argv.projectId });
                });
            }
        })
            .demandCommand()
            .help()
            .wrap(72)
            .argv;
    });
}
exports.cliCommand = cliCommand;
