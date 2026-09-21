import { config } from "dotenv";
config();

import "./common/mongoose.js";
import express from "express";

import authRouter from "./app/auth/auth.route.js";
import massegerRouter from "./app/massege/massege.route.js";
import userRouter from "./app/user/user.route.js";

const app = express();

app.use(express.json());

app.use("/auth", authRouter);
app.use("/massege", massegerRouter);
app.use("/user", userRouter);

app.use((err, req, res, next) => {
  res.status(err.status||500 ).json({ error: err.message, stack: err.stack });
});
app.listen(3000, () => {
  console.log("server is running on port 3000");
});
