import {IHashProviderService} from "../IHashProviderService";
import * as crypto from "crypto";
import {IDeployFiles} from "../../types";
import JSZip from "jszip";

export class HashProviderService implements IHashProviderService {

    protected algoritm: string;

    constructor() {
        this.algoritm = "sha256";
    }

    fileHash(file: File): Promise<string> {

        const hash = crypto.createHash(this.algoritm);
        return new Promise((resolve, reject) => {
            const fileReader = new FileReader();
            const chunkSize = 2097152;
            const chunks = Math.ceil(file.size / chunkSize);
            let currentChunk = 0;

            fileReader.onload = event => {
                if (event.target == null) {
                    return reject("File read error");
                }
                let buffer = new Uint8Array(event.target.result as ArrayBuffer);
                hash.update(buffer);
                ++currentChunk;
                currentChunk < chunks ? loadNext() : resolve(hash.digest("hex").toString()) // Compute hash
            };

            fileReader.onerror = () => reject(fileReader.error);

            const loadNext = () => {
                const start = currentChunk * chunkSize;
                const end = start + chunkSize >= file.size ? file.size : start + chunkSize;
                fileReader.readAsArrayBuffer(File.prototype.slice.call(file, start, end))
            };
            loadNext()
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
        let fileData = await zipEntry.async("blob");
        let file = new File([fileData], zipEntry.name);
        let deployFile = {
            name: relativePath,
            hash: await this.fileHash(file)
        };
        return deployFile;
    }


}
