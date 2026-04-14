import { ContentType, SupportedPlatform } from "@/lib/types";

const PLATFORM_PATTERNS: Record<SupportedPlatform, RegExp> = {
  instagram: /(?:www\.)?instagram\.com\//i,
  tiktok: /(?:www\.)?tiktok\.com\//i,
  twitter: /(?:www\.)?(?:twitter\.com|x\.com)\//i,
  pinterest: /(?:www\.)?pinterest\./i,
  youtube: /(?:www\.)?(?:youtube\.com\/shorts\/|youtu\.be\/)/i
};

export function detectPlatform(url: string): SupportedPlatform | null {
  const normalized = url.trim();
  return (Object.keys(PLATFORM_PATTERNS) as SupportedPlatform[]).find((platform) =>
    PLATFORM_PATTERNS[platform].test(normalized)
  ) || null;
}

export function detectContentType(url: string): ContentType {
  if (/instagram\.com\/(reel|reels)\//i.test(url)) return "reels";
  if (/instagram\.com\/stories\//i.test(url)) return "story";
  if (/instagram\.com\/(tv|igtv)\//i.test(url)) return "igtv";
  if (/instagram\.com\/p\//i.test(url)) return "photo";
  if (/shorts\//i.test(url)) return "video";
  if (/status\//i.test(url)) return "video";
  return "video";
}

export function isValidPublicUrl(url: string): boolean {
  try {
    const parsed = new URL(url);
    return parsed.protocol === "https:" || parsed.protocol === "http:";
  } catch {
    return false;
  }
}
