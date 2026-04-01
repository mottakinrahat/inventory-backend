import { Request, Response } from "express";
import status from "http-status";
import { catchAsync } from "../../../helpers/trycatch";
import { sendResponse } from "../../../helpers/sendResponse";
import { pick } from "../../../shared/pick";
import { categoryFilterableFields } from "./category.constant";
import { CategoryServices } from "./category.services";

const createCategory = catchAsync(async (req: Request, res: Response) => {
 
  const result = await CategoryServices.createCategory(req.body, req.user as any);
  sendResponse(res, {
    success: true,
    statusCode: status.CREATED,
    message: "Category created successfully",
    data: result,
  });
});

const getAllCategories = catchAsync(async (req: Request, res: Response) => {
  const filter = pick(req.query, categoryFilterableFields);
  const options = pick(req.query, ["page", "limit", "sortBy", "sortOrder"]);
  const result = await CategoryServices.getAllCategories(filter, options);
  sendResponse(res, {
    success: true,
    statusCode: status.OK,
    message: "Categories retrieved successfully",
    meta: result?.meta,
    data: result?.data,
  });
});

const getCategoryById = catchAsync(async (req: Request, res: Response) => {
  const result = await CategoryServices.getCategoryById(req.params.id as string);
  sendResponse(res, {
    success: true,
    statusCode: status.OK,
    message: "Category retrieved successfully",
    data: result,
  });
});

const updateCategory = catchAsync(async (req: Request, res: Response) => {
  const result = await CategoryServices.updateCategory(req.params.id as string, req.body);
  sendResponse(res, {
    success: true,
    statusCode: status.OK,
    message: "Category updated successfully",
    data: result,
  });
});

const deleteCategory = catchAsync(async (req: Request, res: Response) => {
  await CategoryServices.deleteCategory(req.params.id as string);
  sendResponse(res, {
    success: true,
    statusCode: status.OK,
    message: "Category deleted successfully",
    data: null,
  });
});

export const CategoryController = {
  createCategory,
  getAllCategories,
  getCategoryById,
  updateCategory,
  deleteCategory,
};
