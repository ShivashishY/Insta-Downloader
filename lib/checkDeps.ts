import { execFileSync, execSync } from "node:child_process";
import { resolveFfmpegCommand, resolveYtDlpCommand } from "@/lib/binaries";

export function checkDependencies() {
  try {
    const ffmpegCommand = resolveFfmpegCommand();
    if (ffmpegCommand === "ffmpeg") {
      execSync("ffmpeg -version", { stdio: "ignore" });
    } else {
      execFileSync(ffmpegCommand, ["-version"], { stdio: "ignore" });
    }
    console.log("[deps] ffmpeg: OK");
  } catch (error) {
    console.error("[deps] ffmpeg NOT FOUND - audio merging will fail. Install ffmpeg.");
    const detail = error instanceof Error ? ` (${error.message})` : "";
    throw new Error(`ffmpeg dependency check failed${detail}`);
  }

  try {
    const ytDlpCommand = resolveYtDlpCommand();
    execFileSync(ytDlpCommand, ["--version"], { stdio: "ignore" });
    console.log("[deps] yt-dlp: OK");
  } catch (error) {
    console.error("[deps] yt-dlp NOT FOUND");
    const detail = error instanceof Error ? ` (${error.message})` : "";
    throw new Error(`yt-dlp dependency check failed${detail}`);
  }
}
