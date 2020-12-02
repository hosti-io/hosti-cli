"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.generateShortLiveToken = exports.checkDomainNameForUser = exports.checkDomainName = exports.removeDeployment = exports.rollBackDeployment = exports.deploySite = exports.deploySiteWithoutAuth = void 0;
const tslib_1 = require("tslib");
const APIUtils_1 = tslib_1.__importDefault(require("./APIUtils"));
const form_data_1 = tslib_1.__importDefault(require("form-data"));
function deploySiteWithoutAuth(domain, site, token) {
    const formData = new form_data_1.default();
    formData.append('site', site);
    formData.append('domain', domain);
    formData.append('token', token);
    const config = {
        headers: {
            'content-type': 'multipart/form-data'
        }
    };
    return APIUtils_1.default.post(`/deployWithoutAuth`, formData, config);
}
exports.deploySiteWithoutAuth = deploySiteWithoutAuth;
function deploySite(domain, site) {
    const formData = new form_data_1.default();
    formData.append('site', site);
    formData.append('domain', domain);
    const config = {
        headers: Object.assign({ 'content-type': 'multipart/form-data' }, formData.getHeaders())
    };
    return APIUtils_1.default.post(`/deploy`, formData, config);
}
exports.deploySite = deploySite;
function rollBackDeployment(rollBackDeployment) {
    return APIUtils_1.default.post(`/rollback`, rollBackDeployment);
}
exports.rollBackDeployment = rollBackDeployment;
function removeDeployment(removeDeployment) {
    return APIUtils_1.default.post(`/removeDeployment`, removeDeployment);
}
exports.removeDeployment = removeDeployment;
function checkDomainName(domain) {
    return APIUtils_1.default.get(`/checkDomain/?domain=${domain}`);
}
exports.checkDomainName = checkDomainName;
function checkDomainNameForUser(domain) {
    return APIUtils_1.default.get(`/checkDomainForUser/?domain=${domain}`);
}
exports.checkDomainNameForUser = checkDomainNameForUser;
function generateShortLiveToken() {
    return APIUtils_1.default.get(`/token`);
}
exports.generateShortLiveToken = generateShortLiveToken;
