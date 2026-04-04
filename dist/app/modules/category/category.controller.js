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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.CategoryController = void 0;
const http_status_1 = __importDefault(require("http-status"));
const trycatch_1 = require("../../../helpers/trycatch");
const sendResponse_1 = require("../../../helpers/sendResponse");
const pick_1 = require("../../../shared/pick");
const category_constant_1 = require("./category.constant");
const category_services_1 = require("./category.services");
const createCategory = (0, trycatch_1.catchAsync)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const result = yield category_services_1.CategoryServices.createCategory(req.body, req.user);
    (0, sendResponse_1.sendResponse)(res, {
        success: true,
        statusCode: http_status_1.default.CREATED,
        message: "Category created successfully",
        data: result,
    });
}));
const getAllCategories = (0, trycatch_1.catchAsync)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const filter = (0, pick_1.pick)(req.query, category_constant_1.categoryFilterableFields);
    const options = (0, pick_1.pick)(req.query, ["page", "limit", "sortBy", "sortOrder"]);
    const result = yield category_services_1.CategoryServices.getAllCategories(filter, options);
    (0, sendResponse_1.sendResponse)(res, {
        success: true,
        statusCode: http_status_1.default.OK,
        message: "Categories retrieved successfully",
        meta: result === null || result === void 0 ? void 0 : result.meta,
        data: result === null || result === void 0 ? void 0 : result.data,
    });
}));
const getCategoryById = (0, trycatch_1.catchAsync)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const result = yield category_services_1.CategoryServices.getCategoryById(req.params.id);
    (0, sendResponse_1.sendResponse)(res, {
        success: true,
        statusCode: http_status_1.default.OK,
        message: "Category retrieved successfully",
        data: result,
    });
}));
const updateCategory = (0, trycatch_1.catchAsync)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const result = yield category_services_1.CategoryServices.updateCategory(req.params.id, req.body);
    (0, sendResponse_1.sendResponse)(res, {
        success: true,
        statusCode: http_status_1.default.OK,
        message: "Category updated successfully",
        data: result,
    });
}));
const deleteCategory = (0, trycatch_1.catchAsync)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    yield category_services_1.CategoryServices.deleteCategory(req.params.id);
    (0, sendResponse_1.sendResponse)(res, {
        success: true,
        statusCode: http_status_1.default.OK,
        message: "Category deleted successfully",
        data: null,
    });
}));
exports.CategoryController = {
    createCategory,
    getAllCategories,
    getCategoryById,
    updateCategory,
    deleteCategory,
};
