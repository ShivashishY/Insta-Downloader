import type { Metadata } from "next";
import ContentPage from "@/components/ContentPage";
import { config } from "@/lib/config";

export const metadata: Metadata = {
  title: "Instagram Story Saver",
  description: "Save Instagram stories online from public links with one click.",
  alternates: { canonical: "/story" },
  openGraph: {
    title: "Instagram Story Saver",
    description: "Download public Instagram stories quickly.",
    url: `${config.SITE_URL}/story`,
    images: ["/next.svg"]
  }
};

export default function Page() {
  return <ContentPage pageKey="story" />;
}
