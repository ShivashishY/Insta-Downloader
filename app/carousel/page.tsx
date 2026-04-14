import type { Metadata } from "next";
import ContentPage from "@/components/ContentPage";
import { config } from "@/lib/config";

export const metadata: Metadata = {
  title: "Instagram Carousel / Album Downloader",
  description: "Download Instagram carousel and album posts, including all photos and videos.",
  alternates: { canonical: "/carousel" },
  openGraph: {
    title: "Instagram Carousel / Album Downloader",
    description: "Save every file in an Instagram album post.",
    url: `${config.SITE_URL}/carousel`,
    images: ["/next.svg"]
  }
};

export default function Page() {
  return <ContentPage pageKey="carousel" />;
}
