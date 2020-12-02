import API from "./APIUtils";

export function authJWT(token: string) {
    return API.get<{ success: boolean }[]>(`/jwt-auth`, { headers: {
        "Authorization" : "Bearer " + token
    }});
}
