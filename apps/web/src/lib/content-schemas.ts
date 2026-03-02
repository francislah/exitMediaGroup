import { z } from "zod";

const sectionKeys = [
  "section01",
  "section02",
  "section03",
  "section04",
  "section05",
  "section06",
  "section07",
  "section08",
  "section09",
] as const;

export type HomeSectionKey = (typeof sectionKeys)[number];
export const sitePageKeys = [
  "projects",
  "privacy",
  "legal",
  "about",
  "contact",
] as const;
export type SitePageKey = (typeof sitePageKeys)[number];

const sectionKeySchema = z.enum(sectionKeys);
const sitePageKeySchema = z.enum(sitePageKeys);

const videoSchema = z.object({
  src: z.string().min(1),
  poster: z.string().min(1),
});

const navLinkSchema = z.object({
  label: z.string().min(1),
  href: z.string().min(1),
});

const sectionBaseSchema = z.object({
  key: sectionKeySchema,
  anchorId: z.string().min(1),
  kicker: z.string().min(1),
  heading: z.string().min(1),
  summary: z.string().min(1),
});

const section01Schema = sectionBaseSchema.extend({
  key: z.literal("section01"),
  seo: z.object({
    title: z.string().min(1),
    description: z.string().min(1),
  }),
  heroTitlePrimary: z.string().min(1),
  heroTitleSecondary: z.string().min(1),
  introLine: z.string().min(1),
  scrollCueLabel: z.string().min(1),
  revealWords: z.array(z.string().min(1)).min(1),
  topNav: z.object({
    links: z.array(navLinkSchema).min(1),
    ctaLabel: z.string().min(1),
    ctaHref: z.string().min(1),
  }),
  smokeVideo: videoSchema,
  showreelVideo: videoSchema,
  dominos: z
    .array(
      z.object({
        id: z.string().min(1),
        role: z.enum(["left", "center", "right"]),
      }),
    )
    .length(3),
});

const section02Schema = sectionBaseSchema.extend({
  key: z.literal("section02"),
  marquee: z.object({
    baseSpeed: z.number().positive(),
    scrollBoostMultiplier: z.number().min(1),
  }),
  logos: z
    .array(
      z.object({
        name: z.string().min(1),
        imageSrc: z.string().min(1),
        imageAlt: z.string().min(1),
        href: z.url(),
      }),
    )
    .min(2),
});

const section03Schema = sectionBaseSchema.extend({
  key: z.literal("section03"),
  body: z.string().min(1),
  ctaLabel: z.string().min(1),
  ctaHref: z.string().min(1),
  video: videoSchema.extend({
    autoplay: z.boolean(),
    muted: z.boolean(),
    loop: z.boolean(),
    playLabel: z.string().min(1),
  }),
});

const section04Schema = sectionBaseSchema.extend({
  key: z.literal("section04"),
  statementWords: z.array(z.string().min(1)).length(3),
  promise: z.string().min(1),
});

const section05Schema = sectionBaseSchema.extend({
  key: z.literal("section05"),
  panels: z
    .array(
      z.object({
        id: z.string().min(1),
        label: z.string().min(1),
        title: z.string().min(1),
        description: z.string().min(1),
      }),
    )
    .min(3),
});

const section06Schema = sectionBaseSchema.extend({
  key: z.literal("section06"),
  orbitTitle: z.string().min(1),
  allProjectsLabel: z.string().min(1),
  backLabel: z.string().min(1),
  detailsLabel: z.string().min(1),
  projects: z
    .array(
      z.object({
        id: z.string().min(1),
        name: z.string().min(1),
        tagline: z.string().min(1),
        services: z.array(z.string().min(1)).min(1),
        videoSrc: z.string().min(1),
        projectUrl: z.url(),
      }),
    )
    .min(6),
});

const section07Schema = sectionBaseSchema.extend({
  key: z.literal("section07"),
  testimonials: z
    .array(
      z.object({
        quote: z.string().min(1),
        author: z.string().min(1),
        role: z.string().min(1),
        company: z.string().min(1),
      }),
    )
    .min(2),
});

const section08Schema = sectionBaseSchema.extend({
  key: z.literal("section08"),
  video: z.object({
    src: z.string().min(1),
    poster: z.string().min(1),
    width: z.number().int().min(1920),
    height: z.number().int().min(1080),
    format: z.literal("mp4"),
    codec: z.literal("h264"),
  }),
});

const formLabelsSchema = z.object({
  nameLabel: z.string().min(1),
  emailLabel: z.string().min(1),
  messageLabel: z.string().min(1),
  submitLabel: z.string().min(1),
});

const section09Schema = sectionBaseSchema.extend({
  key: z.literal("section09"),
  marqueeText: z.string().min(1),
  ctaLabel: z.string().min(1),
  ctaHref: z.string().min(1),
  email: z.email(),
  formLabels: formLabelsSchema,
  navLinks: z.array(navLinkSchema).optional().default([]),
  copyright: z.string().optional().default(""),
  socialLinks: z
    .array(
      z.object({
        label: z.string().min(1),
        href: z.url(),
      }),
    )
    .min(1),
});

export const sectionSchemaMap = {
  section01: section01Schema,
  section02: section02Schema,
  section03: section03Schema,
  section04: section04Schema,
  section05: section05Schema,
  section06: section06Schema,
  section07: section07Schema,
  section08: section08Schema,
  section09: section09Schema,
} as const;

export const homePageContentSchema = z.object({
  seo: z.object({
    title: z.string().min(1),
    description: z.string().min(1),
  }),
  sections: z.object({
    section01: section01Schema,
    section02: section02Schema,
    section03: section03Schema,
    section04: section04Schema,
    section05: section05Schema,
    section06: section06Schema,
    section07: section07Schema,
    section08: section08Schema,
    section09: section09Schema,
  }),
});

const sitePageNavigationSchema = z.object({
  homeLabel: z.string().min(1),
  projectsLabel: z.string().min(1),
  aboutLabel: z.string().min(1),
  contactLabel: z.string().min(1),
});

const sitePageSectionSchema = z.object({
  heading: z.string().min(1),
  body: z.string().min(1),
});

export const sitePageSchema = z.object({
  key: sitePageKeySchema,
  slug: z.string().min(1),
  seo: z.object({
    title: z.string().min(1),
    description: z.string().min(1),
  }),
  kicker: z.string().min(1),
  title: z.string().min(1),
  intro: z.string().min(1),
  navigation: sitePageNavigationSchema,
  sections: z.array(sitePageSectionSchema).min(1),
  contactPanel: z
    .object({
      heading: z.string().min(1),
      intro: z.string().min(1),
    })
    .optional(),
});

export type HomeSectionCommon = z.infer<typeof sectionBaseSchema>;
export type HomeSections = z.infer<typeof homePageContentSchema>["sections"];
export type HomeSectionContent = HomeSections[HomeSectionKey];
export type HomeSectionByKey<K extends HomeSectionKey> = HomeSections[K];
export type HomePageContent = z.infer<typeof homePageContentSchema>;
export type SitePageContent = z.infer<typeof sitePageSchema>;
