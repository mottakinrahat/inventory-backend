import express from "express";
import { ActivityLogController } from "./activityLog.controller";
import { auth } from "../../middleWares/auth";
import { UserRole } from "../../../../prisma/generated/prisma";

const router = express.Router();

// Get all activity logs (admin/manager only)
router.get(
  "/",
  auth(UserRole.ADMIN, UserRole.MANAGER),
  ActivityLogController.getAllActivityLogs
);

// Get a single activity log by ID
router.get(
  "/:id",
  auth(UserRole.ADMIN, UserRole.MANAGER),
  ActivityLogController.getActivityLogById
);

export const activityLogRoutes = router;
