import axios from "axios";
import { execFile } from "node:child_process";
import { promisify } from "node:util";
import { resolveYtDlpCommand } from "@/lib/binaries";
import { config } from "@/lib/config";
import { detectContentType } from "@/lib/detectPlatform";
import { DownloadItem, DownloadResult, SupportedPlatform } from "@/lib/types";

const execFileAsync = promisify(execFile);

type JsonObject = Record<string, unknown>;

interface YtDlpFormat {
  url?: string;
  vcodec?: string;
  acodec?: string;
  ext?: string;
  height?: number;
  format_note?: string;
  filesize?: number;
  filesize_approx?: number;
}

interface YtDlpEntry {
  url?: string;
  ext?: string;
  title?: string;
  uploader?: string;
  thumbnail?: string;
  filesize?: number;
  filesize_approx?: number;
  formats?: YtDlpFormat[];
}

interface YtDlpResponse extends YtDlpEntry {
  entries?: YtDlpEntry[];
}

interface ImageCandidate {
  url: string;
  width?: number;
  height?: number;
}

const AUTO_COOKIE_BROWSERS = ["chrome", "firefox", "safari", "edge"] as const;

function normalizeSize(bytes?: number): string {
  if (!bytes) return "Unknown";
  const units = ["B", "KB", "MB", "GB"];
  let size = bytes;
  let unit = 0;
  while (size >= 1024 && unit < units.length - 1) {
    size /= 1024;
    unit += 1;
  }
  return `${size.toFixed(1)} ${units[unit]}`;
}

function asObject(value: unknown): JsonObject {
  if (value && typeof value === "object") return value as JsonObject;
  return {};
}

function asArray(value: unknown): unknown[] {
  return Array.isArray(value) ? value : [];
}

function asString(value: unknown): string {
  return typeof value === "string" ? value : "";
}

function asNumber(value: unknown): number | undefined {
  return typeof value === "number" ? value : undefined;
}

function isImageExt(ext?: string): boolean {
  const normalized = (ext || "").toLowerCase();
  return normalized === "jpg" || normalized === "jpeg" || normalized === "png" || normalized === "webp";
}

function qualityFromWidth(width?: number): string {
  if (!width) return "Original";
  if (width >= 3800) return "Ultra High (4000px)";
  if (width >= 1800) return "High (2000px)";
  if (width >= 900) return "Medium (1000px)";
  return "Small (500px)";
}

function toVideoItemsFromFormats(formats: YtDlpFormat[]): DownloadItem[] {
  const withVideo = formats
    .filter((f) => f.url && f.vcodec !== "none")
    .sort((a, b) => (b.height || 0) - (a.height || 0));

  // Prefer progressive streams that already contain audio.
  const progressive = withVideo.filter((f) => f.acodec && f.acodec !== "none");
  const filtered = progressive.length > 0 ? progressive : withVideo;

  const uniq = new Map<string, DownloadItem>();
  for (const format of filtered) {
    if (!format.url) continue;
    const quality = format.height ? `HD ${format.height}p` : format.format_note || "Original";
    if (!uniq.has(quality)) {
      uniq.set(quality, {
        quality,
        size: normalizeSize(format.filesize || format.filesize_approx),
        ext: format.ext || "mp4",
        url: format.url
      });
    }
  }

  return Array.from(uniq.values()).slice(0, 4);
}

function imageCandidatesFromEntry(entry: JsonObject): ImageCandidate[] {
  const candidates: ImageCandidate[] = [];

  const displayUrl = asString(entry.display_url);
  if (displayUrl) {
    candidates.push({
      url: displayUrl,
      width: asNumber(entry.width),
      height: asNumber(entry.height)
    });
  }

  for (const resourceRaw of asArray(entry.display_resources)) {
    const resource = asObject(resourceRaw);
    const url = asString(resource.src || resource.display_url || resource.url);
    if (!url) continue;
    candidates.push({
      url,
      width: asNumber(resource.width),
      height: asNumber(resource.height)
    });
  }

  for (const thumbRaw of asArray(entry.thumbnails)) {
    const thumb = asObject(thumbRaw);
    const url = asString(thumb.url);
    if (!url) continue;
    candidates.push({
      url,
      width: asNumber(thumb.width),
      height: asNumber(thumb.height)
    });
  }

  const directUrl = asString(entry.url);
  const ext = asString(entry.ext).toLowerCase();
  if (directUrl && (isImageExt(ext) || /\.(jpg|jpeg|png|webp)(\?|$)/i.test(directUrl))) {
    candidates.push({
      url: directUrl,
      width: asNumber(entry.width),
      height: asNumber(entry.height)
    });
  }

  const uniq = new Map<string, ImageCandidate>();
  for (const candidate of candidates) {
    if (!candidate.url.startsWith("http")) continue;
    const previous = uniq.get(candidate.url);
    if (!previous || (candidate.width || 0) > (previous.width || 0)) {
      uniq.set(candidate.url, candidate);
    }
  }

  return Array.from(uniq.values()).sort((a, b) => (b.width || 0) - (a.width || 0));
}

