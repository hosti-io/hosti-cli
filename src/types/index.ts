export interface IUser {
    email: string;
    username: string;
    token: string;
    fullName: string;
    avatar: string;
    plan: string;
}

export interface IUpdateSiteDto {
    id: string;
    domain: string;
    customDomain?: string | null;
    passwordProtection?: boolean;
    password?: string | null;
}

export interface ICustomDomainValidation {
    valid: boolean;
    DNSEntry: string;
    DNSName: string;
    DNSValue: string;
}


export interface ISiteDetails {
    id: string;
    domain: string;
    ownerId: string;
    siteExpireAt: Date;
    customDomain: string;

    domains: string[];
    link: string;

    createdAt: Date;
    updatedAt: Date;

    screenshotUrl: string;
    passwordProtection: boolean;
    activeDeployment: string;

    deployments: IDeploymentResult[];
}

export interface IConfigurationFile {
    projectId: string;
}

export interface IDeploymentResult {
    date: Date;
    deploymentId: string;
    ownerId: string;
}

export interface ICompleteDeploySiteResponse {
    domain: string;
    status: boolean;
    deploymentId: string;
}


export interface ICompleteDeploySiteRequest {
    deploymentId: string;
    domain: string;
    deploymentFiles: IDeployFiles[]
    updatedFiles: IDeployFiles[]
    token?: string;
}

export interface IDeploySiteWithoutAuthResponse {
    domain: string;
    status: boolean;
    deploymentId: string;
    filesToUpload: IFilesSignedUrls[];
}


export interface IDeploySite {
    token?: string;
    domain: string;
    customDomain?: string;
    files: IDeployFiles[]
}

export interface IDeployFiles {
    name: string;
    hash: string;
    contentType?: string;
}

export interface IUserSite {
    id: string;
    domain: string;
    ownerId: string;
    siteExpireAt: Date;
    customDomain: string;
    activeDeployment: string;
    passwordProtection: boolean;

    createdAt: Date;
    updatedAt: Date;

    domains: string[];

    link: string;
}

export interface IFilesSignedUrls {
    file: string;
    hash: string;
    contentType: string;
    url: string;
}


export interface IErrors {
    [key: string]: string[];
}
