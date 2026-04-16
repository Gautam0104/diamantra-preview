// Top-bar navigation tabs. `scopeParams` is merged into category links so clicks
// land on a pre-filtered /shop-all page. Tab ids match the scope keys the backend
// emits from /public/nav-menu-data.
export const NAV_TABS = [
  {
    id: "all-jewellery",
    label: "All Jewellery",
    icon: "Gem",
    hasMegaMenu: true,
    href: "/shop-all",
    scopeParams: {},
  },
  {
    id: "gold",
    label: "Gold Lab Diamond",
    icon: "Crown",
    hasMegaMenu: true,
    href: "/shop-all?metalTypeSlug=gold",
    scopeParams: { metalTypeSlug: "gold" },
  },
  {
    id: "silver",
    label: "Silver Lab Diamond",
    icon: "Diamond",
    hasMegaMenu: true,
    href: "/shop-all?metalTypeSlug=silver",
    scopeParams: { metalTypeSlug: "silver" },
  },
  {
    id: "enamel",
    label: "Enamel",
    icon: "Palette",
    hasMegaMenu: true,
    href: "/shop-all?collectionSlug=enamel",
    scopeParams: { scopeCollectionSlug: "enamel" },
  },
  {
    id: "diamantra-special",
    label: "Diamantra Special",
    icon: "Sparkles",
    hasMegaMenu: true,
    href: "/shop-all",
    // Diamantra Special is driven by Collection.isSpecialCollection. The bucket
    // collection slug clicked in the mega menu is the filter on its own; no scope
    // param is needed since each special collection is fully self-identifying.
    scopeParams: {},
  },
  {
    id: "charms",
    label: "Charms",
    icon: "Heart",
    hasMegaMenu: true,
    href: "/shop-all?collectionSlug=charms",
    scopeParams: { scopeCollectionSlug: "charms" },
  },
  {
    id: "education",
    label: "Education",
    icon: "GraduationCap",
    hasMegaMenu: false,
    href: "/blogs",
  },
  {
    id: "lab-diamond",
    label: "Lab Diamond",
    icon: "FlaskConical",
    hasMegaMenu: false,
    href: "/lab-grown-vs-natural-diamonds",
  },
  {
    id: "more",
    label: "More",
    icon: "MoreHorizontal",
    hasMegaMenu: false,
    href: "#",
    isDropdown: true,
    dropdownItems: [
      { label: "About Us", href: "/about-us" },
      { label: "Contact", href: "/contact-us" },
      { label: "FAQs", href: "/faqs" },
      { label: "Size Guide", href: "/ring-size-guide" },
      { label: "Design Your Own", href: "/design-your-own" },
    ],
  },
];

// Map a NAV_TABS tab id to the backend scope key.
export const getScopeKey = (tabId) => (tabId === "all-jewellery" ? "all" : tabId);

// Resolve the scope URL params (metal/collection filter) for a tab id.
export const getScopeParams = (tabId) =>
  NAV_TABS.find((t) => t.id === tabId)?.scopeParams || {};

// Build a /shop-all URL from a params object, skipping empty values.
export function generateShopAllUrl(params) {
  const baseUrl = "/shop-all";
  const queryParams = new URLSearchParams();

  Object.entries(params).forEach(([key, value]) => {
    if (Array.isArray(value)) {
      if (value.length > 0) queryParams.set(key, value.join(","));
    } else if (value !== null && value !== undefined && value !== "") {
      queryParams.set(key, value.toString());
    }
  });

  return queryParams.toString() ? `${baseUrl}?${queryParams.toString()}` : baseUrl;
}
