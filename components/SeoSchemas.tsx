import { FaqItem, HowStep } from "@/lib/types";

interface SeoSchemasProps {
  pageUrl: string;
  title: string;
  description: string;
  faqs: FaqItem[];
  steps: HowStep[];
  includeWebsiteSchema?: boolean;
}

export default function SeoSchemas({
  pageUrl,
  title,
  description,
  faqs,
  steps,
  includeWebsiteSchema = false
}: SeoSchemasProps) {
  const faqSchema = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: faqs.map((item) => ({
      "@type": "Question",
      name: item.question,
      acceptedAnswer: {
        "@type": "Answer",
        text: item.answer
      }
    }))
  };

  const howToSchema = {
    "@context": "https://schema.org",
    "@type": "HowTo",
    name: title,
    description,
    step: steps.map((step) => ({
      "@type": "HowToStep",
      name: step.name,
      text: step.text
    }))
  };

  const websiteSchema = {
    "@context": "https://schema.org",
    "@type": "WebSite",
    name: "InstaFastDL",
    url: pageUrl,
    potentialAction: {
      "@type": "SearchAction",
      target: `${pageUrl}result?url={search_term_string}`,
      "query-input": "required name=search_term_string"
    }
  };

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(howToSchema) }} />
      {includeWebsiteSchema && (
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(websiteSchema) }} />
      )}
    </>
  );
}
