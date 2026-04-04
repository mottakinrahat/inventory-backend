import express from "express";
import { ProductController } from "./product.controller";
import { auth } from "../../middleWares/auth";
import validateRequest  from "../../middleWares/validateRequest";
import { UserRole } from "../../../../prisma/generated/prisma";
import { ProductValidation } from "./product.validation";

const router = express.Router();

router.post(
  "/",
  auth(UserRole.ADMIN, UserRole.MANAGER),
  ProductController.createProduct
);

router.get("/", ProductController.getAllProducts);

router.get("/my-products", auth(), ProductController.getMyProducts);

router.get("/:id", ProductController.getProductById);

router.patch(
  "/:id",
  auth(UserRole.ADMIN, UserRole.MANAGER),
  validateRequest(ProductValidation.updateProductValidation),
  ProductController.updateProduct
);

router.delete(
  "/:id",
  auth(UserRole.ADMIN, UserRole.MANAGER),
  ProductController.deleteProduct
);

export const productRoutes = router;
