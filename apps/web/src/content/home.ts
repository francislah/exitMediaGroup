import type { HomePageContent } from "../lib/content-types";
import { loadHomePageContent } from "../lib/content-loader";
import { type Locale, getSupportedLocales, resolveLocale } from "../lib/i18n";

export async function getHomePageContent(
  locale: string,
): Promise<HomePageContent> {
  return loadHomePageContent(resolveLocale(locale));
}

export async function getTypedHomePageContent(
  locale: Locale,
): Promise<HomePageContent> {
  return loadHomePageContent(locale);
}

export function getAvailableHomeLocales(): readonly Locale[] {
  return getSupportedLocales();
}
