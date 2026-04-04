"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.userRoutes = void 0;
const express_1 = __importDefault(require("express"));
const user_controller_1 = require("./user.controller");
const router = express_1.default.Router();
router.post("/", user_controller_1.UserController.createAUser);
router.get("/", user_controller_1.UserController.getAllUser);
router.get("/me", user_controller_1.UserController.getMe);
router.get("/:id", user_controller_1.UserController.getAUser);
exports.userRoutes = router;
