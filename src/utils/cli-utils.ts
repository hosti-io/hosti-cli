import {provideApiKeyQuestion} from "../cli/questions/provideApiKeyQuestion";
import {showError, showInfo, showSuccess} from "./logger.util";
import Configstore from "configstore";
import {authJWT} from "../api/UserAPI";
import {Arguments, Argv} from "yargs";
import {red} from "kleur";
import {ConsoleMessage} from "../types/console-message";

export async function checkAndSaveAuthInteractive() : Promise<void> {
    const config = new Configstore("hosti-cli");
    if (process.env.HOSTI_KEY == null && config.get("api-key") == null) {
        const apiKey = await provideApiKeyQuestion();
        if (apiKey == null || apiKey.apiKey == null || apiKey.apiKey == "") {
            showError("You need to provide API_KEY for hosti.io first");
            process.exit(1);
            return;
        }
        await validateAuth(apiKey.apiKey);
        config.set("api-key", apiKey.apiKey);
    } else if (process.env.HOSTI_KEY == null) {
        process.env.HOSTI_KEY = config.get("api-key");
    }
}

export async function saveApiKey(token: string) {
    const config = new Configstore("hosti-cli");
    config.set("api-key", token);
    process.env.HOSTI_KEY = token;
}

export async function prepopulateEnv (argv: { [key in keyof Arguments<any>]: Arguments<any>[key] }) {
    let tokenForAuth = argv != null ? argv.apiKey as string : process.env.HOSTI_KEY;
    if (tokenForAuth == null || tokenForAuth == "" || tokenForAuth.length < 5) {
        const config = new Configstore("hosti-cli");
        tokenForAuth = config.get("api-key");
    }
    if (tokenForAuth == null) {
        showError("Please provide API key for process");
        process.exit(1);
    }
    if (process.env.HOSTI_KEY == null || process.env.HOSTI_KEY == "" || process.env.HOSTI_KEY.length < 5) {
        process.env.HOSTI_KEY = tokenForAuth;
    }
}

export async function validateAuth(key: string) : Promise<void> {
    showInfo("Fetching and validating auth information. Please wait...");
    let auth = await authJWT(key);
    if (auth == null || auth.status != 200) {
        showError("Please validate your api key first. Status code: " + auth?.status);
        process.exit(1);
    }
    showSuccess("Auth verified");
}
