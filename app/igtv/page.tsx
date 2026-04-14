import type { Metadata } from "next";
import ContentPage from "@/components/ContentPage";
import { config } from "@/lib/config";

export const metadata: Metadata = {
  title: "IGTV Downloader",
  description: "Download IGTV videos from public Instagram links in HD.",
  alternates: { canonical: "/igtv" },
  openGraph: {
    title: "IGTV Downloader",
    description: "Fast IGTV saver without app installation.",
    url: `${config.SITE_URL}/igtv`,
    images: ["/next.svg"]
  }
};

export default function Page() {
  return <ContentPage pageKey="igtv" />;
}
