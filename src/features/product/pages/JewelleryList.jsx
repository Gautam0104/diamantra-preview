import React, { useCallback, useContext, useMemo, useRef, useState, useEffect } from "react";
import { SlidersHorizontal, X, MapPin, ChevronDown, Loader2, Check } from "lucide-react";
import { usePincodeValidation } from "@/shared/hooks/usePincodeValidation";
import NewsletterCTA from "@shared/components/common/newsletter/NewsletterCTA";
import HeroBanner from "../components/HeroBanner";
import FilterSidebar from "../components/FilterSidebar";
import ListProductCard from "../components/ListProductCard";
import PromoBanner from "../components/PromoBanner";
import {
  getPublicProductVariant,
  getSideFilterData,
} from "@/features/product/api/productApi";
import useFiltration from "@/shared/hooks/useFilteration";
import { CurrencyContext } from "@/shared/context/CurrencyContext";
import { useWishlist } from "@/shared/context/WishlistContext";
import { Skeleton } from "@/shared/components/ui/skeleton";
import { gsap } from "gsap";
import Button from "@/features/home/ui/Button";

const PROMO_AFTER = 9;

export default function JewelleryList() {
  const { convertPrice, currency, getCurrencySymbol } = useContext(CurrencyContext);
  const {
    addToWishlist,
    removeFromWishlist,
    isInWishlist,
    wishlistItems,
    isProductLoading,
  } = useWishlist();

  const {
    clearFilters,
    filters,
    handleFilterChangeHook,
    handleFilterMultipleChangeHook,
    debouncedSearch,
  } = useFiltration();

  const [allProducts, setAllProducts] = useState([]);
  const [pagination, setPagination] = useState(0);
  const [loading, setLoading] = useState(false);
  const [sideFilterData, setSideFilterData] = useState({});
  const [hasMore, setHasMore] = useState(true);
  const skipRef = useRef(0);
  const [isLoadingMore, setIsLoadingMore] = useState(false);
  const [showMobileFilters, setShowMobileFilters] = useState(false);
  const [sort, setSort] = useState("Newest");
  const [showSortDropdown, setShowSortDropdown] = useState(false);
  const sortDropdownRef = useRef(null);
  const [pincode, setPincode] = useState("");
  const [showPincodePopover, setShowPincodePopover] = useState(false);
  const [isServiceable, setIsServiceable] = useState(false);
  const [serviceabilityError, setServiceabilityError] = useState("");
  const pincodePopoverRef = useRef(null);

  const { validatePincode, isCheckingPincode } = usePincodeValidation();

  const limit = parseInt(filters.limit) || 12;
  const wishlistRefs = useRef({});

  // Lock body scroll when mobile filter drawer is open
  useEffect(() => {
    if (showMobileFilters) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => { document.body.style.overflow = ""; };
  }, [showMobileFilters]);

  // Sort config
  const validSortFields = {
    Popular: { sortBy: "createdAt", sortOrder: "desc" },
    Newest: { sortBy: "createdAt", sortOrder: "desc" },
    "Price: Low to High": { sortBy: "finalPrice", sortOrder: "asc" },
    "Price: High to Low": { sortBy: "finalPrice", sortOrder: "desc" },
  };

  const handleSortChange = (value) => {
    setSort(value);
    const sortConfig = validSortFields[value];
    if (sortConfig) {
      handleFilterChangeHook({ target: { name: "sortBy", value: sortConfig.sortBy } });
      handleFilterChangeHook({ target: { name: "sortOrder", value: sortConfig.sortOrder } });
    }
  };

  // Pincode check handler
  const handlePincodeCheck = async () => {
    if (pincode.length !== 6) return;
    setServiceabilityError("");
    setIsServiceable(false);
    try {
      const result = await validatePincode(pincode);
      if (result === true) {
        setIsServiceable(true);
      } else {
        setServiceabilityError(`Delivery not available to ${pincode}`);
      }
    } catch {
      setServiceabilityError("Failed to check. Please try again.");
    }
  };

  // Close pincode popover on outside click
  useEffect(() => {
    if (!showPincodePopover) return;
    const handleClickOutside = (e) => {
      if (pincodePopoverRef.current && !pincodePopoverRef.current.contains(e.target)) {
        setShowPincodePopover(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [showPincodePopover]);

  // Close sort dropdown on outside click
  useEffect(() => {
    if (!showSortDropdown) return;
    const handleClickOutside = (e) => {
      if (sortDropdownRef.current && !sortDropdownRef.current.contains(e.target)) {
        setShowSortDropdown(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [showSortDropdown]);

  // Fetch products
  const fetchProductData = useCallback(
    async (loadMore = false) => {
      try {
        if (!loadMore) {
          skipRef.current = 0;
          setLoading(true);
        } else {
          setIsLoadingMore(true);
        }
        const skipToUse = loadMore ? skipRef.current : 0;

        const response = await getPublicProductVariant({
          ...filters,
          search: debouncedSearch,
          limit: limit,
          skip: skipToUse,
        });

        const newProducts = response?.data?.data?.productVariant || [];
        const paginationData = response?.data?.data?.pagination;

        if (loadMore) {
          setAllProducts((prev) => [...prev, ...newProducts]);
        } else {
          setAllProducts(newProducts);
        }

        setHasMore(paginationData?.hasMore || false);
        setPagination(paginationData?.totalCount || 0);

        if (paginationData?.loadedCount) {
          skipRef.current = paginationData.loadedCount;
        } else {
          skipRef.current = skipRef.current + newProducts.length;
        }

        if (!loadMore) {
          const res = await getSideFilterData(filters.jewelryTypeSlug);
          setSideFilterData(res.data.data);
        }
      } catch (err) {
        console.log("Error fetching products:", err);
        setHasMore(false);
      } finally {
        setLoading(false);
        setIsLoadingMore(false);
      }
    },
    [filters, debouncedSearch, limit]
  );

  const handleLoadMore = () => {
    if (isLoadingMore || !hasMore) return;
    fetchProductData(true);
  };

  // Serialize all filter-relevant keys into one stable string so the fetch
  // effect fires exactly once per logical filter change, regardless of URL
  // sync ordering.
  const filterKey = useMemo(
    () =>
      JSON.stringify({
        search: debouncedSearch,
        sortBy: filters.sortBy,
        sortOrder: filters.sortOrder,
        jewelryTypeSlug: filters.jewelryTypeSlug,
        metalVariantSlug: filters.metalVariantSlug,
        gemstoneVariantSlug: filters.gemstoneVariantSlug,
        metalColorSlug: filters.metalColorSlug,
        metalType: filters.metalType,
        purity: filters.purity,
        gender: filters.gender,
        occasionSlug: filters.occasionSlug,
        productStyleSlug: filters.productStyleSlug,
        collectionSlug: filters.collectionSlug,
        caratWeight: filters.caratWeight,
        dailyWear: filters.dailyWear,
        priceRange: filters.priceRange,
        weightRange: filters.weightRange,
        giftRange: filters.giftRange,
        isEnamel: filters.isEnamel,
      }),
    [
      debouncedSearch,
      filters.sortBy, filters.sortOrder,
      filters.jewelryTypeSlug, filters.metalVariantSlug, filters.gemstoneVariantSlug,
      filters.metalColorSlug, filters.metalType, filters.purity, filters.gender,
      filters.occasionSlug, filters.productStyleSlug, filters.collectionSlug,
      filters.caratWeight, filters.dailyWear,
      filters.priceRange, filters.weightRange, filters.giftRange, filters.isEnamel,
    ]
  );

  useEffect(() => {
    const timer = setTimeout(() => {
      fetchProductData();
    }, 100);
    return () => clearTimeout(timer);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [filterKey]);

  useEffect(() => {
    if (filters.limit) {
      skipRef.current = 0;
      setAllProducts([]);
      const timer = setTimeout(() => fetchProductData(false), 100);
      return () => clearTimeout(timer);
    }
  }, [filters.limit]);

  // Helper: sum carat range counts from sideFilterData
  const getCaratCount = useCallback(
    (slugs) => {
      return (sideFilterData.caratWeightRanges || [])
        .filter((r) => slugs.includes(r.slug))
        .reduce((sum, r) => sum + (r.count || 0), 0);
    },
    [sideFilterData]
  );

  // Build filter display data from API response
  const filterDisplayData = useMemo(() => {
    return [
      {
        title: "metalType",
        displayTitle: "Metal",
        options:
          sideFilterData.metalTypes?.map((mt) => ({
            slug: mt.slug,
            label: mt.name,
            count: mt.count,
          })) || [],
      },
      {
        title: "gender",
        displayTitle: "Gender",
        options: [
          { slug: "MEN", label: "Men" },
          { slug: "WOMEN", label: "Women" },
        ],
      },
      {
        title: "priceRange",
        displayTitle: "Price",
        isRadio: true,
        options: [
          { slug: "below-5000", label: "Below ₹5,000" },
          { slug: "5000-15000", label: "₹5,000 - ₹15,000" },
          { slug: "15000-25000", label: "₹15,000 - ₹25,000" },
          { slug: "25000-35000", label: "₹25,000 - ₹35,000" },
          { slug: "35000-50000", label: "₹35,000 - ₹50,000" },
          { slug: "50000-70000", label: "₹50,000 - ₹70,000" },
          { slug: "70000-90000", label: "₹70,000 - ₹90,000" },
          { slug: "90000-110000", label: "₹90,000 - ₹1,10,000" },
          { slug: "110000-140000", label: "₹1,10,000 - ₹1,40,000" },
          { slug: "140000-175000", label: "₹1,40,000 - ₹1,75,000" },
          { slug: "175000-200000", label: "₹1,75,000 - ₹2,00,000" },
          { slug: "above-200000", label: "Above ₹2,00,000" },
        ],
      },
      {
        title: "jewelryTypeSlug",
        displayTitle: "Product Type",
        options:
          sideFilterData.jewelleryType?.map((type) => ({
            slug: type.jewelryTypeSlug,
            label: type.name,
            count: type.products.reduce(
              (total, product) => total + (product._count?.productVariant || 0),
              0
            ),
          })) || [],
      },
      {
        title: "gemstoneVariantSlug",
        displayTitle: "Stone Type",
        options:
          sideFilterData.shape?.map((s) => ({
            slug: s.variants?.[0]?.slug || s.slug,
            label: s.name,
            count: s.count,
            individualSlugs:
              s.variants?.[0]?.slug?.split(",").filter(Boolean) || [],
          })) || [],
      },
      {
        title: "weightRange",
        displayTitle: "Weight Range",
        isRadio: true,
        options: [
          { slug: "0-2", label: "0 - 2 gms" },
          { slug: "2-4", label: "2 - 4 gms" },
          { slug: "4-6", label: "4 - 6 gms" },
          { slug: "6-8", label: "6 - 8 gms" },
          { slug: "8-10", label: "8 - 10 gms" },
          { slug: "10-12", label: "10 - 12 gms" },
          { slug: "12-14", label: "12 - 14 gms" },
          { slug: "14-16", label: "14 - 16 gms" },
          { slug: "16-18", label: "16 - 18 gms" },
          { slug: "18-20", label: "18 - 20 gms" },
          { slug: "above-20", label: "Above 20 gms" },
        ],
      },
      {
        title: "purity",
        displayTitle: "Purity",
        options:
          sideFilterData.purityOptions?.map((p) => ({
            slug: p.label,
            label: p.label,
            count: p.count,
          })) || [],
      },
      {
        title: "giftRange",
        displayTitle: "Gifts",
        isRadio: true,
        options: [
          { slug: "gift-under-25000", label: "Under ₹25,000" },
          { slug: "gift-under-50000", label: "Under ₹50,000" },
          { slug: "gift-under-100000", label: "Under ₹1,00,000" },
          { slug: "gift-100000-200000", label: "₹1,00,000 - ₹2,00,000" },
        ],
      },
      {
        title: "caratWeight",
        displayTitle: "Shop By Carat",
        options: [
          {
            slug: "below-1-carat",
            label: "0 - 1 Ct",
            count: getCaratCount(["below-1-carat"]),
            individualSlugs: ["below-1-carat"],
          },
          {
            slug: "1---2-carat,2---3-carat",
            label: "1 - 3 Ct",
            count: getCaratCount(["1---2-carat", "2---3-carat"]),
            individualSlugs: ["1---2-carat", "2---3-carat"],
          },
          {
            slug: "3---4-carat,4---5-carat",
            label: "3 - 5 Ct",
            count: getCaratCount(["3---4-carat", "4---5-carat"]),
            individualSlugs: ["3---4-carat", "4---5-carat"],
          },
          {
            slug: "plus-5-carat",
            label: "Above 5 Ct",
            count: getCaratCount(["plus-5-carat"]),
            individualSlugs: ["plus-5-carat"],
          },
        ],
      },
      {
        title: "occasionSlug",
        displayTitle: "Occasions",
        options:
          sideFilterData.occasion?.map((occasion) => ({
            slug: occasion.occasionSlug,
            label: occasion.name.toLowerCase(),
            count: 0,
          })) || [],
      },
      {
        title: "collectionSlug",
        displayTitle: "Collections",
        options:
          sideFilterData.collection?.map((c) => ({
            slug: c.collectionSlug,
            label: c.name,
            count: c._count?.products || 0,
          })) || [],
      },
      {
        title: "isEnamel",
        displayTitle: "Enamel",
        isRadio: true,
        options: [{ slug: "true", label: "Yes" }],
      },
      {
        title: "productStyleSlug",
        displayTitle: "Style",
        options:
          sideFilterData.style?.map((style) => ({
            slug: style.productStyleSlug,
            label: style.name,
            count: 0,
          })) || [],
      },
      {
        title: "metalColorSlug",
        displayTitle: "Gold Color",
        options:
          sideFilterData.color?.map((metal) => ({
            slug: metal.metalColorSlug,
            label: metal.name,
            count: metal._count?.productVariant || 0,
          })) || [],
      },
      {
        title: "dailyWear",
        displayTitle: "Daily Wear",
        options:
          sideFilterData?.dailyWear?.map((daily) => ({
            slug: daily?.slug,
            label: daily?.name.toLowerCase(),
            count: daily?.count || 0,
          })) || [],
      },
    ];
  }, [sideFilterData, getCaratCount]);

  // Count active filters (arrays + single-select string filters)
  const activeFilterCount = useMemo(() => {
    let count = 0;
    filterDisplayData.forEach((filter) => {
      const filterValue = filters[filter.title];
      if (Array.isArray(filterValue)) {
        count += filterValue.length;
      } else if (filterValue && typeof filterValue === "string" && filterValue !== "") {
        count += 1;
      }
    });
    return count;
  }, [filters, filterDisplayData]);

  // Build active chip list from filterDisplayData so labels stay human-readable.
  // Mirrors the three modes in FilterSidebar: grouped (individualSlugs), radio, checkbox.
  const activeChips = useMemo(() => {
    const chips = [];
    filterDisplayData.forEach((filter) => {
      const value = filters[filter.title];
      filter.options.forEach((option) => {
        if (option.individualSlugs) {
          const slugs = Array.isArray(value) ? value : [];
          const active = option.individualSlugs.some((s) => slugs.includes(s));
          if (active) {
            chips.push({
              key: `${filter.title}:${option.slug}`,
              filterTitle: filter.title,
              displayTitle: filter.displayTitle,
              label: option.label,
              kind: "group",
              individualSlugs: option.individualSlugs,
            });
          }
        } else if (filter.isRadio) {
          if (value === option.slug) {
            chips.push({
              key: `${filter.title}:${option.slug}`,
              filterTitle: filter.title,
              displayTitle: filter.displayTitle,
              label:
                filter.title === "isEnamel"
                  ? `${filter.displayTitle}: ${option.label}`
                  : option.label,
              kind: "radio",
            });
          }
        } else {
          const slugs = Array.isArray(value) ? value : [];
          if (slugs.includes(option.slug)) {
            chips.push({
              key: `${filter.title}:${option.slug}`,
              filterTitle: filter.title,
              displayTitle: filter.displayTitle,
              label: option.label,
              kind: "array",
              optionSlug: option.slug,
            });
          }
        }
      });
    });
    return chips;
  }, [filters, filterDisplayData]);

  const removeChip = (chip) => {
    if (chip.kind === "radio") {
      handleFilterChangeHook({
        target: { name: chip.filterTitle, value: "" },
      });
    } else if (chip.kind === "group") {
      const current = Array.isArray(filters[chip.filterTitle])
        ? filters[chip.filterTitle]
        : [];
      handleFilterChangeHook({
        target: {
          name: chip.filterTitle,
          value: current.filter((s) => !chip.individualSlugs.includes(s)),
        },
      });
    } else {
      // array multi-select: uncheck via the multi handler
      handleFilterMultipleChangeHook({
        target: {
          name: chip.filterTitle,
          value: chip.optionSlug,
          checked: false,
          type: "checkbox",
        },
      });
    }
  };

  // Wishlist handler
  const handleWishlistClick = (e, productId) => {
    e.preventDefault();
    e.stopPropagation();
    const heartIcon = wishlistRefs.current[productId];
    if (!heartIcon) {
      if (isInWishlist(productId)) {
        const wishlistItem = wishlistItems.find((item) => item.productVariantId === productId);
        if (wishlistItem) removeFromWishlist(wishlistItem.id, productId);
      } else {
        addToWishlist(productId);
      }
      return;
    }
    if (isInWishlist(productId)) {
      gsap.timeline()
        .to(heartIcon, { scale: 1.2, duration: 0.1, ease: "power1.out" })
        .to(heartIcon, { scale: 0.8, duration: 0.2, ease: "back.in" })
        .to(heartIcon, {
          scale: 1, duration: 0.1, ease: "power1.out",
          onComplete: () => {
            const wishlistItem = wishlistItems.find((item) => item.productVariantId === productId);
            if (wishlistItem) removeFromWishlist(wishlistItem.id, productId);
          },
        });
    } else {
      gsap.timeline()
        .to(heartIcon, { scale: 0.8, duration: 0.1, ease: "power1.out" })
        .to(heartIcon, { scale: 1.5, duration: 0.2, ease: "back.out", onComplete: () => addToWishlist(productId) })
        .to(heartIcon, { scale: 1, duration: 0.1, ease: "power1.in" });
    }
  };

  // Split products for promo injection
  const showPromo = allProducts.length > PROMO_AFTER;
  const beforePromo = showPromo ? allProducts.slice(0, PROMO_AFTER) : allProducts;
  const afterPromo = showPromo ? allProducts.slice(PROMO_AFTER) : [];

  const ProductCardSkeleton = () => (
    <div className="flex flex-col">
      <div className="relative">
        <div className="border-2 border-gray-border rounded-2xl overflow-hidden">
          {/* Wishlist heart icon */}
          <Skeleton className="absolute top-3 left-3 w-8 h-8 rounded-full z-10" />
          <Skeleton className="aspect-5/4 w-full" />
        </div>
      </div>
      <div className="pt-2.5 px-1">
        <Skeleton className="h-6 w-3/4" />
        <Skeleton className="h-6 w-1/3 mt-1" />
      </div>
    </div>
  );

  return (
    <main>
      <HeroBanner
        jewelryTypeSlug={filters.jewelryTypeSlug || []}
        categoryName={
          filters.jewelryTypeSlug?.length === 1
            ? sideFilterData.jewelleryType?.find(
                (t) => t.jewelryTypeSlug === filters.jewelryTypeSlug[0]
              )?.name || ""
            : ""
        }
      />

      <section className="py-6 md:py-12 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6">

          {/* Mobile/Tablet filter bar - visible below md */}
          <div className="md:hidden flex items-center justify-between mb-4">
            <p className="text-sm text-gray-text">
              <span className="font-semibold text-charcoal">{pagination || allProducts.length}</span> products
            </p>
            <button
              onClick={() => setShowMobileFilters(true)}
              className="flex items-center gap-1.5 text-sm font-medium text-charcoal border border-gray-300 rounded-full px-4 py-2"
            >
              <SlidersHorizontal size={14} />
              Filters
              {activeFilterCount > 0 && (
                <span className="bg-maroon text-white text-[10px] font-bold w-4.5 h-4.5 rounded-full flex items-center justify-center ml-0.5">
                  {activeFilterCount}
                </span>
              )}
            </button>
          </div>

          {/* Mobile filter drawer overlay */}
          {showMobileFilters && (
            <div className="md:hidden fixed inset-0 z-50 flex">
              <div
                className="absolute inset-0 bg-black/40"
                onClick={() => setShowMobileFilters(false)}
              />
              <div className="relative w-72 max-w-[80vw] bg-white h-full overflow-y-auto shadow-xl z-10">
                <div className="sticky top-0 bg-white flex items-center justify-between px-4 py-3 border-b border-gray-200 z-10">
                  <span className="text-sm font-bold text-charcoal">Filters</span>
                  <button
                    onClick={() => setShowMobileFilters(false)}
                    className="w-8 h-8 flex items-center justify-center rounded-full hover:bg-gray-100"
                  >
                    <X size={18} className="text-gray-text" />
                  </button>
                </div>
                <div className="px-4 pb-24">
                  <FilterSidebar
                    filterDisplayData={filterDisplayData}
                    filters={filters}
                    handleFilterMultipleChangeHook={handleFilterMultipleChangeHook}
                    handleFilterChangeHook={handleFilterChangeHook}
                  />
                </div>
                <div className="sticky bottom-0 bg-white border-t border-gray-200 px-4 py-3">
                  <Button
                    onClick={() => setShowMobileFilters(false)}
                    bgColor="#8B0000"
                    accentColor="#C04040"
                    text={`Show ${pagination || allProducts.length} results`}
                    className="w-full"
                  />
                </div>
              </div>
            </div>
          )}

          {/* Sidebar + Grid Layout */}
          <div className="flex gap-8">
            {/* Left Sidebar - desktop only */}
            <div className="hidden md:block w-56 shrink-0">
              <FilterSidebar
                filterDisplayData={filterDisplayData}
                filters={filters}
                handleFilterMultipleChangeHook={handleFilterMultipleChangeHook}
                handleFilterChangeHook={handleFilterChangeHook}
              />
            </div>

            {/* Right Content - Product Grid */}
            <div className="flex-1 min-w-0">
              {/* Top bar - Title + Pincode + Sort */}
              <div className="flex flex-col md:flex-row gap-2 sm:gap-0 items-start sm:items-center justify-between mb-6">
                <h2 className="text-lg font-heading font-normal text-charcoal truncate w-full">
                  Shop All{" "}
                  <span className="text-sm font-body text-gray-400 font-normal">
                    {pagination || allProducts.length} Designs
                  </span>
                </h2>

                <div className="w-full flex flex-row justify-between sm:justify-end items-center gap-2">
                  <div className="relative" ref={pincodePopoverRef}>
                    <button
                      onClick={() => setShowPincodePopover((prev) => !prev)}
                      className={`flex items-center gap-1.5 text-xs font-semibold px-4 py-2 rounded-full transition-colors ${
                        isServiceable
                          ? "bg-green-700 text-white"
                          : "bg-maroon text-white"
                      }`}
                    >
                      <MapPin size={14} />
                      {isServiceable ? pincode : "Pincode"}
                    </button>

                    {showPincodePopover && (
                      <div className="absolute top-full right-0 mt-2 z-50 bg-white border border-gray-200 rounded-xl shadow-lg p-3 sm:p-4 w-[calc(100vw-2rem)] max-w-64">
                        <p className="text-xs font-semibold text-charcoal mb-2">
                          Check Delivery Availability
                        </p>
                        <div className="flex items-center gap-2">
                          <input
                            type="text"
                            value={pincode}
                            onChange={(e) => {
                              const val = e.target.value.replace(/\D/g, "");
                              setPincode(val);
                              setServiceabilityError("");
                              setIsServiceable(false);
                            }}
                            onKeyDown={(e) => e.key === "Enter" && handlePincodeCheck()}
                            placeholder="Enter pincode"
                            maxLength={6}
                            className="flex-1 min-w-0 border border-gray-300 rounded-lg px-3 py-2 text-xs focus:outline-none focus:border-charcoal"
                          />
                          <button
                            onClick={handlePincodeCheck}
                            disabled={pincode.length !== 6 || isCheckingPincode}
                            className="bg-maroon text-white text-xs font-semibold px-3 py-2 rounded-lg disabled:opacity-50 shrink-0"
                          >
                            {isCheckingPincode ? (
                              <Loader2 size={14} className="animate-spin" />
                            ) : (
                              "Check"
                            )}
                          </button>
                        </div>
                        {isCheckingPincode && (
                          <p className="text-xs text-amber-600 mt-2">
                            Checking serviceability...
                          </p>
                        )}
                        {serviceabilityError && (
                          <p className="text-xs text-red-600 mt-2">
                            {serviceabilityError}
                          </p>
                        )}
                        {isServiceable && !isCheckingPincode && (
                          <p className="text-xs text-green-600 mt-2 flex items-center gap-1">
                            <Check size={12} /> Delivery available to {pincode}
                          </p>
                        )}
                      </div>
                    )}
                  </div>
                  <div className="relative" ref={sortDropdownRef}>
                    <button
                      onClick={() => setShowSortDropdown((prev) => !prev)}
                      className="flex items-center gap-1 bg-white border border-gray-300 rounded-lg pl-4 pr-3 py-2 text-xs font-semibold text-charcoal cursor-pointer focus:outline-none"
                    >
                      {sort}
                      <ChevronDown size={14} className="text-gray-text" />
                    </button>
                    {showSortDropdown && (
                      <div className="absolute top-full right-0 mt-1 z-50 bg-white border border-gray-200 rounded-lg shadow-lg py-1 min-w-[160px]">
                        {["Popular", "Newest", "Price: Low to High", "Price: High to Low"].map((option) => (
                          <button
                            key={option}
                            onClick={() => {
                              handleSortChange(option);
                              setShowSortDropdown(false);
                            }}
                            className={`w-full text-left px-4 py-2 text-xs font-semibold cursor-pointer transition-colors ${
                              sort === option
                                ? "bg-maroon text-white"
                                : "text-charcoal hover:bg-maroon-surface"
                            }`}
                          >
                            {option}
                          </button>
                        ))}
                      </div>
                    )}
                  </div>
                </div>
              </div>

              {/* Active filter chips */}
              {activeChips.length > 0 && (
                <div className="flex flex-wrap items-center gap-2 mb-4">
                  {activeChips.map((chip) => (
                    <button
                      key={chip.key}
                      onClick={() => removeChip(chip)}
                      className="flex items-center gap-1 bg-maroon-surface text-charcoal text-xs font-medium px-3 py-1.5 rounded-full hover:bg-maroon hover:text-white transition-colors capitalize"
                    >
                      <span>{chip.label}</span>
                      <X size={12} />
                    </button>
                  ))}
                  <button
                    onClick={() => clearFilters()}
                    className="text-xs font-semibold text-maroon underline underline-offset-2 ml-1"
                  >
                    Clear all
                  </button>
                </div>
              )}

              {/* Product Grid */}
              {loading ? (
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 sm:gap-6 md:gap-8">
                  {Array.from({ length: limit }).map((_, i) => (
                    <ProductCardSkeleton key={`skeleton-${i}`} />
                  ))}
                </div>
              ) : allProducts.length > 0 ? (
                <>
                  <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 sm:gap-6 md:gap-8">
                    {beforePromo.map((product, index) => (
                      <ListProductCard
                        key={`${product.id}-${index}`}
                        product={product}
                        onWishlistClick={handleWishlistClick}
                        isWishlisted={isInWishlist(product.id)}
                        isWishlistLoading={isProductLoading(product.id)}
                      />
                    ))}

                    {showPromo && <PromoBanner />}

                    {afterPromo.map((product, index) => (
                      <ListProductCard
                        key={`${product.id}-after-${index}`}
                        product={product}
                        onWishlistClick={handleWishlistClick}
                        isWishlisted={isInWishlist(product.id)}
                        isWishlistLoading={isProductLoading(product.id)}
                      />
                    ))}

                    {isLoadingMore &&
                      Array.from({ length: 3 }).map((_, i) => (
                        <ProductCardSkeleton key={`load-more-skeleton-${i}`} />
                      ))}
                  </div>

                  {/* Load More */}
                  {hasMore && !isLoadingMore && (
                    <div className="flex justify-center mt-8">
                      <Button
                        onClick={handleLoadMore}
                        bgColor="#8B0000"
                        accentColor="#C04040"
                        text="Load More"
                      />
                    </div>
                  )}
                </>
              ) : (
                <div className="text-center py-20">
                  <p className="text-lg text-gray-text">
                    No products match the selected filters.
                  </p>
                  <button
                    onClick={() => clearFilters()}
                    className="mt-4 text-sm text-maroon font-semibold underline"
                  >
                    Clear all filters
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      </section>

      <NewsletterCTA />
    </main>
  );
}

