"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.validateAuth = exports.prepopulateEnv = exports.saveApiKey = exports.checkAndSaveAuthInteractive = void 0;
const tslib_1 = require("tslib");
const provideApiKeyQuestion_1 = require("../cli/questions/provideApiKeyQuestion");
const logger_util_1 = require("./logger.util");
const configstore_1 = tslib_1.__importDefault(require("configstore"));
const UserAPI_1 = require("../api/UserAPI");
function checkAndSaveAuthInteractive() {
    return tslib_1.__awaiter(this, void 0, void 0, function* () {
        const config = new configstore_1.default("hosti-cli");
        if (process.env.HOSTI_KEY == null && config.get("api-key") == null) {
            const apiKey = yield provideApiKeyQuestion_1.provideApiKeyQuestion();
            if (apiKey == null || apiKey.apiKey == null || apiKey.apiKey == "") {
                logger_util_1.showError("You need to provide API_KEY for hosti.io first");
                process.exit(1);
                return;
            }
            yield validateAuth(apiKey.apiKey);
            config.set("api-key", apiKey.apiKey);
        }
        else if (process.env.HOSTI_KEY == null) {
            process.env.HOSTI_KEY = config.get("api-key");
        }
    });
}
exports.checkAndSaveAuthInteractive = checkAndSaveAuthInteractive;
function saveApiKey(token) {
    return tslib_1.__awaiter(this, void 0, void 0, function* () {
        const config = new configstore_1.default("hosti-cli");
        config.set("api-key", token);
        process.env.HOSTI_KEY = token;
    });
}
exports.saveApiKey = saveApiKey;
function prepopulateEnv(argv) {
    return tslib_1.__awaiter(this, void 0, void 0, function* () {
        let tokenForAuth = argv != null ? argv.apiKey : process.env.HOSTI_KEY;
        if (tokenForAuth == null || tokenForAuth == "" || tokenForAuth.length < 5) {
            const config = new configstore_1.default("hosti-cli");
            tokenForAuth = config.get("api-key");
        }
        if (tokenForAuth == null) {
            logger_util_1.showError("Please provide API key for process");
            process.exit(1);
        }
        if (process.env.HOSTI_KEY == null || process.env.HOSTI_KEY == "" || process.env.HOSTI_KEY.length < 5) {
            process.env.HOSTI_KEY = tokenForAuth;
        }
    });
}
exports.prepopulateEnv = prepopulateEnv;
function validateAuth(key) {
    return tslib_1.__awaiter(this, void 0, void 0, function* () {
        logger_util_1.showInfo("Fetching and validating auth information. Please wait...");
        let auth = yield UserAPI_1.authJWT(key);
        if (auth == null || auth.status != 200) {
            logger_util_1.showError("Please validate your api key first. Status code: " + (auth === null || auth === void 0 ? void 0 : auth.status));
            process.exit(1);
        }
        logger_util_1.showSuccess("Auth verified");
    });
}
exports.validateAuth = validateAuth;
