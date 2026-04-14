"use client";

import { useMemo, useState } from "react";
import DownloadInput from "@/components/DownloadInput";
import PlatformBadges from "@/components/PlatformBadges";
import { CONTENT_PAGES } from "@/lib/contentData";

type HomeTab = "video" | "photo" | "reels" | "story" | "igtv" | "carousel" | "profile";

const profileTab = {
  key: "profile" as const,
  navLabel: "Profile",
  h1: "Instagram Profile Downloader",
  subtitle: "Paste a public Instagram profile URL to fetch available public media links quickly.",
  inputPlaceholder: "Paste Instagram profile link here..."
};

export default function HomeHero() {
  const [active, setActive] = useState<HomeTab>("video");

  const tabs = useMemo(() => {
    const fromContent = Object.values(CONTENT_PAGES).map((item) => ({
      key: item.key,
      navLabel: item.navLabel,
      h1: item.h1,
      subtitle: item.subtitle,
      inputPlaceholder: item.inputPlaceholder
    }));
    return [...fromContent, profileTab];
  }, []);

  const current = tabs.find((tab) => tab.key === active) || tabs[0];

  return (
    <section className="gradient-hero border-b border-slate-100 py-12">
      <div className="container">
        <div className="flex gap-2 overflow-x-auto pb-2">
          {tabs.map((tab) => (
            <button
              key={tab.key}
              onClick={() => setActive(tab.key as HomeTab)}
              className={`whitespace-nowrap rounded-full border px-4 py-2 text-sm font-medium transition ${
                active === tab.key
                  ? "border-indigo-600 bg-indigo-600 text-white"
                  : "border-slate-300 bg-white text-slate-700 hover:border-indigo-400"
              }`}
              type="button"
            >
              {tab.navLabel}
            </button>
          ))}
        </div>

        <h1 className="mt-5 text-3xl font-extrabold text-slate-900 sm:text-5xl">{current.h1}</h1>
        <p className="mt-4 max-w-4xl text-lg text-slate-600">{current.subtitle}</p>

        <div className="mt-7 card p-5">
          <DownloadInput placeholder={current.inputPlaceholder} redirectToResult />
          <div className="mt-4">
            <PlatformBadges />
          </div>
        </div>
      </div>
    </section>
  );
}
