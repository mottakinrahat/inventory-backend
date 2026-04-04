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
exports.ProductServices = void 0;
const paginationHelpers_1 = require("../../../helpers/paginationHelpers");
const prisma_1 = __importDefault(require("../../../shared/prisma"));
const product_constant_1 = require("./product.constant");
const restockQueue_services_1 = require("../restockQueue/restockQueue.services");
const createProduct = (data, user) => __awaiter(void 0, void 0, void 0, function* () {
    const isUserExist = yield prisma_1.default.user.findUniqueOrThrow({
        where: {
            email: user.email,
        },
    });
    if (!isUserExist) {
        throw new Error("User not found");
    }
    // Ensure category exists
    yield prisma_1.default.category.findUniqueOrThrow({
        where: { id: data.categoryId },
    });
    const result = yield prisma_1.default.product.create({
        data: Object.assign(Object.assign({}, data), { createdById: isUserExist.id }),
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
    yield prisma_1.default.activityLog.create({
        data: {
            action: "PRODUCT_CREATED",
            entityType: "Product",
            entityId: result.id,
            description: `Product "${result.name}" created with price $${result.price} and initial stock ${result.stockQty}.`,
            userId: isUserExist.id,
        },
    });
    // Sync restock queue in case initial stock is below threshold
    yield restockQueue_services_1.RestockQueueServices.syncRestockQueue(result.id);
    return result;
});
const getAllProducts = (params, options) => __awaiter(void 0, void 0, void 0, function* () {
    const { page, limit, sortBy, sortOrder, skip } = paginationHelpers_1.paginationHelpers.calculatePagination(options);
    const { searchTerm } = params, filterData = __rest(params, ["searchTerm"]);
    const andConditions = [];
    if (searchTerm) {
        andConditions.push({
            OR: product_constant_1.productSearchableFields.map((field) => ({
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
                            equals: Number(filterData[key]),
                        },
                    };
                }
                return {
                    [key]: {
                        equals: filterData[key],
                    },
                };
            }),
        });
    }
    const whereConditions = andConditions.length > 0 ? { AND: andConditions } : {};
    const result = yield prisma_1.default.product.findMany({
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
    const total = yield prisma_1.default.product.count({ where: whereConditions });
    return {
        meta: {
            page,
            limit,
            total,
        },
        data: result,
    };
});
const getMyProducts = (user, params, options) => __awaiter(void 0, void 0, void 0, function* () {
    const { page, limit, sortBy, sortOrder, skip } = paginationHelpers_1.paginationHelpers.calculatePagination(options);
    const isUserExist = yield prisma_1.default.user.findUniqueOrThrow({
        where: {
            email: user.email,
        },
    });
    const { searchTerm } = params, filterData = __rest(params, ["searchTerm"]);
    const andConditions = [
        {
            createdById: isUserExist.id,
        },
    ];
    if (searchTerm) {
        andConditions.push({
            OR: product_constant_1.productSearchableFields.map((field) => ({
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
                if (key === "price" || key === "stockQty" || key === "minStockThreshold") {
                    return {
                        [key]: {
                            equals: Number(filterData[key]),
                        },
                    };
                }
                return {
                    [key]: {
                        equals: filterData[key],
                    },
                };
            }),
        });
    }
    const whereConditions = { AND: andConditions };
    const result = yield prisma_1.default.product.findMany({
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
    const total = yield prisma_1.default.product.count({ where: whereConditions });
    return {
        meta: {
            page,
            limit,
            total,
        },
        data: result,
    };
});
const getProductById = (id) => __awaiter(void 0, void 0, void 0, function* () {
    const result = yield prisma_1.default.product.findUniqueOrThrow({
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
});
const updateProduct = (id, data, user) => __awaiter(void 0, void 0, void 0, function* () {
    if (data.categoryId) {
        yield prisma_1.default.category.findUniqueOrThrow({
            where: { id: data.categoryId },
        });
    }
    const result = yield prisma_1.default.product.update({
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
        const isUserExist = yield prisma_1.default.user.findUnique({ where: { email: user.email } });
        if (isUserExist) {
            const changedFields = Object.keys(data).join(", ");
            yield prisma_1.default.activityLog.create({
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
        yield restockQueue_services_1.RestockQueueServices.syncRestockQueue(id);
    }
    return result;
});
const deleteProduct = (id, user) => __awaiter(void 0, void 0, void 0, function* () {
    const product = yield prisma_1.default.product.findUniqueOrThrow({ where: { id } });
    // Remove from restock queue first (cascade would handle it, but explicit is safer)
    yield prisma_1.default.restockQueue.deleteMany({ where: { productId: id } });
    const result = yield prisma_1.default.product.delete({
        where: { id },
    });
    // Log the activity if user is provided
    if (user) {
        const isUserExist = yield prisma_1.default.user.findUnique({ where: { email: user.email } });
        if (isUserExist) {
            yield prisma_1.default.activityLog.create({
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
});
exports.ProductServices = {
    createProduct,
    getAllProducts,
    getProductById,
    updateProduct,
    deleteProduct,
    getMyProducts,
};
