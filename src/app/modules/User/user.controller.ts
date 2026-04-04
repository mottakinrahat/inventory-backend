import { Request, Response } from "express";
import { UserServices } from "./user.services";
import { catchAsync } from "../../../helpers/trycatch";
import { sendResponse } from "../../../helpers/sendResponse";
import { pick } from "../../../shared/pick";
import { userFilterableFields } from "./user.constant";
import status from "http-status";

const createAUser = catchAsync(async (req: Request, res: Response) => {
  const result = await UserServices.createAUser(req.body);
  sendResponse(res, {
    success: true,
    statusCode: status.CREATED,
    message: "User created successfully",
    data: result,
  });
});

const getAllUser = catchAsync(async (req: Request, res: Response) => {
  const filter = pick(req.query, userFilterableFields);
  const options = pick(req.query, ["page", "limit", "sortBy", "sortOrder"]);
  const result = await UserServices.getAllUserData(filter, options);
  sendResponse(res, {
    success: true,
    statusCode: status.OK,
    message: "User data retrieved successfully",
    meta: result?.meta,
    data: result?.data,
  });
});

const getMe = catchAsync(async (req: Request, res: Response) => {
  const result = await UserServices.getMe(req.user?.email as string);
  sendResponse(res, {
    success: true,
    statusCode: status.OK,
    message: "User profile retrieved successfully",
    data: result,
  });
});

const getAUser = catchAsync(async (req: Request, res: Response) => {
  const result = await UserServices.getAUser(req.params.id as string);
  sendResponse(res, {
    success: true,
    statusCode: status.OK,
    message: "User retrieved successfully",
    data: result,
  });
});

export const UserController = {
  createAUser,
  getAllUser,
  getAUser,
  getMe,
};
