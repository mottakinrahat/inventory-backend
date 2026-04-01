import { z } from "zod";

const createCategoryValidation = z.object({
  name: z.string().min(1, { message: "Category name is required" }),
  description: z.string().optional(),
});

const updateCategoryValidation = z.object({
  name: z.string().min(1, { message: "Category name is required" }).optional(),
  description: z.string().optional(),
});

export const CategoryValidation = {
  createCategoryValidation,
  updateCategoryValidation,
};
