import {ICliCommands} from "./ICliCommands";
import { siteService } from "../dependencyResultionFactory";
import {showListOfUserSites} from "../utils/logger.util";

export class CliCommands implements ICliCommands {
    async getUserSites(): Promise<void> {
        let siteResult = await siteService.getUserSites();
        showListOfUserSites(siteResult);
    }
}
