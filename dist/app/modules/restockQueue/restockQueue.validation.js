"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.RestockQueueValidation = void 0;
const zod_1 = require("zod");
const markAsRestockedValidation = zod_1.z.object({
    newStockQty: zod_1.z
        .number()
        .min(0, { message: "Stock quantity must be non-negative" })
        .optional(),
});
exports.RestockQueueValidation = {
    markAsRestockedValidation,
};
