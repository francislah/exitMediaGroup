import type { SitePageContent, SitePageKey } from "../lib/content-types";
import { loadSitePageContent } from "../lib/content-loader";
import { type Locale, resolveLocale } from "../lib/i18n";
import { sitePageKeys } from "../lib/content-schemas";

export async function getSitePageContent(
  locale: string,
  key: SitePageKey,
): Promise<SitePageContent> {
  return loadSitePageContent(resolveLocale(locale), key);
}

export async function getTypedSitePageContent(
  locale: Locale,
  key: SitePageKey,
): Promise<SitePageContent> {
  return loadSitePageContent(locale, key);
}

export function getSitePageKeys(): readonly SitePageKey[] {
  return sitePageKeys;
}
