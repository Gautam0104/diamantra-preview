import { calculateEffectivePrice } from "@/shared/utils/calculateEffectivePrice";

// Curated jewellery photos from public/home/. Each type has a pool we cycle
// through by index so every variant card shows real, on-brand imagery instead
// of random Picsum placeholders.
const IMAGE_POOL = {
  rings: [
    "/home/Ring-1.webp", "/home/Ring-2.webp", "/home/Rings.png", "/home/Rings1.png",
    "/home/Rings2.png", "/home/Engagement-Rings.png", "/home/Wedding-Rings.png",
    "/home/Eternity-Rings.png", "/home/Promise-Rings-1.png", "/home/Classic-Band.png",
    "/home/Diamond-Rings.png",
  ],
  earrings: [
    "/home/earrings.png", "/home/earrings1.png", "/home/earrings1.webp",
    "/home/earrings2.png", "/home/earrings2.webp",
  ],
  necklaces: [
    "/home/necklace.webp", "/home/necklaces.png", "/home/necklaces1.png", "/home/necklaces2.png",
  ],
  bracelets: [
    "/home/Bracelet-1.webp", "/home/Bracelet-2.webp", "/home/Bracelets.png",
    "/home/Bracelets1.png", "/home/Bracelets2.png", "/home/Diamond-Bracelet.png",
  ],
  pendants: [
    "/home/Fashion-Jewelry.png", "/home/Carat1.webp", "/home/Carat2.webp",
    "/home/Carat3.webp", "/home/Carat4.webp", "/home/Carat5.webp",
  ],
};

const pickImg = (typeSlug, idx) => {
  const pool = IMAGE_POOL[typeSlug] || IMAGE_POOL.rings;
  return pool[idx % pool.length];
};

const JEWELRY_TYPES = [
  { slug: "rings", name: "Rings" },
  { slug: "earrings", name: "Earrings" },
  { slug: "necklaces", name: "Necklaces" },
  { slug: "bracelets", name: "Bracelets" },
  { slug: "pendants", name: "Pendants" },
];

const METAL_TYPES = ["gold", "silver"];
// Each metal has its own appropriate color palette so the PDP color selector
// shows realistic options when a metal is picked (e.g. picking "Silver" must
// not surface a "Rose Gold" color swatch).
const COLORS_BY_METAL = {
  gold: [
    { slug: "yellow-gold", name: "Yellow Gold" },
    { slug: "white-gold", name: "White Gold" },
    { slug: "rose-gold", name: "Rose Gold" },
  ],
  silver: [{ slug: "silver", name: "Silver" }],
};
const PURITY_BY_METAL = { gold: ["14K", "18K", "22K"], silver: ["925"] };

const METAL_COLORS = Array.from(
  new Map(
    Object.values(COLORS_BY_METAL)
      .flat()
      .map((c) => [c.slug, c])
  ).values()
);

const ACTIVE_DISCOUNT = {
  id: "gd-1",
  isActive: true,
  discountType: "PERCENTAGE",
  discountValue: 15,
  discountTarget: "TOTAL",
  discountLabel: "15% OFF",
  title: "Festive Sale",
  validFrom: "2026-01-01T00:00:00Z",
  validTo: "2026-12-31T23:59:59Z",
  isQuantityBased: false,
};

const titlesByType = {
  rings: [
    "Solitaire Muse Ring",
    "Twilight Stacker",
    "Eternal Bloom Band",
    "Halo Crescent Ring",
    "Classic Trilogy Ring",
  ],
  earrings: [
    "Aurora Drop Earrings",
    "Pave Huggies",
    "Cluster Studs",
    "Chandelier Danglers",
    "Minimal Orbit Studs",
  ],
  necklaces: [
    "Lumière Pendant Chain",
    "Starlight Collar",
    "Cascade Line Necklace",
    "Solitaire Slider",
    "Everyday Diamond Rope",
  ],
  bracelets: [
    "Tennis Line Bracelet",
    "Infinity Link Cuff",
    "Petal Charm Chain",
    "Classic Bangle",
    "Diamond Tennis Cuff",
  ],
  pendants: [
    "Heart Halo Pendant",
    "Solitaire Drop Pendant",
    "Four-Leaf Charm",
    "Luminous Teardrop",
    "Starburst Pendant",
  ],
};

const products = [];

