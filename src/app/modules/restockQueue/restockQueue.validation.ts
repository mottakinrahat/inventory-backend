import { z } from "zod";

const markAsRestockedValidation = z.object({
  newStockQty: z
    .number()
    .min(0, { message: "Stock quantity must be non-negative" })
    .optional(),
});

export const RestockQueueValidation = {
  markAsRestockedValidation,
};
