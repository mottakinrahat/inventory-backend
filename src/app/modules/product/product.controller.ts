import { Request, Response } from "express";
import status from "http-status";
import { catchAsync } from "../../../helpers/trycatch";
import { sendResponse } from "../../../helpers/sendResponse";
import { pick } from "../../../shared/pick";
import { productFilterableFields } from "./product.constant";
import { ProductServices } from "./product.services";

const createProduct = catchAsync(async (req: Request, res: Response) => {
  console.log(req.body)
  const result = await ProductServices.createProduct(req.body, req.user as any);
  sendResponse(res, {
    success: true,
    statusCode: status.CREATED,
    message: "Product created successfully",
    data: result,
  });
});

const getAllProducts = catchAsync(async (req: Request, res: Response) => {
  const filter = pick(req.query, productFilterableFields);
  const options = pick(req.query, ["page", "limit", "sortBy", "sortOrder"]);
  const result = await ProductServices.getAllProducts(filter, options);
  sendResponse(res, {
    success: true,
    statusCode: status.OK,
    message: "Products retrieved successfully",
    meta: result?.meta,
    data: result?.data,
  });
});

const getMyProducts = catchAsync(async (req: Request, res: Response) => {
  const filter = pick(req.query, productFilterableFields);
  const options = pick(req.query, ["page", "limit", "sortBy", "sortOrder"]);
  const result = await ProductServices.getMyProducts(req.user as any, filter, options);
  sendResponse(res, {
    success: true,
    statusCode: status.OK,
    message: "My products retrieved successfully",
    meta: result?.meta,
    data: result?.data,
  });
});

const getProductById = catchAsync(async (req: Request, res: Response) => {
  const result = await ProductServices.getProductById(req.params.id as string);
  sendResponse(res, {
    success: true,
    statusCode: status.OK,
    message: "Product retrieved successfully",
    data: result,
  });
});

const updateProduct = catchAsync(async (req: Request, res: Response) => {
  const result = await ProductServices.updateProduct(req.params.id as string, req.body, req.user as any);
  sendResponse(res, {
    success: true,
    statusCode: status.OK,
    message: "Product updated successfully",
    data: result,
  });
});

const deleteProduct = catchAsync(async (req: Request, res: Response) => {
  await ProductServices.deleteProduct(req.params.id as string, req.user as any);
  sendResponse(res, {
    success: true,
    statusCode: status.OK,
    message: "Product deleted successfully",
    data: null,
  });
});

export const ProductController = {
  createProduct,
  getAllProducts,
  getProductById,
  updateProduct,
  deleteProduct,
  getMyProducts,
};
