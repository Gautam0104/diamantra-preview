import { Link } from "react-router-dom";

const generateShopAllUrl = (params) => {
  const baseUrl = "/shop-all";
  const queryParams = new URLSearchParams();
  Object.entries(params).forEach(([key, value]) => {
    if (Array.isArray(value)) {
      if (value.length > 0) queryParams.set(key, value.join(","));
    } else if (value !== undefined && value !== null && value !== "") {
      queryParams.set(key, value.toString());
    }
  });
  return queryParams.toString() ? `${baseUrl}?${queryParams.toString()}` : baseUrl;
};

const POPULAR_SEARCH_DATA = [
  {
    heading: "Popular Searches",
    keywords: [
      { name: "Rings", href: generateShopAllUrl({ jewelryTypeSlug: "rings" }) },
      { name: "Earrings", href: generateShopAllUrl({ jewelryTypeSlug: "earrings" }) },
      { name: "Bracelet", href: generateShopAllUrl({ jewelryTypeSlug: "bracelets" }) },
      { name: "Pendant Mangalsutra", href: generateShopAllUrl({ jewelryTypeSlug: "mangalsutra" }) },
      { name: "Necklace", href: generateShopAllUrl({ jewelryTypeSlug: "necklaces" }) },
      { name: "Anklet", href: generateShopAllUrl({ jewelryTypeSlug: "anklet-sets" }) },
      { name: "Cufflinks", href: generateShopAllUrl({ productStyleSlug: "cufflinks" }) },
    ],
  },
  {
    heading: "Top Searches in Gold With Lab Diamond Jewellery",
    keywords: [
      { name: "Ring", href: generateShopAllUrl({ jewelryTypeSlug: "rings", metalTypeSlug: "gold" }) },
      { name: "Earrings", href: generateShopAllUrl({ jewelryTypeSlug: "earrings", metalTypeSlug: "gold" }) },
      { name: "Bracelet", href: generateShopAllUrl({ jewelryTypeSlug: "bracelets", metalTypeSlug: "gold" }) },
      { name: "Pendant", href: generateShopAllUrl({ productStyleSlug: "pendant", metalTypeSlug: "gold" }) },
      { name: "Mangalsutra", href: generateShopAllUrl({ jewelryTypeSlug: "mangalsutra", metalTypeSlug: "gold" }) },
      { name: "Couple Band", href: generateShopAllUrl({ productStyleSlug: "couple-bands", metalTypeSlug: "gold" }) },
    ],
  },
  {
    heading: "Top Searches in Silver With Lab Diamond Jewellery",
    keywords: [
      { name: "Anklet", href: generateShopAllUrl({ jewelryTypeSlug: "anklet-sets", metalTypeSlug: "silver" }) },
      { name: "Cufflinks", href: generateShopAllUrl({ productStyleSlug: "cufflinks", metalTypeSlug: "silver" }) },
      { name: "Tie Pin", href: generateShopAllUrl({ productStyleSlug: "tie-pin", metalTypeSlug: "silver" }) },
      { name: "Charms", href: generateShopAllUrl({ productStyleSlug: "charms", metalTypeSlug: "silver" }) },
      { name: "Brooch", href: generateShopAllUrl({ productStyleSlug: "brooch", metalTypeSlug: "silver" }) },
      { name: "Label Pin", href: generateShopAllUrl({ productStyleSlug: "label-pin", metalTypeSlug: "silver" }) },
    ],
  },
  {
    heading: "TOP Searches In Womens Jewellery",
    keywords: [
      { name: "Rings", href: generateShopAllUrl({ jewelryTypeSlug: "rings", gender: "WOMEN" }) },
      { name: "Earrings", href: generateShopAllUrl({ jewelryTypeSlug: "earrings", gender: "WOMEN" }) },
      { name: "Mangalsutra", href: generateShopAllUrl({ jewelryTypeSlug: "mangalsutra", gender: "WOMEN" }) },
      { name: "Pendant", href: generateShopAllUrl({ productStyleSlug: "pendant", gender: "WOMEN" }) },
      { name: "Pendant sets", href: generateShopAllUrl({ productStyleSlug: "pendant-sets", gender: "WOMEN" }) },
      { name: "Necklace", href: generateShopAllUrl({ jewelryTypeSlug: "necklaces", gender: "WOMEN" }) },
      { name: "Nose Pins", href: generateShopAllUrl({ jewelryTypeSlug: "nosewear", gender: "WOMEN" }) },
      { name: "Bracelets", href: generateShopAllUrl({ jewelryTypeSlug: "bracelets", gender: "WOMEN" }) },
      { name: "Anklet", href: generateShopAllUrl({ jewelryTypeSlug: "anklet-sets", gender: "WOMEN" }) },
      { name: "Brooch", href: generateShopAllUrl({ productStyleSlug: "brooch", gender: "WOMEN" }) },
    ],
  },
  {
    heading: "Top Searches In Mens Jewellery",
    keywords: [
      { name: "Rings", href: generateShopAllUrl({ jewelryTypeSlug: "rings", gender: "MEN" }) },
      { name: "Bracelet", href: generateShopAllUrl({ jewelryTypeSlug: "bracelets", gender: "MEN" }) },
      { name: "Pendant", href: generateShopAllUrl({ productStyleSlug: "pendant", gender: "MEN" }) },
      { name: "Studs", href: generateShopAllUrl({ productStyleSlug: "studs--tops", gender: "MEN" }) },
      { name: "Tie Pin", href: generateShopAllUrl({ productStyleSlug: "tie-pin", gender: "MEN" }) },
      { name: "Cufflinks", href: generateShopAllUrl({ productStyleSlug: "cufflinks", gender: "MEN" }) },
      { name: "Label Pins", href: generateShopAllUrl({ productStyleSlug: "label-pin", gender: "MEN" }) },
    ],
  },
  {
    heading: "Top Searches in Pink Lab Diamond Jewellery",
    keywords: [
      { name: "Rings", href: generateShopAllUrl({ jewelryTypeSlug: "rings", gemstoneVariantSlug: "pink" }) },
      { name: "Pendant", href: generateShopAllUrl({ productStyleSlug: "pendant", gemstoneVariantSlug: "pink" }) },
      { name: "Bracelet", href: generateShopAllUrl({ jewelryTypeSlug: "bracelets", gemstoneVariantSlug: "pink" }) },
      { name: "Earrings", href: generateShopAllUrl({ jewelryTypeSlug: "earrings", gemstoneVariantSlug: "pink" }) },
    ],
  },
];

export default function PopularSearches() {
  return (
    <section className="bg-white border-t border-gray-200" aria-label="Popular Searches">
      <div className="max-w-7xl mx-auto px-6 py-6 md:py-8">
        {POPULAR_SEARCH_DATA.map((category, index) => (
          <div
            key={category.heading}
            className={`py-3 fon ${
              index < POPULAR_SEARCH_DATA.length - 1 ? "border-b border-gray-100" : ""
            }`}
          >
            <p className="text-md text-gray-800">
              <span className="font-heading">{category.heading}</span>
              <br />
              {category.keywords.map((keyword, i) => (
                <span key={keyword.name + i}>
                  <Link
                    to={keyword.href}
                    className="text-gray-500 hover:text-[#C68B73] hover:underline transition-colors"
                  >
                    {keyword.name}
                  </Link>
                  {i < category.keywords.length - 1 && ", "}
                </span>
              ))}
            </p>
          </div>
        ))}
      </div>
    </section>
  );
}
