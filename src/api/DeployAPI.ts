import API from './APIUtils';
import {
    ICheckDomainAvailable,
    IDeploySiteWithoutAuthResponse,
    IRemoveDeploymentRequest,
    IRollbackRequest,
    ISiteDetails,
    IUser
} from "../types";

export function deploySiteWithoutAuth(domain: string, site: object, token: string) {
    const formData = new FormData();
    formData.append('site', site as any);
    formData.append('domain', domain);
    formData.append('token', token);
    const config = {
        headers: {
            'content-type': 'multipart/form-data'
        }
    };
    return API.post<IDeploySiteWithoutAuthResponse>(`/deployWithoutAuth`, formData, config);
}

export function deploySite(domain: string, site: object, user: IUser) {
    const formData = new FormData();
    formData.append('site', site as any);
    formData.append('domain', domain);
    const config = {
        headers: {
            'content-type': 'multipart/form-data'
        }
    };
    return API.post<IDeploySiteWithoutAuthResponse>(`/deploy`, formData, config);
}

export function rollBackDeployment(rollBackDeployment: IRollbackRequest) {
    return API.post<ISiteDetails>(`/rollback`, rollBackDeployment);
}

export function removeDeployment(removeDeployment: IRemoveDeploymentRequest) {
    return API.post<ISiteDetails>(`/removeDeployment`, removeDeployment);
}

export function checkDomainName(domain: string) {
    return API.get<ICheckDomainAvailable>(`/checkDomain/?domain=${domain}`);
}

export function checkDomainNameForUser(domain: string) {
    return API.get<ICheckDomainAvailable>(`/checkDomainForUser/?domain=${domain}`);
}


export function generateShortLiveToken() {
    return API.get<string>(`/token`);
}
