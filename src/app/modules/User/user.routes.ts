import express from "express";
import { UserController } from "./user.controller";

const router = express.Router();

router.post("/", UserController.createAUser);

router.get("/", UserController.getAllUser);

export const userRoutes = router;
