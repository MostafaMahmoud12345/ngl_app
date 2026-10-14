// import http from "http";
// import { createApp } from "./app.js";
// import { env } from "./lib/config/env.js";
// import { logger } from "./pkg/logger/logger.js";
// import mongoose from "mongoose";
// const app = createApp();
// const server = http.createServer(app);
// app.listen(env.port, () => {
//   logger.info(`server is running on port ${env.port}`);
// });
// async function shutdown() {
//   server.close(async () => {
//     await mongoose.disconnect();
//     process.exit(0);
//   });
// }
// process.on("SIGINT", shutdown);
// process.on("SIGTERM", shutdown);

import http from "http";
import { createApp } from "./app.js";
import { env } from "./lib/config/env.js";
import { logger } from "./pkg/logger/logger.js";
import mongoose from "mongoose";
import  "./lib/db/mongoose.js"; 

const app = createApp();
const server = http.createServer(app);

app.listen(env.port, () => {
  logger.info(`server is running on port ${env.port}`);
});

async function shutdown() {
  server.close(async () => {
    await mongoose.disconnect();
    process.exit(0);
  });
}

process.on("SIGINT", shutdown);
process.on("SIGTERM", shutdown);


