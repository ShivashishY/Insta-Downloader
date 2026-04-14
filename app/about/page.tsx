import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "About"
};

export default function AboutPage() {
  return (
    <section className="container py-10">
      <h1 className="mb-4 text-3xl font-extrabold">About InstaFastDL</h1>
      <div className="space-y-5 text-slate-700 leading-7">
        <p>
          InstaFastDL is a web-based downloader for public social media links, focused on Instagram formats such as
          videos, reels, photos, stories, IGTV, and carousel posts. The goal is to provide a fast and clean workflow so
          users can save media for lawful personal use without installing an app.
        </p>
        <p>
          The service processes a URL submitted by the user, fetches available media streams from the source, and
          returns downloadable options in the browser. We do not run a permanent user media vault and do not present
          this service as a content ownership transfer tool.
        </p>
        <p>
          InstaFastDL is operated by an independent web tools team focused on practical utility products and responsible
          content handling. If you need legal or copyright assistance, or want to submit a takedown request, contact us
          at <a className="text-indigo-700 underline" href="mailto:contact@instafastdl.com">contact@instafastdl.com</a> or
          <a className="ml-1 text-indigo-700 underline" href="mailto:dmca@instafastdl.com">dmca@instafastdl.com</a>.
        </p>
      </div>
    </section>
  );
}
