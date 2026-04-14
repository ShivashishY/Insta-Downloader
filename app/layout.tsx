import Script from "next/script";
import type { Metadata } from "next";
import { NextIntlClientProvider } from "next-intl";
import Footer from "@/components/Footer";
import NavBar from "@/components/NavBar";
import { config } from "@/lib/config";
import { getMessages } from "@/lib/i18n";
import "./globals.css";

export const metadata: Metadata = {
  metadataBase: new URL(config.SITE_URL),
  title: {
    default: "SaveMy Reel - Instagram Downloader",
    template: "%s | SaveMy Reel"
  },
  description:
    "Download Instagram videos, Reels, photos, stories, IGTV and carousel posts. Free, no login, no watermark.",
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-image-preview": "large",
      "max-snippet": -1,
      "max-video-preview": -1
    }
  },
  openGraph: {
    title: "SaveMy Reel - Instagram Downloader",
    description:
      "Paste public social media URLs and download in HD quality instantly. No app install, no login.",
    url: config.SITE_URL,
    siteName: "SaveMy Reel",
    images: [{ url: "/file.svg", width: 1200, height: 630, alt: "SaveMy Reel" }],
    type: "website"
  },
  twitter: {
    card: "summary_large_image",
    title: "SaveMy Reel - Instagram Downloader",
    description:
      "Download Instagram videos, Reels, photos, stories, IGTV and carousel posts. Free, no login, no watermark.",
    images: ["/file.svg"]
  }
};

export default async function RootLayout({ children }: { children: React.ReactNode }) {
  const { locale, messages } = await getMessages();

  return (
    <html lang={locale}>
      <body className="min-h-screen">
        <NextIntlClientProvider locale={locale} messages={messages}>
          <NavBar locale={locale} />
          <main>{children}</main>
          <Footer />
        </NextIntlClientProvider>

        {config.GA_MEASUREMENT_ID && (
          <>
            <Script async src={`https://www.googletagmanager.com/gtag/js?id=${config.GA_MEASUREMENT_ID}`} />
            <Script id="ga4">
              {`window.dataLayer = window.dataLayer || [];function gtag(){dataLayer.push(arguments);}gtag('js', new Date());gtag('config', '${config.GA_MEASUREMENT_ID}');`}
            </Script>
          </>
        )}
      </body>
    </html>
  );
}
