"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
function errorHandler(err, req, res, next) {
    console.error(err);
    // below checks if error is an expected error
    if (err instanceof ApiError) {
        res.status(err.code).json(err.message);
        return;
    }
    res.status(500).json("something went wrong");
}
module.exports = errorHandler;
//# sourceMappingURL=errorHandler.js.map