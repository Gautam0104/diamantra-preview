import { filterProducts, sideFilterFacets, mockProducts } from "@/mock/productList";
import { buildProductDetail, getRelatedProducts } from "@/mock/productDetail";
import { mockCoupons } from "@/mock/coupons";

const delay = (ms = 150) => new Promise((r) => setTimeout(r, ms));
const ok = (data) => ({ data: { data, success: true } });

export const getPublicProductVariant = async (filters = {}) => {
  await delay();
  return ok(filterProducts(filters));
};

export const fetchProductName = async () =>
  ok({
    productVariant: mockProducts.map((p) => ({
      id: p.id,
      productVariantTitle: p.productVariantTitle,
      productVariantSlug: p.productVariantSlug,
    })),
  });

export const fetchNewArrivalProductVariant = async (params = {}) => {
  await delay();
  const res = filterProducts({ ...params, isNewArrival: true });
  return ok(res);
};

export const fetchProductBySlug = async (slug) => {
  await delay();
  const detail = buildProductDetail(slug);
  if (!detail) return ok(null);
  return ok(detail);
};

export const getSideFilterData = async () => {
  await delay();
  return ok(sideFilterFacets);
};

export const getProductDetails = async (productVariantId) => {
  await delay();
  const variant = mockProducts.find((v) => v.id === productVariantId);
  if (!variant) return ok(null);
  return ok({
    productVariant: variant,
    finalPrice: variant.finalPrice,
  });
};

export const getProductComparison = async () => ok([]);

export const fetchProductStylesByJewelryType = async () =>
  ok([
    { productStyleSlug: "classic", name: "Classic" },
    { productStyleSlug: "modern", name: "Modern" },
  ]);

export const getNavMaterials = async () => ok([]);

const JT = (name, slug, styles = []) => ({
  name,
  jewelryTypeSlug: slug,
  styles: styles.map((s) => ({
    name: s.replace(/-/g, " "),
    productStyleSlug: s,
  })),
});

const NAV_JEWELRY_TYPES = [
  JT("Rings", "rings", ["solitaire", "engagement", "band", "cocktail", "stackable"]),
  JT("Earrings", "earrings", ["studs", "drops", "hoops", "chandelier"]),
  JT("Necklaces", "necklaces", ["solitaire-pendant", "chain", "choker", "layered"]),
  JT("Bracelets", "bracelets", ["tennis", "bangle", "cuff", "chain"]),
  JT("Pendants", "pendants", ["solitaire-pendant", "cluster", "initial"]),
];

const scopeCollections = (extra = []) => [
  { name: "Women's Collection", collectionSlug: "womens-collection", navDisplayOrder: 1, jewelryTypes: NAV_JEWELRY_TYPES },
  { name: "Men's Collection", collectionSlug: "mens-collection", navDisplayOrder: 2, jewelryTypes: NAV_JEWELRY_TYPES.slice(0, 4) },
  ...extra,
];

export const getNavMenuData = async () => {
  await delay();
  return ok({
    all: scopeCollections(),
    gold: scopeCollections(),
    silver: scopeCollections(),
    enamel: [
      { name: "Enamel", collectionSlug: "enamel", navDisplayOrder: 1, jewelryTypes: NAV_JEWELRY_TYPES.slice(0, 3) },
    ],
    "diamantra-special": [
      { name: "Festive Edit", collectionSlug: "festive-edit", navDisplayOrder: 1, jewelryTypes: NAV_JEWELRY_TYPES.slice(0, 3) },
      { name: "Lumière", collectionSlug: "lumiere", navDisplayOrder: 2, jewelryTypes: NAV_JEWELRY_TYPES.slice(0, 2) },
    ],
    charms: [
      { name: "Charms", collectionSlug: "charms", navDisplayOrder: 1, jewelryTypes: [NAV_JEWELRY_TYPES[4]] },
    ],
  });
};

export const addProductReview = async () => ok({ success: true });

export const fetchReviewsByVariant = async (variantId, params = {}) => {
  const limit = Number(params.limit) || 5;
  const reviews = [
    {
      id: "r1",
      rating: 5,
      reviewTitle: "Absolutely stunning",
      reviewBody: "The finish is flawless and it arrived perfectly packaged. Will be a keepsake.",
      customer: { firstName: "Aisha", lastName: "Khan", designation: "", companyName: "" },
      createdAt: "2026-02-14T10:00:00Z",
      images: [],
    },
    {
      id: "r2",
      rating: 4,
      reviewTitle: "Beautiful piece, small delay",
      reviewBody: "Love the design, shipping took a day longer than expected.",
      customer: { firstName: "Priya", lastName: "Mehta", designation: "", companyName: "" },
      createdAt: "2026-02-02T10:00:00Z",
      images: [],
    },
    {
      id: "r3",
      rating: 5,
      reviewTitle: "Exceeds the pictures",
      reviewBody: "Got it certified by a local jeweller — quality matches the claim.",
      customer: { firstName: "Rohit", lastName: "Sharma", designation: "", companyName: "" },
      createdAt: "2026-01-18T10:00:00Z",
      images: [],
    },
  ];
  return ok({
    reviews: reviews.slice(0, limit),
    pagination: { totalCount: reviews.length, hasMore: limit < reviews.length },
    averageRating: 4.6,
    totalReviews: reviews.length,
  });
};

export const getCouponsForVariant = async () => {
  await delay();
  return ok(mockCoupons);
};

export const getRelatedForSlug = async (slug, category) => ok(getRelatedProducts(slug, category));
