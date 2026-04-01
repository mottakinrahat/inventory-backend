import { Prisma } from "../../../../prisma/generated/prisma";
import { paginationHelpers } from "../../../helpers/paginationHelpers";
import prisma from "../../../shared/prisma";
import { IPaginationOptions } from "../../interfaces/pagination";
import { categorySearchableFields } from "./category.constant";

const createCategory = async (
  data: { name: string; description?: string },
  user:any
) => {
  const isUserExist=await prisma.user.findUniqueOrThrow({
    where:{
      email:user.email
    }
  })
  if(!isUserExist){
    throw new Error("User not found")
  }
  const result = await prisma.category.create({
    data: {
      name: data.name,
      description: data.description,
      createdById: isUserExist.id,
    },
    select: {
      id: true,
      name: true,
      description: true,
      createdAt: true,
      createdBy: {
        select: {
          id: true,
          name: true,
          email: true,
        },
      },
    },
  });

  return result;
};

const getAllCategories = async (
  params: any,
  options: IPaginationOptions
) => {
  const { page, limit, sortBy, sortOrder, skip } =
    paginationHelpers.calculatePagination(options);
  const { searchTerm, ...filterData } = params;
  const andConditions: Prisma.CategoryWhereInput[] = [];

  if (searchTerm) {
    andConditions.push({
      OR: categorySearchableFields.map((field) => ({
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

  const whereConditions: Prisma.CategoryWhereInput =
    andConditions.length > 0 ? { AND: andConditions } : {};

  const result = await prisma.category.findMany({
    where: whereConditions,
    skip,
    take: limit,
    orderBy:
      sortBy && sortOrder ? [{ [sortBy]: sortOrder }] : [{ createdAt: "desc" }],
    select: {
      id: true,
      name: true,
      description: true,
      createdAt: true,
      createdBy: {
        select: {
          id: true,
          name: true,
          email: true,
        },
      },
      _count: {
        select: { products: true },
      },
    },
  });

  const total = await prisma.category.count({ where: whereConditions });

  return {
    meta: {
      page,
      limit,
      total,
    },
    data: result,
  };
};

const getCategoryById = async (id: string) => {
  const result = await prisma.category.findUniqueOrThrow({
    where: { id },
    select: {
      id: true,
      name: true,
      description: true,
      createdAt: true,
      createdBy: {
        select: {
          id: true,
          name: true,
          email: true,
        },
      },
      products: {
        select: {
          id: true,
          name: true,
          price: true,
          stockQty: true,
          status: true,
        },
      },
    },
  });

  return result;
};

const updateCategory = async (
  id: string,
  data: { name?: string; description?: string }
) => {
  const result = await prisma.category.update({
    where: { id },
    data,
    select: {
      id: true,
      name: true,
      description: true,
      createdAt: true,
    },
  });

  return result;
};

const deleteCategory = async (id: string) => {
  const result = await prisma.category.delete({
    where: { id },
  });

  return result;
};

export const CategoryServices = {
  createCategory,
  getAllCategories,
  getCategoryById,
  updateCategory,
  deleteCategory,
};
