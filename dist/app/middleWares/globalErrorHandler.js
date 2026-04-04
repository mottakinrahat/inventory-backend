"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.globalErrorHandler = void 0;
const http_status_1 = __importDefault(require("http-status"));
const globalErrorHandler = (err, req, res, next) => {
    const statusCode = (err === null || err === void 0 ? void 0 : err.statusCode) || http_status_1.default.INTERNAL_SERVER_ERROR;
    const message = (err === null || err === void 0 ? void 0 : err.message) || "Something went wrong";
    res.status(statusCode).json({
        success: false,
        message,
        error: err,
    });
};
exports.globalErrorHandler = globalErrorHandler;
