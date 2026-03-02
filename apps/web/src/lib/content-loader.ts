import { readFile } from "node:fs/promises";
import { join, resolve } from "node:path";
import type {
  HomePageContent,
  HomeSectionKey,
  SitePageContent,
  SitePageKey,
} from "./content-types";
import {
  sectionSchemaMap,
  homePageContentSchema,
  sitePageSchema,
} from "./content-schemas";
import type { Locale } from "./i18n";

const CONTENT_ROOT = resolve(process.cwd(), "..", "..", "content");

const sectionFileByKey: Record<HomeSectionKey, string> = {
  section01: "section-01-hero.json",
  section02: "section-02-clients.json",
  section03: "section-03-who-we-are.json",
  section04: "section-04-method.json",
  section05: "section-05-expertise.json",
  section06: "section-06-projects.json",
  section07: "section-07-testimonials.json",
  section08: "section-08-phantom-video.json",
  section09: "section-09-footer.json",
};

const sitePageFileByKey: Record<SitePageKey, string> = {
  projects: "projects.json",
  privacy: "privacy.json",
  legal: "legal.json",
  about: "about.json",
  contact: "contact.json",
};

async function readJsonFile(filePath: string): Promise<unknown> {
  const raw = await readFile(filePath, "utf-8");

  try {
    return JSON.parse(raw);
  } catch (error) {
    throw new Error(`Invalid JSON in ${filePath}`, { cause: error });
  }
}

async function loadSection<K extends HomeSectionKey>(
  locale: Locale,
  key: K,
): Promise<Awaited<ReturnType<(typeof sectionSchemaMap)[K]["parseAsync"]>>> {
  const filePath = join(CONTENT_ROOT, locale, "home", sectionFileByKey[key]);
  const payload = await readJsonFile(filePath);

  try {
    return (await sectionSchemaMap[key].parseAsync(payload)) as Awaited<
      ReturnType<(typeof sectionSchemaMap)[K]["parseAsync"]>
    >;
  } catch (error) {
    throw new Error(`Schema validation failed for ${filePath}`, {
      cause: error,
    });
  }
}

export async function loadHomePageContent(
  locale: Locale,
): Promise<HomePageContent> {
  const sections = {
    section01: await loadSection(locale, "section01"),
    section02: await loadSection(locale, "section02"),
    section03: await loadSection(locale, "section03"),
    section04: await loadSection(locale, "section04"),
    section05: await loadSection(locale, "section05"),
    section06: await loadSection(locale, "section06"),
    section07: await loadSection(locale, "section07"),
    section08: await loadSection(locale, "section08"),
    section09: await loadSection(locale, "section09"),
  };

  return homePageContentSchema.parse({
    seo: sections.section01.seo,
    sections,
  });
}

export async function loadSitePageContent(
  locale: Locale,
  key: SitePageKey,
): Promise<SitePageContent> {
  const filePath = join(CONTENT_ROOT, locale, "pages", sitePageFileByKey[key]);
  const payload = await readJsonFile(filePath);

  try {
    return await sitePageSchema.parseAsync(payload);
  } catch (error) {
    throw new Error(`Schema validation failed for ${filePath}`, {
      cause: error,
    });
  }
}

export function getContentRootPath(): string {
  return CONTENT_ROOT;
}
