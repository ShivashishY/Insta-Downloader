import type { Metadata } from "next";
import dynamic from "next/dynamic";
import FaqAccordion from "@/components/FaqAccordion";
import FeatureGrid from "@/components/FeatureGrid";
import HomeHero from "@/components/HomeHero";
import HowItWorks from "@/components/HowItWorks";
import SeoSchemas from "@/components/SeoSchemas";
import { config } from "@/lib/config";

const ClientOnlyAdSlot = dynamic(() => import("@/components/AdSlot"), { ssr: false });

const faqItems = [
  { question: "What is SaveMy Reel?", answer: "A free web tool to download public social media content without login." },
  { question: "Is downloading from Instagram legal?", answer: "Use downloads for personal purposes and respect copyright laws in your region." },
  { question: "What formats and quality are available?", answer: "Typically MP4 for video and JPG for photos, with multiple quality options when available." },
  { question: "Do I need to log in or create an account?", answer: "No. The tool works without login." },
  { question: "Are there daily download limits?", answer: "Requests are rate-limited to protect service availability." },
  { question: "How do I download Instagram Reels?", answer: "Copy the reel link, paste into the tool, and choose a quality option." },
  { question: "Can I download from private accounts?", answer: "No. Only publicly available content is supported." },
  { question: "Which browsers and devices are supported?", answer: "Chrome, Safari, Firefox, and Edge on desktop and mobile." },
  { question: "Where do downloaded files go on my phone?", answer: "They are saved to your browser's default downloads folder." },
  { question: "Is my link stored on your servers?", answer: "No permanent storage. Links are processed in-memory per request." },
  { question: "Why is my download slow?", answer: "Source server speed, network, and selected file size can affect download time." },
  { question: "How do I download an Instagram carousel/album?", answer: "Paste a carousel URL and download each item or use Download All if available." }
];

const howSteps = [
  { name: "Copy the URL", text: "Open Instagram and copy the link of any post, reel, video, or story." },
  { name: "Paste the link", text: "Return here, paste it into the input field, and click Download." },
  { name: "Save your file", text: "Pick your preferred quality and download instantly to your device." }
];

export const metadata: Metadata = {
  title: "Download Instagram Videos, Reels & Photos — Free",
  description:
    "Paste any public Instagram link. Download HD video, photos, Reels, Stories, IGTV, or carousels. No login. No watermark. Works on all devices.",
  alternates: { canonical: "/" },
  openGraph: {
    title: "Download Instagram Videos, Reels & Photos — Free",
    description:
      "Download HD Instagram media online: videos, photos, reels, stories, IGTV, carousel posts. Fast and free.",
    url: config.SITE_URL,
    images: ["/next.svg"]
  }
};

export default function HomePage() {
  return (
    <>
      <SeoSchemas
        pageUrl={`${config.SITE_URL}/`}
        title="Instagram Downloader"
        description="Fast Instagram downloader for videos, photos, reels, stories and carousels."
        faqs={faqItems}
        steps={howSteps}
        includeWebsiteSchema
      />

      <HomeHero />

      <div className="container mt-8">
        <ClientOnlyAdSlot slotId="home-top-1" />
      </div>

      <HowItWorks steps={howSteps} />
      <FeatureGrid />

      <section className="container my-10 rounded-xl bg-amber-50 p-4 text-sm text-amber-800">
        For personal use only. Respect creator copyright. Do not redistribute downloaded content without permission.
      </section>

      <FaqAccordion faqs={faqItems} />

      <div className="container mb-10">
        <ClientOnlyAdSlot slotId="home-bottom-1" />
      </div>
    </>
  );
}
