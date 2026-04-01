import { z } from "zod";

const createOrderValidation = z.object({
  customerName: z.string().min(1, { message: "Customer name is required" }),
  customerEmail: z.string().email().optional(),
  items: z.array(z.object({
    productId: z.string().min(1, { message: "Product ID is required" }),
    quantity: z.number().min(1, { message: "Quantity must be at least 1" }),
  })).min(1, { message: "At least one item is required for the order" }),
});

const updateOrderValidation = z.object({
  status: z.enum(["PENDING", "CONFIRMED", "SHIPPED", "DELIVERED", "CANCELLED"]).optional(),
});

export const OrderValidation = {
  createOrderValidation,
  updateOrderValidation,
};
