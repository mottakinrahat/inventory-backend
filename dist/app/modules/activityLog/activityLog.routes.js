"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.activityLogRoutes = void 0;
const express_1 = __importDefault(require("express"));
const activityLog_controller_1 = require("./activityLog.controller");
const auth_1 = require("../../middleWares/auth");
const prisma_1 = require("../../../../prisma/generated/prisma");
const router = express_1.default.Router();
// Get all activity logs (admin/manager only)
router.get("/", (0, auth_1.auth)(prisma_1.UserRole.ADMIN, prisma_1.UserRole.MANAGER), activityLog_controller_1.ActivityLogController.getAllActivityLogs);
// Get a single activity log by ID
router.get("/:id", (0, auth_1.auth)(prisma_1.UserRole.ADMIN, prisma_1.UserRole.MANAGER), activityLog_controller_1.ActivityLogController.getActivityLogById);
exports.activityLogRoutes = router;
