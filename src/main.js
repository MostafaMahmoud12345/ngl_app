import { config } from "dotenv";
config();

import "./common/mongoose.js";
import express from "express";
import { AppError } from "./common/error.js";
import  { logger } from "./common/logger.js";

import authRouter from "./app/auth/auth.route.js";
import massegerRouter from "./app/massege/massege.route.js";
import userRouter from "./app/user/user.route.js";

const app = express();

app.use(express.json());

app.use("/auth", authRouter);
app.use("/massege", massegerRouter);
app.use("/user", userRouter);

app.use((err, req, res, next) => {
  if (err.isOperational) {
    return res.status(err.statusCode).json({ error: err.message });
  }
  logger.error(err.message, { stack: err.stack });
  return res.status(500).json({ error: "something went wrong" });
});
app.listen(3000, () => {
  logger.info("server is running on port 3000");
});
