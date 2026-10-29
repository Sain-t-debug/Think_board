import { Ratelimit } from "@upstash/ratelimit";
import redis from "../config/upstash.js"; // Ensure your Upstash client import is correct

const ratelimit = new Ratelimit({
  redis: redis,
  limiter: Ratelimit.slidingWindow(100, "60 s"), // 10 requests per 10 seconds
  analytics: true,
});

// 🟢 FIX: Ensure the arguments are exactly (req, res, next)
export const rateLimiter = async (req, res, next) => {
  try {
    // Use user IP or a fallback identifier for tracking rates
    const identifier = req.ip || "anonymous"; 
    const { success } = await ratelimit.limit(identifier);

    if (!success) {
      // If rate limit is exceeded, return 429 Too Many Requests
      return res.status(429).json({ 
        error: "Too many requests. Please try again later." 
      });
    }

    // If within limits, move to the next middleware/controller
    next(); 
  } catch (error) {
    console.error("Rate limit error:", error);
    // Move forward anyway if your rate limiter hits a configuration error 
    // so your entire app doesn't break for users
    next(); 
  }
};
