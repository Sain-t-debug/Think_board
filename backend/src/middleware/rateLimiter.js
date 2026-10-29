import { Ratelimit } from "@upstash/ratelimit";
import redis from "../config/upstash.js";

// No Redis configured (e.g. env vars missing on the host) -> fail open.
const ratelimit = redis
  ? new Ratelimit({
      redis,
      limiter: Ratelimit.slidingWindow(100, "60 s"),
      analytics: true,
    })
  : null;

export const rateLimiter = async (req, res, next) => {
  if (!ratelimit) return next();

  try {
    const identifier = req.ip || req.headers["x-forwarded-for"] || "anonymous";
    const { success, limit, remaining, reset } = await ratelimit.limit(identifier);

    res.setHeader("X-RateLimit-Limit", limit);
    res.setHeader("X-RateLimit-Remaining", remaining);

    if (!success) {
      const secondsToWait = Math.max(0, Math.ceil((reset - Date.now()) / 1000));
      res.setHeader("Retry-After", secondsToWait);

      return res.status(429).json({
        error: "Too many requests. Please try again later.",
        retryAfterSeconds: secondsToWait,
      });
    }

    next();
  } catch (error) {
    console.error("Rate limit infrastructure failure:", error);
    next();
  }
};
