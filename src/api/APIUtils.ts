import axios from 'axios';
import {API_SERVER_URL} from "../constants";
import {showError} from "../utils/logger.util";

axios.defaults.baseURL = API_SERVER_URL;
axios.defaults.withCredentials = true;
axios.defaults.headers = {'User-Agent': 'hosti-cli/0.1'};
axios.interceptors.request.use((config) => {
    if (config.url != null && config.url.indexOf("/jwt-auth") == -1) {
        config.headers.Authorization = "Bearer " + process.env.HOSTI_KEY
    }
    return config;
});
axios.interceptors.response.use(function (response) {
    // Any status code that lie within the range of 2xx cause this function to trigger
    // Do something with response data
    return response;
}, function (error) {
    showError(error);
    return Promise.resolve(error);
});

export default axios;
