import {cyan, green, red, yellow} from 'kleur';
import * as figlet from 'figlet';
import {ConsoleMessage} from "../types/console-message";
import {IUserSite} from "../types";
import moment from 'moment';

const newLine = '\n';

export const showTitleAndBanner = (): void => {
    console.log(newLine);
    console.log(cyan(figlet.textSync(ConsoleMessage.TITLE, {horizontalLayout: 'full'})));
    console.info(cyan(ConsoleMessage.BANNER));
};

export const showError = (message: string | Error): void => {
    console.error(red(ConsoleMessage.ERROR) + message);
};

export const showWarning = (message: string): void => {
    console.warn(yellow(ConsoleMessage.WARNING) + message);
};

export const showListOfUserSites = (userSites: IUserSite[]): void => {
    const structDatas = userSites.map((arg, i) => {
        return {
            id: arg.id,
            domains: arg.domains,
            siteExpireIn: moment(arg.siteExpireAt).fromNow(),
            createdAt: moment(arg.createdAt).toLocaleString(),
            updatedAt: moment(arg.updatedAt).toLocaleString(),
            link: arg.link
        }
    });
    console.table(structDatas);
};

export const showSuccess = (message: string): void => {
    console.log(green(ConsoleMessage.SUCCESS) + message + newLine);
};

export const showInfo = (message: string): void => {
    console.info(cyan(ConsoleMessage.INFO) + message + newLine);
};
