import { NextRequest, NextResponse } from "next/server";
import { checkRateLimit } from "@/lib/rateLimiter";
import { checkDependencies } from "@/lib/checkDeps";
import { detectPlatform, isValidPublicUrl } from "@/lib/detectPlatform";
import { extractMedia } from "@/lib/extractMedia";
import { config } from "@/lib/config";

export const runtime = "nodejs";

let depsChecked = false;

export async function POST(request: NextRequest) {
  if (!depsChecked) {
    checkDependencies();
    depsChecked = true;
  }

  const ip = request.headers.get("x-forwarded-for")?.split(",")[0]?.trim() || "127.0.0.1";
  const limiter = await checkRateLimit(ip);

  if (!limiter.success) {
    return NextResponse.json(
      {
        success: false,
        error: "Too many requests. Please wait a moment and try again."
      },
      { status: 429 }
    );
  }

  try {
    const body = await request.json();
    const url = String(body?.url || "").trim();

    if (!isValidPublicUrl(url)) {
      return NextResponse.json({ success: false, error: "Please provide a valid public URL." }, { status: 400 });
    }

    const platform = detectPlatform(url);
    if (!platform) {
      return NextResponse.json(
        {
          success: false,
          error: "Unsupported URL. Supported: Instagram, TikTok, Twitter/X, Pinterest, YouTube Shorts."
        },
        { status: 400 }
      );
    }

    const result = await extractMedia(url, platform);

    const usesDirectImageUrls = result.type === "photo" || result.type === "carousel";

    const items = usesDirectImageUrls
      ? result.items
      : result.items.map((item) => ({
          ...item,
          url: `/api/proxy?url=${encodeURIComponent(item.url)}&sourceUrl=${encodeURIComponent(url)}&filename=${encodeURIComponent(item.fileName || `video.${item.ext}`)}&ext=${encodeURIComponent(item.ext || "mp4")}`
        }));

    return NextResponse.json({
      ...result,
      items,
      success: true,
      sourceMode: config.USE_RAPID_API ? "rapidapi" : "ytdlp"
    });
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : "Could not process this link right now.";
    return NextResponse.json(
      { success: false, error: message },
      { status: 500 }
    );
  }
}
