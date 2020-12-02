import axios from 'axios';
import { API_SERVER_URL } from "../constants";

axios.defaults.baseURL = API_SERVER_URL;
axios.defaults.withCredentials = true;
axios.defaults.headers = { 'User-Agent': 'hosti-cli/0.1'};
axios.interceptors.request.use(function (config) {
    if (config.url != null && config.url.indexOf("/jwt-auth") == -1) {
        config.headers.Authorization =  "Bearer " + process.env.HOSTI_KEY
    }
    return config;
});

export default axios;
