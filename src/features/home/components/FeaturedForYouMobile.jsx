import { useState } from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation } from "swiper/modules";
import "swiper/css";
import "swiper/css/navigation";
import { ArrowLeft, ArrowRight, Flame, Heart, ShoppingCart } from "lucide-react";
import Button from "../ui/Button";
import OptimizedImage from "@shared/components/OptimizedImage";

const formatPrice = (price) =>
  new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    maximumFractionDigits: 0,
  }).format(price);

const STATIC_PRODUCTS = [
  {
    id: "s1",
    name: "Twilight Studs – Glow Muse",
    description: "Handcrafted 925 Silver studs with round lab-grown solitaire diamonds.",
    price: 28213,
    originalPrice: null,
    badge: null,
    wishlisted: true,
    image: "/home/featured/image.svg",
    slug: "twilight-studs-glow-muse",
  },
  {
    id: "s2",
    name: "Celestial Arc – Orbit Glow Hoops",
    description: "Half-moon silver hoops with pavé-set diamonds; radiant everyday shine.",
    price: 7828,
    originalPrice: 8828,
    badge: "Just Dropped",
    wishlisted: true,
    image: "/home/featured/image.svg",
    slug: "celestial-arc-orbit-glow-hoops",
  },
  {
    id: "s3",
    name: "Sparkling Occasions – Midnight Whisper Drops",
    description: "Dangling earrings with a mix of round, pear, and oval stones for festive sparkle.",
    price: 27853,
    originalPrice: null,
    badge: null,
    wishlisted: false,
    image: "/home/featured/image.svg",
    slug: "sparkling-occasions-midnight-whisper-drops",
  },
  {
    id: "s4",
    name: "Twilight Studs – Luminous Grace",
    description: "Elegant emerald + pear-shaped stones with halo diamonds; timeless style.",
    price: 30088,
    originalPrice: 36088,
    badge: "Just Dropped",
    wishlisted: true,
    image: "/home/featured/image.svg",
    slug: "twilight-studs-luminous-grace",
  },
  {
    id: "s5",
    name: "Celestial Arc – Circle of Grace",
    description: "Geometric silver hoops with fine diamond detailing — sleek and minimal.",
    price: 6722,
    originalPrice: null,
    badge: "Trending",
    wishlisted: false,
    image: "/home/featured/image.svg",
    slug: "celestial-arc-circle-of-grace",
  },
  {
    id: "s6",
    name: "Twilight Studs – Dreamlight Radiance",
    description: "Graceful curved silver studs finished with a single round diamond.",
    price: 12146,
    originalPrice: null,
    badge: null,
    wishlisted: false,
    image: "/home/featured/image.svg",
    slug: "twilight-studs-dreamlight-radiance",
  },
];

function FeaturedProductCard({ product }) {
  const [imgSrc, setImgSrc] = useState( "/home/featured/image.svg");
  const isTrending = product.badge === "Trending";

  return (
    <div className="group cursor-pointer">
      {/* Image */}
      <div className="relative flex justify-center items-center aspect-square bg-[#f0f0f0] rounded-xl overflow-hidden">
        <OptimizedImage
          src={imgSrc}
          alt={product.name}
          sizes="(max-width: 640px) 50vw, 25vw"
          className="w-25 h-25 object-cover"
          width={300}
          height={300}
          onError={() => setImgSrc("/home/featured/image.svg")}
        />
        {product.badge && (
          <span
            className={`absolute top-2.5 left-2.5 text-xs font-semibold px-2 py-0.5 rounded z-10 ${
              isTrending
                ? "bg-[#FFD700] text-charcoal"
                : "bg-charcoal text-white"
            }`}
          >
            {isTrending ? "Trending 🔥" : product.badge}
          </span>
        )}
        <button className="absolute top-2.5 right-2.5 w-8 h-8 bg-white rounded-full flex items-center justify-center shadow-sm hover:scale-110 transition-transform z-10">
          <Heart
            size={16}
            className={
              product.wishlisted
                ? "fill-red-500 text-red-500"
                : "text-gray-400"
            }
          />
        </button>
      </div>

      {/* Info */}
      <div className="mt-3 space-y-1">
        <p className="text-sm font-semibold text-charcoal leading-tight line-clamp-1 group-hover:text-maroon transition-colors">
          {product.name}
        </p>
        {product.description && (
          <p className="text-xs text-gray-500 line-clamp-2 leading-snug">
            {product.description}
          </p>
        )}
        <div className="flex items-center gap-1.5 pt-0.5">
          {product.originalPrice && (
            <span className="text-xs text-gray-400 line-through">
              ₹{product.originalPrice.toLocaleString("en-IN")}
            </span>
          )}
          <span className="text-sm font-bold text-maroon">
            {formatPrice(product.price)}
          </span>
        </div>
        <button className="w-full mt-1 border border-gray-300 rounded-2xl py-2 text-xs font-semibold text-charcoal flex items-center justify-around gap-1.5 hover:bg-charcoal hover:text-white hover:border-charcoal transition-all uppercase tracking-wide">
          Add to Cart <ShoppingCart fill="#000" size={13} />
        </button>
      </div>
    </div>
  );
}

