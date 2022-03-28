"use strict";
var ApiError = /** @class */ (function () {
    function ApiError(code, message) {
        this.code = code;
        this.message = message;
    }
    ApiError.badRequest = function (msg) {
        return new ApiError(400, msg);
    };
    ApiError.internalError = function (msg) {
        return new ApiError(500, msg);
    };
    return ApiError;
}());
module.exports = ApiError;
//# sourceMappingURL=error.js.map