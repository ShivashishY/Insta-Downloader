import Link from "next/link";
import { CONTENT_PAGES, ContentKey } from "@/lib/contentData";

interface ContentTypeTabsProps {
  active: ContentKey;
}

export default function ContentTypeTabs({ active }: ContentTypeTabsProps) {
  return (
    <div className="flex gap-2 overflow-x-auto pb-2">
      {(Object.values(CONTENT_PAGES) as Array<(typeof CONTENT_PAGES)[ContentKey]>).map((page) => (
        <Link
          key={page.key}
          href={page.path}
          className={`whitespace-nowrap rounded-full border px-4 py-2 text-sm font-medium transition ${
            active === page.key
              ? "border-indigo-600 bg-indigo-600 text-white"
              : "border-slate-300 bg-white text-slate-700 hover:border-indigo-400"
          }`}
        >
          {page.navLabel}
        </Link>
      ))}
      <Link
        href="/"
        className="whitespace-nowrap rounded-full border border-slate-300 bg-white px-4 py-2 text-sm font-medium text-slate-700 hover:border-indigo-400"
      >
        Profile
      </Link>
    </div>
  );
}
