import {IDeploySiteService} from "../IDeploySiteService";
import {ICompleteDeploySiteResponse, IDeployFiles, IDeploySite, IFilesSignedUrls, IUser} from "../../types";
import {IHashProviderService} from "../IHashProviderService";
import JSZip from "jszip";
import {completeDeploySiteRequest, deploySiteRequest, uploadFileToStorage} from "../../api/DeployAPI";
import mime from "mime";
import {glob} from "glob";
import path from "path";
import * as fs from "fs";
import {showInfo} from "../../utils/logger.util";

export class DeploySiteService implements IDeploySiteService {

    hashProviderService: IHashProviderService;

    constructor(hashProviderService: IHashProviderService) {
        this.hashProviderService = hashProviderService;
    }

    async deploySite(domain: string, archive: File, token?: string, user?: IUser, progress?: (progress: number) => void): Promise<ICompleteDeploySiteResponse> {
        const deployRequest = await this.getDeployParams(domain, archive);
        if (deployRequest == null)
            throw new Error("Invalid deploy params");

        if (deployRequest.files == null || deployRequest.files.length == 0) {
            throw new Error("No files to upload selected. Please verify input first");
        }

        if (token != null && user == null) {
            deployRequest.token = token;
        }
        const result = await deploySiteRequest(deployRequest);

        if (result.data == null || result.status < 200 || result.status > 300)
            throw new Error("Deployment failed. Please try again later");

        const promises = new Array<Promise<boolean>>();

        if (result.data.filesToUpload.length == 0) {
            showInfo("Nothing for upload");
        } else {
            for (const file of result.data.filesToUpload) {
                const originalFile = deployRequest.files.find((arg) => arg.hash === file.hash);
                if (originalFile == null)
                    throw Error("Upload file not found.");
                const result = uploadFileToStorage(originalFile.name, file.url, file.contentType);
                promises.push(result);
            }
        }

        if (progress != null) {
            await this.allProgress(promises, progress);
        } else {
            await Promise.all(promises);
        }

        const completeResult = {
            deploymentId: result.data.deploymentId,
            domain: deployRequest.domain,
            token: token,
            updatedFiles: result.data.filesToUpload.map((arg: IFilesSignedUrls) => {
                return {name: arg.file, hash: arg.hash, contentType: arg.contentType}
            }),
            deploymentFiles: deployRequest.files
        };
        const deploymentResult = await completeDeploySiteRequest(completeResult)
        return deploymentResult.data;
    }

    allProgress(proms: Array<Promise<boolean>>, progress_cb: (progress: number) => void) {
        let d = 0;
        progress_cb(0);
        if (proms.length === 0) {
            progress_cb(100);
        }
        for (const p of proms) {
            // eslint-disable-next-line no-loop-func
            p.then(() => {
                d++;
                progress_cb(Math.round((d * 100) / proms.length));
            });
        }
        return Promise.all(proms);
    }


    async processZipFile(zipEntry: JSZip.JSZipObject, relativePath: string, name: string): Promise<IDeployFiles> {
        let fileData = await zipEntry.async("blob");
        let file = new File([fileData], zipEntry.name);
        let deployFile = {
            name: relativePath,
            fileInstance: file,
            contentType: mime.getType(name) as string,
            hash: await this.hashProviderService.fileHash(relativePath)
        };
        return deployFile;
    }

    async processSingleFile(file: File, relativePath: string, name: string): Promise<IDeployFiles> {
        let deployFile = {
            name: relativePath,
            fileInstance: file,
            contentType: mime.getType(name) as string,
            hash: await this.hashProviderService.fileHash(relativePath)
        };
        return deployFile;
    }


    async getDeployParamsForFolder(domain: string, folder: string): Promise<IDeploySite | null> {
        let filesToDeploy = await this.getDeployFilesInFolder(folder);
        if (filesToDeploy == null)
            return null;
        let result = {
            domain: domain,
            files: filesToDeploy as IDeployFiles[]
        }
        return result;
    }

    async getDeployParams(domain: string, archive: File): Promise<IDeploySite | null> {
        let filesToDeploy = await this.getDeployFiles(archive);
        if (filesToDeploy == null)
            return null;
        let result = {
            domain: domain,
            files: filesToDeploy as IDeployFiles[]
        }
        return result;
    }

