import {ICliCommands} from "./ICliCommands";
import {siteService} from "../dependencyResultionFactory";
import {showError, showInfo, showListOfUserSites, showSuccess} from "../utils/logger.util";
import Configstore from "configstore";
import * as fs from 'fs';
import {promises as fsPromises} from 'fs';
import archiver from "archiver";
import {readConfigurationFile, writeConfigurationFile} from "../utils/deploy-utils";
import {IConfigurationFile} from "../types";
import {deploySite} from "../api/DeployAPI";

export class CliCommands implements ICliCommands {
    async getUserSites(): Promise<void> {
        let siteResult = await siteService.getUserSites();
        showListOfUserSites(siteResult);
    }


    async deploySite(location?: string, projectId?: string): Promise<void> {
        let configFile: IConfigurationFile | undefined = {
            projectId: projectId ?? ""
        };

        if (projectId == null) {
            configFile = await readConfigurationFile(location);
            if (configFile == null || configFile.projectId == null) {
                showError("You need to provide projectID via options or hosti.json file. Please read documentation.");
                process.exit(100);
                return;
            }
        }
        return new Promise(async (resolve, reject) => {
            if (configFile == null) {
                showError("You need to provide projectID via options or hosti.json file. Please read documentation.");
                process.exit(100);
                return;
            }
            try {
                if (await fs.existsSync(location + "/.hosti/")) {
                    await fs.rmdirSync(location + "/.hosti/", {recursive: true})
                }
                await fsPromises.mkdir(location + "/.hosti/");
                const output = fs.createWriteStream(location + "/.hosti/" + '/deploy.zip');
                const archive = archiver('zip', {
                    gzip: true,
                    gzipOptions: {
                        level: 9
                    }
                });
                output.on('close', async function () {
                    if (configFile == null)
                        return;
                    showInfo("Starting site uploading...");
                    const file = fs.createReadStream(location + "/.hosti/" + '/deploy.zip');
                    let result = await deploySite(configFile.projectId, file);
                    if (result.status == 200) {
                        showSuccess("Success deployment");
                        console.table(result.data);
                    } else {
                        showError("Something went wrong during deployment. Status Code:  " + result.status);
                        console.table(result.data)
                    }
                    resolve();
                });
                output.on('end', function () {
                    console.log('Data has been drained');
                    reject("Data has been drained");
                });
                archive.on('warning', function (err) {
                    if (err.code === 'ENOENT') {
                        showError("Files to deploy was not found...");
                        reject(err);
                    } else {
                        showError("Error during deployment: " + err);
                        reject(err);
                    }
                });
                archive.pipe(output);
                await archive.directory(location as string, false);
                await archive.finalize();
                await writeConfigurationFile(location, configFile);
            } finally {
                if (await fs.existsSync(location + "/.hosti/")) {
                    await fs.rmdirSync(location + "/.hosti/", {recursive: true})
                }
            }
        });
    }

    async logout(): Promise<void> {
        const config = new Configstore("hosti-cli");
        config.clear();
        showSuccess("Successful logout")
    }
}
