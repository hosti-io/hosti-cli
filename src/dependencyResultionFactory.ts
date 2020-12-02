//simple implementation to handle dependencies betweenObjects.
import {SiteService} from "./services/SiteService";
import {ISitesService} from "./services/ISitesService";
import {ICliCommands} from "./cli/ICliCommands";
import {CliCommands} from "./cli/CliCommands";
import {ICliCommandsExecuter} from "./cli/ICliCommandsExecuter";
import {CliCommandsExecuter} from "./cli/CliCommandsExecuter";

export const siteService : ISitesService = new SiteService();
export const cliCommands : ICliCommands = new CliCommands();
export const cliCommandsExecuter : ICliCommandsExecuter = new CliCommandsExecuter(cliCommands);
