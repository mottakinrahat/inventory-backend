import express from "express";
import { RestockQueueController } from "./restockQueue.controller";
import { auth } from "../../middleWares/auth";
import validateRequest from "../../middleWares/validateRequest";
import { UserRole } from "../../../../prisma/generated/prisma";
import { RestockQueueValidation } from "./restockQueue.validation";

const router = express.Router();

// Get all restock queue items (with filter: priority, isRestocked, productId)
router.get("/", auth(UserRole.ADMIN, UserRole.MANAGER), RestockQueueController.getAllRestockQueue);

// Get a single restock queue entry
router.get("/:id", auth(UserRole.ADMIN, UserRole.MANAGER), RestockQueueController.getRestockQueueById);

// Mark a restock queue entry as restocked (optionally update stock)
router.patch(
  "/:id/restock",
  auth(UserRole.ADMIN, UserRole.MANAGER),
  validateRequest(RestockQueueValidation.markAsRestockedValidation),
  RestockQueueController.markAsRestocked
);

// Delete a restock queue entry
router.delete(
  "/:id",
  auth(UserRole.ADMIN),
  RestockQueueController.deleteRestockQueueEntry
);

export const restockQueueRoutes = router;
