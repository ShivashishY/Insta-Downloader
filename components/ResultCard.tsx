import Image from "next/image";
import { DownloadResult } from "@/lib/types";

interface ResultCardProps {
  result: DownloadResult;
}

export default function ResultCard({ result }: ResultCardProps) {
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
            {result.items.map((item) => (
              <a
                key={`${item.url}-${item.quality}`}
                href={item.url}
                className="rounded-full bg-indigo-600 px-4 py-2 text-sm font-semibold text-white hover:bg-indigo-700"
                download
                rel="noreferrer"
              >
                Download {item.quality} ({item.ext})
              </a>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
