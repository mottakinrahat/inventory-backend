"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.userRoutes = void 0;
const express_1 = __importDefault(require("express"));
const user_controller_1 = require("./user.controller");
const auth_1 = require("../../middleWares/auth");
const prisma_1 = require("../../../../prisma/generated/prisma");
const router = express_1.default.Router();
router.post("/", user_controller_1.UserController.createAUser);
router.get("/", user_controller_1.UserController.getAllUser);
router.get("/me", (0, auth_1.auth)(prisma_1.UserRole.ADMIN, prisma_1.UserRole.MANAGER), user_controller_1.UserController.getMe);
router.get("/:id", user_controller_1.UserController.getAUser);
exports.userRoutes = router;
