import type { Metadata } from "next";
import ContactPageClient from "@/components/ContactPageClient";
import { config } from "@/lib/config";

export const metadata: Metadata = {
  title: "Contact",
  description: "Contact SaveMy Reel support and submit copyright or DMCA takedown requests.",
  alternates: { canonical: "/contact" },
  openGraph: {
    title: "Contact SaveMy Reel",
    description: "Get help and submit DMCA requests for SaveMy Reel.",
    url: `${config.SITE_URL}/contact`,
    images: ["/file.svg"]
  }
};

export default function ContactPage() {
  return <ContactPageClient />;
}
