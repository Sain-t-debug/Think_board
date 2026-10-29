import { Redis } from "@upstash/redis";
import dotenv from "dotenv";

dotenv.config();

// Build the client only when credentials exist, so a missing env var on the
// host degrades to "no rate limiting" instead of crashing the server at boot.
let redis = null;

if (process.env.UPSTASH_REDIS_REST_URL && process.env.UPSTASH_REDIS_REST_TOKEN) {
  try {
    redis = Redis.fromEnv();
  } catch (error) {
    console.error("Could not initialise Upstash Redis:", error);
  }
} else {
  console.warn(
    "UPSTASH_REDIS_REST_URL / UPSTASH_REDIS_REST_TOKEN are not set — rate limiting is disabled."
  );
}

export default redis;
