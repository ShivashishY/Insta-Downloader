import { cookies } from "next/headers";

export const LOCALES = ["en", "hi", "es", "id", "pt"] as const;
export type Locale = (typeof LOCALES)[number];

export async function getLocale(): Promise<Locale> {
  const locale = cookies().get("NEXT_LOCALE")?.value;
  if (locale && LOCALES.includes(locale as Locale)) {
    return locale as Locale;
  }
  return "en";
}

export async function getMessages() {
  const locale = await getLocale();
  const messages = (await import(`@/messages/${locale}.json`)).default;
  return { locale, messages };
}
