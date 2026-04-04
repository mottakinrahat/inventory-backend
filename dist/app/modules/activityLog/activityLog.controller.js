"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ActivityLogController = void 0;
const http_status_1 = __importDefault(require("http-status"));
const trycatch_1 = require("../../../helpers/trycatch");
const sendResponse_1 = require("../../../helpers/sendResponse");
const pick_1 = require("../../../shared/pick");
const activityLog_constant_1 = require("./activityLog.constant");
const activityLog_services_1 = require("./activityLog.services");
const getAllActivityLogs = (0, trycatch_1.catchAsync)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const filter = (0, pick_1.pick)(req.query, activityLog_constant_1.activityLogFilterableFields);
    const options = (0, pick_1.pick)(req.query, ["page", "limit", "sortBy", "sortOrder"]);
    const result = yield activityLog_services_1.ActivityLogServices.getAllActivityLogs(filter, options);
    (0, sendResponse_1.sendResponse)(res, {
        success: true,
        statusCode: http_status_1.default.OK,
        message: "Activity logs retrieved successfully",
        meta: result === null || result === void 0 ? void 0 : result.meta,
        data: result === null || result === void 0 ? void 0 : result.data,
    });
}));
const getActivityLogById = (0, trycatch_1.catchAsync)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const result = yield activityLog_services_1.ActivityLogServices.getActivityLogById(req.params.id);
    (0, sendResponse_1.sendResponse)(res, {
        success: true,
        statusCode: http_status_1.default.OK,
        message: "Activity log retrieved successfully",
        data: result,
    });
}));
exports.ActivityLogController = {
    getAllActivityLogs,
    getActivityLogById,
};
