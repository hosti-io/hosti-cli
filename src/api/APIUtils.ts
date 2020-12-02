import axios from 'axios';
import { API_SERVER_URL } from "../constants";

axios.defaults.baseURL = API_SERVER_URL;
axios.defaults.withCredentials = true;

axios.interceptors.request.use(function (config) {
    if (config.url != null && config.url.indexOf("/jwt-auth") == -1) {
        config.headers.Authorization = "";
    }
    return config;
});

export default axios;
