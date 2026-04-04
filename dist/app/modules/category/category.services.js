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
exports.CategoryServices = void 0;
const paginationHelpers_1 = require("../../../helpers/paginationHelpers");
const prisma_1 = __importDefault(require("../../../shared/prisma"));
const category_constant_1 = require("./category.constant");
const createCategory = (data, user) => __awaiter(void 0, void 0, void 0, function* () {
    const isUserExist = yield prisma_1.default.user.findUniqueOrThrow({
        where: {
            email: user.email
        }
    });
    if (!isUserExist) {
        throw new Error("User not found");
    }
    const result = yield prisma_1.default.category.create({
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
});
const getAllCategories = (params, options) => __awaiter(void 0, void 0, void 0, function* () {
    const { page, limit, sortBy, sortOrder, skip } = paginationHelpers_1.paginationHelpers.calculatePagination(options);
    const { searchTerm } = params, filterData = __rest(params, ["searchTerm"]);
    const andConditions = [];
    if (searchTerm) {
        andConditions.push({
            OR: category_constant_1.categorySearchableFields.map((field) => ({
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
    const result = yield prisma_1.default.category.findMany({
        where: whereConditions,
        skip,
        take: limit,
        orderBy: sortBy && sortOrder ? [{ [sortBy]: sortOrder }] : [{ createdAt: "desc" }],
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
    const total = yield prisma_1.default.category.count({ where: whereConditions });
    return {
        meta: {
            page,
            limit,
            total,
        },
        data: result,
    };
});
const getCategoryById = (id) => __awaiter(void 0, void 0, void 0, function* () {
    const result = yield prisma_1.default.category.findUniqueOrThrow({
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
});
const updateCategory = (id, data) => __awaiter(void 0, void 0, void 0, function* () {
    const result = yield prisma_1.default.category.update({
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
});
const deleteCategory = (id) => __awaiter(void 0, void 0, void 0, function* () {
    const result = yield prisma_1.default.category.delete({
        where: { id },
    });
    return result;
});
exports.CategoryServices = {
    createCategory,
    getAllCategories,
    getCategoryById,
    updateCategory,
    deleteCategory,
};
