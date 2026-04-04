"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.categoryRoutes = void 0;
const express_1 = __importDefault(require("express"));
const category_controller_1 = require("./category.controller");
const auth_1 = require("../../middleWares/auth");
const prisma_1 = require("../../../../prisma/generated/prisma");
const router = express_1.default.Router();
router.post("/", (0, auth_1.auth)(prisma_1.UserRole.ADMIN, prisma_1.UserRole.MANAGER), category_controller_1.CategoryController.createCategory);
router.get("/", category_controller_1.CategoryController.getAllCategories);
router.get("/:id", category_controller_1.CategoryController.getCategoryById);
router.patch("/:id", category_controller_1.CategoryController.updateCategory);
router.delete("/:id", category_controller_1.CategoryController.deleteCategory);
exports.categoryRoutes = router;
