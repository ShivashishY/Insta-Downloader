import { Lock, MonitorSmartphone, Timer, Video } from "lucide-react";

export default function FeatureGrid() {
  const features = [
    {
      title: "Fast Download",
      text: "Servers optimized for quick extraction and direct download links.",
      icon: Timer
    },
    {
      title: "All Devices",
      text: "Use any browser on mobile, tablet, laptop, or desktop.",
      icon: MonitorSmartphone
    },
    {
      title: "HD Quality",
      text: "Download in original quality when source quality is available.",
      icon: Video
    },
    {
      title: "Private & Secure",
      text: "No login needed and no permanent storage of submitted links.",
      icon: Lock
    }
  ];

  return (
    <section className="container my-12">
      <h2 className="mb-6 text-2xl font-bold text-slate-900">Why Use This Downloader</h2>
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {features.map((feature) => {
          const Icon = feature.icon;
          return (
            <article key={feature.title} className="card p-5">
              <Icon className="mb-3 h-6 w-6 text-indigo-600" />
              <h3 className="mb-2 font-semibold">{feature.title}</h3>
              <p className="text-sm text-slate-600">{feature.text}</p>
            </article>
          );
        })}
      </div>
    </section>
  );
}
