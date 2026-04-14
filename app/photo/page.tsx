import type { Metadata } from "next";
import ContentPage from "@/components/ContentPage";
import { config } from "@/lib/config";

export const metadata: Metadata = {
  title: "Instagram Photo Downloader",
  description: "Download Instagram photos online in original quality. Free and fast.",
  alternates: { canonical: "/photo" },
  openGraph: {
    title: "Instagram Photo Downloader",
    description: "Save public Instagram images in high quality.",
    url: `${config.SITE_URL}/photo`,
    images: ["/next.svg"]
  }
};

export default function Page() {
  return <ContentPage pageKey="photo" />;
}
