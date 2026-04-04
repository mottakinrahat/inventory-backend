import * as bcrypt from "bcrypt";
import { IPaginationOptions } from "../../interfaces/pagination";
import { userSearchableFields } from "./user.constant";
import { Prisma, UserRole } from "../../../../prisma/generated/prisma";
import { paginationHelpers } from "../../../helpers/paginationHelpers";
import prisma from "../../../shared/prisma";


const createAUser = async (data: {
  email: string;
  name: string;
  password: string;
  role?: UserRole;
}) => {
  const hashedPassword: string = await bcrypt.hash(data.password, 12);

  const result = await prisma.user.create({
    data: {
      email: data.email,
      name: data.name,
      passwordHash: hashedPassword,
      role: data.role ?? UserRole.MANAGER,
    },
    select: {
      id: true,
      email: true,
      name: true,
      role: true,
      createdAt: true,
      updatedAt: true,
    },
  });

  return result;
};

const getAllUserData = async (params: any, options: IPaginationOptions) => {
  const { page, limit, sortBy, sortOrder, skip } =
    paginationHelpers.calculatePagination(options);
  const { searchTerm, ...filterData } = params;
  const andConditions: Prisma.UserWhereInput[] = [];

  if (searchTerm) {
    andConditions.push({
      OR: userSearchableFields.map((field) => ({
        [field]: {
          contains: searchTerm,
          mode: "insensitive",
        },
      })),
    });
  }

  if (Object.keys(filterData).length > 0) {
    andConditions.push({
      AND: Object.keys(filterData).map((key) => ({
        [key]: {
          equals: filterData[key as keyof typeof filterData],
        },
      })),
    });
  }

  const whereConditions: Prisma.UserWhereInput =
    andConditions.length > 0 ? { AND: andConditions } : {};

  const result = await prisma.user.findMany({
    where: whereConditions,
    skip,
    take: limit,
    orderBy:
      sortBy && sortOrder ? [{ [sortBy]: sortOrder }] : [{ createdAt: "asc" }],
    select: {
      id: true,
      email: true,
      name: true,
      role: true,
      createdAt: true,
      updatedAt: true,
    },
  });

  const total = await prisma.user.count({ where: whereConditions });

  return {
    meta: {
      page,
      limit,
      total,
    },
    data: result,
  };
};

const getMe = async (email: string) => {
  const result = await prisma.user.findUnique({
    where: { email },
    select: {
      id: true,
      email: true,
      name: true,
      role: true,
      createdAt: true,
      updatedAt: true,
    },
  });
  if (!result) throw new Error("User not found");
  return result;
};

const getAUser = async (id: string) => {
  const result = await prisma.user.findUnique({
    where: { id },
    select: {
      id: true,
      email: true,
      name: true,
      role: true,
      createdAt: true,
      updatedAt: true,
    },
  });
  if (!result) throw new Error("User not found");
  return result;
};

export const UserServices = {
  createAUser,
  getAllUserData,
  getMe,
  getAUser,
};
