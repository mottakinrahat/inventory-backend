import { Request, Response } from "express";
import status from "http-status";
import { catchAsync } from "../../../helpers/trycatch";
import { sendResponse } from "../../../helpers/sendResponse";
import { pick } from "../../../shared/pick";
import { orderFilterableFields } from "./order.constant";
import { OrderServices } from "./order.services";

const createOrder = catchAsync(async (req: Request, res: Response) => {
  const result = await OrderServices.createOrder(req.body, req.user as any);
  sendResponse(res, {
    success: true,
    statusCode: status.CREATED,
    message: "Order created successfully",
    data: result,
  });
});

const getAllOrders = catchAsync(async (req: Request, res: Response) => {
  const filter = pick(req.query, orderFilterableFields);
  const options = pick(req.query, ["page", "limit", "sortBy", "sortOrder"]);
  const result = await OrderServices.getAllOrders(filter, options);
  sendResponse(res, {
    success: true,
    statusCode: status.OK,
    message: "Orders retrieved successfully",
    meta: result?.meta,
    data: result?.data,
  });
});

const getOrderById = catchAsync(async (req: Request, res: Response) => {
  const result = await OrderServices.getOrderById(req.params.id as string);
  sendResponse(res, {
    success: true,
    statusCode: status.OK,
    message: "Order retrieved successfully",
    data: result,
  });
});

const updateOrder = catchAsync(async (req: Request, res: Response) => {
  const result = await OrderServices.updateOrder(req.params.id as string, req.body);
  sendResponse(res, {
    success: true,
    statusCode: status.OK,
    message: "Order updated successfully",
    data: result,
  });
});


export const OrderController = {
  createOrder,
  getAllOrders,
  getOrderById,
  updateOrder,
};
