import { Ratelimit } from "@upstash/ratelimit";
import { Redis } from "@upstash/redis";
import { config } from "@/lib/config";

const memoryBucket = new Map<string, number[]>();

const redis = config.UPSTASH_REDIS_REST_URL && config.UPSTASH_REDIS_REST_TOKEN
  ? new Redis({
      url: config.UPSTASH_REDIS_REST_URL,
      token: config.UPSTASH_REDIS_REST_TOKEN
    })
  : null;

const upstashLimiter = redis
  ? new Ratelimit({
      redis,
      limiter: Ratelimit.slidingWindow(10, "1 m"),
      analytics: true,
      prefix: "social-downloader"
    })
  : null;

export async function checkRateLimit(ip: string) {
  if (upstashLimiter) {
    return upstashLimiter.limit(ip);
  }

  const now = Date.now();
  const windowMs = 60_000;
  const start = now - windowMs;
  const hits = (memoryBucket.get(ip) || []).filter((t) => t > start);

  if (hits.length >= 10) {
    return {
      success: false,
      reset: Date.now() + 1000,
      remaining: 0,
      pending: Promise.resolve()
    };
  }

  hits.push(now);
  memoryBucket.set(ip, hits);

  return {
    success: true,
    reset: Date.now() + windowMs,
    remaining: Math.max(0, 10 - hits.length),
    pending: Promise.resolve()
  };
}