function toImageItems(candidates: ImageCandidate[], prefix: string): DownloadItem[] {
  return candidates.map((candidate, idx) => ({
    quality: qualityFromWidth(candidate.width),
    size: "Original",
    ext: "jpg",
    url: candidate.url,
    thumbnail: candidate.url,
    fileName: `${prefix}_${idx + 1}.jpg`
  }));
}

function isInstagramProfileUrl(url: string): boolean {
  try {
    const parsed = new URL(url);
    if (!/instagram\.com$/i.test(parsed.hostname.replace(/^www\./i, ""))) return false;

    const segments = parsed.pathname.split("/").filter(Boolean);
    if (segments.length !== 1) return false;

    const reserved = new Set([
      "p",
      "reel",
      "reels",
      "explore",
      "stories",
      "tv",
      "igtv",
      "accounts",
      "direct",
      "api"
    ]);

    return !reserved.has(segments[0].toLowerCase());
  } catch {
    return false;
  }
}

async function extractInstagramProfileFallback(url: string): Promise<DownloadResult | null> {
  try {
    const response = await axios.get<string>(url, {
      timeout: 20_000,
      headers: {
        "user-agent": "Mozilla/5.0"
      }
    });

    const html = response.data;
    const ogImageMatch = html.match(/property="og:image"\s+content="([^"]+)"/i);
    const titleMatch = html.match(/property="og:title"\s+content="([^"]+)"/i);

    const imageUrl = (ogImageMatch?.[1] || "").replace(/&amp;/g, "&");
    if (!imageUrl || !imageUrl.startsWith("http")) {
      return null;
    }

    const title = (titleMatch?.[1] || "Instagram Profile").replace(/&amp;/g, "&");
    const username = (() => {
      try {
        const parsed = new URL(url);
        return parsed.pathname.split("/").filter(Boolean)[0] || "unknown";
      } catch {
        return "unknown";
      }
    })();

    return {
      success: true,
      platform: "instagram",
      type: "photo",
      title,
      author: `@${username}`,
      thumbnail: imageUrl,
      items: [
        {
          quality: "Original",
          size: "Original",
          ext: "jpg",
          url: imageUrl,
          thumbnail: imageUrl,
          fileName: `${username}_profile.jpg`
        }
      ]
    };
  } catch {
    return null;
  }
}

async function extractInstagramStoryFallback(url: string): Promise<DownloadResult | null> {
  try {
    const response = await axios.get<string>(url, {
      timeout: 20_000,
      headers: {
        "user-agent": "Mozilla/5.0"
      }
    });

    const html = response.data;
    const ogVideoMatch = html.match(/property="og:video"\s+content="([^"]+)"/i);
    const ogImageMatch = html.match(/property="og:image"\s+content="([^"]+)"/i);

    const videoUrl = (ogVideoMatch?.[1] || "").replace(/&amp;/g, "&");
    const imageUrl = (ogImageMatch?.[1] || "").replace(/&amp;/g, "&");

    if (videoUrl.startsWith("http")) {
      return {
        success: true,
        platform: "instagram",
        type: "story",
        title: "Instagram Story",
        author: "@unknown",
        thumbnail: imageUrl,
        items: [
          {
            quality: "Original",
            size: "Unknown",
            ext: "mp4",
            url: videoUrl,
            thumbnail: imageUrl,
            fileName: "instagram_story.mp4"
          }
        ]
      };
    }

    const looksLikeStoryImage =
      imageUrl.startsWith("http") &&
      (/t51\.12442-15\//.test(imageUrl) || /story/i.test(imageUrl));

    if (looksLikeStoryImage) {
      return {
        success: true,
        platform: "instagram",
        type: "story",
        title: "Instagram Story",
        author: "@unknown",
        thumbnail: imageUrl,
        items: [
          {
            quality: "Original",
            size: "Original",
            ext: "jpg",
            url: imageUrl,
            thumbnail: imageUrl,
            fileName: "instagram_story.jpg"
          }
        ]
      };
    }

    return null;
  } catch {
    return null;
  }
}

