import { Request, Response } from "express";
import status from "http-status";
import { catchAsync } from "../../../helpers/trycatch";
import { sendResponse } from "../../../helpers/sendResponse";
import { pick } from "../../../shared/pick";
import { activityLogFilterableFields } from "./activityLog.constant";
import { ActivityLogServices } from "./activityLog.services";

const getAllActivityLogs = catchAsync(async (req: Request, res: Response) => {
  const filter = pick(req.query, activityLogFilterableFields);
  const options = pick(req.query, ["page", "limit", "sortBy", "sortOrder"]);
  const result = await ActivityLogServices.getAllActivityLogs(filter, options);
  sendResponse(res, {
    success: true,
    statusCode: status.OK,
    message: "Activity logs retrieved successfully",
    meta: result?.meta,
    data: result?.data,
  });
});

const getActivityLogById = catchAsync(async (req: Request, res: Response) => {
  const result = await ActivityLogServices.getActivityLogById(req.params.id as string);
  sendResponse(res, {
    success: true,
    statusCode: status.OK,
    message: "Activity log retrieved successfully",
    data: result,
  });
});

export const ActivityLogController = {
  getAllActivityLogs,
  getActivityLogById,
};
