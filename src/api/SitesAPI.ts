import API from './APIUtils';
import {ICustomDomainValidation, ISiteDetails, IUpdateSiteDto, IUserSite} from '../types';

export function getUserSites() {
    return API.get<IUserSite[]>(`/sites`);
}

export function getSiteDetails(id: string) {
    return API.get<ISiteDetails>(`/site/?id=` + id);
}

export function updateSiteApi(updateSite: IUpdateSiteDto) {
    return API.post<ISiteDetails>(`/updateSite/`, updateSite);
}

export function validateCustomDomain(customDomain: string, id: string) {
    return API.get<ICustomDomainValidation>(`/validateCustomDomain/?id=${id}&domain=${customDomain}`);
}
