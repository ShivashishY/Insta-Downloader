export type SupportedPlatform = "instagram" | "tiktok" | "twitter" | "pinterest" | "youtube";

export type ContentType =
  | "video"
  | "photo"
  | "reels"
  | "story"
  | "igtv"
  | "carousel"
  | "unknown";

export interface DownloadItem {
  quality: string;
  size: string;
  ext: string;
  url: string;
  thumbnail?: string;
  fileName?: string;
}

export interface DownloadResult {
  success: boolean;
  platform: SupportedPlatform;
  type: ContentType;
  title: string;
  author: string;
  thumbnail: string;
  items: DownloadItem[];
}

export interface FaqItem {
  question: string;
  answer: string;
}

export interface HowStep {
  name: string;
  text: string;
}
