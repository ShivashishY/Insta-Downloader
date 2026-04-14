"use client";

import { ChevronDown } from "lucide-react";
import { useState } from "react";
import { FaqItem } from "@/lib/types";

interface FaqAccordionProps {
  faqs: FaqItem[];
}

export default function FaqAccordion({ faqs }: FaqAccordionProps) {
  const [openIndex, setOpenIndex] = useState<number | null>(0);

  return (
    <section className="container my-12">
      <h2 className="mb-6 text-2xl font-bold text-slate-900">Frequently Asked Questions</h2>
      <div className="space-y-3">
        {faqs.map((faq, idx) => {
          const open = idx === openIndex;
          return (
            <div key={faq.question} className="card overflow-hidden">
              <button
                className="flex w-full items-center justify-between px-5 py-4 text-left"
                onClick={() => setOpenIndex(open ? null : idx)}
                type="button"
              >
                <span className="font-semibold">{faq.question}</span>
                <ChevronDown className={`h-5 w-5 transition ${open ? "rotate-180" : ""}`} />
              </button>
              {open && <p className="px-5 pb-5 text-slate-600">{faq.answer}</p>}
            </div>
          );
        })}
      </div>
    </section>
  );
}
