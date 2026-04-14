"use client";

import { useState } from "react";
import Image from "next/image";
import { saveAs } from "file-saver";
import { DownloadResult } from "@/lib/types";

interface ResultCardProps {
  result: DownloadResult;
}

export default function ResultCard({ result }: ResultCardProps) {
  const [busyIndex, setBusyIndex] = useState<number | null>(null);
  const [downloadError, setDownloadError] = useState<string | null>(null);

  const downloadVideo = async (url: string, fileName: string, index: number) => {
    setDownloadError(null);
    setBusyIndex(index);
    try {
      const response = await fetch(url);
      if (!response.ok) {
        throw new Error("Failed to prepare download.");
      }
      const blob = await response.blob();
      saveAs(blob, fileName);
    } catch (error: unknown) {
      setDownloadError(error instanceof Error ? error.message : "Failed to download file.");
    } finally {
      setBusyIndex(null);
    }
  };

  return (
    <section className="card overflow-hidden p-5">
      <div className="grid gap-5 md:grid-cols-[220px_1fr]">
        <div className="overflow-hidden rounded-lg bg-slate-100">
          {result.thumbnail ? (
            <Image
              src={result.thumbnail}
              alt={result.title}
              width={220}
              height={140}
              className="h-full w-full object-cover"
            />
          ) : (
            <div className="flex h-full min-h-36 items-center justify-center text-sm text-slate-500">No thumbnail</div>
          )}
        </div>
        <div>
          <p className="text-sm text-indigo-700">{result.author}</p>
          <h2 className="mb-1 text-xl font-bold text-slate-900">{result.title}</h2>
          <p className="mb-4 text-sm text-slate-600 capitalize">Type: {result.type}</p>
          <div className="flex flex-wrap gap-2">
            {result.items.map((item, index) => (
              <button
                key={`${item.url}-${item.quality}`}
                type="button"
                className="rounded-full bg-indigo-600 px-4 py-2 text-sm font-semibold text-white hover:bg-indigo-700"
                onClick={() => downloadVideo(item.url, item.fileName || `video.${item.ext || "mp4"}`, index)}
                disabled={busyIndex === index}
              >
                {busyIndex === index ? "Preparing..." : `Download ${item.quality} (${item.ext})`}
              </button>
            ))}
          </div>
          {downloadError && <p className="mt-3 text-sm text-red-600">{downloadError}</p>}
        </div>
      </div>
    </section>
  );
}
