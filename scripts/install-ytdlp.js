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

function resolveDownloads() {
  if (process.platform === "linux") {
    // Build and runtime architectures can differ on serverless providers.
    return [
      { asset: "yt-dlp_linux", output: "yt-dlp-linux-x64" },
      { asset: "yt-dlp_linux_aarch64", output: "yt-dlp-linux-arm64" }
    ];
  }

  if (process.platform === "darwin") {
    return [{ asset: "yt-dlp_macos", output: "yt-dlp" }];
  }

  if (process.platform === "win32") {
    return [{ asset: "yt-dlp.exe", output: "yt-dlp.exe" }];
  }

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

  fs.mkdirSync(binDir, { recursive: true });

  const downloads = resolveDownloads();
  for (const item of downloads) {
    const targetPath = path.join(binDir, item.output);
    const downloadUrl = `https://github.com/yt-dlp/yt-dlp/releases/latest/download/${item.asset}`;
    console.log(`[install-ytdlp] Downloading ${downloadUrl}`);
    await download(downloadUrl, targetPath);
    if (process.platform !== "win32") {
      fs.chmodSync(targetPath, 0o755);
    }
    console.log(`[install-ytdlp] Ready: ${targetPath}`);
  }

  if (process.platform === "linux") {
    const launcherPath = path.join(binDir, "yt-dlp");
    const launcher = `#!/usr/bin/env sh
ARCH="$(uname -m)"
if [ "$ARCH" = "aarch64" ] || [ "$ARCH" = "arm64" ]; then
  exec "$(dirname "$0")/yt-dlp-linux-arm64" "$@"
fi
exec "$(dirname "$0")/yt-dlp-linux-x64" "$@"
`;
    fs.writeFileSync(launcherPath, launcher, { mode: 0o755 });
    fs.chmodSync(launcherPath, 0o755);
    console.log(`[install-ytdlp] Ready launcher: ${launcherPath}`);
  }

  // Keep a default name for non-Linux local workflows.
  if (process.platform !== "linux") {
    const fallbackPath = path.join(binDir, process.platform === "win32" ? "yt-dlp.exe" : "yt-dlp");
    if (!fs.existsSync(fallbackPath)) {
      const source = path.join(binDir, downloads[0].output);
      fs.copyFileSync(source, fallbackPath);
    }
  }
}

main().catch((error) => {
  console.error("[install-ytdlp] Failed:", error.message);
  process.exit(1);
});
