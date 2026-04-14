import axios from "axios";
import { Readable } from "node:stream";
import { NextRequest, NextResponse } from "next/server";
import { config } from "@/lib/config";

export const runtime = "nodejs";

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
  const requestedName = request.nextUrl.searchParams.get("filename") || "download.bin";
  const requestedExt = (request.nextUrl.searchParams.get("ext") || "").toLowerCase();

  if (!mediaUrl || !isAllowedHost(mediaUrl)) {
    return NextResponse.json({ success: false, error: "Invalid or blocked media URL." }, { status: 400 });
  }

  try {
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
