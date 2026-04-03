import { Prisma, ProductStatus } from "../../../../prisma/generated/prisma";
import { paginationHelpers } from "../../../helpers/paginationHelpers";
import prisma from "../../../shared/prisma";
import { IPaginationOptions } from "../../interfaces/pagination";
import { productSearchableFields } from "./product.constant";
import { RestockQueueServices } from "../restockQueue/restockQueue.services";

const createProduct = async (
  data: {
    name: string;
    price: number;
    stockQty?: number;
    minStockThreshold?: number;
    categoryId: string;
  },
  user: any
) => {
  const isUserExist = await prisma.user.findUniqueOrThrow({
    where: {
      email: user.email,
    },
  });

  if (!isUserExist) {
    throw new Error("User not found");
  }

  // Ensure category exists
  await prisma.category.findUniqueOrThrow({
    where: { id: data.categoryId },
  });

  const result = await prisma.product.create({
    data: {
      ...data,
      createdById: isUserExist.id,
    },
    include: {
      category: {
        select: {
          id: true,
          name: true,
        },
      },
      createdBy: {
        select: {
          id: true,
          name: true,
          email: true,
        },
      },
    },
  });

  // Log the activity
  await prisma.activityLog.create({
    data: {
      action: "PRODUCT_CREATED",
      entityType: "Product",
      entityId: result.id,
      description: `Product "${result.name}" created with price $${result.price} and initial stock ${result.stockQty}.`,
      userId: isUserExist.id,
    },
  });

  // Sync restock queue in case initial stock is below threshold
  await RestockQueueServices.syncRestockQueue(result.id);

  return result;
};

const getAllProducts = async (params: any, options: IPaginationOptions) => {
  const { page, limit, sortBy, sortOrder, skip } =
    paginationHelpers.calculatePagination(options);
  const { searchTerm, ...filterData } = params;
  const andConditions: Prisma.ProductWhereInput[] = [];

  if (searchTerm) {
    andConditions.push({
      OR: productSearchableFields.map((field) => ({
        [field]: {
          contains: searchTerm,
          mode: "insensitive",
        },
      })),
    });
  }

  if (Object.keys(filterData).length > 0) {
    andConditions.push({
      AND: Object.keys(filterData).map((key) => {
         if (key === 'price' || key === 'stockQty' || key === 'minStockThreshold') {
          return {
             [key]: {
              equals: Number(filterData[key as keyof typeof filterData]),
            },
          }
        }
        return {
          [key]: {
            equals: filterData[key as keyof typeof filterData],
          },
        }
      }),
    });
  }

  const whereConditions: Prisma.ProductWhereInput =
    andConditions.length > 0 ? { AND: andConditions } : {};

  const result = await prisma.product.findMany({
    where: whereConditions,
    skip,
    take: limit,
    orderBy: sortBy && sortOrder ? [{ [sortBy]: sortOrder }] : [{ createdAt: "desc" }],
    include: {
      category: {
        select: { id: true, name: true },
      },
      createdBy: {
        select: { id: true, name: true, email: true },
      },
    },
  });

  const total = await prisma.product.count({ where: whereConditions });

  return {
    meta: {
      page,
      limit,
      total,
    },
    data: result,
  };
};

const getProductById = async (id: string) => {
  const result = await prisma.product.findUniqueOrThrow({
    where: { id },
    include: {
      category: {
        select: { id: true, name: true },
      },
      createdBy: {
        select: { id: true, name: true, email: true },
      },
    },
  });

  return result;
};

const updateProduct = async (
  id: string,
  data: Partial<{
    name: string;
    price: number;
    stockQty: number;
    minStockThreshold: number;
    status: ProductStatus;
    categoryId: string;
  }>,
  user?: any
) => {
  if (data.categoryId) {
    await prisma.category.findUniqueOrThrow({
      where: { id: data.categoryId },
    });
  }

  const result = await prisma.product.update({
    where: { id },
    data,
    include: {
      category: {
        select: { id: true, name: true },
      },
    },
  });

  // Log the activity if user is provided
  if (user) {
    const isUserExist = await prisma.user.findUnique({ where: { email: user.email } });
    if (isUserExist) {
      const changedFields = Object.keys(data).join(", ");
      await prisma.activityLog.create({
        data: {
          action: "PRODUCT_UPDATED",
          entityType: "Product",
          entityId: result.id,
          description: `Product "${result.name}" updated. Fields changed: ${changedFields}.`,
          userId: isUserExist.id,
        },
      });
    }
  }

  // Sync restock queue whenever stock-related fields change
  if (data.stockQty !== undefined || data.minStockThreshold !== undefined) {
    await RestockQueueServices.syncRestockQueue(id);
  }

  return result;
};

const deleteProduct = async (id: string, user?: any) => {
  const product = await prisma.product.findUniqueOrThrow({ where: { id } });

  // Remove from restock queue first (cascade would handle it, but explicit is safer)
  await prisma.restockQueue.deleteMany({ where: { productId: id } });

  const result = await prisma.product.delete({
    where: { id },
  });

  // Log the activity if user is provided
  if (user) {
    const isUserExist = await prisma.user.findUnique({ where: { email: user.email } });
    if (isUserExist) {
      await prisma.activityLog.create({
        data: {
          action: "PRODUCT_DELETED",
          entityType: "Product",
          entityId: id,
          description: `Product "${product.name}" was permanently deleted.`,
          userId: isUserExist.id,
        },
      });
    }
  }

  return result;
};

export const ProductServices = {
  createProduct,
  getAllProducts,
  getProductById,
  updateProduct,
  deleteProduct,
};
