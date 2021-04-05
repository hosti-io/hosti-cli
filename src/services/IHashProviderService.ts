import {IDeployFiles} from "../types";
import {Stream} from "stream";

export interface IHashProviderService {
    fileHash(file: string): Promise<string>;

    zipFileHashes(file: File): Promise<(IDeployFiles | undefined)[]>
}
