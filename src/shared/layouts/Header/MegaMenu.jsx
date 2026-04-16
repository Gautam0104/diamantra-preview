import { useState, useEffect, useMemo } from "react";
import { Link } from "react-router-dom";
import { generateShopAllUrl, getScopeKey, getScopeParams } from "./megaMenuData";

const STYLE_LIMIT = 4;

function LoadingSpinner() {
  return (
    <div className="flex items-center justify-center h-full">
      <div className="h-6 w-6 rounded-full border-2 border-maroon/30 border-t-maroon animate-spin" />
    </div>
  );
}

function CategoryCard({ jewelryType, buildHref }) {
  const [showAll, setShowAll] = useState(false);
  const styles = jewelryType.styles || [];
  const hiddenCount = styles.length - STYLE_LIMIT;
  const visible = showAll ? styles : styles.slice(0, STYLE_LIMIT);
  const hasMore = hiddenCount > 0;

  return (
    <div>
      <Link
        to={buildHref(jewelryType)}
        className="font-heading text-sm font-semibold text-maroon mb-2 block hover:underline"
      >
        {jewelryType.name}
      </Link>
      {styles.length === 0 ? (
        <Link to={buildHref(jewelryType)} className="block text-sm text-gray-400 py-0.5">
          View All
        </Link>
      ) : (
        <>
          <ul className="space-y-1">
            {visible.map((style) => (
              <li key={style.productStyleSlug}>
                <Link
                  to={buildHref(jewelryType, style)}
                  className="block text-sm text-gray-600 hover:text-maroon transition-colors py-0.5 capitalize"
                >
                  {style.name}
                </Link>
              </li>
            ))}
          </ul>
          {hasMore && (
            <button
              type="button"
              onClick={() => setShowAll((v) => !v)}
              className="mt-1 text-xs text-maroon hover:underline cursor-pointer"
            >
              {showAll ? "Show Less" : `Show More (+${hiddenCount})`}
            </button>
          )}
        </>
      )}
    </div>
  );
}

export default function MegaMenu({
  activeTab,
  activeCollection,
  setActiveCollection,
  navMenuData,
  onMouseEnter,
  onMouseLeave,
}) {
  const scopeKey = getScopeKey(activeTab);
  // scopeCollections: array of { name, collectionSlug, navDisplayOrder, jewelryTypes: [...] }
  const scopeCollections = useMemo(
    () => navMenuData?.[scopeKey] || null,
    [navMenuData, scopeKey]
  );

  // Only show collections that actually contain jewelry types in this scope.
  const availableCollections = useMemo(() => {
    if (!scopeCollections) return [];
    return scopeCollections.filter((c) => (c.jewelryTypes?.length ?? 0) > 0);
  }, [scopeCollections]);

  // Auto-correct activeCollection when it isn't present in the current scope.
  useEffect(() => {
    if (availableCollections.length === 0) return;
    const exists = availableCollections.some((c) => c.collectionSlug === activeCollection);
    if (!exists) setActiveCollection(availableCollections[0].collectionSlug);
  }, [availableCollections, activeCollection, setActiveCollection]);

  const activeCollectionData = useMemo(
    () => availableCollections.find((c) => c.collectionSlug === activeCollection) || null,
    [availableCollections, activeCollection]
  );
  const displayedJewelryTypes = activeCollectionData?.jewelryTypes || [];

  const buildHref = (jewelryType, style) => {
    const params = { jewelryTypeSlug: jewelryType.jewelryTypeSlug };
    if (style) params.productStyleSlug = style.productStyleSlug;
    Object.assign(params, getScopeParams(activeTab));
    if (activeCollection) params.collectionSlug = activeCollection;
    return generateShopAllUrl(params);
  };

  const isLoading = navMenuData === null;
  const isEmpty = !isLoading && availableCollections.length === 0;

  return (
    <div
      className="absolute left-1/2 -translate-x-1/2 top-full w-[85%] max-w-7xl bg-white shadow-2xl rounded-2xl overflow-hidden z-50 h-[80vh]"
      onMouseEnter={onMouseEnter}
      onMouseLeave={onMouseLeave}
    >
      <div className="flex max-w-screen-2xl mx-auto h-[100%]">
        {/* Left column: Collection list derived directly from API response */}
        <div className="w-60 shrink-0 border-r border-gray-100 py-6 bg-[#fcf6eb] flex flex-col gap-2 h-[100%]">
          {isLoading ? (
            <div className="px-6 py-3 text-xs text-gray-400">Loading…</div>
          ) : (
            availableCollections.map((collection) => (
              <div
                key={collection.collectionSlug}
                onMouseEnter={() => setActiveCollection(collection.collectionSlug)}
                className={`px-6 py-3 text-sm cursor-pointer transition-colors ${
                  activeCollection === collection.collectionSlug
                    ? "bg-maroon text-white font-medium"
                    : "text-charcoal hover:bg-maroon-surface"
                }`}
              >
                {collection.name}
              </div>
            ))
          )}
        </div>

        {/* Right column: Category grid */}
        <div className="flex-1 px-8 py-6 overflow-y-auto h-[100%]">
          {isLoading ? (
            <LoadingSpinner />
          ) : isEmpty ? (
            <div className="flex items-center justify-center h-full text-sm text-gray-400">
              No products available in this section
            </div>
          ) : displayedJewelryTypes.length > 0 ? (
            <div className="grid grid-cols-3 gap-x-12 gap-y-6">
              {displayedJewelryTypes.map((jewelryType) => (
                <CategoryCard
                  key={jewelryType.jewelryTypeSlug}
                  jewelryType={jewelryType}
                  buildHref={buildHref}
                />
              ))}
            </div>
          ) : (
            <div className="text-center text-gray-400 py-8">
              No products found for this collection
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
