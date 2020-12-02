"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.cliCommandsExecuter = exports.cliCommands = exports.siteService = void 0;
//simple implementation to handle dependencies betweenObjects.
const SiteService_1 = require("./services/SiteService");
const CliCommands_1 = require("./cli/CliCommands");
const CliCommandsExecuter_1 = require("./cli/CliCommandsExecuter");
exports.siteService = new SiteService_1.SiteService();
exports.cliCommands = new CliCommands_1.CliCommands();
exports.cliCommandsExecuter = new CliCommandsExecuter_1.CliCommandsExecuter(exports.cliCommands);
