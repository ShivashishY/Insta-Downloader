import type { Metadata } from "next";
import ContentPage from "@/components/ContentPage";
import { config } from "@/lib/config";

export const metadata: Metadata = {
  title: "Instagram Video Downloader",
  description: "Download Instagram videos online in HD quality. Free, no login, no watermark.",
  alternates: { canonical: "/video" },
  openGraph: {
    title: "Instagram Video Downloader",
    description: "Save Instagram videos quickly in MP4 HD quality.",
    url: `${config.SITE_URL}/video`,
    images: ["/next.svg"]
  }
};

export default function Page() {
  return <ContentPage pageKey="video" />;
}
