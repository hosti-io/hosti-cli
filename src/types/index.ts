export interface IUser {
    email: string;
    username: string;
    token: string;
    fullName: string;
    avatar: string;
    plan: string;
}

export interface PageModel {
    page: string;
    link: string
}

export interface IStatusResponse {
    success: boolean;
}

export interface IForgotPassword {
    email: string;
}

export interface IResetPassword {
    password: string;
    id: string;
    token: string;
}



export interface IHttpErrorMessage {
    errorMessage: string,
    validationErrors: object,
    errorCode: string
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

export interface IRemoveDeploymentRequest {
    siteId: string;
    deployment: string;
}

export interface IRollbackRequest {
    siteId: string;
    activeDeployment: string;
    rollbackDeployment: string;
}


export interface IDeploySiteWithoutAuthResponse {
    domain: string;
    status: boolean;
}


export interface ICheckDomainAvailable {
    domain?: string;
    available?: boolean;
}

export interface IShortLiveToken {
    token: string;
}

export interface IErrors {
    [key: string]: string[];
}

export interface IActivityLog {
    action: string;
    project: string;
    location: string;
    date: Date;
}
