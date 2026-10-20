import http from "http";
import { createApp } from "./app.js";
import { env } from "./lib/config/env.js";
import { logger } from "./pkg/logger/logger.js";
import mongoose from "mongoose";
import "./lib/db/mongoose.js";

const app = createApp();
const server = http.createServer(app);

app.listen(3003, () => {
  logger.info(`server is running on port 3003`);
});

async function shutdown() {
  server.close(async () => {
    await mongoose.disconnect();
    process.exit(0);
  });
}

process.on("SIGINT", shutdown);
process.on("SIGTERM", shutdown);
