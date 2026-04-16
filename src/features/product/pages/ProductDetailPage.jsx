import { Fragment, useContext, useEffect, useRef, useState } from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import { Autoplay, Pagination } from "swiper/modules";
import "swiper/css";
import "swiper/css/pagination";
import {
  Star,
  ArrowLeft,
  ArrowRight,
  ChevronDown,
  ChevronRight,
  Minus,
  Plus,
  Ruler,
} from "lucide-react";
import { FiHeart } from "react-icons/fi";
import RelatedSuggestions from "../components/RelatedSuggestion";
import { fetchProductBySlug, getCouponsForVariant } from "@/features/product/api/productApi";
import { Link, useNavigate, useParams } from "react-router-dom";
import { Skeleton } from "@/shared/components/ui/skeleton";
import SEOProvider from "@/shared/components/common/SEOProvider/SEOProvider";
import { useCart } from "@/shared/context/CartContext";
import { toast } from "sonner";
import { CurrencyContext } from "@/shared/context/CurrencyContext";
import Cart from "@features/cart/components/Cart";
import ReviewCard from "../components/ReviewCard";
import { useWishlist } from "@/shared/context/WishlistContext";
import ShareButton from "@/shared/components/ShareButton/ShareButton";
import RecentlyViewed from "../components/RecentlyViewed";
import { AuthContext } from "@/shared/context/Auth";
import ButtonLoading from "@/shared/components/Loaders/ButtonLoading";
import ImageCarouselModal from "@/shared/components/ImageCarouselModal/ImageCarouselModal";
import { formatSizeUnit } from "@/shared/utils/sizeUtils";
import { usePincodeValidation } from "@/shared/hooks/usePincodeValidation";
import HeroBanner from "../components/HeroBanner";
import ProductPriceDisplay from "@/shared/components/ProductPriceDisplay";
import Button from "@features/home/ui/Button";
import RoundedPill from "@/shared/components/blueprint/RoundedPill";
import NewsletterCTA from "@/shared/components/common/newsletter/NewsletterCTA";
import InstaJourney from "@/features/home/components/InstaJourney";
import ColorSelector from "../components/ColorSelector";
import { getMetalWeightLabel } from "@/shared/utils/getMetalWeightLabel";

function StarRating({ rating }) {
  return (
    <div className="flex items-center gap-0.5">
      {[1, 2, 3, 4, 5].map((i) => (
        <Star
          key={i}
          size={14}
          className={
            i <= Math.floor(rating)
              ? "text-amber-400 fill-amber-400"
              : "text-gray-300"
          }
        />
      ))}
    </div>
  );
}

const trustBadges = [
  { icon: "/product-detail/diamond.svg", label: "Certified\nDiamonds" },
  { icon: "/product-detail/hallmark.svg", label: "Hallmark\nJewellery" },
  { icon: "/product-detail/strelling.svg", label: "925 Sterling\nSilver" },
  { icon: "/product-detail/polish.svg",         label: "High Quality\nPolish" },
];

