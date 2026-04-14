import { Copy, Download, Link2 } from "lucide-react";
import { HowStep } from "@/lib/types";

interface HowItWorksProps {
  title?: string;
  steps: HowStep[];
}

const icons = [Copy, Link2, Download];

export default function HowItWorks({ title = "How It Works", steps }: HowItWorksProps) {
  return (
    <section className="container my-10">
      <h2 className="mb-6 text-2xl font-bold text-slate-900">{title}</h2>
      <div className="grid gap-4 md:grid-cols-3">
        {steps.map((step, idx) => {
          const Icon = icons[idx] || Download;
          return (
            <article key={step.name} className="card p-5">
              <div className="mb-3 inline-flex h-10 w-10 items-center justify-center rounded-full bg-indigo-100 text-indigo-700">
                <Icon className="h-5 w-5" />
              </div>
              <h3 className="mb-2 text-lg font-semibold">{idx + 1}. {step.name}</h3>
              <p className="text-slate-600">{step.text}</p>
            </article>
          );
        })}
      </div>
    </section>
  );
}
