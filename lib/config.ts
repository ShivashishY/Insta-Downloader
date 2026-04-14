export const config = {
  USE_COBALT: process.env.USE_COBALT === "true",
  COBALT_API_URL: process.env.COBALT_API_URL || "",
  YTDLP_BINARY_PATH: process.env.YTDLP_BINARY_PATH || "",
  USE_RAPID_API: process.env.USE_RAPID_API === "true",
  RAPID_API_KEY: process.env.RAPID_API_KEY || "",
  RAPID_API_HOST: process.env.RAPID_API_HOST || "",
  YTDLP_COOKIES_FILE: process.env.YTDLP_COOKIES_FILE || "",
  YTDLP_COOKIES_FROM_BROWSER: process.env.YTDLP_COOKIES_FROM_BROWSER || "",
  GA_MEASUREMENT_ID: process.env.NEXT_PUBLIC_GA_MEASUREMENT_ID || "",
  SITE_URL: process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000",
  UPSTASH_REDIS_REST_URL: process.env.UPSTASH_REDIS_REST_URL || "",
  UPSTASH_REDIS_REST_TOKEN: process.env.UPSTASH_REDIS_REST_TOKEN || "",
  ALLOWED_PROXY_HOSTS: [
    "cdninstagram.com",
    "fbcdn.net",
    "instagram.com",
    "tiktokcdn.com",
    "muscdn.com",
    "twimg.com",
    "pinimg.com",
    "googlevideo.com",
    "ytimg.com"
  ]
};
