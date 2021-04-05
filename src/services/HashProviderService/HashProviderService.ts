import {IHashProviderService} from "../IHashProviderService";
import * as crypto from "crypto";
import {IDeployFiles} from "../../types";
import JSZip from "jszip";
import {Stream} from "stream";
import fs from "fs";

export class HashProviderService implements IHashProviderService {

    protected algoritm: string;

    constructor() {
        this.algoritm = "sha256";
    }

    fileHash(file: string): Promise<string> {
        const hash = crypto.createHash(this.algoritm);
        return new Promise((resolve, reject) => {
            const input = fs.createReadStream(file);
            input.on('error', reject);
            input.on('data', function (chunk) {
                hash.update(chunk);
            });
            input.on('close', function () {
                resolve(hash.digest('hex'));
            });
        });
    }

    zipFileHashes(file: File): Promise<(IDeployFiles | undefined)[]> {
        return new Promise(((resolve, reject) => {
            const promises = Array<Promise<IDeployFiles | undefined>>();
            JSZip.loadAsync(file).then(async (zip) => {
                zip.forEach((relativePath, zipEntry) => {
                    if (zipEntry.dir)
                        return;
                    promises.push(this.processFile(zipEntry, relativePath));
                });
                const result = await Promise.all(promises);
                resolve(result);
            });
        }));
    }

    async processFile(zipEntry: JSZip.JSZipObject, relativePath: string): Promise<IDeployFiles> {
        let deployFile = {
            name: relativePath,
            hash: await this.fileHash(relativePath)
        };
        return deployFile;
    }


}
