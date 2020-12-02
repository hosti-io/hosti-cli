"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.validateCustomDomain = exports.updateSiteApi = exports.getSiteDetails = exports.getUserSites = void 0;
const tslib_1 = require("tslib");
const APIUtils_1 = tslib_1.__importDefault(require("./APIUtils"));
function getUserSites() {
    return APIUtils_1.default.get(`/sites`);
}
exports.getUserSites = getUserSites;
function getSiteDetails(id) {
    return APIUtils_1.default.get(`/site/?id=` + id);
}
exports.getSiteDetails = getSiteDetails;
function updateSiteApi(updateSite) {
    return APIUtils_1.default.post(`/updateSite/`, updateSite);
}
exports.updateSiteApi = updateSiteApi;
function validateCustomDomain(customDomain, id) {
    return APIUtils_1.default.get(`/validateCustomDomain/?id=${id}&domain=${customDomain}`);
}
exports.validateCustomDomain = validateCustomDomain;
