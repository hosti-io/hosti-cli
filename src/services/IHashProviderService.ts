import {IDeployFiles} from "../types";

export interface IHashProviderService {
    fileHash(file: File): Promise<string>;

    zipFileHashes(file: File): Promise<(IDeployFiles | undefined)[]>
}
