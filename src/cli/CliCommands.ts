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
import streamBuffers from 'stream-buffers';

export class CliCommands implements ICliCommands {
    async getUserSites(): Promise<void> {
        let siteResult = await siteService.getUserSites();
        showListOfUserSites(siteResult);
    }


    async deploySite(location?: string, projectId?: string): Promise<void> {
        if (location == null) {
            showError("You need to provide path to the website that you want to deploy");
            return;
        }
        let configFile: IConfigurationFile | undefined = {
            projectId: projectId ?? ""
        };
        let formattedLocation = location;
        if (!formattedLocation.startsWith("/")){
            formattedLocation = "./" + formattedLocation;
        }
        if (formattedLocation.endsWith("/")) {
            formattedLocation = formattedLocation.slice(0, formattedLocation.length - 1);
        }
        if (projectId == null) {
            configFile = await readConfigurationFile(formattedLocation);
            if (configFile == null || configFile.projectId == null) {
                showError("You need to provide projectId via options or hosti.json file. Please read documentation.");
                process.exit(100);
                return;
            }
        }
        return new Promise(async (resolve, reject) => {
            if (configFile == null) {
                showError("You need to provide projectId via options or hosti.json file. Please read documentation.");
                process.exit(100);
                return;
            }
            try {
                let outputStreamBuffer = new streamBuffers.WritableStreamBuffer({
                    initialSize: (1000 * 1024),   // start at 1000 kilobytes.
                    incrementAmount: (1000 * 1024) // grow by 1000 kilobytes each time buffer overflows.
                });
                const archive = archiver('zip', {
                    gzip: true,
                    gzipOptions: {
                        level: 9
                    }
                });
                outputStreamBuffer.on('finish', async function () {
                    if (configFile == null)
                        return;
                    showInfo("Starting site uploading...");

                    let result = await deploySite(configFile.projectId, outputStreamBuffer.getContents() as Buffer);
                    if (result.status == 200) {
                        showSuccess("Success deployment");
                        console.table(result.data);
                    } else {
                        showError("Something went wrong during deployment. Status Code:  " + result.status);
                        console.table(result.data)
                    }
                    resolve();
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
                archive.pipe(outputStreamBuffer);
                await archive.directory((location as string) + "/", false);
                await archive.finalize();
                await writeConfigurationFile(location, configFile);
            } finally {
                //if (await fs.existsSync(location + "/.hosti/")) {
                //    await fs.rmdirSync(location + "/.hosti/", {recursive: true})
               // }
            }
        });
    }

    async logout(): Promise<void> {
        const config = new Configstore("hosti-cli");
        config.clear();
        showSuccess("Successful logout")
    }
}
