import { useState, useMemo, useRef, useEffect, useCallback } from "react";
import { Link } from "react-router-dom";
import {
  ShoppingCart,
  Heart,
  User,
  Menu,
  X,
  Search,
  Mic,
  ChevronRight,
} from "lucide-react";
import { useCart } from "@/shared/context/CartContext";
import { useWishlist } from "@/shared/context/WishlistContext";
import useSearch from "@/shared/hooks/useSearch";
import SearchSuggestionDropdown from "@/shared/components/SearchSuggestionDropdown";
import Cart from "@features/cart/components/Cart";
import {
  NAV_TABS,
  generateShopAllUrl,
  getScopeKey,
  getScopeParams,
} from "./megaMenuData";
import { getNavMenuData } from "@/features/product/api/productApi";

const STYLE_LIMIT = 4;

function MobileCategoryCard({ jewelryType, buildHref, onNavigate }) {
  const [showAll, setShowAll] = useState(false);
  const styles = jewelryType.styles || [];
  const hiddenCount = styles.length - STYLE_LIMIT;
  const visible = showAll ? styles : styles.slice(0, STYLE_LIMIT);
  const hasMore = hiddenCount > 0;

  return (
    <div className="mb-3">
      <Link
        to={buildHref(jewelryType)}
        onClick={onNavigate}
        className="text-maroon text-xs font-semibold uppercase tracking-wide"
      >
        {jewelryType.name}
      </Link>
      {styles.length > 0 && (
        <ul className="mt-1 space-y-1">
          {visible.map((style) => (
            <li key={style.productStyleSlug}>
              <Link
                to={buildHref(jewelryType, style)}
                onClick={onNavigate}
                className="block text-charcoal/70 text-xs hover:text-maroon transition-colors py-0.5 capitalize"
              >
                {style.name}
              </Link>
            </li>
          ))}
        </ul>
      )}
      {hasMore && (
        <button
          type="button"
          onClick={() => setShowAll((v) => !v)}
          className="mt-1 text-[11px] text-maroon hover:underline cursor-pointer"
        >
          {showAll ? "Show Less" : `Show More (+${hiddenCount})`}
        </button>
      )}
    </div>
  );
}

const NavIcon = ({ tabId, className }) => (
  <img
    src={`/navbar-icon/${tabId}.svg`}
    alt=""
    className={className}
    aria-hidden="true"
    onError={(e) => {
      e.target.src = "/navbar-icon/all-jewellery.svg";
    }}
  />
);