    getDeployFilesInFolder(folder: string): Promise<(IDeployFiles | undefined)[]> {
        return new Promise((async (resolve, reject) => {
            const promises = Array<Promise<IDeployFiles | undefined>>();
            glob(folder + "/**/*", {  mark: true, nodir: true }, async (err, res) => {
                if (err) {
                    console.error("Error during fetching files in the folder", err.message);
                    return reject(err);
                }
                for (let file of res) {
                    promises.push(this.checkAccessAndReturnFilePromise(file));
                }
                const result = await Promise.all(promises);
                if (result != null && result.length > 0) {
                    resolve(result.filter((arg) => arg != undefined));
                } else {
                    reject("No files for deployment")
                }
            });
        }));
    }


    async checkAccessAndReturnFilePromise(file: string) : Promise<IDeployFiles | undefined> {
        return new Promise((resolve, reject) => {
            fs.access(file, fs.constants.R_OK, (err) => {
                if (err) {
                    console.warn("Not able to read the file. Ignore this file for deployment: " + file);
                    resolve(undefined);
                } else {
                    resolve(this.getDeployParamsForFile(file))
                }
            });
        });
    }

    async getDeployParamsForFile(filePath: string) : Promise<IDeployFiles | undefined> {
        const fileName = path.basename(filePath);
        let deployFile = {
            name: filePath,
            contentType: mime.getType(fileName) as string,
            hash: await this.hashProviderService.fileHash(filePath)
        };
        return deployFile;
    }

    async getDeployFiles(archive: File): Promise<(IDeployFiles | undefined)[]> {
        switch (archive.type) {
            case "text/html":
                return this.getDeployedIndex(archive)
            default:
                return this.getDeployedZip(archive)
        }
    }

    async getDeployedIndex(archive: File) : Promise<(IDeployFiles | undefined)[]> {
        let array: (IDeployFiles | undefined)[] = [];
        let indexFile = await this.processSingleFile(archive, "index.html", "index.html");
        array.push(indexFile);
        return array;
    }

    getDeployedZip(archive: File) : Promise<(IDeployFiles | undefined)[]> {
        return new Promise(((resolve, reject) => {
            const promises = Array<Promise<IDeployFiles | undefined>>();
            JSZip.loadAsync(archive).then(async (zip) => {
                zip.forEach((relativePath, zipEntry) => {
                    if (zipEntry.dir)
                        return;
                    promises.push(this.processZipFile(zipEntry, relativePath, zipEntry.name));
                });
                const result = await Promise.all(promises);
                resolve(result);
            });
        }));
    }
    async deployFolder(domain: string, folderPath: string, token?: string, user?: IUser, progress?: (progress: number) => void): Promise<ICompleteDeploySiteResponse> {
        const deployRequest = await this.getDeployParamsForFolder(domain, folderPath);
        if (deployRequest == null)
            throw new Error("Invalid deploy params");

        if (token != null && user == null) {
            deployRequest.token = token;
        }
        const result = await deploySiteRequest(deployRequest);
        if (result.data == null || result.status < 200 || result.status > 300)
            throw new Error("Deployment failed. Please try again later. Error message: " + result.data);

        const promises = new Array<Promise<boolean>>();
        for (const file of result.data.filesToUpload) {
            const originalFile = deployRequest.files.find((arg) => arg.hash === file.hash);
            if (originalFile == null)
                throw Error("Upload file not found.");
            const result = uploadFileToStorage(originalFile.name, file.url, file.contentType);
            promises.push(result);
        }

        if (progress != null) {
            await this.allProgress(promises, progress);
        } else {
            await Promise.all(promises);
        }

        const completeResult = {
            deploymentId: result.data.deploymentId,
            domain: deployRequest.domain,
            token: token,
            updatedFiles: result.data.filesToUpload.map((arg: IFilesSignedUrls) => {
                return {name: arg.file, hash: arg.hash, contentType: arg.contentType}
            }),
            deploymentFiles: deployRequest.files
        };
        const deploymentResult = await completeDeploySiteRequest(completeResult)
        return deploymentResult.data;
    }
}