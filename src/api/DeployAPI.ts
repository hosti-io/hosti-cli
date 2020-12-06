import API from './APIUtils';
import {IDeploySiteWithoutAuthResponse,} from "../types";
import FormData from 'form-data';


export function deploySite(domain: string, site: object) {
    const formData = new FormData();
    formData.append('site', site as any, { filename : 'hosti-deployment.zip' });
    formData.append('domain', domain);
    const config = {
        headers: {
            'content-type': 'multipart/form-data',
            ...formData.getHeaders()
        }
    };
    return API.post<IDeploySiteWithoutAuthResponse>(`/deploy`, formData, config);
}