JEWELRY_TYPES.forEach((type, typeIdx) => {
  const titles = titlesByType[type.slug];
  titles.forEach((title, i) => {
    METAL_TYPES.forEach((metal, mi) => {
      const colorOptions = COLORS_BY_METAL[metal];
      colorOptions.forEach((color, ci) => {
        if (products.length >= 60) return;
        const id = `var-${type.slug}-${i}-${metal}-${color.slug}`;
        const basePrice = 18000 + typeIdx * 6000 + i * 4000 + mi * 3000 + ci * 1500;
        const finalPrice = basePrice + Math.round(Math.random() * 2000);
        const purity = PURITY_BY_METAL[metal][(i + mi + ci) % PURITY_BY_METAL[metal].length];
        const hasPrevPrice = (i + mi + ci) % 3 === 0;
        const hasDiscount = (i + mi + ci) % 4 === 0;
        const baseImgIdx = i * METAL_TYPES.length + mi + ci;

        const variant = {
          id,
          sku: `SKU-${type.slug.toUpperCase()}-${i}-${metal}-${ci}`,
          productVariantTitle: `${title} – ${color.name}`,
          productVariantSlug: `${type.slug}-${i}-${metal}-${color.slug}`,
          productVariantImage: [
            { imageUrl: pickImg(type.slug, baseImgIdx) },
            { imageUrl: pickImg(type.slug, baseImgIdx + 1) },
            { imageUrl: pickImg(type.slug, baseImgIdx + 2) },
          ],
          products: { id: `prod-${type.slug}-${i}`, name: title, description: `A handcrafted ${title.toLowerCase()} in ${metal}.` },
          gemstoneVariant: {
            clarity: ["VS1", "VS2", "VVS1", "SI1"][(i + mi + ci) % 4],
            color: ["D", "E", "F", "G"][(i + mi + ci) % 4],
            certification: "IGI",
            certificateUrl: "#",
            countryOfOrigin: "India",
            gemstoneVariantSlug: "round",
          },
          finalPrice,
          previousPrice: hasPrevPrice ? Math.round(finalPrice * 1.22) : null,
          sellingPrice: Math.round(finalPrice / 1.03),
          metalPrice: Math.round(finalPrice * 0.45),
          diamondPrice: Math.round(finalPrice * 0.35),
          makingChargePrice: Math.round(finalPrice * 0.15),
          gst: 3,
          metalWeightInGram: 3 + (i % 8),
          grossWeight: 3.5 + (i % 8),
          stock: 5 + (i % 10),
          isFreeSize: type.slug !== "rings",
          isEnamel: false,
          unitType: "PIECE",
          isNewArrival: i % 4 === 0,
          isFeatured: i % 3 === 0,
          jewelryType: { slug: type.slug, name: type.name, jewelryTypeSlug: type.slug },
          metalType: metal,
          metalColor: color,
          purity,
          Wishlist: [],
          GlobalDiscount: hasDiscount ? ACTIVE_DISCOUNT : null,
          productSize: type.slug === "rings"
            ? [
                { id: `${id}-s1`, size: "6", circumference: "51.8", stock: 5 },
                { id: `${id}-s2`, size: "7", circumference: "54.4", stock: 3 },
                { id: `${id}-s3`, size: "8", circumference: "57.0", stock: 2 },
              ]
            : [],
          ScrewOption: [],
        };

        const pricing = calculateEffectivePrice(variant);
        products.push({ ...variant, pricing });
      });
    });
  });
});

export const mockProducts = products;

const PRICE_RANGE_MAP = {
  "below-5000": [0, 5000],
  "5000-15000": [5000, 15000],
  "15000-25000": [15000, 25000],
  "25000-35000": [25000, 35000],
  "35000-50000": [35000, 50000],
  "50000-70000": [50000, 70000],
  "70000-90000": [70000, 90000],
  "90000-110000": [90000, 110000],
  "110000-140000": [110000, 140000],
  "140000-175000": [140000, 175000],
  "175000-200000": [175000, 200000],
  "above-200000": [200000, Infinity],
};
const WEIGHT_RANGE_MAP = {
  "0-2": [0, 2], "2-4": [2, 4], "4-6": [4, 6], "6-8": [6, 8], "8-10": [8, 10],
  "10-12": [10, 12], "12-14": [12, 14], "14-16": [14, 16], "16-18": [16, 18],
  "18-20": [18, 20], "above-20": [20, Infinity],
};

const asArray = (v) => (v == null ? [] : Array.isArray(v) ? v : String(v).split(","));

