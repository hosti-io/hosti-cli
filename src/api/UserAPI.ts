import API from "./APIUtils";
import {IUserSite} from "../types";

export function authJWT(token: string) {
    return API.get<{ success: boolean }[]>(`/jwt-auth`, { headers: {
        "Authorization" : "Bearer " + token
    }});
}