export default function FeaturedForYouMobile({ products = [] }) {
  // Normalize dynamic products to card shape
  const dynamicProducts = products.map((p) => ({
    id: p.id,
    name: p.productVariantTitle || p.name,
    description: p.description || p.shortDescription || "",
    price: p.finalPrice || p.price,
    originalPrice: p.compareAtPrice || p.originalPrice || null,
    badge: p.isNewArrival ? "Just Dropped" : (p.badge || null),
    wishlisted: p.wishlisted || false,
    image: p.productVariantImage?.[0]?.imageUrl || p.image || "/home/featured/image.svg",
    slug: p.productVariantSlug || p.slug,
  }));

  // Use dynamic data if available, otherwise fall back to static
  const displayProducts = dynamicProducts.length > 0 ? dynamicProducts : STATIC_PRODUCTS;

  return (
    <section className="py-8 md:py-12 bg-white">
      <div className="max-w-7xl mx-auto px-2  md:px-4">
        {/* Header */}
        <div className="flex flex-row items-start justify-between mb-8 md:mb-10">
          <div>
            {/* Title row */}
            <div className="flex items-center gap-2 mb-2">
              <h2 className="font-heading text-xl xs:text-2xl md:text-[33px] text-charcoal leading-[66px] -tracking-[2%]">
                Featured for you
              </h2>
          <div className="flex items-center shrink-0">
            <svg width="12" height="12" viewBox="0 0 10 10" fill="none" className="shrink-0">
              <polygon points="0,5 5,0 10,5 5,10" fill="#000000" />
            </svg>
            <div className="w-16 xs:w-10 sm:w-16 md:w-24">
              <img src="/home/why-diamantra/Line-right.svg" alt="" loading="lazy" className="w-full h-[2px]" />
            </div>
          </div>

            </div>
            {/* Subtitle */}
            <p className="text-[12px] text-gray-500 uppercase tracking-[12%] leading-[33px]">
              Handpicked sparkle from our{" "}
              <span className="font-bold text-maroon">Latest Drops</span>
              {" "}and{" "}
              <span className="font-bold text-maroon">Trending Picks.</span>
            </p>
          </div>

          {/* Nav arrows */}
          <div className="flex items-center gap-2 mt-3">
            <button className="featured-prev-mobile w-9 h-9 rounded-full border border-gray-300 flex items-center justify-center hover:border-charcoal transition-colors cursor-pointer">
              <ArrowLeft size={18} />
            </button>
            <button className="featured-next-mobile w-9 h-9 rounded-full border border-gray-300 flex items-center justify-center hover:border-charcoal transition-colors cursor-pointer">
              <ArrowRight size={18} />
            </button>
          </div>
        </div>

        {/* Product Slider */}
        <Swiper
          modules={[Navigation]}
          navigation={{ prevEl: ".featured-prev-mobile", nextEl: ".featured-next-mobile" }}
          spaceBetween={16}
          slidesPerView={2}
          breakpoints={{
            640: { slidesPerView: 3 },
            900: { slidesPerView: 4 },
            1100: { slidesPerView: 5 },
            1280: { slidesPerView: 6 },
          }}
        >
          {displayProducts.map((p) => (
            <SwiperSlide key={p.id}>
              <FeaturedProductCard product={p} />
            </SwiperSlide>
          ))}
        </Swiper>

        {/* Footer */}
        <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mt-10">
          <div className="flex items-center gap-2 text-sm text-gray-600">
            <Flame size={16} className="text-orange-500" />
            <span className="font-medium">23 people bought this this week.</span>
          </div>
          <Button className="py-3" text="More Products" />
        </div>
      </div>
    </section>
  );
}
