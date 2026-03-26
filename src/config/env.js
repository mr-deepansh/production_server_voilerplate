import { z } from "zod";

const envSchema = z.object({
  PORT: z.string().default("5000"),
  MONGODB_URI: z
    .string({
      required_error: "❌ MONGODB_URI is required",
    })
    .min(1, "❌ MONGODB_URI cannot be empty"),
  NODE_ENV: z.enum(["development", "production", "test"]).default("development"),
  DB_MAX_POOL_SIZE: z.string().default("10").transform(Number),
  DB_MIN_POOL_SIZE: z.string().default("2").transform(Number),
  DB_SOCKET_TIMEOUT_MS: z.string().default("45000").transform(Number),
  DB_SERVER_SELECTION_TIMEOUT_MS: z.string().default("10000").transform(Number),
  DB_HEARTBEAT_FREQUENCY_MS: z.string().default("10000").transform(Number),
  DB_MAX_RETRIES: z.string().default("3").transform(Number),
  DB_RETRY_DELAY_MS: z.string().default("5000").transform(Number),
  GRACEFUL_SHUTDOWN_TIMEOUT_MS: z.string().default("10000").transform(Number),
});

export const env = envSchema.parse(process.env);
