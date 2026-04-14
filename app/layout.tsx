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
    default: "Instagram Downloader - Fast & Free",
    template: "%s | InstaFastDL"
  },
  description:
    "Download Instagram videos, Reels, photos, stories, IGTV and carousel posts. Free, no login, no watermark.",
  alternates: {
    canonical: "/"
  },
  openGraph: {
    title: "Instagram Downloader - Fast & Free",
    description:
      "Paste public social media URLs and download in HD quality instantly. No app install, no login.",
    url: config.SITE_URL,
    siteName: "InstaFastDL",
    images: [{ url: "/next.svg", width: 1200, height: 630, alt: "InstaFastDL" }],
    type: "website"
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
