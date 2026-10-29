import { Redis } from "@upstash/redis";
import dotenv from "dotenv"; 

dotenv.config(); 

// Create and export the raw Redis client instance
const redis = Redis.fromEnv(); 

export default redis;