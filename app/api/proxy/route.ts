import axios from "axios";
import { execFile } from "node:child_process";
import { promises as fs } from "node:fs";
import { tmpdir } from "node:os";
import { delimiter, join } from "node:path";
import { promisify } from "node:util";
import { Readable } from "node:stream";
import { NextRequest, NextResponse } from "next/server";
import ffmpegPath from "ffmpeg-static";
import { config } from "@/lib/config";

export const runtime = "nodejs";

const execFileAsync = promisify(execFile);
const runtimePath = `${join(process.cwd(), "bin")}${delimiter}${process.env.PATH || ""}`;

function isAllowedHost(rawUrl: string) {
  try {
    const parsed = new URL(rawUrl);
    return config.ALLOWED_PROXY_HOSTS.some((host) => parsed.hostname.endsWith(host));
  } catch {
    return false;
  }
}

export async function GET(request: NextRequest) {
  const mediaUrl = request.nextUrl.searchParams.get("url");
  const sourceUrl = request.nextUrl.searchParams.get("sourceUrl");
  const requestedName = request.nextUrl.searchParams.get("filename") || "download.bin";
  const requestedExt = (request.nextUrl.searchParams.get("ext") || "").toLowerCase();

  if (!mediaUrl || !isAllowedHost(mediaUrl)) {
    return NextResponse.json({ success: false, error: "Invalid or blocked media URL." }, { status: 400 });
  }

  try {
    if (sourceUrl) {
      try {
        const outputDir = join(tmpdir(), "savemyreel");
        await fs.mkdir(outputDir, { recursive: true });

        const outputPath = join(outputDir, `merged-${Date.now()}-${Math.random().toString(36).slice(2)}.mp4`);
        const cookieArgs: string[] = [];
        if (config.YTDLP_COOKIES_FILE) {
          cookieArgs.push("--cookies", config.YTDLP_COOKIES_FILE);
        } else if (config.YTDLP_COOKIES_FROM_BROWSER) {
          cookieArgs.push("--cookies-from-browser", config.YTDLP_COOKIES_FROM_BROWSER);
        }

        const args = [
          "-f",
          "bestvideo+bestaudio/best",
          "--merge-output-format",
          "mp4",
          ...(typeof ffmpegPath === "string" ? ["--ffmpeg-location", ffmpegPath] : []),
          "--no-playlist",
          "-o",
          outputPath,
          ...cookieArgs,
          sourceUrl
        ];

        await execFileAsync("yt-dlp", args, {
          env: { ...process.env, PATH: runtimePath },
          maxBuffer: 10 * 1024 * 1024
        });

        const data = await fs.readFile(outputPath);
        await fs.unlink(outputPath).catch(() => undefined);

        const headers = new Headers();
        headers.set("content-type", "video/mp4");
        headers.set("cache-control", "no-store");
        headers.set("content-disposition", `attachment; filename="${requestedName.endsWith(".mp4") ? requestedName : "video.mp4"}"`);

        return new NextResponse(data, { headers });
      } catch {
        // Fall through and stream direct media URL if merge fails.
      }
    }

    const upstream = await axios.get(mediaUrl, {
      responseType: "stream",
      timeout: 25_000,
      headers: {
        "user-agent": "Mozilla/5.0"
      }
    });

    const upstreamType = upstream.headers["content-type"] || "application/octet-stream";
    const isImageRequest = requestedExt === "jpg" || requestedExt === "jpeg" || upstreamType.startsWith("image/");
    const contentType = isImageRequest ? "image/jpeg" : upstreamType;
    const contentLength = upstream.headers["content-length"];

    const stream = Readable.toWeb(upstream.data) as ReadableStream;

    const headers = new Headers();
    headers.set("content-type", contentType);
    if (contentLength) headers.set("content-length", contentLength);
    headers.set("cache-control", "no-store");
    headers.set("content-disposition", `attachment; filename="${requestedName}"`);

    return new NextResponse(stream, { headers });
  } catch {
    return NextResponse.json(
      { success: false, error: "Unable to stream this media right now." },
      { status: 502 }
    );
  }
}
