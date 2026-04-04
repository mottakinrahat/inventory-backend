"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.restockQueueRoutes = void 0;
const express_1 = __importDefault(require("express"));
const restockQueue_controller_1 = require("./restockQueue.controller");
const auth_1 = require("../../middleWares/auth");
const validateRequest_1 = __importDefault(require("../../middleWares/validateRequest"));
const prisma_1 = require("../../../../prisma/generated/prisma");
const restockQueue_validation_1 = require("./restockQueue.validation");
const router = express_1.default.Router();
// Get all restock queue items (with filter: priority, isRestocked, productId)
router.get("/", (0, auth_1.auth)(prisma_1.UserRole.ADMIN, prisma_1.UserRole.MANAGER), restockQueue_controller_1.RestockQueueController.getAllRestockQueue);
// Get a single restock queue entry
router.get("/:id", (0, auth_1.auth)(prisma_1.UserRole.ADMIN, prisma_1.UserRole.MANAGER), restockQueue_controller_1.RestockQueueController.getRestockQueueById);
// Mark a restock queue entry as restocked (optionally update stock)
router.patch("/:id/restock", (0, auth_1.auth)(prisma_1.UserRole.ADMIN, prisma_1.UserRole.MANAGER), (0, validateRequest_1.default)(restockQueue_validation_1.RestockQueueValidation.markAsRestockedValidation), restockQueue_controller_1.RestockQueueController.markAsRestocked);
// Delete a restock queue entry
router.delete("/:id", (0, auth_1.auth)(prisma_1.UserRole.ADMIN), restockQueue_controller_1.RestockQueueController.deleteRestockQueueEntry);
exports.restockQueueRoutes = router;
