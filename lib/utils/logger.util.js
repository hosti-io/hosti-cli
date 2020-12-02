"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.showInfo = exports.showSuccess = exports.showListOfUserSites = exports.showWarning = exports.showError = exports.showTitleAndBanner = void 0;
const tslib_1 = require("tslib");
const kleur_1 = require("kleur");
const figlet = tslib_1.__importStar(require("figlet"));
const console_message_1 = require("../types/console-message");
const moment_1 = tslib_1.__importDefault(require("moment"));
const newLine = '\n';
const showTitleAndBanner = () => {
    console.log(newLine);
    console.log(kleur_1.cyan(figlet.textSync(console_message_1.ConsoleMessage.TITLE, { horizontalLayout: 'full' })));
    console.info(kleur_1.cyan(console_message_1.ConsoleMessage.BANNER));
};
exports.showTitleAndBanner = showTitleAndBanner;
const showError = (message) => {
    console.error(kleur_1.red(console_message_1.ConsoleMessage.ERROR) + message);
};
exports.showError = showError;
const showWarning = (message) => {
    console.warn(kleur_1.yellow(console_message_1.ConsoleMessage.WARNING) + message);
};
exports.showWarning = showWarning;
const showListOfUserSites = (userSites) => {
    const structDatas = userSites.map((arg, i) => {
        return {
            id: arg.id,
            domains: arg.domains,
            siteExpireIn: moment_1.default(arg.siteExpireAt).fromNow(),
            createdAt: moment_1.default(arg.createdAt).toLocaleString(),
            updatedAt: moment_1.default(arg.updatedAt).toLocaleString(),
            link: arg.link
        };
    });
    console.table(structDatas);
};
exports.showListOfUserSites = showListOfUserSites;
const showSuccess = (message) => {
    console.log(kleur_1.green(console_message_1.ConsoleMessage.SUCCESS) + message + newLine);
};
exports.showSuccess = showSuccess;
const showInfo = (message) => {
    console.info(kleur_1.cyan(console_message_1.ConsoleMessage.INFO) + message + newLine);
};
exports.showInfo = showInfo;
