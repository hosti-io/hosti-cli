export interface Answer {
    command: SupportedCommands
    apiKey?: string;
    deployLocation?: string;
    deployProjectId?: string;
}

export enum SupportedCommands {
    LIST_OF_SITES,
    DEPLOY_SITE,
    LOG_OUT
}

export interface Choise {
    name: string,
    value: SupportedCommands
}
