import Link from "next/link";

export default function Footer() {
  return (
    <footer className="mt-14 border-t border-slate-200 bg-white">
      <div className="container grid gap-8 py-10 md:grid-cols-4">
        <div>
          <h3 className="text-lg font-bold text-indigo-700">SaveMy Reel</h3>
          <p className="mt-2 text-sm text-slate-600">Fast social media downloader for public content.</p>
        </div>
        <div>
          <h4 className="mb-3 font-semibold">Downloader</h4>
          <ul className="space-y-2 text-sm text-slate-600">
            <li><Link href="/video">Video</Link></li>
            <li><Link href="/photo">Photo</Link></li>
            <li><Link href="/reels">Reels</Link></li>
            <li><Link href="/story">Story</Link></li>
            <li><Link href="/igtv">IGTV</Link></li>
            <li><Link href="/carousel">Carousel</Link></li>
            <li><a href="#">Viewer</a></li>
          </ul>
        </div>
        <div>
          <h4 className="mb-3 font-semibold">Info</h4>
          <ul className="space-y-2 text-sm text-slate-600">
            <li><Link href="/about">About</Link></li>
            <li><Link href="/contact">Contact</Link></li>
            <li><Link href="/privacy-policy">Privacy Policy</Link></li>
            <li><Link href="/terms-and-conditions">Terms & Conditions</Link></li>
          </ul>
        </div>
        <div>
          <h4 className="mb-3 font-semibold">Follow</h4>
          <ul className="space-y-2 text-sm text-slate-600">
            <li><a href="#">Instagram</a></li>
            <li><a href="#">Facebook</a></li>
            <li><a href="#">YouTube</a></li>
            <li><a href="#">Twitter/X</a></li>
            <li><a href="#">TikTok</a></li>
          </ul>
        </div>
      </div>
      <div className="border-t border-slate-100 bg-slate-50 py-4">
        <p className="container text-center text-xs leading-5 text-slate-600">
          This tool is intended for personal use only. We do not store any downloaded content on our servers. All media is streamed directly from the source. Respect copyright and only download content you have permission to save.
        </p>
      </div>
      <div className="border-t border-slate-100 py-4 text-center text-xs text-slate-500">
        Copyright © {new Date().getFullYear()} SaveMy Reel. All rights reserved.
      </div>
    </footer>
  );
}
