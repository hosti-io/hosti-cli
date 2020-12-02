"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.index = void 0;
const tslib_1 = require("tslib");
const dependencyResultionFactory_1 = require("./dependencyResultionFactory");
const logger_util_1 = require("./utils/logger.util");
const commandQuestion_1 = require("./cli/questions/commandQuestion");
const provideApiKeyQuestion_1 = require("./cli/questions/provideApiKeyQuestion");
const UserAPI_1 = require("./api/UserAPI");
function index() {
    return tslib_1.__awaiter(this, void 0, void 0, function* () {
        logger_util_1.showTitleAndBanner();
        if (process.env.HOSTI_KEY == null) {
            const apiKey = yield provideApiKeyQuestion_1.provideApiKeyQuestion();
            if (apiKey == null || apiKey.apiKey == null || apiKey.apiKey == "") {
                logger_util_1.showError("You need to provide API_KEY for hosti.io first");
                process.exit(1);
            }
            else {
                logger_util_1.showInfo("Fetching and validating auth information. Please wait...");
                let auth = yield UserAPI_1.authJWT(apiKey.apiKey);
                if (auth == null || auth.status != 200) {
                    logger_util_1.showError("Please validate your api key first. Status code: " + (auth === null || auth === void 0 ? void 0 : auth.status));
                    process.exit(1);
                }
            }
        }
        const selectedCommand = yield commandQuestion_1.getCommandQuestion();
        yield dependencyResultionFactory_1.cliCommandsExecuter.executeCommand(selectedCommand.command);
    });
}
exports.index = index;
index();