export default function ProductDetailPage() {
  const { convertPrice, currency, getCurrencySymbol } =
    useContext(CurrencyContext);
  const {
    addToWishlist,
    removeFromWishlist,
    removeFromWishlistForDetail,
    isInWishlist,
    wishlistCount,
    addWishLoading,
    isProductLoading,
  } = useWishlist();
  const { addToRecentlyViewed } = useContext(AuthContext);
  const [showSharePopup, setShowSharePopup] = useState(false);

  const {
    addToCart,
    buyNow,
    isItemInCart,
    addLoading,
    buyNowLoading,
    cartData,
  } = useCart();
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [selectedImage, setSelectedImage] = useState("");
  const [selectedMetalVariant, setSelectedMetalVariant] = useState(null);
  const [selectedColor, setSelectedColor] = useState(null);
  const [ringSize, setRingSize] = useState("");
  const [selectedProductSizeId, setSelectedProductSizeId] = useState("");
  const { productVariantSlug } = useParams();
  const navigate = useNavigate();
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isCarouselOpen, setIsCarouselOpen] = useState(false);
  const [carouselStartIndex, setCarouselStartIndex] = useState(0);
  const [selectedChainStyle, setSelectedChainStyle] = useState("");
  const [selectedCountry, setSelectedCountry] = useState("IN");
  const [pincode, setPincode] = useState("");
  const [isCheckingServiceability, setIsCheckingServiceability] =
    useState(false);
  const [serviceabilityError, setServiceabilityError] = useState("");
  const [isServiceable, setIsServiceable] = useState(false);
  const [nameOnJewelry, setNameOnJewelry] = useState("");
  const [remark, setRemark] = useState("");
  const [quantity, setQuantity] = useState(1);
  const thumbRef = useRef(null);

  const {
    isCheckingPincode,
    pincodeError,
    setPincodeError,
    validatePincode,
    handlePostalCodeChange,
    validatePincodeBeforeSubmit,
  } = usePincodeValidation();

  const [openSections, setOpenSections] = useState({
    description: true,
    shipping: true,
    price: true,
  });
  const [selectedScrewOptionId, setSelectedScrewOptionId] = useState("");
  const [activeJewelryTab, setActiveJewelryTab] = useState("material");
  const [offersOpen, setOffersOpen] = useState(false);
  const [variantCoupons, setVariantCoupons] = useState([]);
  const [sizeDropdownOpen, setSizeDropdownOpen] = useState(false);
  const sizeDropdownRef = useRef(null);

  const extractTextFromHTML = (html) => {
    if (!html) return "";
    const doc = new DOMParser().parseFromString(html, "text/html");
    return doc.body.textContent || doc.body.innerText || "";
  };

  const displayPrice = (price) => {
    return `${getCurrencySymbol(currency)}${convertPrice(price).toLocaleString(
      "en-IN",
      {
        minimumFractionDigits: 2,
        maximumFractionDigits: 2,
      }
    )}`;
  };

  const toggleSection = (section) => {
    setOpenSections((prev) => ({
      ...prev,
      [section]: !prev[section],
    }));
  };

  const handleMetalVariantChange = (metalVariant) => {
    setSelectedMetalVariant(metalVariant);
    const group = product.groupedVariants.find(
      (g) => g.metalVariant.id === metalVariant.id
    );
    if (group && group.colors.length > 0) {
      setSelectedColor(group.colors[0]);
      if (group.colors[0].variant.productVariantImage?.length > 0) {
        setSelectedImage(
          group.colors[0].variant.productVariantImage[0].imageUrl
        );
      }
    } else {
      setSelectedColor(null);
      setSelectedImage("");
    }
  };

  const handleColorChange = (color) => {
    setSelectedColor(color);
    if (color.variant.productVariantImage?.length > 0) {
      setSelectedImage(color.variant.productVariantImage[0].imageUrl);
    }
  };

  const generateShopAllUrl = (params) => {
    const baseUrl = "/shop-all";
    const queryParams = new URLSearchParams();

    Object.entries(params).forEach(([key, value]) => {
      if (Array.isArray(value)) {
        if (value.length > 0) {
          queryParams.set(key, value.join(","));
        }
      } else if (value) {
        queryParams.set(key, value.toString());
      }
    });

    return queryParams.toString()
      ? `${baseUrl}?${queryParams.toString()}`
      : baseUrl;
  };

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (sizeDropdownRef.current && !sizeDropdownRef.current.contains(e.target)) {
        setSizeDropdownOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  useEffect(() => {
    const fetchProductDetails = async () => {
      setLoading(true);
      try {
        const response = await fetchProductBySlug(productVariantSlug);
        setProduct(response?.data?.data);

        let initialVariant = null;
        for (const group of response.data.data.groupedVariants) {
          for (const color of group.colors) {
            if (color.variant.productVariantSlug === productVariantSlug) {
              initialVariant = color.variant;
              setSelectedMetalVariant(group.metalVariant);
              setSelectedColor(color);
              if (color.variant.productVariantImage?.length > 0) {
                setSelectedImage(color.variant.productVariantImage[0].imageUrl);
              }
              break;
            }
          }
          if (initialVariant) break;
        }

        if (
          !initialVariant &&
          response.data.data?.groupedVariants?.length > 0
        ) {
          const firstGroup = response.data.data.groupedVariants[0];
          setSelectedMetalVariant(firstGroup.metalVariant);
          if (firstGroup.colors.length > 0) {
            setSelectedColor(firstGroup.colors[0]);
            if (firstGroup.colors[0].variant.productVariantImage?.length > 0) {
              setSelectedImage(
                firstGroup.colors[0].variant.productVariantImage[0].imageUrl
              );
            }
          }
        }
      } catch (error) {
        toast.error("Failed to fetch product details");
        console.log("Error fetching product details:", error);
        navigate("/shop-all");
      } finally {
        setLoading(false);
      }
    };

    if (productVariantSlug) {
      fetchProductDetails();
    }
    window.scrollTo(0, 0);
  }, [productVariantSlug, navigate]);

  const currentVariant = selectedColor?.variant;
  const metalVariant = selectedMetalVariant;
  const gemstoneVariant = currentVariant?.gemstoneVariant;

  const currentGroup = product?.groupedVariants?.find(
    (group) => group.metalVariant.id === selectedMetalVariant?.id
  );

  const isInCart = currentVariant ? isItemInCart(currentVariant?.id) : false;

  useEffect(() => {
    if (product && currentVariant) {
      const viewedProduct = {
        id: currentVariant.id,
        productVariantTitle: currentVariant.productVariantTitle,
        productVariantSlug: currentVariant.productVariantSlug,
        finalPrice: currentVariant.finalPrice,
        productVariantImage: currentVariant.productVariantImage,
        products: {
          productSlug: product.productSlug,
          name: product.name,
        },
      };

      addToRecentlyViewed(viewedProduct);

      const storedItems = JSON.parse(
        localStorage.getItem("recentlyViewed") || "[]"
      );
      const updatedItems = [
        viewedProduct,
        ...storedItems.filter((item) => item.id !== viewedProduct.id),
      ].slice(0, 10);

      localStorage.setItem("recentlyViewed", JSON.stringify(updatedItems));
    }
  }, [product, currentVariant, addToRecentlyViewed]);

  useEffect(() => {
    if (!currentVariant?.id) return;
    getCouponsForVariant(currentVariant.id)
      .then((res) => setVariantCoupons(res?.data?.data || []))
      .catch(() => setVariantCoupons([]));
  }, [currentVariant?.id]);

  if (loading || !product) {
    return (
      <main className="bp-section">
        <section className="py-8 md:py-14 bg-white">
          <div className="max-w-7xl mx-auto px-4 sm:px-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-14">

              {/* Left — sticky image panel */}
              <div className="lg:sticky lg:top-20 self-start">
                {/* Breadcrumb */}
                <div className="flex items-center gap-1 mb-6">
                  <Skeleton className="h-4 w-12" />
                  <Skeleton className="h-4 w-4" />
                  <Skeleton className="h-4 w-20" />
                  <Skeleton className="h-4 w-4" />
                  <Skeleton className="h-4 w-48" />
                </div>
                {/* Main image in gray frame */}
                <div className="rounded-3xl bg-[#666666] relative mb-3 overflow-hidden p-4">
                  <div className="m-6 sm:m-5 aspect-[5/4] rounded-2xl overflow-hidden bg-white">
                    <Skeleton className="w-full h-full rounded-none" />
                  </div>
                </div>
                {/* Thumbnails */}
                <div className="flex gap-3">
                  {[...Array(4)].map((_, idx) => (
                    <div
                      key={idx}
                      className="rounded-2xl bg-[#666666] shrink-0 p-1.5"
                      style={{ width: "calc((100% - 0.75rem * 3) / 4)" }}
                    >
                      <div className="aspect-square rounded-xl overflow-hidden bg-white">
                        <Skeleton className="w-full h-full rounded-none" />
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Right — Product Info */}
              <div className="flex flex-col">
                {/* Price + Share/Wishlist icons */}
                <div className="flex items-start justify-between gap-3">
                  <Skeleton className="h-8 w-40" />
                  <div className="flex gap-2 mt-1">
                    <Skeleton className="w-8 h-8 rounded-full" />
                    <Skeleton className="w-8 h-8 rounded-full" />
                  </div>
                </div>
                <Skeleton className="h-3 w-32 mt-1" />

                {/* Title + SKU */}
                <div className="flex flex-row justify-between mt-2">
                  <Skeleton className="h-5 w-48" />
                  <Skeleton className="h-3 w-20" />
                </div>

                {/* Description */}
                <Skeleton className="h-12 w-full mt-2" />

                {/* Pincode pill */}
                <div className="flex items-center mt-6 border border-gray-200 rounded-full p-1">
                  <Skeleton className="h-9 flex-1 rounded-full" />
                  <Skeleton className="h-9 w-16 rounded-full ml-1" />
                </div>

                {/* Trust badges — 4 cards */}
                <div className="flex justify-between gap-3 mt-5">
                  {[...Array(4)].map((_, i) => (
                    <div key={i} className="bg-gray-100 rounded-xl flex flex-col items-center justify-center p-4 py-5 flex-1 gap-2">
                      <Skeleton className="h-9 w-9" />
                      <Skeleton className="h-3 w-14" />
                      <Skeleton className="h-3 w-10" />
                    </div>
                  ))}
                </div>

                {/* Size selector row */}
                <div className="flex items-center gap-3 mt-4">
                  <Skeleton className="w-9 h-9 rounded-full" />
                  <Skeleton className="h-4 w-12" />
                  <Skeleton className="h-8 w-28 rounded-full" />
                </div>

                {/* Offers For You */}
                <div className="mt-4">
                  <Skeleton className="h-4 w-28 mb-3" />
                  <Skeleton className="h-12 w-full rounded-lg" />
                  <Skeleton className="h-12 w-full rounded-lg mt-2" />
                </div>

                {/* Gift promo row */}
                <div className="flex items-center gap-2 mt-2 px-1">
                  <Skeleton className="h-4 w-4 rounded" />
                  <Skeleton className="h-3 w-56" />
                </div>

                {/* Action buttons — Call Us + WhatsApp */}
                <div className="flex items-center gap-2.5 mt-2.5">
                  <Skeleton className="h-10 flex-1 rounded-full" />
                  <Skeleton className="h-10 flex-1 rounded-full" />
                </div>

                {/* Metal variants — gray card */}
                <div className="bg-gray-100 rounded-2xl mt-6 flex justify-around items-center px-4 py-4">
                  {[...Array(3)].map((_, i) => (
                    <div key={i} className="flex flex-col items-center gap-2">
                      <Skeleton className="w-14 h-14 rounded-full" />
                      <Skeleton className="h-3 w-10" />
                    </div>
                  ))}
                </div>
              </div>

            </div>
          </div>
        </section>
      </main>
    );
  }

  const hasPendant = product?.productStyle?.some(
    (style) => style.name === "Pendant"
  );

  // Reverse pricing: use server-calculated values directly
  const metalPrice = currentVariant?.metalPrice || 0;
  const diamondCharges = currentVariant?.diamondPrice || 0;
  const makingChargePrice = currentVariant?.makingChargePrice || 0;
  const totalSP = currentVariant?.sellingPrice || 0;
  const gstPercentage = currentVariant?.gst || 0;
  const gstAmount = (totalSP * gstPercentage) / 100;
  const finalPrice = totalSP + gstAmount;

  const variantGridCols = product.groupedVariants
    .map((_, i) => (i > 0 ? "2px 1fr" : "1fr"))
    .join(" ");

  const getMetalStyle = (metalType) => {
    const name = metalType?.name?.toLowerCase() || "";
    if (name.includes("gold"))
      return "bg-amber-300 shadow-[0_10px_30px_8px_rgba(212,175,55,0.45)]";
    if (name.includes("silver"))
      return "border-2 border-gray-300 bg-gray-100 shadow-[0_10px_30px_8px_rgba(180,180,180,0.5)]";
    if (name.includes("rose"))
      return "bg-gold shadow-[0_10px_30px_8px_rgba(220,140,60,0.45)]";
    return "bg-gray-200 shadow-md";
  };

  const handleAddToCart = async () => {
    if (currentVariant?.ScrewOption?.length > 0 && !selectedScrewOptionId) {
      toast.error("Please select a screw option");
      return;
    }
    if (
      !selectedProductSizeId &&
      currentVariant?.productSize?.length > 0 &&
      !currentVariant?.isFreeSize &&
      !(currentVariant?.ScrewOption?.length > 0)
    ) {
      toast.error("Please select a size");
      return;
    }

    const result = await addToCart(
      currentVariant?.id,
      currentVariant?.ScrewOption?.length > 0
        ? selectedScrewOptionId
        : selectedProductSizeId || null,
      quantity,
      currentVariant?.ScrewOption?.length > 0 ? "SCREW_OPTION" : "SIZE",
      hasPendant ? selectedChainStyle : undefined,
      nameOnJewelry || null,
      remark || null
    );
    if (result.success) {
      setIsCartOpen(true);
      setNameOnJewelry("");
      setRemark("");
    }
  };

  const handleBuyNow = () => {
    if (currentVariant?.ScrewOption?.length > 0 && !selectedScrewOptionId) {
      toast.error("Please select a screw option");
      return;
    }
    if (
      !selectedProductSizeId &&
      currentVariant?.productSize?.length > 0 &&
      !currentVariant?.isFreeSize &&
      !(currentVariant?.ScrewOption?.length > 0)
    ) {
      toast.error("Please select a size");
      return;
    }
    buyNow(
      currentVariant?.id,
      currentVariant?.ScrewOption?.length > 0 ? selectedScrewOptionId : selectedProductSizeId || null,
      quantity,
      currentVariant?.ScrewOption?.length > 0 ? "SCREW_OPTION" : "SIZE",
      hasPendant ? selectedChainStyle : undefined,
      nameOnJewelry || null,
      remark || null
    );
  };

  const handleWhatsAppNow = () => {
    const whatsappMessage = `Hi! I'm interested in ${product.name} (${currentVariant?.sku}) - ${displayPrice(currentVariant?.finalPrice)}. ${window.location.href}`;
    window.open(
      `https://wa.me/910000000000?text=${encodeURIComponent(whatsappMessage)}`,
      "_blank"
    );
  };

  const handleWishlistToggle = async () => {
    if (isInWishlist(currentVariant?.id)) {
      const wishlistItem = currentVariant?.Wishlist.find(
        (item) => item.productVariantId === currentVariant?.id
      );
      if (wishlistItem) {
        removeFromWishlist(wishlistItem.id, currentVariant?.id);
      }
    } else {
      await addToWishlist(currentVariant?.id);
    }
  };

  const handlePincodeChange = async (e) => {
    const value = e.target.value.replace(/\D/g, "");
    setPincode(value);

    if (value.length !== 6) {
      setServiceabilityError("");
      setIsServiceable(false);
      return;
    }

    setIsCheckingServiceability(true);
    setServiceabilityError("");
    setIsServiceable(false);

    try {
      const result = await validatePincode(value);

      if (result === true) {
        setIsServiceable(true);
        toast.success(`Delivery available to ${value}`);
      } else {
        setServiceabilityError(
          result.error || `Delivery not available to ${value}`
        );
      }
    } catch (error) {
      setServiceabilityError(
        "Serviceability check failed. Please try again."
      );
      console.error("Serviceability error:", error);
    } finally {
      setIsCheckingServiceability(false);
    }
  };

  return (
    <>
      <main className="bp-section pb-20">
        <SEOProvider
          title={product.metaTitle || product.name}
          description={
            product.metaDescription ||
            extractTextFromHTML(product.description)
          }
          keywords={product.metaKeywords}
          url={window.location.href}
        />

        {/* <HeroBanner /> */}

        {/* Product Hero */}
        <section className="py-8 md:py-14 bg-white">
          <div className="max-w-7xl mx-auto px-4 sm:px-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-14">
              {/* Left - Image Gallery */}
              <div className="lg:sticky lg:top-20 self-start">
                {/* Breadcrumb */}
                <nav className="flex items-center gap-1 text-sm text-gray-text mb-6">
                  <Link to="/" className="hover:text-maroon transition-colors">
                    Home
                  </Link>
                  <ChevronRight size={14} />
                  <Link
                    to={generateShopAllUrl({
                      jewelryTypeSlug: product.jewelryType?.name.toLowerCase(),
                    })}
                    className="hover:text-maroon transition-colors"
                  >
                    {product.jewelryType?.name}
                  </Link>
                  <ChevronRight size={14} />
                  <span className="text-charcoal font-medium truncate">
                    {product.name}
                  </span>
                </nav>
                {/* Main image frame */}
                <div className="rounded-3xl bg-[#666666] relative mb-3 overflow-hidden">
                  {/* Decorative curves on gray frame */}
                  <div className="absolute top-0 left-0 right-0 flex z-10 pointer-events-none">
                    <img src="/Vector.png" alt="" className="ml-16 sm:ml-20" />
                  </div>
                  <div className="absolute bottom-0 left-0 right-0 flex justify-end z-10 pointer-events-none">
                    <img src="/Vector.png" alt="" className="rotate-180 mr-16 sm:mr-20" />
                  </div>

                  {/* Product image inside the frame */}
                  <div className="aspect-[5/4] rounded-2xl overflow-hidden relative bg-white">
                    {selectedImage ? (
                      selectedImage.endsWith(".mp4") ? (
                        <video
                          src={selectedImage}
                          autoPlay
                          loop
                          muted
                          playsInline
                          className="absolute inset-0 w-full h-full object-cover"
                          alt={product.name}
                          fetchPriority="high"
                        />
                      ) : (
                        <img
                          onClick={() => {
                            setCarouselStartIndex(
                              currentVariant?.productVariantImage?.findIndex(
                                (img) => img.imageUrl === selectedImage
                              ) || 0
                            );
                            setIsCarouselOpen(true);
                          }}
                          src={selectedImage}
                          alt={product.name}
                          loading="eager"
                          fetchPriority="high"
                          className="cursor-zoom-in absolute inset-0 w-full h-full object-cover"
                        />
                      )
                    ) : (
                      <div className="absolute inset-0 w-full h-full bg-gray-100 flex items-center justify-center">
                        <span className="text-gray-text">No Image available</span>
                      </div>
                    )}
                  </div>

                </div>

                {/* Thumbnails row - slider */}
                <div className="relative">
                  <div
                    ref={thumbRef}
                    className="flex gap-3 overflow-x-auto scrollbar-hide scroll-smooth"
                  >
                    {currentVariant?.productVariantImage?.map((img, i) => (
                      <div
                        key={i}
                        onClick={() => setSelectedImage(img.imageUrl)}
                        className={`rounded-2xl bg-[#666666] shrink-0 cursor-pointer transition-all ${
                          selectedImage === img.imageUrl
                            ? "ring-2 ring-gold"
                            : "hover:ring-2 hover:ring-gold/50"
                        }`}
                        style={{ width: "calc((100% - 0.75rem * 3) / 4)" }}
                      >
                        <div className="aspect-square rounded-xl overflow-hidden bg-white">
                          {img.imageUrl.endsWith(".mp4") ? (
                            <video
                              src={img.imageUrl}
                              muted
                              playsInline
                              className="w-full h-full object-cover mix-blend-multiply"
                            />
                          ) : (
                            <img
                              src={img.imageUrl}
                              alt={`Thumbnail ${i + 1}`}
                              loading="eager"
                              className="w-full h-full object-cover"
                            />
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                  <button
                    onClick={() =>
                      thumbRef.current?.scrollBy({
                        left: -thumbRef.current.offsetWidth,
                        behavior: "smooth",
                      })
                    }
                    className="absolute -left-4 top-1/2 -translate-y-1/2 w-8 h-8 rounded-full border border-gray-200 bg-white flex items-center justify-center shadow-sm hover:bg-gray-50 z-10"
                  >
                    <ArrowLeft size={16} className="text-gray-400" />
                  </button>
                  <button
                    onClick={() =>
                      thumbRef.current?.scrollBy({
                        left: thumbRef.current.offsetWidth,
                        behavior: "smooth",
                      })
                    }
                    className="absolute -right-4 top-1/2 -translate-y-1/2 w-8 h-8 rounded-full border border-gray-200 bg-white flex items-center justify-center shadow-sm hover:bg-gray-50 z-10"
                  >
                    <ArrowRight size={16} className="text-gray-400" />
                  </button>
                </div>
              </div>

              {/* Right - Product Info */}
              <div className="flex flex-col">
                {/* Price + Action Icons Row */}
                <div className="flex items-start justify-between gap-3">
                  {/* Left: price + tax label */}
                  <div>
                    {currentVariant?.pricing ? (
                      <ProductPriceDisplay
                        pricing={currentVariant.pricing}
                        priceClassName="text-[20px]"
                      />
                    ) : (
                      <p className="text-maroon font-semibold text-[20px] leading-[18px] -tracking-[2%] line-through">
                        {displayPrice(currentVariant?.finalPrice)}
                      </p>
                    )}
                    <p className="text-xs text-gray-400 mt-0.5">MRP Incl. of all taxes</p>
                    {currentVariant?.unitType === "PAIR" && (
                      <span className="inline-block mt-1 text-[11px] font-medium text-maroon bg-maroon/10 rounded-full px-2 py-0.5 uppercase tracking-wide">
                        Sold as pair
                      </span>
                    )}
                  </div>

                  {/* Right: Share + Wishlist outline circles */}
                  <div className="flex items-center gap-2 mt-1 shrink-0">
                    <ShareButton
                      url={window.location.href}
                      title={product.name}
                      price={displayPrice(currentVariant?.finalPrice)}
                      variantTitle={currentVariant?.productVariantTitle}
                      position="static"
                      iconSize="small"
                      buttonClassName="w-8 h-8 rounded-full border border-gray-200 bg-gray-50 flex items-center justify-center shrink-0 hover:bg-gray-100 transition-all"
                    />
                    <button
                      onClick={handleWishlistToggle}
                      disabled={isProductLoading(currentVariant?.id)}
                      aria-label="Add to Wishlist"
                      className={`w-8 h-8 rounded-full border flex items-center justify-center shrink-0 transition-all ${
                        isInWishlist(currentVariant?.id)
                          ? "border-maroon bg-maroon"
                          : "border-gray-200 bg-gray-50 hover:bg-gray-100"
                      } ${isProductLoading(currentVariant?.id) ? "opacity-50 cursor-not-allowed" : ""}`}
                    >
                      {isProductLoading(currentVariant?.id) ? (
                        <span className="text-xs">...</span>
                      ) : (
                        <FiHeart
                          size={16}
                          className={isInWishlist(currentVariant?.id) ? "text-white" : "text-gray-500"}
                          fill={isInWishlist(currentVariant?.id) ? "white" : "none"}
                        />
                      )}
                    </button>
                  </div>
                </div>

                <div className="flex flex-row justify-between mt-2">
                  {/* Title */}
                <p className="text-[16px] tracking-[0%] leading-[18px] text-charcoal font-semibold mt-1">
                  {product.name}
                </p>

                {/* SKU — CODE: label */}
                <p className="text-xs font-bold text-charcoal mt-1">
                  <span className="text-gray-text font-normal">CODE- </span>{currentVariant?.sku}
                </p>
                </div>

                {/* Subtitle + Rating */}
                {/* <div className="flex flex-row flex-wrap items-center gap-2 sm:gap-3 mt-2">
                  <p className="text-[15px] font-semibold text-charcoal capitalize">
                    {(currentVariant.gemstoneVariant
                      ? currentVariant.productVariantTitle?.split(
                          " with " + currentVariant.gemstoneVariant.clarity
                        )[0]?.trim()
                      : currentVariant.productVariantTitle
                    )}{" "}
                    {currentVariant.metalVariant?.metalType?.name?.toLowerCase()}
                  </p>
                  <div className="w-px h-4 bg-gray-300" />
                  <StarRating rating={5} />
                </div> */}

                {/* Description */}
                {product.description && (
                  <div
                    dangerouslySetInnerHTML={{ __html: product.description }}
                    className="jodit-wysiwyg text-[12px] text-gray-text leading-[18px] tracking-[0%] mt-2 [&>*]:text-[12px]"
                  />
                )}

                  {/* Certification + Pincode row */}
                  <div
                    dangerouslySetInnerHTML={{ __html: "Check EOD by entering pin-code below" }}
                    className="jodit-wysiwyg text-[12px] text-gray-text leading-[18px] tracking-[0%] mt-2 [&>*]:text-[12px]"
                  />
                <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-4 mt-1 w-90">
                   
                  {gemstoneVariant?.certification && (
                    
                    <div className="flex items-center gap-3 shrink-0 justify-center sm:justify-start">
                    
                      <div className="flex flex-col items-center">
                        <img src="/diamond.svg" alt="" className="h-5 w-auto" />
                        <span className="text-xs font-semibold text-gold mt-0.5">
                          {gemstoneVariant.certification}
                        </span>
                      </div>
                      {gemstoneVariant.certificateUrl && (
                        <a
                          href={gemstoneVariant.certificateUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          download={`${gemstoneVariant.certification}_certificate.pdf`}
                          className="text-xs text-gold hover:text-gold-dark transition-colors"
                        >
                          Download
                        </a>
                      )}
                    </div>
                  )}
                  <div className="flex items-center gap-2 flex-1 border border-gray-300 rounded-full p-1">
                    <input
                      type="text"
                      value={pincode}
                      onChange={handlePincodeChange}
                      placeholder="Check pincode Availability"
                      maxLength={6}
                      className="px-4 py-2.5 text-xs flex-1 focus:outline-none focus:border-charcoal"
                    />
                    <RoundedPill text="Check" />
                  </div>
                </div>

{/* Trust badges */}
                <div className="flex justify-between gap-3 mt-5">
                  {trustBadges.map((badge) => (
                    <div key={badge.label} className="bg-gray-100 rounded-xl flex flex-col items-center justify-center text-center gap-2 flex-1 p-4 py-5 aspect-square">
                      <img
                        src={badge.icon}
                        alt={badge.label}
                        className="h-9 w-auto"
                        loading="lazy"
                      />
                      <span className="text-[10px] font-semibold text-charcoal leading-tight whitespace-pre-line">
                        {badge.label}
                      </span>
                    </div>
                  ))}
                </div>

                                {/* Diamond Type / Size / Screw selectors */}
                <div className="space-y-4 mt-4">
                  {currentVariant?.ScrewOption?.length > 0 ? (
                    <div className="flex items-center justify-between gap-4">
                      <label className="text-sm font-medium text-charcoal shrink-0">
                        Diamond Type
                      </label>
                      <select
                        aria-label="Screw Option selection"
                        value={selectedScrewOptionId}
                        onChange={(e) => setSelectedScrewOptionId(e.target.value)}
                        className="border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-gold transition-colors bg-white text-charcoal max-w-[200px]"
                      >
                        <option value="">Select</option>
                        {currentVariant?.ScrewOption.map((screw) => (
                          <option key={screw.id} value={screw.id}>
                            {screw.screwType} ({screw.screwMaterial})
                          </option>
                        ))}
                      </select>
                    </div>
                  ) : currentVariant?.isFreeSize ? (
                    <div className="flex items-center gap-3">
                      <div className="w-9 h-9 rounded-full border-2 border-maroon flex items-center justify-center flex-shrink-0">
                        <Ruler size={18} className="text-maroon" />
                      </div>
                      <span className="font-medium text-sm text-charcoal">Size</span>
                      <span className="inline-flex items-center border border-gray-300 rounded-full px-4 py-1.5 text-sm text-gray-text bg-gray-50">
                        One Size Fits All
                      </span>
                    </div>
                  ) : currentVariant?.productSize?.length > 0 ? (
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <div className="w-9 h-9 rounded-full border-2 border-maroon flex items-center justify-center flex-shrink-0">
                          <Ruler size={18} className="text-maroon" />
                        </div>
                        <span className="font-medium text-sm text-charcoal">Size</span>
                        <div ref={sizeDropdownRef} className="relative">
                          <button
                            onClick={() => setSizeDropdownOpen(!sizeDropdownOpen)}
                            aria-label={`${product.jewelryType?.name} Size selection`}
                            className="flex items-center gap-2 border border-gray-300 rounded-full px-4 py-1.5 text-sm hover:border-maroon transition-colors bg-white"
                          >
                            <span>
                              {selectedProductSizeId
                                ? (() => {
                                    const s = currentVariant.productSize.find(
                                      (s) => String(s.id) === String(selectedProductSizeId)
                                    );
                                    if (!s) return "Select";
                                    const isBangle = product.jewelryType?.name.toLowerCase() === "bangles";
                                    return `${s.label || s.labelSize}${isBangle ? "" : formatSizeUnit(s.unit)}${s.circumference ? ` - ${s.circumference}` : ""}`;
                                  })()
                                : "Select"}
                            </span>
                            <ChevronDown size={14} className={`transition-transform ${sizeDropdownOpen ? "rotate-180" : ""}`} />
                          </button>
                          {sizeDropdownOpen && (
                            <div className="absolute top-full left-0 mt-1 bg-white border border-gray-200 rounded-lg shadow-lg z-20 max-h-48 overflow-y-auto min-w-[140px]">
                              {currentVariant.productSize.map((size) => {
                                const isBangle = product.jewelryType?.name.toLowerCase() === "bangles";
                                return (
                                  <button
                                    key={size.id}
                                    onClick={() => { setSelectedProductSizeId(size.id); setSizeDropdownOpen(false); }}
                                    className={`w-full text-left px-4 py-2 text-sm hover:bg-cream transition-colors ${String(selectedProductSizeId) === String(size.id) ? "bg-cream font-medium text-maroon" : "text-charcoal"}`}
                                  >
                                    {size.label || size.labelSize}{" "}
                                    {isBangle ? "" : formatSizeUnit(size.unit)}
                                    {size.circumference ? ` - ${size.circumference}` : ""}{" "}
                                    {isBangle ? formatSizeUnit(size.unit) : ""}
                                  </button>
                                );
                              })}
                            </div>
                          )}
                        </div>
                      </div>
                      {product.jewelryType?.name.toLowerCase() !== "earrings" &&
                        product.jewelryType?.jewelryTypeSlug.toLowerCase() !== "mens-collection" && (
                          <Link
                            to={`/${product.jewelryType?.name.toLowerCase().replace(/\s+/g, "-")}-size-chart`}
                            className="text-maroon text-sm underline hover:opacity-80 transition-opacity"
                          >
                            Size Chart
                          </Link>
                        )}
                    </div>
                  ) : null}

                  {/* Chain Style - Pendants only */}
                  {hasPendant && (
                    <div>
                      <label className="mb-2 capitalize font-medium flex justify-between items-center text-sm text-charcoal">
                        Select Chain Style
                        <a
                          href="/home/Chain_Styles.pdf"
                          download="Chain_Styles.pdf"
                          className="text-gold text-xs hover:text-gold-dark transition-colors"
                          title="Download Chain Style Design PDF"
                          aria-label="Download Chain Style Design PDF"
                        >
                          View Chain Designs
                        </a>
                      </label>
                      <select
                        aria-label="Chain Style selection"
                        value={selectedChainStyle}
                        onChange={(e) => setSelectedChainStyle(e.target.value)}
                        className="w-full border border-gray-200 rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:border-gold transition-colors bg-white text-charcoal"
                      >
                        <option value="">Select Chain Style</option>
                        <option value="Singapore">Singapore</option>
                        <option value="Box">Box</option>
                        <option value="Round rolo">Round rolo</option>
                        <option value="Oval rolo">Oval rolo</option>
                        <option value="Dia-cut rolo">Dia-cut rolo</option>
                        <option value="Flat open wheat">Flat open wheat</option>
                        <option value="Hammer">Hammer</option>
                      </select>
                    </div>
                  )}

                  {/* Engraving */}
                  {/* <div>
                    <label className="block mb-2 font-medium text-sm text-charcoal">Engrave a Name</label>
                    <input
                      type="text"
                      placeholder="Enter name (up to 8 characters)"
                      className="w-full border border-gray-200 rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:border-gold transition-colors bg-white text-charcoal"
                      value={nameOnJewelry}
                      onChange={(e) => { if (e.target.value.length <= 8) setNameOnJewelry(e.target.value); }}
                      maxLength={8}
                    />
                    {nameOnJewelry.length > 0 && (
                      <p className="text-xs mt-1.5 text-gray-text">
                        {nameOnJewelry.length}/8 characters
                        {nameOnJewelry.length === 8 && <span className="text-red-500 ml-1">(Maximum limit reached)</span>}
                      </p>
                    )}
                  </div> */}

                  {/* Remark */}
                  {/* <div>
                    <label className="block mb-2 font-medium text-sm text-charcoal">Special Notes for Artisans</label>
                    <textarea
                      placeholder="Enter any special instructions or preferences (Optional)"
                      className="w-full border border-gray-200 rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:border-gold transition-colors bg-white text-charcoal resize-none"
                      rows="3"
                      value={remark}
                      onChange={(e) => setRemark(e.target.value)}
                    />
                  </div> */}
                </div>

                {/* Offers For You */}
                <div className="mt-4 rounded-xl overflow-hidden">
                  <div className="flex items-center justify-between w-full px-4 py-3 bg-white">
                    <span className="text-sm font-semibold text-charcoal">
                      Offers For You{" "}
                      <span className="text-xs text-gray-text font-normal">
                        (can be applied at checkout)
                      </span>
                    </span>
                  </div>
                  <div className="">
                    <div className="flex bg-gray-100 rounded-lg items-start gap-3 px-4 py-3">
                      <div className="w-5 h-5  flex items-center justify-center shrink-0 mt-0.5">
                        <img src="/discount-icon.svg" alt="" />
                      </div>
                      <p className="text-xs text-charcoal">
                        Get 20% off on at least 3rd item Jewellery.
                      </p>
                    </div>
                    <div className="flex items-start gap-3 px-4 py-3 bg-gray-100 rounded-lg mt-2 ">
                      <div className="w-5 h-5 flex items-center justify-center shrink-0 mt-0.5">
                        <img src="/discount-icon.svg" alt="" />
                      </div>
                      <p className="text-xs text-charcoal">
                        Get 15% off on purchase of 2 or more products.
                      </p>
                    </div>
                  </div>
                </div>

                {/* Gift card promo */}
                <div className="flex items-center gap-2 text-xs text-gold-light mt-2 px-1">
                  <img src="/gift-icon.svg" alt="Gift Icon" />
                  <span className="text-maroon">Add free personalized gift card to your order</span>
                  <img src="/pensil-icon.svg" alt="pensil Icon" />
                </div>

                {/* Promotional Banner */}
                {currentVariant?.GlobalDiscount && (
                  <div className="mt-4 rounded-xl bg-maroon text-white relative overflow-hidden py-4 min-h-[80px]">
                    {/* Bottom-left diamond */}
                    <img
                      src="/home/shiny-diamond.svg"
                      alt=""
                      aria-hidden="true"
                      className="absolute -left-8 -bottom-8 h-28 w-28 pointer-events-none select-none"
                    />
                    {/* Top-right-center diamond */}
                    {/* <img
                      src="/home/shiny-diamond.svg"
                      alt=""
                      aria-hidden="true"
                      className="absolute -top-7 left-[58%] h-24 w-24 pointer-events-none select-none"
                    /> */}
                    {/* Bottom-right diamond */}
                    {/* <img
                      src="/home/shiny-diamond.svg"
                      alt=""
                      aria-hidden="true"
                      className="absolute -right-8 -bottom-8 h-28 w-28 pointer-events-none select-none"
                    /> */}

                    {/* Layout: left label | center-right discount */}
                    <div className="relative z-10 flex items-center px-8 gap-4 h-full">
                      <p className="text-sm font-bold whitespace-nowrap shrink-0">
                        Clearance Sale
                      </p>

                      <div className="flex-1 text-center">
                        <p className="text-[26px] font-extrabold italic text-[#f5c842] leading-tight">
                          flat{" "}
                          {currentVariant.GlobalDiscount.discountType === "FIXED"
                            ? `${getCurrencySymbol(currency)}${currentVariant.GlobalDiscount.discountValue}`
                            : `${currentVariant.GlobalDiscount.discountValue}%`}{" "}
                          off
                        </p>
                        {currentVariant.GlobalDiscount.discountLabel && (
                          <p className="text-[9px] uppercase tracking-[0.2em] text-white font-medium mt-0.5">
                            {currentVariant.GlobalDiscount.discountLabel}
                          </p>
                        )}
                      </div>
                    </div>
                  </div>
                )}

                {/* Product Discount Banners — auto-rotating carousel, one at a time */}
                {variantCoupons.length > 0 && (
                  <div className="mt-4">
                    <Swiper
                      modules={[Autoplay, Pagination]}
                      autoplay={{ delay: 3500, disableOnInteraction: false }}
                      pagination={{ clickable: true }}
                      loop={variantCoupons.length > 1}
                      slidesPerView={1}
                      spaceBetween={0}
                      className="coupon-swiper"
                    >
                      {variantCoupons.map((coupon) => {
                        const base = currentVariant?.finalPrice || 0;
                        const discountAmount =
                          coupon.discountType === "PERCENTAGE"
                            ? Math.min(
                                Math.round((base * coupon.discountValue) / 100),
                                coupon.maxDiscountCap || Infinity
                              )
                            : Math.min(coupon.discountValue, base);
                        const afterDiscount = Math.max(0, base - discountAmount);
                        return (
                          <SwiperSlide key={coupon.id}>
                            <div className="rounded-xl bg-maroon text-white relative overflow-hidden py-4 min-h-[80px] mb-8">
                              <img
                                src="/home/shiny-diamond.svg"
                                alt=""
                                aria-hidden="true"
                                className="absolute -left-8 -bottom-8 h-28 w-28 pointer-events-none select-none"
                              />
                              <img
                                src="/home/featured/image.svg"
                                alt=""
                                aria-hidden="true"
                                className="absolute -right-8 -bottom-10 h-28 w-28 pointer-events-none select-none rotate-270"
                              />

                              <div className="relative z-10 flex items-center px-8 gap-4 h-full justify-center">
                                <p className="text-sm font-bold whitespace-nowrap shrink-0">
                                  Clearance Sale
                                </p>
                                <div className="flex-1 text-center">
                                  <p className="text-[26px] font-extrabold text-[#f5c842] leading-tight">
                                    flat{" "}
                                    {coupon.discountType === "FIXED"
                                      ? `${getCurrencySymbol(currency)}${coupon.discountValue}`
                                      : `${coupon.discountValue}%`}{" "}
                                    off
                                  </p>
                                  <p className="text-[9px] uppercase tracking-[0.2em] text-white font-medium mt-0.5">
                                    {coupon.name}
                                  </p>
                                  <p className="text-[9px] text-white/80 mt-0.5">
                                    After discount:{" "}
                                    <span className="font-semibold">{displayPrice(afterDiscount)}</span>
                                  </p>
                                </div>
                              </div>
                            </div>
                          </SwiperSlide>
                        );
                      })}
                    </Swiper>
                  </div>
                )}

                {/* Action Buttons — Row A: Add to Cart + Buy Now */}
                {/* <div className="flex items-center gap-2.5 mt-5">
                  <div
                    className={`flex-1 ${
                      isInCart ||
                      addLoading ||
                      (currentVariant?.stock !== undefined && currentVariant.stock <= 0)
                        ? "pointer-events-none opacity-60"
                        : ""
                    }`}
                  >
                    <Button
                      text={
                        addLoading
                          ? "Adding..."
                          : isInCart
                          ? "Added to Cart"
                          : currentVariant?.stock <= 0
                          ? "Out of Stock"
                          : "Add to Cart"
                      }
                      onClick={handleAddToCart}
                      className="w-full"
                    />
                  </div>
                  <div className={`flex-1 ${buyNowLoading ? "pointer-events-none opacity-60" : ""}`}>
                    <Button
                      text={buyNowLoading ? "Processing..." : "Buy Now"}
                      bgColor="#1a1a1a"
                      accentColor="#444444"
                      onClick={handleBuyNow}
                      className="w-full"
                    />
                  </div>
                </div> */}

                {/* Action Buttons — Row B: Call Us + WhatsApp + Wishlist */}
                <div className="flex items-center gap-2.5 mt-2.5">
                  <div className="flex-1">
                    <Button
                      onClick={() => window.open("tel:+910000000000")}
                      className="w-full "
                      text="Call Us"
                    >
                      Call Us
                    </Button>
                  </div>
                  <div className="flex-1">
                    <Button
                      text="Whatsapp Now"
                      bgColor="#00b242"
                      accentColor="#67e395"
                      onClick={handleWhatsAppNow}
                      className="w-full"
                    />
                  </div>
                </div>

                {/* Quantity stepper (compact) */}
                {/* <div className="flex items-center gap-2 mt-3">
                  <span className="text-xs text-gray-text">Qty:</span>
                  <div className="inline-flex items-center border border-gray-300 rounded-3xl overflow-hidden">
                    <button
                      onClick={() => setQuantity((q) => Math.max(1, q - 1))}
                      className="w-8 h-8 flex items-center justify-center hover:bg-gray-100 border-r border-gray-300"
                    >
                      <Minus className="w-3 h-3" />
                    </button>
                    <span className="w-8 text-center text-xs font-semibold">
                      {quantity}
                    </span>
                    <button
                      onClick={() => setQuantity((q) => q + 1)}
                      className="w-8 h-8 flex items-center justify-center hover:bg-gray-100 border-l border-gray-300"
                    >
                      <Plus className="w-3 h-3" />
                    </button>
                  </div>
                </div> */}

                {/* Metal Variant Circles (hidden metalVariants filtered out server-side via isVisible) */}
                <div className="bg-gray-100 rounded-2xl mt-6 flex justify-around items-center px-4 py-4">
                  {product.groupedVariants
                    .filter((group) => group.metalVariant?.isVisible !== false)
                    .map((group) => (
                    <button
                      key={group.metalVariant.id}
                      onClick={() => handleMetalVariantChange(group.metalVariant)}
                      className="flex flex-col items-center gap-2"
                    >
                      <div
                        className={`w-14 h-14 rounded-full flex items-center justify-center relative overflow-hidden transition-all ${getMetalStyle(
                          group.metalVariant.metalType
                        )} ${
                          selectedMetalVariant?.id === group.metalVariant.id
                            ? "ring-2 ring-maroon ring-offset-2"
                            : ""
                        }`}
                      >
                        <img
                          src={`/metal-color-plate/${
                            group.metalVariant.metalType?.name?.toLowerCase().includes("rose")
                              ? "rose-gold"
                              : group.metalVariant.metalType?.name?.toLowerCase().includes("silver")
                              ? "silver"
                              : "gold"
                          }.svg`}
                          alt={group.metalVariant.metalType?.name}
                          className="absolute inset-0 w-full h-full object-cover"
                        />
                        <span className="relative text-sm font-bold text-charcoal z-10">
                          {group.metalVariant.purityLabel}
                        </span>
                      </div>
                      <span className="text-[10px] text-gray-text">
                        {group.metalVariant.metalType?.name}
                      </span>
                    </button>
                  ))}
                </div>

                {/* Color Selection — swatches for Silver, dropdown for Gold / Enamel */}
                <ColorSelector
                  metalType={selectedMetalVariant?.metalType}
                  isEnamel={currentVariant?.isEnamel === true}
                  colors={currentGroup?.colors || []}
                  selectedColor={selectedColor}
                  onChange={handleColorChange}
                  purityLabel={selectedMetalVariant?.purityLabel}
                />



              

                {/* Pincode status messages */}
                {isCheckingServiceability && (
                  <p className="text-xs text-gold mt-1.5">Checking serviceability for {pincode}...</p>
                )}
                {serviceabilityError && (
                  <>
                    <p className="text-xs text-red-600 mt-1.5">{serviceabilityError}</p>
                    <p className="text-xs text-gray-text mt-1 leading-relaxed">
                      Contact us at{" "}
                      <a href="mailto:support@diamantra.com" className="text-charcoal hover:underline">
                        support@diamantra.com
                      </a>{" "}
                      for alternative arrangements.
                    </p>
                  </>
                )}
                {isServiceable && !isCheckingServiceability && (
                  <p className="text-xs text-green-600 mt-1.5 flex items-center gap-1">
                    &#10003; Delivery available to {pincode}
                  </p>
                )}

                {/* Jewelry Details — tabbed */}
                <div className="border-t border-gray-100 pt-6 mt-4">
                <h2 className="font-heading text-2xl md:text-3xl text-charcoal italic leading-tight mb-4">
                  Jewelry Details
                </h2>
                <div className="flex border-b border-gray-200 mb-5">
                  <button
                    onClick={() => setActiveJewelryTab("material")}
                    className={`px-5 py-2.5 text-sm font-medium transition-colors border-b-2 -mb-px ${
                      activeJewelryTab === "material"
                        ? "border-maroon text-maroon"
                        : "border-transparent text-gray-text hover:text-charcoal"
                    }`}
                  >
                    Know your Material
                  </button>
                  <button
                    onClick={() => setActiveJewelryTab("care")}
                    className={`px-5 py-2.5 text-sm font-medium transition-colors border-b-2 -mb-px ${
                      activeJewelryTab === "care"
                        ? "border-maroon text-maroon"
                        : "border-transparent text-gray-text hover:text-charcoal"
                    }`}
                  >
                    Jewelry Care
                  </button>
                </div>

                {activeJewelryTab === "material" && (
                  <div className="space-y-4">
                    {product.description && (
                      <div
                        dangerouslySetInnerHTML={{ __html: product.description }}
                        className="jodit-wysiwyg text-sm text-gray-text leading-relaxed [&>*]:text-sm"
                      />
                    )}
                    {/* <div className="grid grid-cols-2 md:grid-cols-4 gap-px bg-gray-200 rounded-xl overflow-hidden mt-4">
                      <div className="px-4 py-3 bg-white">
                        <span className="text-xs text-gray-text block">SKU</span>
                        <span className="text-sm font-medium text-charcoal">{currentVariant?.sku}</span>
                      </div>
                      {product.productStyle?.length > 0 && (
                        <div className="px-4 py-3 bg-cream">
                          <span className="text-xs text-gray-text block">Style</span>
                          <span className="text-sm font-medium text-charcoal">
                            {product.productStyle.map((s) => s.name).join(", ")}
                          </span>
                        </div>
                      )}
                      <div className="px-4 py-3 bg-white">
                        <span className="text-xs text-gray-text block">Gross Weight</span>
                        <span className="text-sm font-medium text-charcoal">{currentVariant?.grossWeight} Grams</span>
                      </div>
                      {product.collection?.length > 0 && (
                        <div className="px-4 py-3 bg-cream">
                          <span className="text-xs text-gray-text block">Collection</span>
                          <span className="text-sm font-medium text-charcoal capitalize">
                            {product.collection.map((c) => c.name.toLowerCase()).join(", ")}
                          </span>
                        </div>
                      )}
                      <div className="px-4 py-3 bg-cream">
                        <span className="text-xs text-gray-text block">Net Metal Weight</span>
                        <span className="text-sm font-medium text-charcoal">{currentVariant?.metalWeightInGram} Grams</span>
                      </div>
                      <div className="px-4 py-3 bg-white">
                        <span className="text-xs text-gray-text block">Metal Type &amp; Color</span>
                        <span className="text-sm font-medium text-charcoal">
                          {metalVariant?.purityLabel} {metalVariant?.metalType?.name} - {selectedColor?.color}
                        </span>
                      </div>
                    </div> */}
                    {/* {product.note && (
                      <div className="mt-4 p-4 bg-cream rounded-xl">
                        <span className="text-xs font-semibold text-charcoal">NOTE:</span>
                        <div
                          dangerouslySetInnerHTML={{ __html: product.note.content }}
                          className="jodit-wysiwyg text-xs mt-1 text-gray-text [&>*]:text-xs"
                        />
                      </div>
                    )} */}
                    {currentVariant?.note && (
                      <div className="mt-2 p-4 bg-cream rounded-xl">
                        <span className="text-xs font-semibold text-charcoal">NOTE:</span>
                        <div
                          dangerouslySetInnerHTML={{ __html: currentVariant.note }}
                          className="jodit-wysiwyg text-xs mt-1 text-gray-text [&>*]:text-xs"
                        />
                      </div>
                    )}
                  </div>
                )}

                {activeJewelryTab === "care" && (
                  <div className="text-sm text-gray-text leading-relaxed space-y-3">
                    {product.returnPolicy && (
                      <div
                        dangerouslySetInnerHTML={{ __html: product.returnPolicy.content }}
                        className="jodit-wysiwyg text-sm [&>*]:text-sm text-gray-text"
                      />
                    )}
                    {currentVariant?.returnPolicyText && (
                      <div>
                        <h3 className="text-sm font-medium mb-2 text-charcoal">Return Policy</h3>
                        <div
                          dangerouslySetInnerHTML={{ __html: currentVariant.returnPolicyText }}
                          className="jodit-wysiwyg text-sm [&>*]:text-sm text-gray-text"
                        />
                      </div>
                    )}
                    {!product.returnPolicy && !currentVariant?.returnPolicyText && (
                      <p>
                        Store your jewellery in a cool, dry place away from direct sunlight. Avoid
                        contact with perfumes, lotions, and chemicals. Clean gently with a soft cloth
                        after each wear.
                      </p>
                    )}
                  </div>
                )}
                </div>
                {/* Product Details */}
                <div className="border-t border-gray-100 pt-6 mt-4">
                <h2 className="font-heading text-2xl md:text-3xl text-charcoal italic leading-tight mb-4">
                  Product Details
                </h2>
                <div className="divide-y divide-gray-200">
                  <div className="grid grid-cols-2 py-4">
                    <span className="text-sm text-gray-text">Size</span>
                    <span className="text-sm font-semibold text-charcoal text-right">
                      {currentVariant?.isFreeSize
                        ? "One Size Fits All"
                        : currentVariant?.productSize?.[0]?.labelSize ||
                          currentVariant?.productSize?.[0]?.label ||
                          "—"}
                    </span>
                  </div>
                  <div className="grid grid-cols-2 py-4">
                    <span className="text-sm text-gray-text">
                      {getMetalWeightLabel(metalVariant?.metalType)}
                    </span>
                    <span className="text-sm font-semibold text-charcoal text-right">
                      {currentVariant?.metalWeightInGram} gms
                    </span>
                  </div>
                  <div className="grid grid-cols-2 py-4">
                    <span className="text-sm text-gray-text">Gross Weight</span>
                    <span className="text-sm font-semibold text-charcoal text-right">{currentVariant?.grossWeight} gms</span>
                  </div>
                  <div className="grid grid-cols-2 py-4">
                    <span className="text-sm text-gray-text">SKU</span>
                    <span className="text-sm font-semibold text-charcoal text-right">{currentVariant?.sku}</span>
                  </div>
                  {product.productStyle?.length > 0 && (
                    <div className="grid grid-cols-2 py-4">
                      <span className="text-sm text-gray-text">Style</span>
                      <span className="text-sm font-semibold text-charcoal text-right">
                        {product.productStyle.map((s) => s.name).join(", ")}
                      </span>
                    </div>
                  )}
                  <div className="grid grid-cols-2 py-4">
                    <span className="text-sm text-gray-text">Metal</span>
                    <span className="text-sm font-semibold text-charcoal text-right">
                      {metalVariant?.purityLabel} {metalVariant?.metalType?.name}
                      {selectedColor?.color && selectedColor.color !== "__no_color__"
                        ? ` - ${selectedColor.color}` : ""}
                    </span>
                  </div>
                </div>
                </div>
                {/* Diamond Details */}
                {(gemstoneVariant || currentVariant?.diamondShape || currentVariant?.gemstoneWeightInCarat) && (
                <div className="border-t border-gray-100 pt-6 mt-4">
                  <h2 className="font-heading text-2xl md:text-3xl text-charcoal italic leading-tight mb-4">
                    Diamond Details
                  </h2>
                  <div className="divide-y divide-dashed divide-gray-200">
                    {[
                      { label: "Diamond Shape", value: currentVariant?.diamondShape || gemstoneVariant?.shape },
                      { label: "Diamond Weight", value: currentVariant?.gemstoneWeightInCarat ? `${currentVariant.gemstoneWeightInCarat}CT` : null },
                      { label: "Total Diamond Weight", value: ((currentVariant?.gemstoneWeightInCarat || 0) + (currentVariant?.sideDiamondWeight || 0)) > 0 ? `${((currentVariant?.gemstoneWeightInCarat || 0) + (currentVariant?.sideDiamondWeight || 0)).toFixed(3)}CT` : null },
                      { label: "Diamond Color", value: currentVariant?.diamondColor || gemstoneVariant?.color },
                      { label: "Diamond Clarity", value: currentVariant?.diamondClarity || gemstoneVariant?.clarity },
                      { label: "Country of Origin", value: currentVariant?.countryOfOrigin || gemstoneVariant?.countryOfOrigin || "India" },
                      { label: "Diamond Type", value: (currentVariant?.diamondType || gemstoneVariant?.origin) ? `${(currentVariant?.diamondType || gemstoneVariant?.origin)?.toLowerCase().replace(/_/g, " ")} Diamond` : null },
                    ].filter(({ value }) => value).map(({ label, value }) => (
                      <div key={label} className="grid grid-cols-2 py-4">
                        <span className="text-sm text-gray-text">{label}</span>
                        <span className="text-sm font-bold text-charcoal text-right capitalize">{value}</span>
                      </div>
                    ))}
                    {gemstoneVariant?.certification && (
                      <div className="grid grid-cols-2 py-4">
                        <span className="text-sm text-gray-text">Certification</span>
                        <div className="flex items-center justify-end gap-2">
                          <span className="text-sm font-bold text-charcoal">{gemstoneVariant.certification}</span>
                          {gemstoneVariant?.certificateUrl && (
                            <a
                              href={gemstoneVariant.certificateUrl}
                              target="_blank"
                              rel="noopener noreferrer"
                              download={`${gemstoneVariant.certification}_certificate.pdf`}
                              className="text-xs text-gold hover:text-gold-dark transition-colors"
                            >
                              Download
                            </a>
                          )}
                        </div>
                      </div>
                    )}
                  </div>
                </div>
                )}

                {/* Price Breakup */}
                <div className="border-t border-gray-100 pt-6 mt-4">
                <h2 className="font-heading text-2xl md:text-3xl text-charcoal italic leading-tight mb-4">
                  Price Breakup
                </h2>
                <div className="divide-y divide-gray-200">
                  <div className="grid grid-cols-2 py-4">
                    <span className="text-sm text-gray-text">Cost</span>
                    <div className="text-right">
                      {currentVariant?.previousPrice &&
                        parseFloat(currentVariant.previousPrice) > (currentVariant?.finalPrice || 0) && (
                        <span className="text-md text-gray-400 line-through block">
                          {convertPrice(parseFloat(currentVariant.previousPrice)).toLocaleString("en-IN")}
                        </span>
                      )}
                      {/* <span className="text-sm font-semibold text-charcoal">
                        {convertPrice(totalSP).toLocaleString("en-IN")}
                      </span> */}
                    </div>
                  </div>
                  {currentVariant?.gst > 0 && (
                    <div className="grid grid-cols-2 py-4">
                      <span className="text-sm text-gray-text">GST</span>
                      <span className="text-sm font-semibold text-charcoal text-right">{gstPercentage}%</span>
                    </div>
                  )}
                  <div className="grid grid-cols-2 py-4 font-semibold">
                    <span className="text-charcoal">Total  Price</span>
                    <span className="text-maroon text-right">
                      {convertPrice(currentVariant?.finalPrice).toLocaleString("en-IN")}
                    </span>
                  </div>
                </div>
                </div>
                {/* What Makes It Shine */}
                <div className="border-t border-gray-100 pt-6 mt-4 flex-col items-center">
                  <h2 className="font-heading text-2xl md:text-3xl text-charcoal text-center mb-4">
                    What Makes It Shine
                  </h2>
                  <div className="flex justify-center relative">
                    <div
                      className="absolute bottom-0 left-1/2 -translate-x-1/2 w-[30%] h-[26%] z-10"
                      style={{ backgroundColor: "#005a34" }}
                    />
                    <img src="/what-make-shine.svg" alt="" />
                  </div>
                  {/* <div className="rounded-2xl overflow-hidden" style={{ backgroundColor: "#1a4a35" }}>
                    <div className="text-center px-6 pt-5 pb-3">
                      <p className="text-white text-sm leading-snug">
                        A comparison of{" "}
                        <span className="font-bold">LAB GROWN &amp; NATURAL DIAMOND</span>{" "}
                        prices:
                      </p>
                      <p className="text-white/70 text-xs mt-1">
                        Reveals some exciting differences in pricing
                      </p>
                    </div>
                    <div className="flex items-end justify-center px-6 pb-6">
                      <div className="flex flex-col items-center gap-2 flex-1">
                        <div className="w-32 h-32 rounded-full overflow-hidden border-4 border-white/20 shadow-lg">
                          <img src="/home/diamond.png" alt="Natural Diamond" className="w-full h-full object-cover" />
                        </div>
                        <span className="text-white text-[10px] font-bold tracking-widest uppercase">Natural Diamond</span>
                      </div>
                      <div className="flex-shrink-0 w-11 h-11 rounded-full bg-white flex items-center justify-center shadow-md mb-7">
                        <span className="text-base font-bold" style={{ color: "#1a4a35" }}>₹</span>
                      </div>
                      <div className="flex flex-col items-center gap-2 flex-1">
                        <div className="w-32 h-32 rounded-full overflow-hidden border-4 border-white/20 shadow-lg">
                          <img src="/home/Labgrown.png" alt="Lab Grown Diamond" className="w-full h-full object-cover" />
                        </div>
                        <span className="text-white text-[10px] font-bold tracking-widest uppercase">Lab Grown Diamond</span>
                      </div>
                    </div>
                  </div> */}
                </div>
              </div>
            </div>
          </div>
        </section>

                {/* Similar Designs */}
        {product?.relatedSuggestion?.length > 0 && (
        <section className="py-10 md:py-14 bg-white">
          <div className="max-w-7xl mx-auto px-4 sm:px-6">
            <div className="flex items-center gap-3 mb-4">
              <h2 className="font-heading text-3xl md:text-4xl text-charcoal italic leading-tight">
                Similar Designs
              </h2>
              <ArrowLeft size={28} className="text-charcoal shrink-0" />
            </div>
            <RelatedSuggestions product={product.relatedSuggestion} />
          </div>
        </section>
        )}

        {/* Instagram Journey */}
        <InstaJourney />

        {/* Customer Reviews */}
        <ReviewCard variantId={currentVariant?.id} />

        {/* Recently Viewed */}
        <section className="py-10 md:py-14 bg-white">
          <div className="max-w-7xl mx-auto px-4 sm:px-6">
            <RecentlyViewed />
          </div>
        </section>
        
        <NewsletterCTA />

        {/* Cart Drawer */}
        {isCartOpen && (
          <div className="fixed inset-0 bg-black/50 bg-opacity-50 z-50">
            <div className="fixed top-0 right-0 h-full w-full md:w-md xl:w-xl bg-white shadow-xl transform translate-x-0 transition-transform duration-300 ease-in-out z-50">
              <Cart onClose={() => setIsCartOpen(false)} />
            </div>
          </div>
        )}
      </main>

      {/* Image Carousel Modal */}
      {isCarouselOpen && currentVariant?.productVariantImage && (
        <ImageCarouselModal
          images={currentVariant.productVariantImage.map(
            (img) => img.imageUrl
          )}
          initialIndex={carouselStartIndex}
          onClose={() => setIsCarouselOpen(false)}
        />
      )}

      {/* Sticky Bottom Action Bar */}
      {product && currentVariant && (
        <div className="fixed bottom-0 left-0 right-0 z-40 bg-[#1a1a1a] px-4 py-3">
          <div className="max-w-7xl mx-auto flex items-center gap-4">
            {/* Name + Price */}
            <div className="flex-1 min-w-0">
              <p className="text-sm text-white font-medium truncate">{product.name}</p>
              <p className="text-base font-bold text-gold leading-tight">
                {displayPrice((currentVariant?.pricing?.discountedPrice ?? currentVariant?.finalPrice) * quantity)}
              </p>
            </div>

            {/* Quantity Stepper */}
            <div className="shrink-0 inline-flex items-center border border-white/30 rounded-3xl overflow-hidden">
              <button
                onClick={() => setQuantity((q) => Math.max(1, q - 1))}
                className="w-8 h-10 flex items-center justify-center hover:bg-white/10 border-r border-white/30"
              >
                <Minus className="w-3 h-3 text-white" />
              </button>
              <span className="w-8 text-center text-xs font-semibold text-white">{quantity}</span>
              <button
                onClick={() => setQuantity((q) => q + 1)}
                className="w-8 h-8 flex items-center justify-center hover:bg-white/10 border-l border-white/30"
              >
                <Plus className="w-3 h-3 text-white" />
              </button>
            </div>

            {/* Add to Cart */}
            <div className={`shrink-0 w-36 ${isInCart || addLoading || currentVariant?.stock <= 0 ? "pointer-events-none opacity-60" : ""}`}>
              <Button
                text={addLoading ? "Adding..." : isInCart ? "Added to Cart" : currentVariant?.stock <= 0 ? "Out of Stock" : "Add to Cart"}
                onClick={handleAddToCart}
                className="w-full"
              />
            </div>

            {/* Buy Now */}
            <div className={`shrink-0 w-36 border-2 border-[#d98e04] rounded-full ${buyNowLoading ? "pointer-events-none opacity-60" : ""}`}>
              <Button
                text={buyNowLoading ? "Processing..." : "Buy Now"}
                bgColor="#1a1a1a"
                accentColor="#676767"
                onClick={handleBuyNow}
                className="w-full"
              />
            </div>
          </div>
        </div>
      )}
    </>
  );
}
