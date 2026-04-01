import express from "express";
import { CategoryController } from "./category.controller";
import { auth } from "../../middleWares/auth";
import { UserRole } from "../../../../prisma/generated/prisma";

const router = express.Router();

router.post("/", auth(UserRole.ADMIN, UserRole.MANAGER), CategoryController.createCategory);

router.get("/", CategoryController.getAllCategories);

router.get("/:id", CategoryController.getCategoryById);

router.patch("/:id", CategoryController.updateCategory);

router.delete("/:id", CategoryController.deleteCategory);

export const categoryRoutes = router;
