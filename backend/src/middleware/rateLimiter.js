import redis from "../config/upstash.js";

const LIMIT = 100;
const WINDOW_SECONDS = 60;

/**
 * Fixed-window rate limiter (100 requests / 60s per IP).
 *
 * Deliberately uses only plain Redis commands (INCR / EXPIRE) instead of
 * @upstash/ratelimit: that package calls `redis.evalsha()`, which does not
 * exist in older @upstash/redis releases and caused:
 *   TypeError: ctx.redis.evalsha is not a function
 * Keeping to core commands makes the limiter work with any client version.
 */
export const rateLimiter = async (req, res, next) => {
  // No Redis configured (e.g. env vars missing on the host) -> fail open.
  if (!redis) return next();

  const identifier = req.ip || req.headers["x-forwarded-for"] || "anonymous";
  const windowId = Math.floor(Date.now() / (WINDOW_SECONDS * 1000));
  const key = `ratelimit:${identifier}:${windowId}`;

  try {
    const requests = Number(await redis.incr(key));

    // First request in this window -> start the expiry clock.
    if (requests === 1) {
      await redis.expire(key, WINDOW_SECONDS);
    }

    const resetAt = (windowId + 1) * WINDOW_SECONDS * 1000;
    const remaining = Math.max(0, LIMIT - requests);

    res.setHeader("X-RateLimit-Limit", LIMIT);
    res.setHeader("X-RateLimit-Remaining", remaining);

    if (requests > LIMIT) {
      const secondsToWait = Math.max(0, Math.ceil((resetAt - Date.now()) / 1000));
      res.setHeader("Retry-After", secondsToWait);

      return res.status(429).json({
        error: "Too many requests. Please try again later.",
        retryAfterSeconds: secondsToWait,
      });
    }

    next();
  } catch (error) {
    // Never let a Redis outage take down the API.
    console.error("Rate limit infrastructure failure:", error);
    next();
  }
};
