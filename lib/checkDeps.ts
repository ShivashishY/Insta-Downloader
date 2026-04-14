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
  } catch {
    console.error("[deps] ffmpeg NOT FOUND - audio merging will fail. Install ffmpeg.");
    process.exit(1);
  }

  try {
    const ytDlpCommand = resolveYtDlpCommand();
    execFileSync(ytDlpCommand, ["--version"], { stdio: "ignore" });
    console.log("[deps] yt-dlp: OK");
  } catch {
    console.error("[deps] yt-dlp NOT FOUND");
    process.exit(1);
  }
}
