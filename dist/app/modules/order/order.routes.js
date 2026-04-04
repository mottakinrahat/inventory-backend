"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.orderRoutes = void 0;
const express_1 = __importDefault(require("express"));
const order_controller_1 = require("./order.controller");
const auth_1 = require("../../middleWares/auth");
const validateRequest_1 = __importDefault(require("../../middleWares/validateRequest"));
const prisma_1 = require("../../../../prisma/generated/prisma");
const order_validation_1 = require("./order.validation");
const router = express_1.default.Router();
router.post("/", (0, auth_1.auth)(prisma_1.UserRole.ADMIN, prisma_1.UserRole.MANAGER), (0, validateRequest_1.default)(order_validation_1.OrderValidation.createOrderValidation), order_controller_1.OrderController.createOrder);
router.get("/", order_controller_1.OrderController.getAllOrders);
router.get("/my-orders", (0, auth_1.auth)(), order_controller_1.OrderController.getMyOrders);
router.get("/:id", order_controller_1.OrderController.getOrderById);
router.patch("/:id", (0, auth_1.auth)(prisma_1.UserRole.ADMIN, prisma_1.UserRole.MANAGER), (0, validateRequest_1.default)(order_validation_1.OrderValidation.updateOrderValidation), order_controller_1.OrderController.updateOrder);
exports.orderRoutes = router;
