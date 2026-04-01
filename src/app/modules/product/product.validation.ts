import { z } from "zod";

const createProductValidation = z.object({
  name: z.string().min(1, { message: "Product name is required" }),
  price: z.number().min(0, { message: "Price must be a positive number" }),
  stockQty: z.number().min(0).optional(),
  minStockThreshold: z.number().min(0).optional(),
  categoryId: z.string().min(1, { message: "Category ID is required" }),
});

const updateProductValidation = z.object({
  name: z.string().optional(),
  price: z.number().min(0).optional(),
  stockQty: z.number().min(0).optional(),
  minStockThreshold: z.number().min(0).optional(),
  categoryId: z.string().optional(),
  status: z.enum(["ACTIVE", "OUT_OF_STOCK", "INACTIVE"]).optional(),
});

export const ProductValidation = {
  createProductValidation,
  updateProductValidation,
};
