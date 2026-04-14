import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Terms and Conditions"
};

export default function TermsAndConditionsPage() {
  return (
    <section className="container py-10">
      <h1 className="mb-4 text-3xl font-extrabold">Terms and Conditions</h1>
      <p className="mb-6 text-slate-600">Last updated: April 14, 2026</p>

      <div className="space-y-6 text-slate-700 leading-7">
        <section>
          <h2 className="text-xl font-bold">1. Acceptance of Terms</h2>
          <p>
            By using InstaFastDL, you agree to these terms. If you do not agree, do not use the service.
          </p>
        </section>

        <section>
          <h2 className="text-xl font-bold">2. Intended Use</h2>
          <p>
            This tool is intended for personal use only. You must comply with copyright laws, platform terms, and local
            regulations before downloading any media.
          </p>
        </section>

        <section>
          <h2 className="text-xl font-bold">3. Public Content Requirement</h2>
          <p>
            The service is designed for publicly accessible links and authorized access flows. We do not guarantee
            availability for private, deleted, expired, or geo-restricted content.
          </p>
        </section>

        <section>
          <h2 className="text-xl font-bold">4. No Media Hosting</h2>
          <p>
            We do not offer permanent cloud storage of downloaded media. Content is streamed from source for immediate
            delivery and is not stored as a personal collection on our servers.
          </p>
        </section>

        <section>
          <h2 className="text-xl font-bold">5. No Warranty</h2>
          <p>
            The service is provided on an as-is basis without warranties of uninterrupted availability, compatibility,
            or fitness for a specific purpose.
          </p>
        </section>

        <section>
          <h2 className="text-xl font-bold">6. Limitation of Liability</h2>
          <p>
            We are not liable for user misuse, copyright violations, or any losses arising from downloaded media usage.
            Users are fully responsible for lawful behavior.
          </p>
        </section>

        <section>
          <h2 className="text-xl font-bold">7. DMCA Takedown</h2>
          <p>
            Copyright owners may submit DMCA takedown requests by emailing
            <a className="ml-1 text-indigo-700 underline" href="mailto:dmca@instafastdl.com">dmca@instafastdl.com</a>.
            Include ownership evidence, the relevant URL, and your legal declaration.
          </p>
        </section>
      </div>
    </section>
  );
}
