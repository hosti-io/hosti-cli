export interface ICliCommands {
    getUserSites(): Promise<void>;

    logout(): Promise<void>;

    deploySite(location?: string, projectId?: string, isSpaApplication?:boolean): Promise<void>;
}
