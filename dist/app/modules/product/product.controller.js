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
exports.ProductController = void 0;
const http_status_1 = __importDefault(require("http-status"));
const trycatch_1 = require("../../../helpers/trycatch");
const sendResponse_1 = require("../../../helpers/sendResponse");
const pick_1 = require("../../../shared/pick");
const product_constant_1 = require("./product.constant");
const product_services_1 = require("./product.services");
const createProduct = (0, trycatch_1.catchAsync)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    console.log(req.body);
    const result = yield product_services_1.ProductServices.createProduct(req.body, req.user);
    (0, sendResponse_1.sendResponse)(res, {
        success: true,
        statusCode: http_status_1.default.CREATED,
        message: "Product created successfully",
        data: result,
    });
}));
const getAllProducts = (0, trycatch_1.catchAsync)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const filter = (0, pick_1.pick)(req.query, product_constant_1.productFilterableFields);
    const options = (0, pick_1.pick)(req.query, ["page", "limit", "sortBy", "sortOrder"]);
    const result = yield product_services_1.ProductServices.getAllProducts(filter, options);
    (0, sendResponse_1.sendResponse)(res, {
        success: true,
        statusCode: http_status_1.default.OK,
        message: "Products retrieved successfully",
        meta: result === null || result === void 0 ? void 0 : result.meta,
        data: result === null || result === void 0 ? void 0 : result.data,
    });
}));
const getMyProducts = (0, trycatch_1.catchAsync)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const filter = (0, pick_1.pick)(req.query, product_constant_1.productFilterableFields);
    const options = (0, pick_1.pick)(req.query, ["page", "limit", "sortBy", "sortOrder"]);
    const result = yield product_services_1.ProductServices.getMyProducts(req.user, filter, options);
    (0, sendResponse_1.sendResponse)(res, {
        success: true,
        statusCode: http_status_1.default.OK,
        message: "My products retrieved successfully",
        meta: result === null || result === void 0 ? void 0 : result.meta,
        data: result === null || result === void 0 ? void 0 : result.data,
    });
}));
const getProductById = (0, trycatch_1.catchAsync)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const result = yield product_services_1.ProductServices.getProductById(req.params.id);
    (0, sendResponse_1.sendResponse)(res, {
        success: true,
        statusCode: http_status_1.default.OK,
        message: "Product retrieved successfully",
        data: result,
    });
}));
const updateProduct = (0, trycatch_1.catchAsync)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const result = yield product_services_1.ProductServices.updateProduct(req.params.id, req.body, req.user);
    (0, sendResponse_1.sendResponse)(res, {
        success: true,
        statusCode: http_status_1.default.OK,
        message: "Product updated successfully",
        data: result,
    });
}));
const deleteProduct = (0, trycatch_1.catchAsync)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    yield product_services_1.ProductServices.deleteProduct(req.params.id, req.user);
    (0, sendResponse_1.sendResponse)(res, {
        success: true,
        statusCode: http_status_1.default.OK,
        message: "Product deleted successfully",
        data: null,
    });
}));
exports.ProductController = {
    createProduct,
    getAllProducts,
    getProductById,
    updateProduct,
    deleteProduct,
    getMyProducts,
};
