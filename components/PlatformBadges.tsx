import { Bird, Camera, Music2, Pin, Play } from "lucide-react";

export default function PlatformBadges() {
  const badges = [
    { label: "Instagram", icon: Camera },
    { label: "TikTok", icon: Music2 },
    { label: "Twitter/X", icon: Bird },
    { label: "Pinterest", icon: Pin },
    { label: "YouTube Shorts", icon: Play }
  ];

  return (
    <div className="flex flex-wrap items-center gap-2">
      {badges.map((badge) => {
        const Icon = badge.icon;
        return (
          <span key={badge.label} className="rounded-full border border-slate-200 bg-white px-3 py-1 text-sm text-slate-700">
            <Icon className="mr-1 inline-block h-4 w-4" />
            {badge.label}
          </span>
        );
      })}
    </div>
  );
}
