"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.CliCommands = void 0;
const tslib_1 = require("tslib");
const dependencyResultionFactory_1 = require("../dependencyResultionFactory");
const logger_util_1 = require("../utils/logger.util");
const configstore_1 = tslib_1.__importDefault(require("configstore"));
const fs_1 = require("fs");
const fs = tslib_1.__importStar(require("fs"));
const archiver_1 = tslib_1.__importDefault(require("archiver"));
const deploy_utils_1 = require("../utils/deploy-utils");
const DeployAPI_1 = require("../api/DeployAPI");
class CliCommands {
    getUserSites() {
        return tslib_1.__awaiter(this, void 0, void 0, function* () {
            let siteResult = yield dependencyResultionFactory_1.siteService.getUserSites();
            logger_util_1.showListOfUserSites(siteResult);
        });
    }
    deploySite(location, projectId) {
        return tslib_1.__awaiter(this, void 0, void 0, function* () {
            let configFile = {
                projectId: projectId !== null && projectId !== void 0 ? projectId : ""
            };
            if (projectId == null) {
                configFile = yield deploy_utils_1.readConfigurationFile(location);
                if (configFile == null || configFile.projectId == null) {
                    logger_util_1.showError("You need to provide projectID via options or hosti.json file. Please read documentation.");
                    process.exit(100);
                    return;
                }
            }
            return new Promise((resolve, reject) => tslib_1.__awaiter(this, void 0, void 0, function* () {
                if (configFile == null) {
                    logger_util_1.showError("You need to provide projectID via options or hosti.json file. Please read documentation.");
                    process.exit(100);
                    return;
                }
                try {
                    if (yield fs.existsSync(location + "/.hosti/")) {
                        yield fs.rmdirSync(location + "/.hosti/", { recursive: true });
                    }
                    yield fs_1.promises.mkdir(location + "/.hosti/");
                    const output = fs.createWriteStream(location + "/.hosti/" + '/deploy.zip');
                    const archive = archiver_1.default('zip', {
                        gzip: true,
                        gzipOptions: {
                            level: 9
                        }
                    });
                    output.on('close', function () {
                        return tslib_1.__awaiter(this, void 0, void 0, function* () {
                            if (configFile == null)
                                return;
                            logger_util_1.showInfo("Starting site uploading...");
                            const file = fs.createReadStream(location + "/.hosti/" + '/deploy.zip');
                            let result = yield DeployAPI_1.deploySite(configFile.projectId, file);
                            if (result.status == 200) {
                                logger_util_1.showSuccess("Success deployment");
                                console.table(result.data);
                            }
                            else {
                                logger_util_1.showError("Something went wrong during deployment. Status Code:  " + result.status);
                                console.table(result.data);
                            }
                            resolve();
                        });
                    });
                    output.on('end', function () {
                        console.log('Data has been drained');
                        reject("Data has been drained");
                    });
                    archive.on('warning', function (err) {
                        if (err.code === 'ENOENT') {
                            logger_util_1.showError("Files to deploy was not found...");
                            reject(err);
                        }
                        else {
                            logger_util_1.showError("Error during deployment: " + err);
                            // throw error
                            reject(err);
                        }
                    });
                    archive.pipe(output);
                    yield archive.directory(location, false);
                    yield archive.finalize();
                    yield deploy_utils_1.writeConfigurationFile(location, configFile);
                }
                finally {
                    if (yield fs.existsSync(location + "/.hosti/")) {
                        yield fs.rmdirSync(location + "/.hosti/", { recursive: true });
                    }
                }
            }));
        });
    }
    logout() {
        return tslib_1.__awaiter(this, void 0, void 0, function* () {
            const config = new configstore_1.default("hosti-cli");
            config.clear();
            logger_util_1.showSuccess("Successful logout");
        });
    }
}
exports.CliCommands = CliCommands;
