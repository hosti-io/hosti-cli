import {ICompleteDeploySiteResponse, IUser} from "../types";

export interface IDeploySiteService {
    deployFolder(domain: string, folderPath: string, token?: string, user?: IUser, progress?: (progress: number) => void): Promise<ICompleteDeploySiteResponse>;
    deploySite(domain: string, archive: File, token?: string, user?: IUser, progress?: (progress: number) => void): Promise<ICompleteDeploySiteResponse>;
}