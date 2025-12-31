"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.handleError = exports.createValidationError = void 0;
const createValidationError = (message) => {
    const error = new Error(message);
    error.name = "ValidationError";
    return error;
};
exports.createValidationError = createValidationError;
const handleError = (error) => {
    if (error.name === "AppError" && error.statusCode) {
        return {
            statusCode: error.statusCode,
            message: error.message,
        };
    }
    if (error.name === "ValidationError") {
        return {
            statusCode: 400,
            message: error.message,
        };
    }
    console.error("Unexpected error:", error);
    return {
        statusCode: 500,
        message: "An unexpected error occurred. Please try again later.",
    };
};
exports.handleError = handleError;
//# sourceMappingURL=errors.js.map