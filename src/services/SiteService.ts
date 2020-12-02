import {ISitesService} from "./ISitesService";
import {IUserSite} from "../types";
import {getUserSites} from "../api/SitesAPI";
import {InvalidRequestException} from "../errors/InvalidRequestException";

export class SiteService implements ISitesService {
    async getUserSites(): Promise<IUserSite[]> {
        let result = await getUserSites();
        if (result == null) {
            throw new InvalidRequestException(0, "unknown", "Request failed");
        }
        else if (result.status != 200) {
            throw new InvalidRequestException(result.status, result.statusText, JSON.stringify(result.data));
        }
        return result.data;
    }

}
