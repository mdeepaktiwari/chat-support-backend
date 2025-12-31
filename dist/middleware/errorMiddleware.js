"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.errorMiddleware = void 0;
const errors_1 = require("../services/errors");
const errorMiddleware = (error, _req, res, _next) => {
    const { statusCode, message } = (0, errors_1.handleError)(error);
    res.status(statusCode).json({
        success: false,
        error: message,
        ...(process.env.NODE_ENV === "development" && {
            stack: error.stack,
        }),
    });
};
exports.errorMiddleware = errorMiddleware;
//# sourceMappingURL=errorMiddleware.js.map