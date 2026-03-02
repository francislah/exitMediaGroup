import { loadHomePageContent, loadSitePageContent } from "../src/lib/content-loader";
import { getSupportedLocales } from "../src/lib/i18n";
import { getSitePageKeys } from "../src/content/site-pages";

async function main() {
  const locales = getSupportedLocales();

  for (const locale of locales) {
    const content = await loadHomePageContent(locale);
    const sectionCount = Object.keys(content.sections).length;
    console.log(`[content] ${locale}: ${sectionCount} sections validated`);

    const pageKeys = getSitePageKeys();
    for (const key of pageKeys) {
      await loadSitePageContent(locale, key);
    }
    console.log(`[content] ${locale}: ${pageKeys.length} pages validated`);
  }

  console.log("[content] validation complete");
}

main().catch((error) => {
  console.error("[content] validation failed");
  console.error(error);
  process.exit(1);
});
