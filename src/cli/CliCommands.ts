import {ICliCommands} from "./ICliCommands";
import {siteService} from "../dependencyResultionFactory";
import {showError, showInfo, showListOfUserSites, showSuccess} from "../utils/logger.util";
import Configstore from "configstore";
import {readConfigurationFile, writeConfigurationFile} from "../utils/deploy-utils";
import {IConfigurationFile} from "../types";
import {IHashProviderService} from "../services/IHashProviderService";
import {IDeploySiteService} from "../services/IDeploySiteService";
import {HashProviderService} from "../services/HashProviderService/HashProviderService";
import {DeploySiteService} from "../services/DeploySiteService/DeploySiteService";

export class CliCommands implements ICliCommands {

    protected hashProvider: IHashProviderService;
    protected deploySiteService: IDeploySiteService;

    constructor() {
        this.hashProvider = new HashProviderService();
        this.deploySiteService = new DeploySiteService(this.hashProvider);
    }


    async getUserSites(): Promise<void> {
        let siteResult = await siteService.getUserSites();
        showListOfUserSites(siteResult);
    }


    async deploySite(location?: string, projectId?: string, isSpaApplication?: boolean): Promise<void> {
        if (location == null) {
            showError("You need to provide path to the website that you want to deploy");
            return;
        }
        let configFile: IConfigurationFile | undefined = {
            projectId: projectId ?? ""
        };
        let formattedLocation = location;
        if (formattedLocation != "." && !formattedLocation.startsWith("/")){
            formattedLocation = "/" + formattedLocation;
        }
        if (formattedLocation != "." && formattedLocation.endsWith("/")) {
            formattedLocation = formattedLocation.slice(0, formattedLocation.length - 1);
        }
        if (projectId == null) {
            configFile = await readConfigurationFile(formattedLocation);
            if (configFile == null || configFile.projectId == null) {
                showError("You need to provide projectId via options or hosti.json file. Please read documentation.");
                process.exit(100);
                return;
            } else {
                showInfo("Deploy folder to the " + configFile.projectId + " project. ProjectId fetched from hosti.json config file");
            }
        } else {
            showInfo("Deploy folder to the " + projectId + " project");
        }

        return new Promise(async (resolve, reject) => {
            if (configFile == null) {
                showError("You need to provide projectId via options or hosti.json file. Please read documentation.");
                process.exit(100);
                return;
            }
            try {
                showInfo("Start website uploading: " + formattedLocation);

                await this.deploySiteService.deployFolder(configFile.projectId,  formattedLocation, isSpaApplication ?? false,  undefined, undefined, (progress) => {
                    showInfo("Upload progress: " + progress + "%");
                });
                await writeConfigurationFile(location, configFile);

                showSuccess("Complete site uploading. Website will be live shortly");
                showSuccess("URL: https://" + configFile.projectId + ".hosti.site/");

            }
            catch (e) {
                showError("Failed site deployment with unexpected error");
                if (e != null) {
                    showError(e);
                    showError(e.stack);
                }
            }
            finally {

            }
        });
    }

    async logout(): Promise<void> {
        const config = new Configstore("hosti-cli");
        config.clear();
        showSuccess("Successful logout")
    }
}
