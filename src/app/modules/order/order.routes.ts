import express from "express";
import { OrderController } from "./order.controller";
import { auth } from "../../middleWares/auth";
import validateRequest from "../../middleWares/validateRequest";
import { UserRole } from "../../../../prisma/generated/prisma";
import { OrderValidation } from "./order.validation";

const router = express.Router();

router.post(
  "/",
  auth(UserRole.ADMIN, UserRole.MANAGER),
  validateRequest(OrderValidation.createOrderValidation),
  OrderController.createOrder
);

router.get("/", OrderController.getAllOrders);

router.get("/my-orders", auth(), OrderController.getMyOrders);

router.get("/:id", OrderController.getOrderById);

router.patch(
  "/:id",
  auth(UserRole.ADMIN, UserRole.MANAGER),
  validateRequest(OrderValidation.updateOrderValidation),
  OrderController.updateOrder
);

export const orderRoutes = router;
