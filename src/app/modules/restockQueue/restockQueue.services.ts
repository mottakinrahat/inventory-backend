import { Prisma, StockPriority } from "../../../../prisma/generated/prisma";
import { paginationHelpers } from "../../../helpers/paginationHelpers";
import prisma from "../../../shared/prisma";
import { IPaginationOptions } from "../../interfaces/pagination";
import { restockQueueFilterableFields } from "./restockQueue.constant";

/**
 * Determine stock priority based on current stock vs threshold
 */
export const getStockPriority = (
  stockQty: number,
  threshold: number
): StockPriority | null => {
  if (stockQty === 0) return StockPriority.HIGH;
  if (stockQty <= threshold / 2) return StockPriority.MEDIUM;
  if (stockQty <= threshold) return StockPriority.LOW;
  return null; // stock is healthy — remove from queue
};

const syncRestockQueue = async (productId: string) => {
  const product = await prisma.product.findUniqueOrThrow({
    where: { id: productId },
  });

  const priority = getStockPriority(product.stockQty, product.minStockThreshold);

  if (priority === null) {
    await prisma.restockQueue.deleteMany({ where: { productId } });
    return null;
  }

  const result = await prisma.restockQueue.upsert({
    where: { productId },
    update: {
      currentStock: product.stockQty,
      threshold: product.minStockThreshold,
      priority,
      isRestocked: false,
      updatedAt: new Date(),
    },
    create: {
      productId,
      currentStock: product.stockQty,
      threshold: product.minStockThreshold,
      priority,
    },
    include: {
      product: {
        select: { id: true, name: true, price: true, status: true },
      },
    },
  });

  return result;
};

const getAllRestockQueue = async (
  params: any,
  options: IPaginationOptions
) => {
  const { page, limit, sortBy, sortOrder, skip } =
    paginationHelpers.calculatePagination(options);
  const { searchTerm, ...filterData } = params;
  const andConditions: Prisma.RestockQueueWhereInput[] = [];

  // Filter by fields
  if (Object.keys(filterData).length > 0) {
    andConditions.push({
      AND: Object.keys(filterData).map((key) => {
        if (key === "isRestocked") {
          return { [key]: { equals: filterData[key] === "true" } };
        }
        return {
          [key]: { equals: filterData[key as keyof typeof filterData] },
        };
      }),
    });
  }

  const whereConditions: Prisma.RestockQueueWhereInput =
    andConditions.length > 0 ? { AND: andConditions } : {};

  const result = await prisma.restockQueue.findMany({
    where: whereConditions,
    skip,
    take: limit,
    orderBy:
      sortBy && sortOrder
        ? [{ [sortBy]: sortOrder }]
        : [{ priority: "asc" }, { createdAt: "desc" }],
    include: {
      product: {
        select: {
          id: true,
          name: true,
          price: true,
          status: true,
          category: { select: { id: true, name: true } },
        },
      },
    },
  });

  const total = await prisma.restockQueue.count({ where: whereConditions });

  return {
    meta: { page, limit, total },
    data: result,
  };
};

const getRestockQueueById = async (id: string) => {
  const result = await prisma.restockQueue.findUniqueOrThrow({
    where: { id },
    include: {
      product: {
        select: {
          id: true,
          name: true,
          price: true,
          stockQty: true,
          minStockThreshold: true,
          status: true,
          category: { select: { id: true, name: true } },
        },
      },
    },
  });

  return result;
};

/**
 * Mark a restock queue entry as restocked (fulfilled).
 * Optionally update the product's stockQty with a new quantity.
 */
const markAsRestocked = async (
  id: string,
  data: { newStockQty?: number },
  user: any
) => {
  const entry = await prisma.restockQueue.findUniqueOrThrow({
    where: { id },
    include: { product: true },
  });

  const isUserExist = await prisma.user.findUniqueOrThrow({
    where: { email: user.email },
  });

  return await prisma.$transaction(async (tx) => {
    let updatedStockQty = entry.product.stockQty;

    if (data.newStockQty !== undefined) {
      const updated = await tx.product.update({
        where: { id: entry.productId },
        data: { stockQty: data.newStockQty },
      });
      updatedStockQty = updated.stockQty;
    }

    const updatedEntry = await tx.restockQueue.update({
      where: { id },
      data: { isRestocked: true },
      include: {
        product: {
          select: { id: true, name: true, price: true, status: true },
        },
      },
    });

    // Log the activity
    await tx.activityLog.create({
      data: {
        action: "RESTOCK_FULFILLED",
        entityType: "RestockQueue",
        entityId: id,
        description: `Product "${entry.product.name}" restocked. New stock: ${updatedStockQty ?? entry.currentStock}.`,
        userId: isUserExist.id,
      },
    });

    return updatedEntry;
  });
};

/**
 * Delete a restock queue entry manually (e.g. false alarm).
 */
const deleteRestockQueueEntry = async (id: string) => {
  const result = await prisma.restockQueue.delete({ where: { id } });
  return result;
};

export const RestockQueueServices = {
  syncRestockQueue,
  getAllRestockQueue,
  getRestockQueueById,
  markAsRestocked,
  deleteRestockQueueEntry,
};
