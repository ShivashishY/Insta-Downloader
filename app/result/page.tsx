"use client";

import dynamic from "next/dynamic";
import { Copy, RotateCcw } from "lucide-react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { useEffect, useMemo, useState } from "react";
import ImageResult from "@/components/ImageResult";
import ResultCard from "@/components/ResultCard";
import { DownloadResult } from "@/lib/types";

const ClientOnlyAdSlot = dynamic(() => import("@/components/AdSlot"), { ssr: false });

export default function ResultPage() {
  const params = useSearchParams();
  const url = useMemo(() => params.get("url") || "", [params]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [result, setResult] = useState<DownloadResult | null>(null);
  const [copyStatus, setCopyStatus] = useState<"idle" | "success" | "error">("idle");

  const copyResultLink = async () => {
    const target = window.location.href;

    try {
      if (navigator.clipboard?.writeText) {
        await navigator.clipboard.writeText(target);
      } else {
        const textarea = document.createElement("textarea");
        textarea.value = target;
        textarea.setAttribute("readonly", "true");
        textarea.style.position = "fixed";
        textarea.style.opacity = "0";
        document.body.appendChild(textarea);
        textarea.select();
        document.execCommand("copy");
        document.body.removeChild(textarea);
      }

      setCopyStatus("success");
    } catch {
      setCopyStatus("error");
    } finally {
      window.setTimeout(() => setCopyStatus("idle"), 1800);
    }
  };

  useEffect(() => {
    const run = async () => {
      if (!url) {
        setError("Missing URL. Please paste a media link first.");
        setLoading(false);
        return;
      }

      try {
        setLoading(true);
        const response = await fetch("/api/download", {
          method: "POST",
          headers: { "content-type": "application/json" },
          body: JSON.stringify({ url })
        });

        const raw = await response.text();
        let payload: { success?: boolean; error?: string } & DownloadResult;
        try {
          payload = JSON.parse(raw);
        } catch {
          throw new Error(`Server returned an invalid response (${response.status}).`);
        }

        if (!response.ok || !payload.success) {
          throw new Error(payload.error || "Unable to load media result.");
        }

        setResult(payload);
      } catch (err: unknown) {
        setError(err instanceof Error ? err.message : "Request failed");
      } finally {
        setLoading(false);
      }
    };

    run();
  }, [url]);

  return (
    <section className="container py-10">
      <h1 className="mb-2 text-3xl font-extrabold">Download Result</h1>
      <p className="mb-6 text-slate-600">Your media links are ready. Choose a quality and download instantly.</p>

      <div className="grid gap-6 lg:grid-cols-[1fr_260px]">
        <div className="space-y-5">
          {loading && <p className="card p-5">Processing URL and fetching media...</p>}
          {error && <p className="card p-5 text-red-600">{error}</p>}
          {result && (result.type === "photo" || result.type === "carousel") ? <ImageResult result={result} /> : null}
          {result && result.type !== "photo" && result.type !== "carousel" ? <ResultCard result={result} /> : null}

          {result && (
            <div className="card flex flex-wrap items-center gap-3 p-4">
              <button
                type="button"
                className="inline-flex items-center rounded-full border border-slate-300 px-4 py-2 text-sm"
                onClick={copyResultLink}
              >
                <Copy className="mr-2 h-4 w-4" /> Copy result link
              </button>
              {copyStatus === "success" && <span className="text-sm text-emerald-700">Link copied</span>}
              {copyStatus === "error" && <span className="text-sm text-red-600">Copy failed</span>}
              <Link href="/" className="inline-flex items-center rounded-full bg-indigo-600 px-4 py-2 text-sm font-semibold text-white">
                <RotateCcw className="mr-2 h-4 w-4" /> Download Another
              </Link>
            </div>
          )}
        </div>

        <aside className="space-y-4">
          <ClientOnlyAdSlot slotId="result-sidebar-1" />
          <ClientOnlyAdSlot slotId="result-sidebar-2" />
        </aside>
      </div>

      <section className="mt-8 rounded-xl bg-amber-50 p-4 text-sm text-amber-800">
        For personal use only. Respect creator copyright. Do not redistribute downloaded content without permission.
      </section>
    </section>
  );
}
