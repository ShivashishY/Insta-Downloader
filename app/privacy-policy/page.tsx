import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Privacy Policy"
};

export default function PrivacyPolicyPage() {
  return (
    <section className="container py-10">
      <h1 className="mb-4 text-3xl font-extrabold">Privacy Policy</h1>
      <p className="mb-6 text-slate-600">Last updated: April 14, 2026</p>

      <div className="space-y-6 text-slate-700 leading-7">
        <section>
          <h2 className="text-xl font-bold">1. What This Tool Does</h2>
          <p>
            InstaFastDL provides a web interface that helps users request downloads of publicly accessible media URLs.
            Media is fetched on demand from the source platform and returned to the user for immediate download.
          </p>
        </section>

        <section>
          <h2 className="text-xl font-bold">2. No User Account Data Storage</h2>
          <p>
            We do not require account registration to use this tool. We do not create personal user profiles, and we do
            not intentionally store personal account data such as names, passwords, or social account credentials.
          </p>
        </section>

        <section>
          <h2 className="text-xl font-bold">3. No Downloaded Media Storage</h2>
          <p>
            We do not operate a permanent media locker. Downloaded files are not stored as a user library on our
            servers. Media is streamed directly from source links or temporary processing endpoints for delivery.
          </p>
        </section>

        <section>
          <h2 className="text-xl font-bold">4. Personal Use Disclaimer</h2>
          <p>
            This service is intended for personal use only. You are responsible for ensuring you have permission to
            download and use any content. Do not redistribute, publish, or commercialize third-party media without
            proper rights or authorization.
          </p>
        </section>

        <section>
          <h2 className="text-xl font-bold">5. Logs and Abuse Prevention</h2>
          <p>
            Basic technical request metadata may be processed for rate limiting, security, and abuse prevention. We use
            this data only to keep the service stable and secure.
          </p>
        </section>

        <section>
          <h2 className="text-xl font-bold">6. DMCA and Copyright Complaints</h2>
          <p>
            If you are a copyright owner and believe content access through this tool violates your rights, send a
            takedown request to <a className="text-indigo-700 underline" href="mailto:dmca@instafastdl.com">dmca@instafastdl.com</a>.
            Include your contact details, the infringing URL, proof of ownership, and a good-faith statement.
          </p>
        </section>
      </div>
    </section>
  );
}
