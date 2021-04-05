import API from './APIUtils';
import {
    ICompleteDeploySiteRequest,
    ICompleteDeploySiteResponse,
    IDeploySite,
    IDeploySiteWithoutAuthResponse,
} from "../types";
import axios, {AxiosResponse} from "axios";
import * as fs from "fs";
import FormData from "form-data";



export function deploySiteRequest(deployRequest: IDeploySite): Promise<AxiosResponse<IDeploySiteWithoutAuthResponse>> {
    return API.post<IDeploySiteWithoutAuthResponse>(`/deploy`, deployRequest);
}

export function completeDeploySiteRequest(completeDeploySiteRequest: ICompleteDeploySiteRequest): Promise<AxiosResponse<ICompleteDeploySiteResponse>> {
    return API.post<ICompleteDeploySiteResponse>(`/completeDeploy`, completeDeploySiteRequest);
}

export function uploadFileToStorage(file: string, url: string, contentType: string): Promise<boolean> {
    return new Promise<boolean>((resolve, reject) => {
        const input = fs.createReadStream(file);
        axios.put(url, input, {
            withCredentials: false,
            headers: {
                "Content-Type": contentType ?? "text/plain"
            }
        }).then((res) => {
            resolve(true);
        }).catch((err) => {
            reject(err);
        });
    });
}