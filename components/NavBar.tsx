import Link from "next/link";
import LanguageSwitcher from "@/components/LanguageSwitcher";
import { CONTENT_PAGES } from "@/lib/contentData";

interface NavBarProps {
  locale: string;
}

export default function NavBar({ locale }: NavBarProps) {
  return (
    <header className="sticky top-0 z-40 border-b border-slate-200 bg-white/90 backdrop-blur">
      <nav className="container flex items-center justify-between gap-4 py-3">
        <Link href="/" className="text-lg font-extrabold text-indigo-700">
          SaveMy Reel
        </Link>
        <div className="hidden items-center gap-4 text-sm text-slate-700 md:flex">
          {Object.values(CONTENT_PAGES).map((item) => (
            <Link key={item.path} href={item.path} className="hover:text-indigo-700">
              {item.navLabel}
            </Link>
          ))}
        </div>
        <LanguageSwitcher current={locale} />
      </nav>
    </header>
  );
}
