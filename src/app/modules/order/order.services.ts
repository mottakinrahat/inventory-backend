import { Prisma, OrderStatus } from "../../../../prisma/generated/prisma";
import { paginationHelpers } from "../../../helpers/paginationHelpers";
import prisma from "../../../shared/prisma";
import { IPaginationOptions } from "../../interfaces/pagination";
import { orderSearchableFields } from "./order.constant";
import { RestockQueueServices } from "../restockQueue/restockQueue.services";

const createOrder = async (
  data: {
    customerName: string;
    customerEmail?: string;
    items: { productId: string; quantity: number }[];
  },
  user: any
) => {
  const isUserExist = await prisma.user.findUniqueOrThrow({
    where: {
      email: user.email,
    },
  });

  const result = await prisma.$transaction(async (tx) => {
    let totalPrice = 0;
    const orderItemsData = [];

    // Calculate prices and deduct stock
    for (const item of data.items) {
      const product = await tx.product.findUniqueOrThrow({
        where: { id: item.productId },
      });

      if (product.stockQty < item.quantity) {
        throw new Error(`Insufficient stock for product ${product.name}`);
      }

      const subtotal = item.quantity * product.price;
      totalPrice += subtotal;

      // Update product stock
      await tx.product.update({
        where: { id: product.id },
        data: { stockQty: product.stockQty - item.quantity },
      });

      orderItemsData.push({
        productId: product.id,
        quantity: item.quantity,
        unitPrice: product.price,
        subtotal,
      });
    }

    const order = await tx.order.create({
      data: {
        customerName: data.customerName,
        customerEmail: data.customerEmail,
        totalPrice,
        createdById: isUserExist.id,
        items: {
          create: orderItemsData,
        },
      },
      include: {
        items: true,
      },
    });

    // Log the activity
    await tx.activityLog.create({
      data: {
        action: "ORDER_CREATED",
        entityType: "Order",
        entityId: order.id,
        description: `Order #${order.orderNumber} created for customer "${order.customerName}" with total $${order.totalPrice.toFixed(2)}.`,
        userId: isUserExist.id,
      },
    });

    return order;
  });

  // Sync restock queue for each product affected by this order (outside transaction)
  for (const item of data.items) {
    await RestockQueueServices.syncRestockQueue(item.productId);
  }

  return result;
};

const getAllOrders = async (params: any, options: IPaginationOptions) => {
  const { page, limit, sortBy, sortOrder, skip } =
    paginationHelpers.calculatePagination(options);
  const { searchTerm, ...filterData } = params;
  const andConditions: Prisma.OrderWhereInput[] = [];

  if (searchTerm) {
    andConditions.push({
      OR: orderSearchableFields.map((field) => ({
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

  const whereConditions: Prisma.OrderWhereInput =
    andConditions.length > 0 ? { AND: andConditions } : {};

  const result = await prisma.order.findMany({
    where: whereConditions,
    skip,
    take: limit,
    orderBy: sortBy && sortOrder ? [{ [sortBy]: sortOrder }] : [{ createdAt: "desc" }],
    include: {
      createdBy: {
        select: { id: true, name: true, email: true },
      },
      items: {
        include: { product: true }
      }
    },
  });

  const total = await prisma.order.count({ where: whereConditions });

  return {
    meta: {
      page,
      limit,
      total,
    },
    data: result,
  };
};

const getOrderById = async (id: string) => {
  const result = await prisma.order.findUniqueOrThrow({
    where: { id },
    include: {
      createdBy: {
        select: { id: true, name: true, email: true },
      },
       items: {
        include: { product: true }
      }
    },
  });

  return result;
};

const updateOrder = async (
  id: string,
  data: Partial<{
    status: OrderStatus;
  }>
) => {
  const result = await prisma.order.update({
    where: { id },
    data,
     include: {
       items: {
        include: { product: true }
      }
    },
  });

  return result;
};

export const OrderServices = {
  createOrder,
  getAllOrders,
  getOrderById,
  updateOrder,
};
