"use client";

import { Loader2, XCircle } from "lucide-react";
import { useTranslations } from "next-intl";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { DownloadResult } from "@/lib/types";

interface DownloadInputProps {
  placeholder?: string;
  initialUrl?: string;
  onResult?: (result: DownloadResult) => void;
  redirectToResult?: boolean;
}

export default function DownloadInput({
  placeholder = "Paste Instagram link here...",
  initialUrl = "",
  onResult,
  redirectToResult = false
}: DownloadInputProps) {
  const t = useTranslations();
  const router = useRouter();
  const [url, setUrl] = useState(initialUrl);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const submit = async () => {
    setError(null);
    if (!url.trim()) {
      setError("Please paste a public social media URL.");
      return;
    }

    if (redirectToResult) {
      router.push(`/result?url=${encodeURIComponent(url)}`);
      return;
    }

    setLoading(true);
    try {
      const response = await fetch("/api/download", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({ url })
      });
      const payload = await response.json();
      if (!response.ok || !payload.success) {
        throw new Error(payload.error || "Unable to download this URL.");
      }
      onResult?.(payload);
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : "Request failed.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-3">
      <div className="flex flex-col gap-3 sm:flex-row">
        <input
          className="input-pill"
          value={url}
          onChange={(event) => setUrl(event.target.value)}
          placeholder={placeholder}
          aria-label="social url"
        />
        <button
          className="primary-btn min-w-32 px-6 py-3"
          onClick={submit}
          disabled={loading}
          type="button"
        >
          {loading ? <Loader2 className="mx-auto h-5 w-5 animate-spin" /> : t("download")}
        </button>
      </div>
      <button type="button" onClick={() => setUrl("")} className="inline-flex items-center text-sm text-slate-500 hover:text-slate-700">
        <XCircle className="mr-1 h-4 w-4" /> {t("clear")}
      </button>
      {error && <p className="text-sm text-red-600">{error}</p>}
      <div className="flex flex-wrap gap-2 text-xs">
        {[
          "No Login Required",
          "HD Quality",
          "No Watermark",
          "100% Free"
        ].map((badge) => (
          <span key={badge} className="rounded-full bg-emerald-50 px-3 py-1 text-emerald-700">{badge}</span>
        ))}
      </div>
    </div>
  );
}
