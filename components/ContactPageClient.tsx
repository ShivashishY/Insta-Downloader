"use client";

import { FormEvent, useState } from "react";

export default function ContactPageClient() {
  const [status, setStatus] = useState<string>("");

  const handleDmcaSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const form = event.currentTarget;
    const data = new FormData(form);

    const name = String(data.get("name") || "");
    const email = String(data.get("email") || "");
    const infringingUrl = String(data.get("url") || "");
    const details = String(data.get("details") || "");
    const statement = String(data.get("statement") || "");
    const signature = String(data.get("signature") || "");

    const subject = encodeURIComponent("DMCA Takedown Request");
    const body = encodeURIComponent(
      `Name: ${name}\nEmail: ${email}\nInfringing URL: ${infringingUrl}\n\nDetails:\n${details}\n\nGood Faith Statement:\n${statement}\n\nElectronic Signature:\n${signature}`
    );

    window.location.href = `mailto:dmca@savemyreel.xyz?subject=${subject}&body=${body}`;
    setStatus("Your email client was opened with a prefilled DMCA request.");
    form.reset();
  };

  return (
    <section className="container py-10">
      <h1 className="mb-4 text-3xl font-extrabold">Contact</h1>
      <p className="mb-6 text-slate-600">
        General support: <a className="text-indigo-700 underline" href="mailto:contact@savemyreel.xyz">contact@savemyreel.xyz</a>
      </p>

      <article className="card p-6">
        <h2 className="mb-4 text-xl font-bold">DMCA Takedown Request Form</h2>
        <form className="space-y-4" onSubmit={handleDmcaSubmit}>
          <input name="name" required placeholder="Your full name" className="w-full rounded-lg border border-slate-300 px-4 py-3" />
          <input name="email" required type="email" placeholder="Your email" className="w-full rounded-lg border border-slate-300 px-4 py-3" />
          <input name="url" required placeholder="Infringing content URL" className="w-full rounded-lg border border-slate-300 px-4 py-3" />
          <textarea name="details" required rows={4} placeholder="Describe the copyrighted work and issue" className="w-full rounded-lg border border-slate-300 px-4 py-3" />
          <textarea name="statement" required rows={3} placeholder="Good faith statement" className="w-full rounded-lg border border-slate-300 px-4 py-3" />
          <input name="signature" required placeholder="Electronic signature" className="w-full rounded-lg border border-slate-300 px-4 py-3" />
          <button type="submit" className="rounded-full bg-indigo-600 px-6 py-3 font-semibold text-white">Submit DMCA Request</button>
        </form>
        {status && <p className="mt-4 text-sm text-emerald-700">{status}</p>}
      </article>
    </section>
  );
}
