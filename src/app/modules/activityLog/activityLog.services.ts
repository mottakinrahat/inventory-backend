import { Prisma } from "../../../../prisma/generated/prisma";
import { paginationHelpers } from "../../../helpers/paginationHelpers";
import prisma from "../../../shared/prisma";
import { IPaginationOptions } from "../../interfaces/pagination";
import { activityLogSearchableFields } from "./activityLog.constant";

const getAllActivityLogs = async (
  params: any,
  options: IPaginationOptions
) => {
  const { page, limit, sortBy, sortOrder, skip } =
    paginationHelpers.calculatePagination(options);
  const { searchTerm, ...filterData } = params;
  const andConditions: Prisma.ActivityLogWhereInput[] = [];

  if (searchTerm) {
    andConditions.push({
      OR: activityLogSearchableFields.map((field) => ({
        [field]: { contains: searchTerm, mode: "insensitive" },
      })),
    });
  }

  if (Object.keys(filterData).length > 0) {
    andConditions.push({
      AND: Object.keys(filterData).map((key) => ({
        [key]: { equals: filterData[key as keyof typeof filterData] },
      })),
    });
  }

  const whereConditions: Prisma.ActivityLogWhereInput =
    andConditions.length > 0 ? { AND: andConditions } : {};

  const result = await prisma.activityLog.findMany({
    where: whereConditions,
    skip,
    take: limit,
    orderBy:
      sortBy && sortOrder
        ? [{ [sortBy]: sortOrder }]
        : [{ createdAt: "desc" }],
    include: {
      user: {
        select: { id: true, name: true, email: true },
      },
    },
  });

  const total = await prisma.activityLog.count({ where: whereConditions });

  return {
    meta: { page, limit, total },
    data: result,
  };
};

const getActivityLogById = async (id: string) => {
  const result = await prisma.activityLog.findUniqueOrThrow({
    where: { id },
    include: {
      user: {
        select: { id: true, name: true, email: true },
      },
    },
  });

  return result;
};

export const ActivityLogServices = {
  getAllActivityLogs,
  getActivityLogById,
};