export default function NavbarMobile() {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [mobileExpandedCategory, setMobileExpandedCategory] = useState(null);
  const [mobileActiveCollection, setMobileActiveCollection] = useState(null);
  const searchContainerRef = useRef(null);

  const { cartCount } = useCart();
  const { wishlistCount } = useWishlist();

  // Nav menu data (grouped by gender)
  const [navMenuData, setNavMenuData] = useState(null);
  const navMenuFetchedRef = useRef(false);

  const {
    searchQuery,
    setSearchQuery,
    suggestions,
    highlightedIndex,
    isListening,
    isVoiceSupported,
    startListening,
    stopListening,
    handleSubmit,
    handleSuggestionClick,
    handleKeyDown,
    clearSearch,
  } = useSearch();

  // Fetch nav menu data (lazy — on first accordion open)
  const fetchNavMenu = useCallback(async () => {
    if (navMenuFetchedRef.current) return;
    navMenuFetchedRef.current = true;
    try {
      const response = await getNavMenuData();
      setNavMenuData(response?.data?.data || null);
    } catch (err) {
      console.error("Error fetching nav menu data:", err);
      navMenuFetchedRef.current = false;
    }
  }, []);

  // Scope key derived from the currently expanded tab
  const expandedScopeKey = mobileExpandedCategory
    ? getScopeKey(mobileExpandedCategory)
    : null;
  const expandedScopeCollections = useMemo(
    () => (expandedScopeKey ? navMenuData?.[expandedScopeKey] || null : null),
    [navMenuData, expandedScopeKey]
  );

  // Collections that actually have jewelry types in the current scope.
  const availableCollections = useMemo(() => {
    if (!expandedScopeCollections) return [];
    return expandedScopeCollections.filter((c) => (c.jewelryTypes?.length ?? 0) > 0);
  }, [expandedScopeCollections]);

  // Auto-correct mobileActiveCollection when the available set doesn't include it
  useEffect(() => {
    if (!expandedScopeKey || availableCollections.length === 0) return;
    const exists = availableCollections.some(
      (c) => c.collectionSlug === mobileActiveCollection
    );
    if (!exists) setMobileActiveCollection(availableCollections[0].collectionSlug);
  }, [availableCollections, mobileActiveCollection, expandedScopeKey]);

  const mobileActiveCollectionData = useMemo(
    () =>
      availableCollections.find((c) => c.collectionSlug === mobileActiveCollection) || null,
    [availableCollections, mobileActiveCollection]
  );
  const mobileFilteredTypes = mobileActiveCollectionData?.jewelryTypes || [];
  const isMobileLoading = mobileExpandedCategory && navMenuData === null;

  // Build a URL with scope + collection + jewelryType/style params
  const buildMobileHref = (jewelryType, style) => {
    const params = { jewelryTypeSlug: jewelryType.jewelryTypeSlug };
    if (style) params.productStyleSlug = style.productStyleSlug;
    Object.assign(params, getScopeParams(mobileExpandedCategory));
    if (mobileActiveCollection) params.collectionSlug = mobileActiveCollection;
    return generateShopAllUrl(params);
  };

  // Close search suggestions on click outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (
        searchContainerRef.current &&
        !searchContainerRef.current.contains(event.target)
      ) {
        clearSearch();
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [clearSearch]);

  // Lock body scroll when drawer or cart is open
  useEffect(() => {
    if (mobileOpen || isCartOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [mobileOpen, isCartOpen]);

  return (
    <>
      {/* ── Header bar ── */}
      <header className="sticky top-0 z-50 bg-white border-b border-gray-100">
        <div className="flex items-center justify-between px-4 py-2">
          {/* Logo */}
          <Link to="/" className="flex items-center shrink-0">
            <img src="/logo.png" alt="DiaMantra" className="h-12 w-auto" />
          </Link>

          {/* Right icons */}
          <div className="flex items-center gap-2">
            {/* Cart */}
            <button
              onClick={() => setIsCartOpen(true)}
              aria-label={`Shopping cart with ${cartCount} items`}
              className="relative flex items-center justify-center w-9 h-9 rounded-full border border-gray-200 transition-colors cursor-pointer"
            >
              <ShoppingCart size={16} className="text-charcoal" />
              {cartCount > 0 && (
                <span className="absolute -top-1 -right-1 bg-maroon text-white text-[10px] font-semibold rounded-full w-5 h-5 flex items-center justify-center">
                  {cartCount}
                </span>
              )}
            </button>

            {/* Wishlist */}
            <Link
              to="/wishlist"
              className="relative flex items-center justify-center w-9 h-9 rounded-full border border-gray-200 transition-colors"
            >
              <Heart size={16} className="text-charcoal" />
              {wishlistCount > 0 && (
                <span className="absolute -top-1 -right-1 bg-maroon text-white text-[10px] font-semibold rounded-full w-5 h-5 flex items-center justify-center">
                  {wishlistCount}
                </span>
              )}
            </Link>

            {/* User */}
            <Link
              to="/user/profile"
              className="flex items-center justify-center w-9 h-9 rounded-full border border-gray-200 transition-colors"
            >
              <User size={16} className="text-charcoal" />
            </Link>

            {/* Menu */}
            <button
              onClick={() => setMobileOpen(true)}
              className="flex items-center justify-center w-9 h-9 rounded-full border border-gray-200 transition-colors cursor-pointer"
              aria-label="Open menu"
            >
              <Menu size={16} className="text-charcoal" />
            </button>
          </div>
        </div>

        {/* Search bar */}
        <div className="px-4 pb-3" ref={searchContainerRef}>
          <form onSubmit={handleSubmit} className="relative">
            <div className="flex items-center border border-gray-200 rounded-full h-10 px-4 focus-within:border-maroon transition-colors">
              <input
                type="text"
                placeholder={isListening ? "Listening..." : "Search"}
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                onKeyDown={handleKeyDown}
                className="flex-1 text-sm bg-transparent focus:outline-none"
              />
              <div className="flex items-center gap-2 shrink-0">
                {isVoiceSupported && (
                  <button
                    type="button"
                    onClick={isListening ? stopListening : startListening}
                    className={`flex items-center justify-center w-8 h-8 transition-colors cursor-pointer ${
                      isListening
                        ? "text-red-500 animate-pulse"
                        : "text-gray-text hover:text-maroon"
                    }`}
                    aria-label={
                      isListening ? "Stop voice search" : "Start voice search"
                    }
                  >
                    <Mic size={16} />
                  </button>
                )}
                <div className="w-px h-4 bg-gray-300" />
                <button
                  type="submit"
                  className="flex items-center justify-center w-8 h-8 text-gray-text hover:text-maroon transition-colors cursor-pointer"
                  aria-label="Search"
                >
                  <Search size={16} />
                </button>
              </div>
            </div>
            <SearchSuggestionDropdown
              suggestions={suggestions}
              highlightedIndex={highlightedIndex}
              onSelect={handleSuggestionClick}
            />
          </form>
        </div>
      </header>

      {/* ── Navigation Drawer ── */}
      {mobileOpen && (
        <div className="fixed inset-0 z-50">
          {/* Backdrop */}
          <div
            className="absolute inset-0 bg-black/50"
            onClick={() => setMobileOpen(false)}
          />

          {/* Drawer panel */}
          <div className="absolute top-0 right-0 h-full w-[80%] max-w-sm bg-white shadow-xl flex flex-col">
            {/* Drawer header */}
            <div className="flex items-center justify-between px-4 py-3 border-b border-gray-100">
              <span className="text-sm font-semibold text-charcoal">Menu</span>
              <button
                onClick={() => setMobileOpen(false)}
                className="flex items-center justify-center w-8 h-8 rounded-full hover:bg-gray-100 transition-colors cursor-pointer"
                aria-label="Close menu"
              >
                <X size={18} className="text-charcoal" />
              </button>
            </div>

            {/* Navigation links */}
            <nav className="flex-1 overflow-y-auto">
              <ul className="flex flex-col px-4 py-2">
                {NAV_TABS.map((tab) => {
                  if (tab.hasMegaMenu) {
                    return (
                      <li key={tab.id}>
                        <button
                          onClick={() => {
                            setMobileExpandedCategory(
                              mobileExpandedCategory === tab.id ? null : tab.id
                            );
                            fetchNavMenu();
                          }}
                          className="flex items-center justify-between w-full py-3 text-charcoal hover:text-maroon text-sm font-medium transition-colors cursor-pointer"
                        >
                          <span className="flex items-center gap-2">
                            <NavIcon tabId={tab.id} className="w-5 h-5" />
                            {tab.label}
                          </span>
                          <ChevronRight
                            size={14}
                            className={`transition-transform ${
                              mobileExpandedCategory === tab.id
                                ? "rotate-90"
                                : ""
                            }`}
                          />
                        </button>

                        {mobileExpandedCategory === tab.id && (
                          <div className="pl-7 pb-2">
                            {isMobileLoading ? (
                              <p className="text-xs text-gray-400 py-2">Loading…</p>
                            ) : (
                              <>
                                {/* Collection pills — pulled directly from API response */}
                                <div className="flex gap-2 mb-3 overflow-x-auto">
                                  {availableCollections.map((col) => (
                                    <button
                                      key={col.collectionSlug}
                                      onClick={() => setMobileActiveCollection(col.collectionSlug)}
                                      className={`px-3 py-1 text-xs rounded-full whitespace-nowrap transition-colors ${
                                        mobileActiveCollection === col.collectionSlug
                                          ? "bg-maroon text-white font-medium"
                                          : "bg-gray-100 text-charcoal"
                                      }`}
                                    >
                                      {col.name}
                                    </button>
                                  ))}
                                </div>

                                {/* Filtered jewelry types */}
                                {mobileFilteredTypes.map((jewelryType) => (
                                  <MobileCategoryCard
                                    key={jewelryType.jewelryTypeSlug}
                                    jewelryType={jewelryType}
                                    buildHref={buildMobileHref}
                                    onNavigate={() => setMobileOpen(false)}
                                  />
                                ))}

                                {mobileFilteredTypes.length === 0 && (
                                  <p className="text-xs text-gray-400 py-2">No products found</p>
                                )}
                              </>
                            )}
                          </div>
                        )}
                      </li>
                    );
                  }

                  if (tab.isDropdown) {
                    return (
                      <li key={tab.id}>
                        <button
                          onClick={() =>
                            setMobileExpandedCategory(
                              mobileExpandedCategory === tab.id ? null : tab.id
                            )
                          }
                          className="flex items-center justify-between w-full py-3 text-charcoal hover:text-maroon text-sm font-medium transition-colors cursor-pointer"
                        >
                          <span className="flex items-center gap-2">
                            <NavIcon tabId={tab.id} className="w-5 h-5" />
                            {tab.label}
                          </span>
                          <ChevronRight
                            size={14}
                            className={`transition-transform ${
                              mobileExpandedCategory === tab.id
                                ? "rotate-90"
                                : ""
                            }`}
                          />
                        </button>
                        {mobileExpandedCategory === tab.id && (
                          <ul className="pl-7 pb-2">
                            {tab.dropdownItems.map((item) => (
                              <li key={item.href}>
                                <Link
                                  to={item.href}
                                  onClick={() => setMobileOpen(false)}
                                  className="block text-charcoal/70 text-xs hover:text-maroon transition-colors py-1.5"
                                >
                                  {item.label}
                                </Link>
                              </li>
                            ))}
                          </ul>
                        )}
                      </li>
                    );
                  }

                  return (
                    <li key={tab.id}>
                      <Link
                        to={tab.href}
                        onClick={() => setMobileOpen(false)}
                        className="flex items-center gap-2 py-3 text-charcoal hover:text-maroon text-sm font-medium transition-colors"
                      >
                        <NavIcon tabId={tab.id} className="w-5 h-5" />
                        <span>{tab.label}</span>
                      </Link>
                    </li>
                  );
                })}
              </ul>
            </nav>
          </div>
        </div>
      )}

      {/* ── Cart Drawer ── */}
      {isCartOpen && (
        <div className="fixed inset-0 bg-black/50 z-50">
          <div className="fixed top-0 right-0 h-full w-full bg-white shadow-xl z-50">
            <Cart onClose={() => setIsCartOpen(false)} />
          </div>
        </div>
      )}

    </>
  );
}
