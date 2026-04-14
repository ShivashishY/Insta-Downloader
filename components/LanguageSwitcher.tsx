"use client";

import { usePathname, useRouter, useSearchParams } from "next/navigation";

const locales = [
  { code: "en", label: "English" },
  { code: "hi", label: "Hindi" },
  { code: "es", label: "Spanish" },
  { code: "id", label: "Indonesian" },
  { code: "pt", label: "Portuguese" }
];

interface LanguageSwitcherProps {
  current: string;
}

export default function LanguageSwitcher({ current }: LanguageSwitcherProps) {
  const router = useRouter();
  const pathname = usePathname();
  const query = useSearchParams();

  const onChange = (value: string) => {
    document.cookie = `NEXT_LOCALE=${value}; path=/; max-age=31536000; samesite=lax`;
    const params = query.toString();
    const nextPath = params ? `${pathname}?${params}` : pathname;
    router.push(nextPath);
    router.refresh();
  };

  return (
    <select
      aria-label="Switch language"
      className="rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm"
      value={current}
      onChange={(event) => onChange(event.target.value)}
    >
      {locales.map((locale) => (
        <option key={locale.code} value={locale.code}>
          {locale.label}
        </option>
      ))}
    </select>
  );
}
