import { connectDB, disconnectDB } from "./config/db.js";
import { env } from "./config/env.js";
import dotenv from "dotenv";
import { logger } from "./utils/logger.js";
import app from "./app.js";

dotenv.config({
  quiet: true,
  path: ".env",
});

let server;

const startServer = async () => {
  try {
    await connectDB();
    server = app.listen(env.PORT, () => {
      logger.info(`🚀 Server started on port ${env.PORT} in ${env.NODE_ENV} mode`);
    });
  } catch (error) {
    logger.error("❌ Startup failed", error);
    process.exit(1);
  }
};

let isShuttingDown = false;

const gracefulShutdown = async (signal) => {
  if (isShuttingDown) return;
  isShuttingDown = true;
  logger.info(`🚦 ${signal} received. Starting graceful shutdown...`);
  try {
    if (server) {
      await new Promise((resolve) => server.close(resolve));
      logger.info("✅ HTTP server closed");
    }
    await disconnectDB();
    logger.info("👋 Graceful shutdown completed");
    setTimeout(() => process.exit(0), 100);
  } catch (error) {
    logger.error("❌ Error during shutdown", error);
    process.exit(1);
  }
};

if (env.NODE_ENV === "production") {
  process.on("SIGTERM", () => gracefulShutdown("SIGTERM"));
  process.on("SIGINT", () => gracefulShutdown("SIGINT"));
}
process.on("unhandledRejection", (reason, promise) => {
  logger.error("❌ Unhandled Rejection", { promise, reason });
  gracefulShutdown("unhandledRejection");
});

process.on("uncaughtException", (error) => {
  logger.error("❌ Uncaught Exception", { error });
  gracefulShutdown("uncaughtException");
});

startServer();
