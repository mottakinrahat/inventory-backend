"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.OrderValidation = void 0;
const zod_1 = require("zod");
const createOrderValidation = zod_1.z.object({
    customerName: zod_1.z.string().min(1, { message: "Customer name is required" }),
    customerEmail: zod_1.z.string().email().optional(),
    items: zod_1.z.array(zod_1.z.object({
        productId: zod_1.z.string().min(1, { message: "Product ID is required" }),
        quantity: zod_1.z.number().min(1, { message: "Quantity must be at least 1" }),
    })).min(1, { message: "At least one item is required for the order" }),
});
const updateOrderValidation = zod_1.z.object({
    status: zod_1.z.enum(["PENDING", "CONFIRMED", "SHIPPED", "DELIVERED", "CANCELLED"]).optional(),
});
exports.OrderValidation = {
    createOrderValidation,
    updateOrderValidation,
};
