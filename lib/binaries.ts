import { existsSync } from "node:fs";
import { createRequire } from "node:module";
import { join } from "node:path";
import { config } from "@/lib/config";

const localRequire = createRequire(import.meta.url);

function resolveOptionalFfmpegStatic(): string {
  try {
    const candidate = localRequire("ffmpeg-static") as string;
    return typeof candidate === "string" ? candidate : "";
  } catch {
    return "";
  }
}

export function resolveYtDlpCommand(): string {
  const configuredPath = config.YTDLP_BINARY_PATH.trim();
  if (configuredPath) return configuredPath;

  if (process.platform === "linux") {
    const linuxBinary = process.arch === "arm64"
      ? join(process.cwd(), "bin", "yt-dlp-linux-arm64")
      : join(process.cwd(), "bin", "yt-dlp-linux-x64");
    if (existsSync(linuxBinary)) return linuxBinary;
  }

  const bundledPath = join(process.cwd(), "bin", "yt-dlp");
  if (existsSync(bundledPath)) return bundledPath;

  const bundledWinPath = join(process.cwd(), "bin", "yt-dlp.exe");
  if (existsSync(bundledWinPath)) return bundledWinPath;

  return "yt-dlp";
}

export function resolveFfmpegCommand(): string {
  const configuredPath = config.FFMPEG_BINARY_PATH.trim();
  if (configuredPath) return configuredPath;

  const bundledPath = join(process.cwd(), "bin", process.platform === "win32" ? "ffmpeg.exe" : "ffmpeg");
  if (existsSync(bundledPath)) return bundledPath;

  if (process.platform === "darwin") {
    const macCandidates = [
      "/opt/homebrew/bin/ffmpeg",
      "/usr/local/bin/ffmpeg",
      "/usr/bin/ffmpeg"
    ];
    for (const candidate of macCandidates) {
      if (existsSync(candidate)) return candidate;
    }
  }

  if (process.platform === "linux") {
    const linuxCandidates = ["/usr/bin/ffmpeg", "/usr/local/bin/ffmpeg"];
    for (const candidate of linuxCandidates) {
      if (existsSync(candidate)) return candidate;
    }
  }

  const ffmpegStatic = resolveOptionalFfmpegStatic();
  if (ffmpegStatic) return ffmpegStatic;

  return "ffmpeg";
}
