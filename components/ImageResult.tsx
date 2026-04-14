"use client";

import { useState } from "react";
import Image from "next/image";
import JSZip from "jszip";
import { saveAs } from "file-saver";
import { DownloadResult } from "@/lib/types";

interface ImageResultProps {
  result: DownloadResult;
}

function proxyUrl(sourceUrl: string, fileName: string) {
  return `/api/proxy?url=${encodeURIComponent(sourceUrl)}&filename=${encodeURIComponent(fileName)}&ext=jpg`;
}

export default function ImageResult({ result }: ImageResultProps) {
  const [busyIndex, setBusyIndex] = useState<number | null>(null);
  const [zipLoading, setZipLoading] = useState(false);

  const downloadOne = async (url: string, index: number) => {
    const fileName = `photo_${index + 1}.jpg`;
    setBusyIndex(index);
    try {
      const response = await fetch(proxyUrl(url, fileName));
      if (!response.ok) throw new Error("Failed to fetch image");
      const blob = await response.blob();
      saveAs(blob, fileName);
    } finally {
      setBusyIndex(null);
    }
  };

  const downloadAllAsZip = async () => {
    setZipLoading(true);
    try {
      const zip = new JSZip();
      await Promise.all(
        result.items.map(async (item, index) => {
          const fileName = `photo_${index + 1}.jpg`;
          const response = await fetch(proxyUrl(item.url, fileName));
          if (!response.ok) return;
          const blob = await response.blob();
          zip.file(fileName, blob);
        })
      );
      const zipBlob = await zip.generateAsync({ type: "blob" });
      saveAs(zipBlob, "photos.zip");
    } finally {
      setZipLoading(false);
    }
  };

  if (!result.items.length) {
    return <p className="card p-5 text-red-600">No downloadable images were found for this URL.</p>;
  }

  if (result.type === "photo") {
    const first = result.items[0];
    return (
      <section className="card p-5">
        <div className="overflow-hidden rounded-xl bg-slate-100">
          <Image
            src={first.thumbnail || first.url}
            alt={result.title}
            width={1100}
            height={650}
            className="h-auto w-full object-cover"
          />
        </div>
        <button
          type="button"
          className="primary-btn mt-4 px-6 py-3"
          onClick={() => downloadOne(first.url, 0)}
          disabled={busyIndex === 0}
        >
          {busyIndex === 0 ? "Preparing..." : "Download Image"}
        </button>
      </section>
    );
  }

  return (
    <section className="space-y-5">
      <div className="flex items-center justify-between gap-3">
        <h2 className="text-xl font-bold">Carousel Images</h2>
        <button
          type="button"
          className="rounded-full bg-slate-900 px-4 py-2 text-sm font-semibold text-white"
          onClick={downloadAllAsZip}
          disabled={zipLoading}
        >
          {zipLoading ? "Building ZIP..." : "Download All as ZIP"}
        </button>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {result.items.map((item, index) => (
          <article key={`${item.url}-${index}`} className="card p-3">
            <div className="overflow-hidden rounded-lg bg-slate-100">
              <Image
                src={item.thumbnail || item.url}
                alt={`Carousel image ${index + 1}`}
                width={500}
                height={500}
                className="h-48 w-full object-cover"
              />
            </div>
            <button
              type="button"
              className="primary-btn mt-3 w-full px-4 py-2 text-sm"
              onClick={() => downloadOne(item.url, index)}
              disabled={busyIndex === index}
            >
              {busyIndex === index ? "Preparing..." : `Download Image ${index + 1}`}
            </button>
          </article>
        ))}
      </div>
    </section>
  );
}
