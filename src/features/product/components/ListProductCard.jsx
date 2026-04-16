import { useContext } from "react";
import { Link } from "react-router-dom";
import { Heart } from "lucide-react";
import { CurrencyContext } from "@/shared/context/CurrencyContext";
import { Swiper, SwiperSlide } from "swiper/react";
import { Pagination, Autoplay } from "swiper/modules";
import "swiper/css";
import "swiper/css/pagination";
import ProductPriceDisplay from "@/shared/components/ProductPriceDisplay";

export default function ListProductCard({ product, onWishlistClick, isWishlisted, isWishlistLoading }) {
  const { convertPrice, currency, getCurrencySymbol } = useContext(CurrencyContext);

  if (!product) return null;

  const displayTitle = product.productVariantTitle
    ?.split(" with " + product?.gemstoneVariant?.clarity)?.[0]
    ?.trim();

  const productName = product.products?.name || null;

  const discount = product.GlobalDiscount;
  const discountLabel =
    product.pricing?.discountLabel || discount?.discountLabel;

  // Build ribbon text from discount data when no explicit label is set
  let badgeText = discountLabel;
  if (!badgeText && discount?.isActive && discount?.discountValue) {
    const targetMap = {
      MAKING_CHARGE: "Making Charge",
      DIAMOND_PRICE: "Diamond Price",
      TOTAL: "",
    };
    const target = targetMap[discount.discountTarget] ?? "";
    const valueText =
      discount.discountType === "PERCENTAGE"
        ? `${discount.discountValue}% off`
        : `₹${discount.discountValue} off`;
    badgeText = target ? `${valueText} on ${target}` : valueText;
  }
  if (!badgeText && product.pricing?.hasDiscount && product.pricing?.discountPercent) {
    badgeText = `${product.pricing.discountPercent}% Off`;
  }
  if (!badgeText && product.isNewArrival) {
    badgeText = "New Arrival";
  }

  return (
    <Link
      to={`/shop-all/details/${product.productVariantSlug}`}
      className="group cursor-pointer flex flex-col"
    >
      {/* Image area wrapper */}
      <div className="relative">
        {/* Card with border and rounded corners */}
        <div className="border-2 border-gray-border rounded-2xl overflow-hidden ">
          {/* Heart / wishlist icon - top left */}
          <button
            className="absolute top-3 left-3 w-8 h-8 rounded-full border border-black  flex items-center justify-center z-20"
            onClick={(e) => {
              e.preventDefault();
              e.stopPropagation();
              onWishlistClick?.(e, product.id);
            }}
          >
            {isWishlistLoading ? (
              <div className="w-3 h-3 border-2 border-dashed border-maroon border-t-transparent rounded-full animate-spin" />
            ) : isWishlisted ? (
              <Heart size={14} className="text-maroon fill-maroon" />
            ) : (
              <Heart size={14} className="text-black" />
            )}
          </button>

          {/* Product image */}
          <div className="aspect-5/4 bg-white flex items-center justify-center">
            {product.productVariantImage?.length > 0 ? (
              <Swiper
                loop={true}
                pagination={{ clickable: true, dynamicBullets: true }}
                autoplay={{ delay: 3000, disableOnInteraction: false, pauseOnMouseEnter: true }}
                modules={[Pagination, Autoplay]}
                className="w-full h-full"
              >
                {product.productVariantImage.map((image, index) => (
                  <SwiperSlide key={`${image.imageUrl}-${index}`}>
                    {image.imageUrl.endsWith(".mp4") ? (
                      <video
                        src={image.imageUrl}
                        autoPlay
                        loop
                        muted
                        playsInline
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <img
                        src={image.imageUrl}
                        alt={`${displayTitle} - ${index + 1}`}
                        className="w-full h-full object-cover"
                        loading="lazy"
                      />
                    )}
                  </SwiperSlide>
                ))}
              </Swiper>
            ) : (
              <span className="text-gray-400 font-semibold text-sm">No Image</span>
            )}
          </div>
        </div>

        {/* Gold ribbon tag */}
        {badgeText && (
          <div className="absolute top-3 -right-1.5 z-10 flex flex-col items-end">
            <div
              className="bg-linear-to-r from-gold to-gold-light text-white text-[10px] font-semibold py-2 pl-5 pr-2.5 tracking-wide whitespace-nowrap"
              style={{
                clipPath: "polygon(8% 50%, 0% 0%, 100% 0%, 100% 100%, 0% 100%)",
              }}
            >
              {badgeText}
            </div>
            <div
              className="w-1.5 h-0 mr-0"
              style={{
                borderLeft: "6px solid #92400e",
                borderBottom: "5px solid transparent",
              }}
            />
          </div>
        )}
      </div>

      {/* Product info - below card */}
      <div className="pt-2.5 px-1">
        {productName && (
          <h3 className="font-heading text-[24px] font-normal text-charcoal leading-tight italic">
            {productName}
          </h3>
        )}
        <p className="text-[14px] text-gray-text leading-tight">
          {displayTitle}
        </p>
        <div className="mt-1">
          {product.pricing ? (
            <ProductPriceDisplay pricing={product.pricing} priceClassName="text-[22px]" fractionDigits={0} />
          ) : (
            <p className="text-maroon font-bold text-[22px]">
              {getCurrencySymbol(currency)}
              {convertPrice(product.finalPrice).toLocaleString("en-IN", {
                minimumFractionDigits: 0,
                maximumFractionDigits: 0,
              })}
            </p>
          )}
        </div>
      </div>
    </Link>
  );
}