async function extractInstagramFallbackImages(url: string): Promise<DownloadItem[]> {
  const urls = new Set<string>();

  const collectFromHtml = (html: string) => {
    const ogImageRegex = /property="og:image"\s+content="([^"]+)"/g;
    for (const match of html.matchAll(ogImageRegex)) {
      if (!match[1]) continue;
      const decoded = match[1].replace(/&amp;/g, "&");
      if (decoded.startsWith("http")) {
        urls.add(decoded);
      }
    }

      const displayUrlRegex = /display_url\\":\\"(https:[^\"]+)/g;
    for (const match of html.matchAll(displayUrlRegex)) {
      if (!match[1]) continue;
        const decoded = match[1]
          .replace(/\\u0026/g, "&")
          .replace(/\\\\\//g, "/")
          .replace(/\\\//g, "/")
          .replace(/\\\"/g, '"')
          .replace(/\\+$/g, "");
      // Keep actual post images and skip most profile/thumb artifacts.
      if (/t51\.82787-15\//.test(decoded) || /cdninstagram\.com/.test(decoded)) {
        urls.add(decoded);
      }
    }
  };

  const toItems = () => Array.from(urls).map((imageUrl, idx) => ({
    quality: "Original",
    size: "Original",
    ext: "jpg",
    url: imageUrl,
    thumbnail: imageUrl,
    fileName: `photo_${idx + 1}.jpg`
  }));

  // Main page often has only cover image, but still useful.
  try {
    const response = await axios.get<string>(url, {
      timeout: 20_000,
      headers: {
        "user-agent": "Mozilla/5.0"
      }
    });

    collectFromHtml(response.data);
  } catch {
    // ignore and continue with embed fallback
  }

  // Embed page commonly exposes full sidecar nodes even when yt-dlp entries are empty.
  try {
    const cleanUrl = url.split("?")[0].replace(/\/$/, "");
    const embedUrl = `${cleanUrl}/embed/captioned/`;

    const embedResponse = await axios.get<string>(embedUrl, {
      timeout: 20_000,
      headers: {
        "user-agent": "Mozilla/5.0"
      }
    });

    collectFromHtml(embedResponse.data);
  } catch {
    // ignore and return whatever we already captured
  }

  return toItems();
}

async function extractInstagramReelWithCobalt(url: string): Promise<DownloadResult> {
  if (!config.COBALT_API_URL) {
    throw new Error("USE_COBALT is enabled but COBALT_API_URL is missing.");
  }

  const response = await axios.post<{ status: "stream" | "redirect"; url: string }>(
    config.COBALT_API_URL,
    { url },
    {
      timeout: 20_000,
      headers: {
        "content-type": "application/json"
      }
    }
  );

  const payload = response.data;
  if (!payload?.url || (payload.status !== "stream" && payload.status !== "redirect")) {
    throw new Error("Cobalt response is invalid for this reel URL.");
  }

  return {
    success: true,
    platform: "instagram",
    type: "reels",
    title: "Instagram Reel",
    author: "@unknown",
    thumbnail: "",
    items: [
      {
        quality: "Original",
        size: "Unknown",
        ext: "mp4",
        url: payload.url,
        fileName: "reel.mp4"
      }
    ]
  };
}

function hasExplicitCookieConfig(): boolean {
  return Boolean(config.YTDLP_COOKIES_FILE || config.YTDLP_COOKIES_FROM_BROWSER);
}

function isAuthRestrictedError(message: string): boolean {
  return /unreachable|cookies-from-browser|authentication|login/i.test(message);
}

async function runYtDlpJson(url: string, extraArgs: string[] = []): Promise<YtDlpResponse> {
  const ytDlpCommand = resolveYtDlpCommand();
  const args = [
    "--dump-json",
    "--no-playlist",
    "-f",
    "bestvideo+bestaudio/best",
    "--merge-output-format",
    "mp4",
    "--audio-multistreams",
    "--no-warnings",
    ...extraArgs,
    url
  ];
  const { stdout } = await execFileAsync(ytDlpCommand, args, {
    maxBuffer: 20 * 1024 * 1024
  });
  return JSON.parse(stdout) as YtDlpResponse;
}

async function mapYtDlpResponseToResult(
  data: YtDlpResponse,
  url: string,
  platform: SupportedPlatform
): Promise<DownloadResult> {
  const isCarousel = Array.isArray(data.entries) && data.entries.length > 1;
  const entries: YtDlpEntry[] = isCarousel ? (data.entries || []) : [data];

  const imageItems = entries.flatMap((entry, entryIndex) => {
    const imageCandidates = imageCandidatesFromEntry(entry as unknown as JsonObject);
    return toImageItems(imageCandidates, `photo_${entryIndex + 1}`);
  });

  const items: DownloadItem[] = entries.flatMap((entry) => {
    if (entry.formats?.length) {
      return toVideoItemsFromFormats(entry.formats);
    }
    if (entry.url) {
      return [
        {
          quality: "Original",
          size: normalizeSize(entry.filesize || entry.filesize_approx),
          ext: entry.ext || "mp4",
          url: entry.url,
          fileName: `video.${entry.ext || "mp4"}`,
          thumbnail: entry.thumbnail
        }
      ];
    }
    return [];
  });

  const uniqueItems = items.filter(
    (item, idx) => items.findIndex((candidate) => candidate.url === item.url) === idx
  );

  const uniqueImageItems = imageItems.filter(
    (item, idx) => imageItems.findIndex((candidate) => candidate.url === item.url) === idx
  );

  const inferredType = isCarousel
    ? "carousel"
    : uniqueImageItems.length > 0 && uniqueItems.length === 0
      ? "photo"
      : detectContentType(url);

  let finalItems = inferredType === "photo" || inferredType === "carousel"
    ? uniqueImageItems
    : uniqueItems;

  const hasEmptyEntries = Array.isArray(data.entries) && data.entries.length === 0;
  const shouldTryInstagramFallback =
    platform === "instagram" &&
    (finalItems.length === 0 ||
      (inferredType === "photo" && (hasEmptyEntries || finalItems.length <= 1)));

  if (shouldTryInstagramFallback) {
    const fallbackImages = await extractInstagramFallbackImages(url);
    if (fallbackImages.length > finalItems.length) {
      finalItems = fallbackImages;
    }
  }

  const finalType = finalItems.length && (inferredType === "photo" || inferredType === "carousel")
    ? (finalItems.length > 1 ? "carousel" : "photo")
    : inferredType;

  return {
    success: true,
    platform,
    type: finalType,
    title: (data.title || "Untitled post").toString().slice(0, 120),
    author: data.uploader ? `@${data.uploader}` : "@unknown",
    thumbnail: data.thumbnail || finalItems[0]?.thumbnail || entries[0]?.thumbnail || "",
    items: finalItems
  };
}

async function extractWithYtDlp(url: string, platform: SupportedPlatform): Promise<DownloadResult> {
  const isInstagramReelUrl = platform === "instagram" && /instagram\.com\/(reel|reels)\//i.test(url);
  if (isInstagramReelUrl && config.USE_COBALT) {
    return extractInstagramReelWithCobalt(url);
  }

  if (platform === "instagram" && isInstagramProfileUrl(url)) {
    const profileFallback = await extractInstagramProfileFallback(url);
    if (profileFallback) {
      return profileFallback;
    }
  }

  const isStoryUrl = /instagram\.com\/stories\//i.test(url);

  try {
    const ytDlpArgs: string[] = [];
    if (config.YTDLP_COOKIES_FILE) {
      ytDlpArgs.push("--cookies", config.YTDLP_COOKIES_FILE);
    } else if (config.YTDLP_COOKIES_FROM_BROWSER) {
      ytDlpArgs.push("--cookies-from-browser", config.YTDLP_COOKIES_FROM_BROWSER);
    }
    const data = await runYtDlpJson(url, ytDlpArgs);
    return mapYtDlpResponseToResult(data, url, platform);
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : "";

    if (platform === "instagram" && isStoryUrl) {
      if (!hasExplicitCookieConfig() && isAuthRestrictedError(message)) {
        for (const browser of AUTO_COOKIE_BROWSERS) {
          try {
            const data = await runYtDlpJson(url, ["--cookies-from-browser", browser]);
            return mapYtDlpResponseToResult(data, url, platform);
          } catch {
            // Try next browser automatically.
          }
        }
      }

      const storyFallback = await extractInstagramStoryFallback(url);
      if (storyFallback) {
        return storyFallback;
      }

      if (isAuthRestrictedError(message)) {
        if (!hasExplicitCookieConfig()) {
          throw new Error(
            "This Instagram story requires authentication. Automatic server cookie detection failed. Configure YTDLP_COOKIES_FILE or YTDLP_COOKIES_FROM_BROWSER on the server."
          );
        }
        throw new Error("This Instagram story is not publicly accessible. Your cookie session may be expired or missing story access.");
      }
    }

    if (message.includes("ENOENT")) {
      throw new Error("yt-dlp is not installed on the server. Ensure deploy-time installer runs or set YTDLP_BINARY_PATH.");
    }
    throw new Error("Unable to resolve media. The content may be private or temporarily unavailable.");
  }
}

async function extractWithRapidApi(url: string, platform: SupportedPlatform): Promise<DownloadResult> {
  if (!config.RAPID_API_KEY || !config.RAPID_API_HOST) {
    throw new Error("RapidAPI mode is enabled but RAPID_API_KEY or RAPID_API_HOST is missing.");
  }

  // Replace this endpoint path with your chosen RapidAPI provider.
  const response = await axios.post(
    `https://${config.RAPID_API_HOST}/download`,
    { url },
    {
      headers: {
        "x-rapidapi-key": config.RAPID_API_KEY,
        "x-rapidapi-host": config.RAPID_API_HOST,
        "content-type": "application/json"
      },
      timeout: 20_000
    }
  );

  const payload = asObject(response.data);
  const payloadType = asString(payload.type).toLowerCase();

  const sidecarCandidates = asArray(payload.items).flatMap((item, idx) => {
    const obj = asObject(item);
    const candidates = imageCandidatesFromEntry(obj);
    return toImageItems(candidates, `photo_${idx + 1}`);
  });

  const singleImageCandidates = toImageItems(imageCandidatesFromEntry(payload), "photo");
  const providedItems = asArray(payload.items)
    .map((item): DownloadItem | null => {
      const obj = asObject(item);
      const itemUrl = asString(obj.url);
      if (!itemUrl) return null;
      const ext = asString(obj.ext) || "mp4";
      return {
        quality: asString(obj.quality) || "Original",
        size: asString(obj.size) || "Unknown",
        ext,
        url: itemUrl,
        thumbnail: asString(obj.thumbnail),
        fileName: asString(obj.fileName) || `download.${ext}`
      } satisfies DownloadItem;
    })
    .filter((item): item is DownloadItem => item !== null);

  const imageDrivenItems = payloadType === "photo" || payloadType === "graphsidecar"
    ? (sidecarCandidates.length ? sidecarCandidates : singleImageCandidates)
    : [];

  const finalItems = imageDrivenItems.length ? imageDrivenItems : providedItems;

  const mappedType = payloadType === "graphsidecar"
    ? "carousel"
    : payloadType === "photo" || payloadType === "video" || payloadType === "reels" || payloadType === "story" || payloadType === "igtv" || payloadType === "carousel"
      ? payloadType
      : detectContentType(url);

  return {
    success: true,
    platform,
    type: mappedType,
    title: asString(payload.title) || "Untitled",
    author: asString(payload.author) || "@unknown",
    thumbnail: asString(payload.thumbnail) || finalItems[0]?.thumbnail || "",
    items: finalItems
  };
}

async function extractWithCobalt(url: string, platform: SupportedPlatform): Promise<DownloadResult> {
  const cobaltUrl = config.COBALT_API_URL || "https://api.cobalt.tools";

  const response = await fetch(`${cobaltUrl.replace(/\/$/, "")}/`, {
    method: "POST",
    headers: {
      "content-type": "application/json",
      accept: "application/json"
    },
    body: JSON.stringify({
      url,
      videoQuality: "1080",
      filenameStyle: "pretty",
      downloadMode: "auto"
    })
  });

  const payload = await response.json() as Record<string, unknown>;
  const status = typeof payload.status === "string" ? payload.status : "";
  const mediaUrl = typeof payload.url === "string" ? payload.url : "";

  if (!response.ok || status === "error") {
    const errorObj = (payload.error && typeof payload.error === "object") ? payload.error as Record<string, unknown> : {};
    const errorCode = typeof errorObj.code === "string" ? errorObj.code : "COBALT_FAILED";
    throw new Error(errorCode);
  }

  if (!mediaUrl || (status !== "stream" && status !== "redirect" && status !== "tunnel" && status !== "picker")) {
    throw new Error("COBALT_INVALID_RESPONSE");
  }

  const inferredType = detectContentType(url);

  return {
    success: true,
    platform,
    type: inferredType,
    title: "SaveMy Reel Download",
    author: "@unknown",
    thumbnail: "",
    items: [
      {
        quality: "HD",
        size: "Unknown",
        ext: "mp4",
        url: mediaUrl,
        fileName: "download.mp4"
      }
    ]
  };
}

export async function extractMedia(url: string, platform: SupportedPlatform): Promise<DownloadResult> {
  if (config.USE_COBALT) {
    return extractWithCobalt(url, platform);
  }

  if (config.USE_RAPID_API) {
    return extractWithRapidApi(url, platform);
  }
  return extractWithYtDlp(url, platform);
}