export function filterProducts(filters = {}) {
  const {
    search, limit = 12, skip = 0, sortBy, sortOrder = "desc",
    metalVariantSlug, gemstoneVariantSlug, metalColorSlug, metalType, purity, gender,
    jewelryTypeSlug, priceRange, weightRange, isNewArrival, isFeatured, isEnamel,
  } = filters;

  let list = [...mockProducts];

  const typeSlugs = asArray(jewelryTypeSlug).filter(Boolean);
  if (typeSlugs.length) list = list.filter((p) => typeSlugs.includes(p.jewelryType?.slug));

  const metalSlugs = asArray(metalType).filter(Boolean);
  if (metalSlugs.length) list = list.filter((p) => metalSlugs.includes(p.metalType));

  const colorSlugs = asArray(metalColorSlug).filter(Boolean);
  if (colorSlugs.length) list = list.filter((p) => colorSlugs.includes(p.metalColor?.slug));

  const puritySlugs = asArray(purity).filter(Boolean);
  if (puritySlugs.length) list = list.filter((p) => puritySlugs.includes(p.purity));

  const gemSlugs = asArray(gemstoneVariantSlug).filter(Boolean);
  if (gemSlugs.length) list = list.filter((p) => gemSlugs.includes(p.gemstoneVariant?.gemstoneVariantSlug));

  if (priceRange && PRICE_RANGE_MAP[priceRange]) {
    const [min, max] = PRICE_RANGE_MAP[priceRange];
    list = list.filter((p) => p.finalPrice >= min && p.finalPrice <= max);
  }
  if (weightRange && WEIGHT_RANGE_MAP[weightRange]) {
    const [min, max] = WEIGHT_RANGE_MAP[weightRange];
    list = list.filter((p) => (p.metalWeightInGram ?? 0) >= min && (p.metalWeightInGram ?? 0) <= max);
  }
  if (isNewArrival !== undefined) list = list.filter((p) => !!p.isNewArrival === (isNewArrival === true || isNewArrival === "true"));
  if (isFeatured !== undefined) list = list.filter((p) => !!p.isFeatured === (isFeatured === true || isFeatured === "true"));
  if (isEnamel === "true") list = list.filter((p) => p.isEnamel);

  if (search) {
    const s = search.toLowerCase();
    list = list.filter((p) => p.productVariantTitle.toLowerCase().includes(s));
  }

  if (sortBy === "finalPrice") {
    list.sort((a, b) => (sortOrder === "asc" ? a.finalPrice - b.finalPrice : b.finalPrice - a.finalPrice));
  } else if (sortBy === "createdAt") {
    list.sort((a, b) => sortOrder === "asc" ? 0 : 0);
  }

  const totalCount = list.length;
  const start = Number(skip) || 0;
  const end = start + (Number(limit) || 12);
  const paged = list.slice(start, end);

  return {
    productVariant: paged,
    pagination: {
      totalCount,
      loadedCount: end < totalCount ? end : totalCount,
      hasMore: end < totalCount,
    },
  };
}

export const sideFilterFacets = {
  metalTypes: [
    { slug: "gold", name: "Gold", count: mockProducts.filter((p) => p.metalType === "gold").length },
    { slug: "silver", name: "Silver", count: mockProducts.filter((p) => p.metalType === "silver").length },
  ],
  jewelleryType: JEWELRY_TYPES.map((t) => ({
    jewelryTypeSlug: t.slug,
    name: t.name,
    products: mockProducts.filter((p) => p.jewelryType?.slug === t.slug),
  })),
  shape: [
    { slug: "round", name: "Round", count: 12, variants: [{ slug: "round" }] },
    { slug: "oval", name: "Oval", count: 6, variants: [{ slug: "oval" }] },
    { slug: "emerald", name: "Emerald", count: 4, variants: [{ slug: "emerald" }] },
  ],
  purityOptions: [
    { label: "14K", count: mockProducts.filter((p) => p.purity === "14K").length },
    { label: "18K", count: mockProducts.filter((p) => p.purity === "18K").length },
    { label: "22K", count: mockProducts.filter((p) => p.purity === "22K").length },
    { label: "925", count: mockProducts.filter((p) => p.purity === "925").length },
  ],
  occasion: [
    { occasionSlug: "wedding", name: "Wedding" },
    { occasionSlug: "festive", name: "Festive" },
    { occasionSlug: "everyday", name: "Everyday" },
  ],
  collection: [
    { collectionSlug: "signature", name: "Signature", _count: 12 },
    { collectionSlug: "bridal", name: "Bridal", _count: 8 },
  ],
  color: METAL_COLORS.map((c) => ({
    metalColorSlug: c.slug,
    name: c.name,
    _count: mockProducts.filter((p) => p.metalColor?.slug === c.slug).length,
  })),
  style: [
    { productStyleSlug: "classic", name: "Classic" },
    { productStyleSlug: "modern", name: "Modern" },
    { productStyleSlug: "vintage", name: "Vintage" },
  ],
  caratWeightRanges: [
    { slug: "0.1-0.5", count: 4 },
    { slug: "0.5-1.0", count: 6 },
    { slug: "1.0-2.0", count: 3 },
    { slug: "2.0-plus", count: 2 },
  ],
  dailyWear: [
    { slug: "office", name: "Office", count: 8 },
    { slug: "party", name: "Party", count: 6 },
  ],
};
