import Image from "next/image";
import { DownloadResult } from "@/lib/types";

interface CarouselResultProps {
  result: DownloadResult;
}

export default function CarouselResult({ result }: CarouselResultProps) {
  const zipUrl = `/api/proxy?url=${encodeURIComponent(result.items[0]?.url || "")}`;

  return (
    <section className="space-y-5">
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-bold">Carousel Files</h2>
        <a href={zipUrl} className="rounded-full bg-slate-900 px-4 py-2 text-sm text-white">
          Download All (ZIP placeholder)
        </a>
      </div>
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {result.items.map((item, idx) => (
          <article key={`${item.url}-${idx}`} className="card overflow-hidden p-3">
            {item.thumbnail ? (
              <Image src={item.thumbnail} alt={`Carousel item ${idx + 1}`} width={300} height={200} className="mb-3 h-40 w-full rounded object-cover" />
            ) : (
              <div className="mb-3 flex h-40 items-center justify-center rounded bg-slate-100">Item {idx + 1}</div>
            )}
            <a href={item.url} className="block rounded-lg bg-indigo-600 px-4 py-2 text-center text-sm font-semibold text-white hover:bg-indigo-700" download>
              Download {item.ext.toUpperCase()}
            </a>
          </article>
        ))}
      </div>
    </section>
  );
}
