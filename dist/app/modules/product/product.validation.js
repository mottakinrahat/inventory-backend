"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ProductValidation = void 0;
const zod_1 = require("zod");
const createProductValidation = zod_1.z.object({
    name: zod_1.z.string().min(1, { message: "Product name is required" }),
    price: zod_1.z.number().min(0, { message: "Price must be a positive number" }),
    stockQty: zod_1.z.number().min(0).optional(),
    minStockThreshold: zod_1.z.number().min(0).optional(),
    categoryId: zod_1.z.string().min(1, { message: "Category ID is required" }),
});
const updateProductValidation = zod_1.z.object({
    name: zod_1.z.string().optional(),
    price: zod_1.z.number().min(0).optional(),
    stockQty: zod_1.z.number().min(0).optional(),
    minStockThreshold: zod_1.z.number().min(0).optional(),
    categoryId: zod_1.z.string().optional(),
    status: zod_1.z.enum(["ACTIVE", "OUT_OF_STOCK", "INACTIVE"]).optional(),
});
exports.ProductValidation = {
    createProductValidation,
    updateProductValidation,
};
