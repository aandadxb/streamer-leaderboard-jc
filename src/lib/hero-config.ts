export const HERO_FALLBACKS = {
  bannerUrl: "/assets/banner.png",
  streamerImageUrl: "/assets/streamer.png",
  caption: "Streamer's Wager Race",
  mainText: "EXCLUSIVE PRIZES TO BE WON",
} as const;

export const HERO_MAX_IMAGE_SIZE_BYTES = 5 * 1024 * 1024;

export const HERO_IMAGE_REQUIREMENTS = {
  heroBanner: {
    label: "Hero banner",
    fieldName: "heroBanner",
    removeFieldName: "removeHeroBanner",
    width: 1520,
    height: 400,
    mimeTypes: ["image/png", "image/jpeg", "image/webp"],
    formatsLabel: "PNG, JPG, or WEBP",
  },
  heroStreamerImage: {
    label: "Hero streamer image",
    fieldName: "heroStreamerImage",
    removeFieldName: "removeHeroStreamerImage",
    width: 1566,
    height: 915,
    mimeTypes: ["image/png", "image/webp"],
    formatsLabel: "PNG or WEBP",
  },
} as const;

export type HeroImageKind = keyof typeof HERO_IMAGE_REQUIREMENTS;
