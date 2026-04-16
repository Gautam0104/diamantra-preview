import { mockProducts } from "./productList";
import { calculateEffectivePrice } from "@/shared/utils/calculateEffectivePrice";

// Group variants that share a base product title (everything before the " – ").
const byBaseTitle = new Map();
mockProducts.forEach((v) => {
  const baseTitle = v.productVariantTitle.split(" – ")[0];
  if (!byBaseTitle.has(baseTitle)) byBaseTitle.set(baseTitle, []);
  byBaseTitle.get(baseTitle).push(v);
});

const HEX_BY_METAL_COLOR = {
  "yellow-gold": "#D4AF37",
  "white-gold": "#E5E4E2",
  "rose-gold": "#B76E79",
};

export function buildProductDetail(slug) {
  const variant = mockProducts.find((v) => v.productVariantSlug === slug);
  if (!variant) return null;

  const baseTitle = variant.productVariantTitle.split(" – ")[0];
  const siblings = byBaseTitle.get(baseTitle) || [variant];

  // Group siblings by metal type → each metal becomes one selectable variant
  // with a list of color options. The metal-circle selector in PDP reads
  // metalVariant.metalType.name (object, not string) to pick the swatch SVG,
  // and metalVariant.purityLabel for the centered text — match those exact keys.
  const metalDisplayName = (m) =>
    m === "gold" ? "Gold" : m === "silver" ? "Silver" : m === "platinum" ? "Platinum" : m;

  const byMetal = new Map();
  for (const s of siblings) {
    const key = s.metalType;
    if (!byMetal.has(key)) {
      byMetal.set(key, {
        metalVariant: {
          id: `mv-${s.metalType}`,
          name: metalDisplayName(s.metalType),
          metalType: { name: metalDisplayName(s.metalType), metalTypeSlug: s.metalType },
          metalTypeId: `mt-${s.metalType}`,
          purityLabel: s.purity,
          purity: s.purity,
          isVisible: true,
        },
        colors: [],
      });
    }
    const enriched = { ...s, pricing: calculateEffectivePrice(s) };
    byMetal.get(key).colors.push({
      color: s.metalColor?.slug || "default",
      name: s.metalColor?.name || s.metalType,
      hexCode: HEX_BY_METAL_COLOR[s.metalColor?.slug] || "#CCCCCC",
      isVisible: true,
      variant: enriched,
    });
  }

  const groupedVariants = Array.from(byMetal.values());

  return {
    id: variant.products.id,
    productSlug: variant.products.id,
    slug: variant.products.id,
    name: baseTitle,
    description: variant.products.description,
    metaTitle: `${baseTitle} | Diamantra`,
    groupedVariants,
    metalVariants: groupedVariants.map((g) => g.metalVariant),
    categories: [
      { id: "cat-1", name: variant.jewelryType.name, slug: variant.jewelryType.slug },
    ],
    reviewsSummary: { averageRating: 4.6, totalReviews: 128 },
    materialDetails: {
      metalType: variant.metalType,
      metalPurity: variant.purity,
      metalColor: variant.metalColor?.name,
      metalWeight: `${variant.metalWeightInGram}g`,
      grossWeight: `${variant.grossWeight}g`,
    },
    diamondDetails: {
      clarity: variant.gemstoneVariant?.clarity,
      color: variant.gemstoneVariant?.color,
      cut: "Excellent",
      certification: variant.gemstoneVariant?.certification,
      shape: "Round Brilliant",
    },
    priceBreakup: {
      metalPrice: variant.metalPrice,
      diamondPrice: variant.diamondPrice,
      makingCharge: variant.makingChargePrice,
      subtotal: variant.sellingPrice,
      gst: Math.round(variant.finalPrice - variant.sellingPrice),
      total: variant.finalPrice,
    },
  };
}

export function getRelatedProducts(currentSlug, category) {
  return mockProducts
    .filter(
      (p) =>
        p.productVariantSlug !== currentSlug && p.jewelryType?.slug === category
    )
    .slice(0, 8);
}
