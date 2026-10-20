import express from "express";
import { router } from "./route.js";
import { correlationId } from "./pkg/correlation/correlationId.js";
import { errorHandler } from "./lib/error/error.handler.js";
import cors from "cors";
import cookieParser from "cookie-parser";
export function createApp() {
  const app = express();
  app.use(cors({ origin: "http://localhost:4200" }));
  app.use('/uploads',express.static('uploads'));

  app.use(express.json());
  app.use(cookieParser());
  app.use(correlationId);
  app.get('/health',(req,res,next)=>{
    console.log("server is HIT")
    res.json('ok')
  })
  app.use("/api", router);
  app.use(errorHandler);
  return app;
}
