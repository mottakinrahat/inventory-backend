"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const user_routes_1 = require("../modules/User/user.routes");
const auth_routes_1 = require("../modules/auth/auth.routes");
const category_routes_1 = require("../modules/category/category.routes");
const product_routes_1 = require("../modules/product/product.routes");
const order_routes_1 = require("../modules/order/order.routes");
const restockQueue_routes_1 = require("../modules/restockQueue/restockQueue.routes");
const activityLog_routes_1 = require("../modules/activityLog/activityLog.routes");
const router = express_1.default.Router();
const moduleRouter = [
    {
        path: "/user",
        route: user_routes_1.userRoutes,
    },
    {
        path: "/auth",
        route: auth_routes_1.authRoutes,
    },
    {
        path: "/category",
        route: category_routes_1.categoryRoutes,
    },
    {
        path: "/product",
        route: product_routes_1.productRoutes,
    },
    {
        path: "/order",
        route: order_routes_1.orderRoutes,
    },
    {
        path: "/restock-queue",
        route: restockQueue_routes_1.restockQueueRoutes,
    },
    {
        path: "/activity-log",
        route: activityLog_routes_1.activityLogRoutes,
    },
];
moduleRouter.forEach((route) => router.use(route.path, route.route));
exports.default = router;
