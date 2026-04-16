import { mockProducts } from "./productList";

// Empty banners → HeroBanner renders the Figma-matching fallback that uses
// /home/banner/women-image.png + bg-graphic-left/right.svg, which is the
// canonical hero design. Populating this array would switch the component to
// the slider mode, which expects full-bleed campaign imagery we don't have.
export const banners = [];

// Use the cutout PNGs the source design intended — clean transparent product
// silhouettes that blend with the grey tile background.
export const jewelleryType = [
  { id: "jt1", name: "Rings", slug: "rings", imageUrl: "/home/Rings.png", jewelryTypeSlug: "rings" },
  { id: "jt2", name: "Earrings", slug: "earrings", imageUrl: "/home/Fashion-Jewelry.png", jewelryTypeSlug: "earrings" },
  { id: "jt3", name: "Necklaces", slug: "necklaces", imageUrl: "/home/Everyday-Wear.png", jewelryTypeSlug: "necklaces" },
  { id: "jt4", name: "Bracelets", slug: "bracelets", imageUrl: "/home/Bracelets.png", jewelryTypeSlug: "bracelets" },
  { id: "jt5", name: "Pendants", slug: "pendants", imageUrl: "/home/Mens-Jewelry.png", jewelryTypeSlug: "pendants" },
];

const pickTrending = mockProducts.slice(0, 8);
const pickNewArrivals = mockProducts.slice(8, 16).map((p) => ({ ...p, isNewArrival: true }));

// Sections fall through to their built-in defaults for imagery; we only set
// videoUrl so the play-button overlay renders on video-section / video-cards.
// /Animae_logo.webm is the only video asset in public/, reused as a stand-in.
const PREVIEW_VIDEO = "/video.mp4";

export const homePageSections = [
  {
    sectionKey: "video-section",
    content: { videoUrl: PREVIEW_VIDEO },
  },
  {
    sectionKey: "video-cards",
    content: {
      cards: [
        { title: "For Women Video Section", subtitle: "Exclusive styling & collection", poster: "/home/video-cards/img-1.png", videoUrl: PREVIEW_VIDEO },
        { title: "For Women Video Section", subtitle: "Latest trends & picks", poster: "/home/video-cards/img-2.png", videoUrl: PREVIEW_VIDEO },
      ],
    },
  },
];

export const indexPageData = {
  banner: banners,
  jewelleryType,
  trendingProduct: pickTrending,
  newArrivals: pickNewArrivals,
  homePageSections,
};

export const announcementBanners = [
  { id: "a1", text: "Free Shipping on orders above ₹5,000", link: "/shop-all" },
  { id: "a2", text: "Certified Diamonds. Lifetime Exchange.", link: "/shop-all" },
];

export const headerImage = {
  logo: "/logo.png",
  tagline: "Diamonds reimagined",
};
