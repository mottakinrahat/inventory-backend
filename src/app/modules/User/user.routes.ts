import express from "express";
import { UserController } from "./user.controller";
import { auth } from "../../middleWares/auth";
import { UserRole } from "../../../../prisma/generated/prisma";

const router = express.Router();

router.post("/", UserController.createAUser);

router.get("/", UserController.getAllUser);
router.get("/me",  UserController.getMe);
router.get("/:id", UserController.getAUser);
export const userRoutes = router;
