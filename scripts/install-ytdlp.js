#!/usr/bin/env node

const fs = require("node:fs");
const path = require("node:path");
const https = require("node:https");

function resolveAsset() {
  if (process.platform === "linux") return "yt-dlp_linux";
  if (process.platform === "darwin") return "yt-dlp_macos";
  if (process.platform === "win32") return "yt-dlp.exe";
  throw new Error(`Unsupported platform for yt-dlp install: ${process.platform}`);
}

function download(url, destination) {
  return new Promise((resolve, reject) => {
    const request = https.get(url, (response) => {
      if (response.statusCode && response.statusCode >= 300 && response.statusCode < 400 && response.headers.location) {
        response.resume();
        download(response.headers.location, destination).then(resolve).catch(reject);
        return;
      }

      if (response.statusCode !== 200) {
        reject(new Error(`Download failed with status ${response.statusCode}`));
        return;
      }

      const file = fs.createWriteStream(destination, { mode: 0o755 });
      response.pipe(file);
      file.on("finish", () => file.close(resolve));
      file.on("error", reject);
    });

    request.on("error", reject);
    request.setTimeout(30_000, () => {
      request.destroy(new Error("Timed out while downloading yt-dlp"));
    });
  });
}

async function main() {
  const binDir = path.join(process.cwd(), "bin");
  const binaryPath = path.join(binDir, process.platform === "win32" ? "yt-dlp.exe" : "yt-dlp");

  fs.mkdirSync(binDir, { recursive: true });

  const assetName = resolveAsset();
  const downloadUrl = `https://github.com/yt-dlp/yt-dlp/releases/latest/download/${assetName}`;

  console.log(`[install-ytdlp] Downloading ${downloadUrl}`);
  await download(downloadUrl, binaryPath);

  if (process.platform !== "win32") {
    fs.chmodSync(binaryPath, 0o755);
  }

  console.log(`[install-ytdlp] yt-dlp ready at ${binaryPath}`);
}

main().catch((error) => {
  console.error("[install-ytdlp] Failed:", error.message);
  process.exit(1);
});
