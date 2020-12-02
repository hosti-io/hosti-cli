import {IUserSite} from "../types";

export interface ISitesService {
    getUserSites(): Promise<IUserSite[]>;
}
