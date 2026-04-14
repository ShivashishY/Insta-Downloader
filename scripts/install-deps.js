#!/usr/bin/env node

const fs = require("node:fs");
const path = require("node:path");
const { execFileSync, execSync } = require("node:child_process");

function commandAvailable(command, args = ["--version"]) {
  try {
    execFileSync(command, args, { stdio: "ignore" });
    return true;
  } catch {
    return false;
  }
}

function run(command) {
  execSync(command, { stdio: "inherit" });
}

function ensureBinDir() {
  const binDir = path.join(process.cwd(), "bin");
  fs.mkdirSync(binDir, { recursive: true });
  return binDir;
}

function ensureYtDlp() {
  ensureBinDir();
  const localYtDlp = path.join(process.cwd(), "bin", process.platform === "win32" ? "yt-dlp.exe" : "yt-dlp");
  if (fs.existsSync(localYtDlp)) {
    console.log("[install-deps] yt-dlp found in bin/");
    return;
  }

  if (commandAvailable("yt-dlp")) {
    console.log("[install-deps] yt-dlp found in PATH");
    return;
  }

  console.log("[install-deps] yt-dlp missing. Installing local binary...");
  run("node scripts/install-ytdlp.js");
}

function tryCopyFfmpegToBin(ffmpegPath) {
  try {
    const binDir = ensureBinDir();
    const target = path.join(binDir, process.platform === "win32" ? "ffmpeg.exe" : "ffmpeg");
    fs.copyFileSync(ffmpegPath, target);
    if (process.platform !== "win32") {
      fs.chmodSync(target, 0o755);
    }
    console.log(`[install-deps] ffmpeg copied to ${target}`);
  } catch (error) {
    console.warn(`[install-deps] Could not copy ffmpeg to bin/: ${error.message}`);
  }
}

function installSystemFfmpegIfPossible() {
  if (process.platform === "darwin") {
    try {
      run("brew install ffmpeg");
      return true;
    } catch {
      return false;
    }
  }

  if (process.platform === "linux") {
    const managers = [
      "apt-get update && apt-get install -y ffmpeg",
      "apk add --no-cache ffmpeg",
      "yum install -y ffmpeg"
    ];
    for (const cmd of managers) {
      try {
        run(cmd);
        return true;
      } catch {
        // try next package manager
      }
    }
  }

  return false;
}

function ensureFfmpeg() {
  if (commandAvailable("ffmpeg", ["-version"])) {
    console.log("[install-deps] ffmpeg found in PATH");
    return;
  }

  let ffmpegStaticPath = "";
  try {
    ffmpegStaticPath = require("ffmpeg-static");
  } catch {
    ffmpegStaticPath = "";
  }

  if (ffmpegStaticPath && commandAvailable(ffmpegStaticPath, ["-version"])) {
    console.log("[install-deps] ffmpeg found via ffmpeg-static");
    tryCopyFfmpegToBin(ffmpegStaticPath);
    return;
  }

  console.log("[install-deps] ffmpeg missing. Trying system install...");
  const installed = installSystemFfmpegIfPossible();
  if (!installed || !commandAvailable("ffmpeg", ["-version"])) {
    throw new Error("ffmpeg is missing and could not be auto-installed. Install ffmpeg or add ffmpeg-static.");
  }
}

function main() {
  ensureYtDlp();
  ensureFfmpeg();
  console.log("[install-deps] Dependencies ready.");
}

main();
