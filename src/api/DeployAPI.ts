import API from './APIUtils';
import {
    ICompleteDeploySiteRequest,
    ICompleteDeploySiteResponse,
    IDeploySite,
    IDeploySiteWithoutAuthResponse,
} from "../types";
import axios, {AxiosResponse} from "axios";


export function deploySiteRequest(deployRequest: IDeploySite): Promise<AxiosResponse<IDeploySiteWithoutAuthResponse>> {
    if (deployRequest.token == null) {
        return API.post<IDeploySiteWithoutAuthResponse>(`/deploy`, deployRequest);
    }
    return API.post<IDeploySiteWithoutAuthResponse>(`/deployWithoutAuth`, deployRequest);
}

export function completeDeploySiteRequest(completeDeploySiteRequest: ICompleteDeploySiteRequest): Promise<AxiosResponse<ICompleteDeploySiteResponse>> {
    return API.post<ICompleteDeploySiteResponse>(`/completeDeploy`, completeDeploySiteRequest);
}

export function uploadFileToStorage(file: File, url: string, contentType: string): Promise<boolean> {
    return new Promise<boolean>((resolve, reject) => {
        const reader = new FileReader();
        reader.onload = () => {
            axios.put(url, reader.result, {
                withCredentials: false,
                headers: {
                    "Content-Type": contentType ?? "text/plain"
                }
            }).then((res) => {
                resolve(true);
            }).catch((err) => {
                reject(err);
            });
        }
        reader.readAsArrayBuffer(file);

    });
}