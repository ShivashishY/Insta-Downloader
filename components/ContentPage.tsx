import dynamic from "next/dynamic";
import Link from "next/link";
import ContentTypeTabs from "@/components/ContentTypeTabs";
import DownloadInput from "@/components/DownloadInput";
import FaqAccordion from "@/components/FaqAccordion";
import FeatureGrid from "@/components/FeatureGrid";
import HowItWorks from "@/components/HowItWorks";
import PlatformBadges from "@/components/PlatformBadges";
import SeoSchemas from "@/components/SeoSchemas";
import { CONTENT_PAGES, ContentKey } from "@/lib/contentData";
import { config } from "@/lib/config";

const ClientOnlyAdSlot = dynamic(() => import("@/components/AdSlot"), { ssr: false });

interface ContentPageProps {
  pageKey: ContentKey;
}

export default function ContentPage({ pageKey }: ContentPageProps) {
  const page = CONTENT_PAGES[pageKey];

  return (
    <>
      <SeoSchemas
        pageUrl={`${config.SITE_URL}${page.path}`}
        title={page.h1}
        description={page.subtitle}
        faqs={page.faqs}
        steps={page.howTo}
      />
      <section className="gradient-hero border-b border-slate-100 py-10">
        <div className="container">
          <ContentTypeTabs active={page.key} />
          <h1 className="mt-5 text-3xl font-extrabold text-slate-900 sm:text-4xl">{page.h1}</h1>
          <p className="mt-3 max-w-3xl text-slate-600">{page.subtitle}</p>
          <div className="mt-6 card p-5">
            <DownloadInput placeholder={page.inputPlaceholder} redirectToResult />
            <div className="mt-4">
              <PlatformBadges />
            </div>
          </div>
        </div>
      </section>

      <div className="container mt-8">
        <ClientOnlyAdSlot slotId="hero-inline-1" />
      </div>

      <HowItWorks title={`How to download ${page.navLabel.toLowerCase()} content`} steps={page.howTo} />
      <FeatureGrid />

      <section className="container my-10">
        <article className="card space-y-4 p-6">
          <h2 className="text-2xl font-bold text-slate-900">{page.guideTitle}</h2>
          {page.guideParagraphs.map((paragraph, index) => (
            <p key={`${page.key}-guide-${index}`} className="text-slate-700 leading-7">
              {paragraph}
            </p>
          ))}
        </article>
      </section>

      <section className="container my-10 rounded-xl bg-amber-50 p-4 text-sm text-amber-800">
        For personal use only. Respect creator copyright. Do not redistribute downloaded content without permission.
      </section>

      <section className="container my-8">
        <h2 className="mb-3 text-2xl font-bold">Explore Other Tools</h2>
        <div className="flex flex-wrap gap-3 text-indigo-700">
          {Object.values(CONTENT_PAGES)
            .filter((item) => item.key !== page.key)
            .map((item) => (
              <Link key={item.path} href={item.path} className="rounded-full border border-indigo-200 px-4 py-2 hover:bg-indigo-50">
                {item.h1}
              </Link>
            ))}
        </div>
      </section>

      <FaqAccordion faqs={page.faqs} />
      <div className="container mb-8">
        <ClientOnlyAdSlot slotId="faq-inline-1" />
      </div>
    </>
  );
}
