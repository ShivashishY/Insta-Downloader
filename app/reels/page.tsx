import type { Metadata } from "next";
import ContentPage from "@/components/ContentPage";
import { config } from "@/lib/config";

export const metadata: Metadata = {
  title: "Instagram Reels Downloader",
  description: "Download Instagram Reels videos in HD quality with no watermark.",
  alternates: { canonical: "/reels" },
  openGraph: {
    title: "Instagram Reels Downloader",
    description: "Fast Instagram Reels saver for public links.",
    url: `${config.SITE_URL}/reels`,
    images: ["/next.svg"]
  }
};

export default function Page() {
  return <ContentPage pageKey="reels" />;
}
