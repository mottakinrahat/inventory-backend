import { Request, Response } from "express";
import status from "http-status";
import { catchAsync } from "../../../helpers/trycatch";
import { sendResponse } from "../../../helpers/sendResponse";
import { pick } from "../../../shared/pick";
import { restockQueueFilterableFields } from "./restockQueue.constant";
import { RestockQueueServices } from "./restockQueue.services";

const getAllRestockQueue = catchAsync(async (req: Request, res: Response) => {
  const filter = pick(req.query, restockQueueFilterableFields);
  const options = pick(req.query, ["page", "limit", "sortBy", "sortOrder"]);
  const result = await RestockQueueServices.getAllRestockQueue(filter, options);
  sendResponse(res, {
    success: true,
    statusCode: status.OK,
    message: "Restock queue retrieved successfully",
    meta: result?.meta,
    data: result?.data,
  });
});

const getRestockQueueById = catchAsync(async (req: Request, res: Response) => {
  const result = await RestockQueueServices.getRestockQueueById(req.params.id as string);
  sendResponse(res, {
    success: true,
    statusCode: status.OK,
    message: "Restock queue entry retrieved successfully",
    data: result,
  });
});

const markAsRestocked = catchAsync(async (req: Request, res: Response) => {
  const result = await RestockQueueServices.markAsRestocked(
    req.params.id as string,
    req.body,
    req.user as any
  );
  sendResponse(res, {
    success: true,
    statusCode: status.OK,
    message: "Restock queue entry marked as restocked",
    data: result,
  });
});

const deleteRestockQueueEntry = catchAsync(
  async (req: Request, res: Response) => {
    await RestockQueueServices.deleteRestockQueueEntry(req.params.id as string);
    sendResponse(res, {
      success: true,
      statusCode: status.OK,
      message: "Restock queue entry deleted successfully",
      data: null,
    });
  }
);

export const RestockQueueController = {
  getAllRestockQueue,
  getRestockQueueById,
  markAsRestocked,
  deleteRestockQueueEntry,
};
