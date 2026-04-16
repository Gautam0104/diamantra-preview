import { useState, useRef, useEffect, useCallback } from "react";
import { Link } from "react-router-dom";
import useSearch from "@/shared/hooks/useSearch";
import SearchSuggestionDropdown from "@/shared/components/SearchSuggestionDropdown";
import {
  Search,
  ShoppingCart,
  Heart,
  User,
  X,
  Mic,
  ChevronDown,
} from "lucide-react";
import { useCart } from "@/shared/context/CartContext";
import { useWishlist } from "@/shared/context/WishlistContext";
import Cart from "@features/cart/components/Cart";
import { getNavMenuData } from "@/features/product/api/productApi";
import { NAV_TABS } from "./megaMenuData";
import MegaMenu from "./MegaMenu";

const NavIcon = ({ tabId, className }) => (
  <img
    src={`/navbar-icon/${tabId}.svg`}
    alt=""
    className={className}
    aria-hidden="true"
    onError={(e) => { e.target.src = "/navbar-icon/all-jewellery.svg"; }}
  />
);

export default function Navbar() {
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [mobileSearchOpen, setMobileSearchOpen] = useState(false);
  const { cartCount } = useCart();
  const { wishlistCount } = useWishlist();
  const searchContainerRef = useRef(null);

  // Mega menu state
  const [activeTab, setActiveTab] = useState(null);
  const [megaMenuOpen, setMegaMenuOpen] = useState(false);
  const [activeCollection, setActiveCollection] = useState(null);
  const [moreDropdownOpen, setMoreDropdownOpen] = useState(false);
  const hoverTimeoutRef = useRef(null);
  const moreDropdownRef = useRef(null);

  // Nav menu data keyed by scope (all, gold, silver, enamel, diamantra-special, charms)
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

  // Fetch nav menu data (lazy — on first mega menu open)
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

  // Hover handlers for mega menu
  const handleTabMouseEnter = (tab) => {
    clearTimeout(hoverTimeoutRef.current);
    if (tab.hasMegaMenu) {
      setActiveTab(tab.id);
      setMegaMenuOpen(true);
      fetchNavMenu();
      // activeCollection is auto-corrected by MegaMenu's effect to the first
      // available collection in the new scope — no need to guess here.
    }
  };

  const handleTabMouseLeave = () => {
    hoverTimeoutRef.current = setTimeout(() => {
      setMegaMenuOpen(false);
      setActiveTab(null);
    }, 200);
  };

  const handleMegaMenuMouseEnter = () => {
    clearTimeout(hoverTimeoutRef.current);
  };

  const handleMegaMenuMouseLeave = () => {
    hoverTimeoutRef.current = setTimeout(() => {
      setMegaMenuOpen(false);
      setActiveTab(null);
    }, 150);
  };

  // Close mega menu on Escape key
  useEffect(() => {
    const handleEscape = (e) => {
      if (e.key === "Escape") {
        setMegaMenuOpen(false);
        setActiveTab(null);
        setMoreDropdownOpen(false);
      }
    };
    document.addEventListener("keydown", handleEscape);
    return () => document.removeEventListener("keydown", handleEscape);
  }, []);

  // Close suggestions on click outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (
        searchContainerRef.current &&
        !searchContainerRef.current.contains(event.target)
      ) {
        clearSearch();
      }
      if (
        moreDropdownRef.current &&
        !moreDropdownRef.current.contains(event.target)
      ) {
        setMoreDropdownOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [clearSearch]);

  return (
    <>
      <header className="flex flex-col w-full z-50">
        {/* Top navigation bar - maroon background */}
        <nav className="flex flex-col bg-maroon relative">
          <div className="flex items-center justify-center px-4 h-12">
            {/* Desktop nav tabs */}
            <ul className="hidden md:flex items-center justify-center gap-1 lg:gap-2 xl:gap-4">
              {NAV_TABS.map((tab) => {
                if (tab.isDropdown) {
                  return (
                    <li key={tab.id} className="relative" ref={moreDropdownRef}>
                      <button
                        onClick={() => setMoreDropdownOpen(!moreDropdownOpen)}
                        className={`flex items-center gap-1.5 px-2 lg:px-3 py-2 text-white/90 hover:text-gold text-[11px] lg:text-xs xl:text-sm font-medium transition-colors cursor-pointer`}
                      >
                        <NavIcon tabId={tab.id} className="w-4 h-4 shrink-0" />
                        <span>{tab.label}</span>
                        <ChevronDown size={12} className={`transition-transform ${moreDropdownOpen ? "rotate-180" : ""}`} />
                      </button>
                      {moreDropdownOpen && (
                        <div className="absolute right-0 top-full mt-1 w-48 bg-white rounded-md shadow-lg border border-gray-100 py-1 z-50">
                          {tab.dropdownItems.map((item) => (
                            <Link
                              key={item.href}
                              to={item.href}
                              onClick={() => setMoreDropdownOpen(false)}
                              className="block px-4 py-2 text-sm text-charcoal hover:bg-maroon-surface hover:text-maroon transition-colors"
                            >
                              {item.label}
                            </Link>
                          ))}
                        </div>
                      )}
                    </li>
                  );
                }

                if (tab.hasMegaMenu) {
                  return (
                    <li
                      key={tab.id}
                      onMouseEnter={() => handleTabMouseEnter(tab)}
                      onMouseLeave={handleTabMouseLeave}
                    >
                      <Link
                        to={tab.href}
                        className={`flex items-center gap-1.5 px-2 lg:px-3 py-2 text-[11px] lg:text-xs xl:text-sm font-medium transition-colors ${
                          activeTab === tab.id
                            ? "text-gold"
                            : "text-white/90 hover:text-gold"
                        }`}
                      >
                        <NavIcon tabId={tab.id} className="w-4 h-4 shrink-0" />
                        <span>{tab.label}</span>
                      </Link>
                    </li>
                  );
                }

                return (
                  <li key={tab.id}>
                    <Link
                      to={tab.href}
                      className="flex items-center gap-1.5 px-2 lg:px-3 py-2 text-white/90 hover:text-gold text-[11px] lg:text-xs xl:text-sm font-medium transition-colors"
                    >
                      <NavIcon tabId={tab.id} className="w-4 h-4 shrink-0" />
                      <span>{tab.label}</span>
                    </Link>
                  </li>
                );
              })}
            </ul>
          </div>

          {/* Mega Menu Dropdown */}
          {megaMenuOpen && activeTab && (
            <MegaMenu
              activeTab={activeTab}
              activeCollection={activeCollection}
              setActiveCollection={setActiveCollection}
              navMenuData={navMenuData}
              onMouseEnter={handleMegaMenuMouseEnter}
              onMouseLeave={handleMegaMenuMouseLeave}
            />
          )}
        </nav>

        {/* Bottom bar - white background with logo, search, icons */}
        <div className="flex items-center bg-white border-b border-gray-100">
          <div className="flex items-center justify-around w-full px-3 py-2 gap-3 md:px-6 md:gap-6">
            {/* Logo */}
            <Link to="/" className="flex items-center shrink-0">
              <img src="/logo.png" alt="DiaMantra" className="h-16 md:h-32 w-auto " />
            </Link>

            {/* Search bar */}
            <div className="hidden md:flex items-center flex-1 max-w-xl mx-6" ref={searchContainerRef}>
              <form onSubmit={handleSubmit} className="relative flex items-center w-full">
                <div className="flex items-center w-full border border-gray-300 rounded-full h-12 px-8 focus-within:border-maroon transition-colors">
                  <input
                    type="text"
                    placeholder={isListening ? "Listening..." : "Search"}
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    onKeyDown={handleKeyDown}
                    className="flex-1 ml-4 text-sm bg-transparent focus:outline-none"
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
                        aria-label={isListening ? "Stop voice search" : "Start voice search"}
                      >
                        <Mic size={18} />
                      </button>
                    )}
                    <div className="w-px h-5 bg-gray-300" />
                    <button
                      type="submit"
                      className="flex items-center justify-center w-8 h-8 text-gray-text hover:text-maroon transition-colors cursor-pointer"
                      aria-label="Search"
                    >
                      <Search size={18} />
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

            {/* Right icons */}
            <div className="flex items-center gap-2 md:gap-3">
              {/* Mobile search */}
              <button
                onClick={() => setMobileSearchOpen(true)}
                className="md:hidden flex items-center justify-center w-9 h-9 rounded-full border border-gray-200 hover:border-maroon hover:text-maroon transition-colors cursor-pointer"
                aria-label="Open search"
              >
                <Search size={16} className="text-charcoal" />
              </button>

              {/* Cart */}
              <button
                onClick={() => setIsCartOpen(true)}
                aria-label={`Shopping cart with ${cartCount} items`}
                className="relative flex items-center justify-center w-9 h-9 md:w-12 md:h-12 rounded-full border border-gray-200 hover:border-maroon hover:text-maroon transition-colors cursor-pointer"
              >
                <ShoppingCart size={18} className="text-charcoal" />
                {cartCount > 0 && (
                  <span className="absolute -top-1 -right-1 bg-maroon text-white text-[10px] font-semibold rounded-full w-5 h-5 flex items-center justify-center">
                    {cartCount}
                  </span>
                )}
              </button>

              {/* Wishlist */}
              <Link
                to="/wishlist"
                className="relative flex items-center justify-center w-9 h-9 md:w-12 md:h-12 rounded-full border border-gray-200 hover:border-maroon hover:text-maroon transition-colors cursor-pointer"
              >
                <Heart size={18} className="text-charcoal" />
                {wishlistCount > 0 && (
                  <span className="absolute -top-1 -right-1 bg-maroon text-white text-[10px] font-semibold rounded-full w-5 h-5 flex items-center justify-center">
                    {wishlistCount}
                  </span>
                )}
              </Link>

              {/* User */}
              <Link
                to="/user/profile"
                className="flex items-center justify-center w-9 h-9 md:w-12 md:h-12 rounded-full border border-gray-200 hover:border-maroon hover:text-maroon transition-colors cursor-pointer"
              >
                <User size={18} className="text-charcoal" />
              </Link>
            </div>
          </div>
        </div>
      </header>

      {/* Cart Drawer */}
      {isCartOpen && (
        <div className="fixed inset-0 bg-black/50 z-50">
          <div className="fixed top-0 right-0 h-full w-full md:w-md xl:w-xl bg-white shadow-xl z-50">
            <Cart onClose={() => setIsCartOpen(false)} />
          </div>
        </div>
      )}

      {/* Mobile Search Overlay */}
      {mobileSearchOpen && (
        <div className="fixed inset-0 z-50 md:hidden">
          <div
            className="absolute inset-0 bg-black/50"
            onClick={() => {
              setMobileSearchOpen(false);
              clearSearch();
            }}
          />
          <div className="relative bg-white px-4 py-4 shadow-lg">
            <form
              onSubmit={(e) => {
                handleSubmit(e);
                setMobileSearchOpen(false);
              }}
              className="relative pr-10"
            >
              <div className="flex items-center border border-gray-300 rounded-full h-12 px-4 focus-within:border-maroon transition-colors">
                <input
                  type="text"
                  placeholder={isListening ? "Listening..." : "Search jewellery..."}
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  onKeyDown={handleKeyDown}
                  autoFocus
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
                      aria-label={isListening ? "Stop voice search" : "Start voice search"}
                    >
                      <Mic size={18} />
                    </button>
                  )}
                  <div className="w-px h-5 bg-gray-300" />
                  <button
                    type="submit"
                    className="flex items-center justify-center w-8 h-8 text-gray-text hover:text-maroon transition-colors cursor-pointer"
                    aria-label="Search"
                  >
                    <Search size={18} />
                  </button>
                </div>
              </div>
              <SearchSuggestionDropdown
                suggestions={suggestions}
                highlightedIndex={highlightedIndex}
                onSelect={(suggestion) => {
                  handleSuggestionClick(suggestion);
                  setMobileSearchOpen(false);
                }}
              />
            </form>
            <button
              onClick={() => {
                setMobileSearchOpen(false);
                clearSearch();
              }}
              className="absolute top-5 right-4 text-gray-text hover:text-maroon cursor-pointer"
              aria-label="Close search"
            >
              <X size={20} />
            </button>
          </div>
        </div>
      )}
    </>
  );
}
