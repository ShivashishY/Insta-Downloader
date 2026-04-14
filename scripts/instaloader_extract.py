#!/usr/bin/env python3
import json
import subprocess
import sys


def main() -> int:
    if len(sys.argv) < 2:
        print("Usage: instaloader_extract.py <url>", file=sys.stderr)
        return 1

    url = sys.argv[1]
    args = [
        "yt-dlp",
        "--dump-json",
        "--no-playlist",
        "-f",
        "bestvideo+bestaudio/best",
        "--merge-output-format",
        "mp4",
        "--audio-multistreams",
        url,
    ]

    proc = subprocess.run(args, check=False, capture_output=True, text=True)
    if proc.returncode != 0:
        print(proc.stderr.strip(), file=sys.stderr)
        return proc.returncode

    # Validate JSON output before printing.
    payload = json.loads(proc.stdout)
    print(json.dumps(payload))
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
