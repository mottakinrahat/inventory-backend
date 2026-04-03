import express from "express";
import { userRoutes } from "../modules/User/user.routes";
import { authRoutes } from "../modules/auth/auth.routes";
import { categoryRoutes } from "../modules/category/category.routes";
import { productRoutes } from "../modules/product/product.routes";
import { orderRoutes } from "../modules/order/order.routes";
import { restockQueueRoutes } from "../modules/restockQueue/restockQueue.routes";
import { activityLogRoutes } from "../modules/activityLog/activityLog.routes";

const router = express.Router();

const moduleRouter = [
  {
    path: "/user",
    route: userRoutes,
  },
  {
    path: "/auth",
    route: authRoutes,
  },
  {
    path: "/category",
    route: categoryRoutes,
  },
  {
    path: "/product",
    route: productRoutes,
  },
  {
    path: "/order",
    route: orderRoutes,
  },
  {
    path: "/restock-queue",
    route: restockQueueRoutes,
  },
  {
    path: "/activity-log",
    route: activityLogRoutes,
  },
];
 

moduleRouter.forEach((route) => router.use(route.path, route.route));

export default router;
