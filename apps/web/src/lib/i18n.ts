const SUPPORTED_LOCALES = ["fr", "en"] as const;

export type Locale = (typeof SUPPORTED_LOCALES)[number];

export const DEFAULT_LOCALE: Locale = "fr";

export function getSupportedLocales(): readonly Locale[] {
  return SUPPORTED_LOCALES;
}

export function isLocale(value: string): value is Locale {
  return SUPPORTED_LOCALES.includes(value as Locale);
}

export function resolveLocale(value?: string): Locale {
  if (!value) {
    return DEFAULT_LOCALE;
  }

  return isLocale(value) ? value : DEFAULT_LOCALE;
}

export function localePrefix(locale: Locale): string {
  return locale === DEFAULT_LOCALE ? "" : `/${locale}`;
}

export function toLocalePath(locale: Locale, pathname = "/"): string {
  const safePath = pathname.startsWith("/") ? pathname : `/${pathname}`;
  return `${localePrefix(locale)}${safePath === "/" ? "" : safePath}` || "/";
}

function normalizePathname(pathname: string): string {
  if (!pathname) {
    return "/";
  }

  return pathname.startsWith("/") ? pathname : `/${pathname}`;
}

function splitPathAndSuffix(pathname: string): {
  path: string;
  suffix: string;
} {
  const normalized = normalizePathname(pathname);
  const hashIndex = normalized.indexOf("#");
  const queryIndex = normalized.indexOf("?");
  const firstSuffixIndex =
    queryIndex === -1
      ? hashIndex
      : hashIndex === -1
        ? queryIndex
        : Math.min(queryIndex, hashIndex);

  if (firstSuffixIndex === -1) {
    return { path: normalized, suffix: "" };
  }

  return {
    path: normalized.slice(0, firstSuffixIndex),
    suffix: normalized.slice(firstSuffixIndex),
  };
}

export function parseLocalePath(pathname: string): {
  locale: Locale;
  unlocalizedPath: string;
} {
  const { path } = splitPathAndSuffix(pathname);
  const segments = path.split("/").filter(Boolean);
  const firstSegment = segments[0];

  if (
    firstSegment &&
    isLocale(firstSegment) &&
    firstSegment !== DEFAULT_LOCALE
  ) {
    const remaining = segments.slice(1).join("/");
    return {
      locale: firstSegment,
      unlocalizedPath: remaining ? `/${remaining}` : "/",
    };
  }

  return {
    locale: DEFAULT_LOCALE,
    unlocalizedPath: path || "/",
  };
}

export function switchLocalePath(
  pathname: string,
  targetLocale: Locale,
): string {
  const { suffix, path } = splitPathAndSuffix(pathname);
  const { unlocalizedPath } = parseLocalePath(path);
  return `${toLocalePath(targetLocale, unlocalizedPath)}${suffix}`;
}

export function getAlternateLocale(locale: Locale): Locale {
  return locale === "fr" ? "en" : "fr";
}
