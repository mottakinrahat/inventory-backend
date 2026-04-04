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
exports.RestockQueueServices = exports.getStockPriority = void 0;
const prisma_1 = require("../../../../prisma/generated/prisma");
const paginationHelpers_1 = require("../../../helpers/paginationHelpers");
const prisma_2 = __importDefault(require("../../../shared/prisma"));
/**
 * Determine stock priority based on current stock vs threshold
 */
const getStockPriority = (stockQty, threshold) => {
    if (stockQty === 0)
        return prisma_1.StockPriority.HIGH;
    if (stockQty <= threshold / 2)
        return prisma_1.StockPriority.MEDIUM;
    if (stockQty <= threshold)
        return prisma_1.StockPriority.LOW;
    return null; // stock is healthy — remove from queue
};
exports.getStockPriority = getStockPriority;
const syncRestockQueue = (productId) => __awaiter(void 0, void 0, void 0, function* () {
    const product = yield prisma_2.default.product.findUniqueOrThrow({
        where: { id: productId },
    });
    const priority = (0, exports.getStockPriority)(product.stockQty, product.minStockThreshold);
    if (priority === null) {
        yield prisma_2.default.restockQueue.deleteMany({ where: { productId } });
        return null;
    }
    const result = yield prisma_2.default.restockQueue.upsert({
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
});
const getAllRestockQueue = (params, options) => __awaiter(void 0, void 0, void 0, function* () {
    const { page, limit, sortBy, sortOrder, skip } = paginationHelpers_1.paginationHelpers.calculatePagination(options);
    const { searchTerm } = params, filterData = __rest(params, ["searchTerm"]);
    const andConditions = [];
    // Filter by fields
    if (Object.keys(filterData).length > 0) {
        andConditions.push({
            AND: Object.keys(filterData).map((key) => {
                if (key === "isRestocked") {
                    return { [key]: { equals: filterData[key] === "true" } };
                }
                return {
                    [key]: { equals: filterData[key] },
                };
            }),
        });
    }
    const whereConditions = andConditions.length > 0 ? { AND: andConditions } : {};
    const result = yield prisma_2.default.restockQueue.findMany({
        where: whereConditions,
        skip,
        take: limit,
        orderBy: sortBy && sortOrder
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
    const total = yield prisma_2.default.restockQueue.count({ where: whereConditions });
    return {
        meta: { page, limit, total },
        data: result,
    };
});
const getRestockQueueById = (id) => __awaiter(void 0, void 0, void 0, function* () {
    const result = yield prisma_2.default.restockQueue.findUniqueOrThrow({
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
});
/**
 * Mark a restock queue entry as restocked (fulfilled).
 * Optionally update the product's stockQty with a new quantity.
 */
const markAsRestocked = (id, data, user) => __awaiter(void 0, void 0, void 0, function* () {
    const entry = yield prisma_2.default.restockQueue.findUniqueOrThrow({
        where: { id },
        include: { product: true },
    });
    const isUserExist = yield prisma_2.default.user.findUniqueOrThrow({
        where: { email: user.email },
    });
    return yield prisma_2.default.$transaction((tx) => __awaiter(void 0, void 0, void 0, function* () {
        let updatedStockQty = entry.product.stockQty;
        if (data.newStockQty !== undefined) {
            const updated = yield tx.product.update({
                where: { id: entry.productId },
                data: { stockQty: data.newStockQty },
            });
            updatedStockQty = updated.stockQty;
        }
        const updatedEntry = yield tx.restockQueue.update({
            where: { id },
            data: { isRestocked: true },
            include: {
                product: {
                    select: { id: true, name: true, price: true, status: true },
                },
            },
        });
        // Log the activity
        yield tx.activityLog.create({
            data: {
                action: "RESTOCK_FULFILLED",
                entityType: "RestockQueue",
                entityId: id,
                description: `Product "${entry.product.name}" restocked. New stock: ${updatedStockQty !== null && updatedStockQty !== void 0 ? updatedStockQty : entry.currentStock}.`,
                userId: isUserExist.id,
            },
        });
        return updatedEntry;
    }));
});
/**
 * Delete a restock queue entry manually (e.g. false alarm).
 */
const deleteRestockQueueEntry = (id) => __awaiter(void 0, void 0, void 0, function* () {
    const result = yield prisma_2.default.restockQueue.delete({ where: { id } });
    return result;
});
exports.RestockQueueServices = {
    syncRestockQueue,
    getAllRestockQueue,
    getRestockQueueById,
    markAsRestocked,
    deleteRestockQueueEntry,
};
