"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.CategoryValidation = void 0;
const zod_1 = require("zod");
const createCategoryValidation = zod_1.z.object({
    name: zod_1.z.string().min(1, { message: "Category name is required" }),
    description: zod_1.z.string().optional(),
});
const updateCategoryValidation = zod_1.z.object({
    name: zod_1.z.string().min(1, { message: "Category name is required" }).optional(),
    description: zod_1.z.string().optional(),
});
exports.CategoryValidation = {
    createCategoryValidation,
    updateCategoryValidation,
};
