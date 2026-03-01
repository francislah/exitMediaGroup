import { loadHomePageContent } from "../src/lib/content-loader";
import { getSupportedLocales } from "../src/lib/i18n";

async function main() {
  const locales = getSupportedLocales();

  for (const locale of locales) {
    const content = await loadHomePageContent(locale);
    const sectionCount = Object.keys(content.sections).length;
    console.log(`[content] ${locale}: ${sectionCount} sections validated`);
  }

  console.log("[content] validation complete");
}

main().catch((error) => {
  console.error("[content] validation failed");
  console.error(error);
  process.exit(1);
});
