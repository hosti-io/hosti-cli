export interface Answer {
    command: SupportedCommands
    apiKey: string;
}

export enum SupportedCommands {
    LIST_OF_SITES ,
    DEPLOY_NEW_SITE,
    UPDATE_SITE ,
    DEPLOY_OR_UPDATE_SITE
}

export interface Choise {
    name: string,
    value: SupportedCommands
}
