"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.SiteService = void 0;
const tslib_1 = require("tslib");
const SitesAPI_1 = require("../api/SitesAPI");
const InvalidRequestException_1 = require("../errors/InvalidRequestException");
class SiteService {
    getUserSites() {
        return tslib_1.__awaiter(this, void 0, void 0, function* () {
            let result = yield SitesAPI_1.getUserSites();
            if (result == null) {
                throw new InvalidRequestException_1.InvalidRequestException(0, "unknown", "Request failed");
            }
            else if (result.status != 200) {
                throw new InvalidRequestException_1.InvalidRequestException(result.status, result.statusText, JSON.stringify(result.data));
            }
            return result.data;
        });
    }
}
exports.SiteService = SiteService;
