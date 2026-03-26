import mongoose from "mongoose";
import { logger } from "../utils/logger.js";
import { env } from "./env.js";
import ApiError from "../utils/apiError.js";

const mongooseOptions = {
  maxPoolSize: env.DB_MAX_POOL_SIZE,
  minPoolSize: env.DB_MIN_POOL_SIZE,
  socketTimeoutMS: env.DB_SOCKET_TIMEOUT_MS,
  serverSelectionTimeoutMS: env.DB_SERVER_SELECTION_TIMEOUT_MS,
  heartbeatFrequencyMS: env.DB_HEARTBEAT_FREQUENCY_MS,
  retryWrites: true,
  retryReads: true,
  w: "majority",
};

const handleConnectionEvents = () => {
  mongoose.connection.on("connected", () => {
    logger.info("✅ MongoDB connection established");
  });

  mongoose.connection.on("error", (error) => {
    logger.error(`❌ MongoDB connection error: ${error.message}`);
  });

  mongoose.connection.on("disconnected", () => {
    logger.warn("⚠️ MongoDB disconnected. Attempting to reconnect...");
  });

  mongoose.connection.on("reconnected", () => {
    logger.info("✅ MongoDB reconnected successfully");
  });
};

const sleep = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

export const connectDB = async (retries = env.DB_MAX_RETRIES) => {
  try {
    if (!env.MONGODB_URI) {
      throw ApiError.internal("❌ MONGODB_URI is not defined");
    }
    logger.info(
      `🔄 Connecting to MongoDB... (Attempt ${env.DB_MAX_RETRIES - retries + 1}/${env.DB_MAX_RETRIES})`
    );
    const conn = await mongoose.connect(env.MONGODB_URI, mongooseOptions);
    handleConnectionEvents();
    logger.info(`✅ MongoDB Connected: ${conn.connection.host} | DB: ${conn.connection.name}`);
    return conn;
  } catch (error) {
    logger.error(`❌ MongoDB connection failed: ${error.message}`);
    if (retries > 0) {
      logger.warn(`⏳ Retrying in ${env.DB_RETRY_DELAY_MS / 1000}s... (${retries} attempts left)`);
      await sleep(env.DB_RETRY_DELAY_MS);
      return connectDB(retries - 1);
    }
    logger.error("❌ Max retries reached. Unable to connect to MongoDB");
    throw ApiError.internal("Database connection failed after multiple attempts");
  }
};

export const disconnectDB = async () => {
  try {
    await mongoose.connection.close();
    logger.info("✅ MongoDB connection closed gracefully");
  } catch (error) {
    logger.error(`❌ Error closing MongoDB connection: ${error.message}`);
    throw error;
  }
};
