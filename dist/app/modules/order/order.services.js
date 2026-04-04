"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __rest = (this && this.__rest) || function (s, e) {
    var t = {};
    for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p) && e.indexOf(p) < 0)
        t[p] = s[p];
    if (s != null && typeof Object.getOwnPropertySymbols === "function")
        for (var i = 0, p = Object.getOwnPropertySymbols(s); i < p.length; i++) {
            if (e.indexOf(p[i]) < 0 && Object.prototype.propertyIsEnumerable.call(s, p[i]))
                t[p[i]] = s[p[i]];
        }
    return t;
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.OrderServices = void 0;
const paginationHelpers_1 = require("../../../helpers/paginationHelpers");
const prisma_1 = __importDefault(require("../../../shared/prisma"));
const order_constant_1 = require("./order.constant");
const restockQueue_services_1 = require("../restockQueue/restockQueue.services");
const createOrder = (data, user) => __awaiter(void 0, void 0, void 0, function* () {
    const isUserExist = yield prisma_1.default.user.findUniqueOrThrow({
        where: {
            email: user.email,
        },
    });
    const result = yield prisma_1.default.$transaction((tx) => __awaiter(void 0, void 0, void 0, function* () {
        let totalPrice = 0;
        const orderItemsData = [];
        // Calculate prices and deduct stock
        for (const item of data.items) {
            const product = yield tx.product.findUniqueOrThrow({
                where: { id: item.productId },
            });
            if (product.stockQty < item.quantity) {
                throw new Error(`Insufficient stock for product ${product.name}`);
            }
            const subtotal = item.quantity * product.price;
            totalPrice += subtotal;
            // Update product stock
            yield tx.product.update({
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
        const order = yield tx.order.create({
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
        yield tx.activityLog.create({
            data: {
                action: "ORDER_CREATED",
                entityType: "Order",
                entityId: order.id,
                description: `Order #${order.orderNumber} created for customer "${order.customerName}" with total $${order.totalPrice.toFixed(2)}.`,
                userId: isUserExist.id,
            },
        });
        return order;
    }));
    // Sync restock queue for each product affected by this order (outside transaction)
    for (const item of data.items) {
        yield restockQueue_services_1.RestockQueueServices.syncRestockQueue(item.productId);
    }
    return result;
});
const getAllOrders = (params, options) => __awaiter(void 0, void 0, void 0, function* () {
    const { page, limit, sortBy, sortOrder, skip } = paginationHelpers_1.paginationHelpers.calculatePagination(options);
    const { searchTerm } = params, filterData = __rest(params, ["searchTerm"]);
    const andConditions = [];
    if (searchTerm) {
        andConditions.push({
            OR: order_constant_1.orderSearchableFields.map((field) => ({
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
                    equals: filterData[key],
                },
            })),
        });
    }
    const whereConditions = andConditions.length > 0 ? { AND: andConditions } : {};
    const result = yield prisma_1.default.order.findMany({
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
    const total = yield prisma_1.default.order.count({ where: whereConditions });
    return {
        meta: {
            page,
            limit,
            total,
        },
        data: result,
    };
});
const getOrderById = (id) => __awaiter(void 0, void 0, void 0, function* () {
    const result = yield prisma_1.default.order.findUniqueOrThrow({
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
});
const updateOrder = (id, data) => __awaiter(void 0, void 0, void 0, function* () {
    const result = yield prisma_1.default.order.update({
        where: { id },
        data,
        include: {
            items: {
                include: { product: true }
            }
        },
    });
    return result;
});
exports.OrderServices = {
    createOrder,
    getAllOrders,
    getOrderById,
    updateOrder,
};
