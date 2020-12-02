import {cliCommandsExecuter} from "./dependencyResultionFactory";
import {showError, showInfo, showSuccess, showTitleAndBanner} from "./utils/logger.util";
import {getCommandQuestion} from "./cli/questions/commandQuestion";
import {provideApiKeyQuestion} from "./cli/questions/provideApiKeyQuestion";
import {authJWT} from "./api/UserAPI";

export async function index(): Promise<void> {
    showTitleAndBanner();
    if (process.env.HOSTI_KEY == null) {
        const apiKey = await provideApiKeyQuestion();
        if (apiKey == null || apiKey.apiKey == null || apiKey.apiKey == "") {
            showError("You need to provide API_KEY for hosti.io first");
            process.exit(1);
        } else {
            showInfo("Fetching and validating auth information. Please wait...");
            let auth = await authJWT(apiKey.apiKey);
            if (auth == null || auth.status != 200) {
                showError("Please validate your api key first. Status code: " + auth?.status);
                process.exit(1);
            }
            showSuccess("Auth verified");
        }
    }
    const selectedCommand = await getCommandQuestion();
    await cliCommandsExecuter.executeCommand(selectedCommand.command);
}

index();
