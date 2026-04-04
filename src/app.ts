import express, {  Request, Response } from "express";
import cors from "cors";

import router from "./app/routes";
import { globalErrorHandler } from "./app/middleWares/globalErrorHandler";

import notFound from "./app/middleWares/notFound";
import cookieParser from "cookie-parser";


import config from "./config";
const app = express();
app.use(
  cors({
    origin: [config.frontend_url as string, "http://localhost:3001"],
    credentials: true,
  })
);
app.use(cookieParser())
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.get("/", (req:Request, res:Response) => {
  res.send("Hello World!");
});

app.use('/api/v1',router)



app.use(globalErrorHandler);
app.use(notFound);
export default app;