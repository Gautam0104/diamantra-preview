import { Heart, ShoppingCart } from "lucide-react";
import { Link } from "react-router-dom";
import ProductPriceDisplay from "@/shared/components/ProductPriceDisplay";
import OptimizedImage from "@shared/components/OptimizedImage";

const formatPrice = (price) =>
  new Intl.NumberFormat("en-IN", { style: "currency", currency: "INR", maximumFractionDigits: 0 }).format(price);

export default function ProductCard({ product }) {
  if (!product) return null;

  return (
    <Link to={`/shop-all/details/${product.slug || product.id}`} className="group cursor-pointer block">
      <div className="relative aspect-square bg-[#c4c4c4] rounded-lg overflow-hidden">
        {product.image && (
          <OptimizedImage
            src={product.image}
            alt={product.name}
            sizes="(max-width: 640px) 50vw, 25vw"
            className="w-full h-full object-cover"
            width={400}
            height={400}
          />
        )}
        {product.badge && (
          <span className="absolute top-3 left-3 bg-gold text-white text-xs font-semibold px-2.5 py-1 rounded z-10">
            {product.badge}
          </span>
        )}
        <button className="absolute top-3 right-3 p-1.5 bg-white/80 rounded-full hover:bg-white transition-colors z-10">
          <Heart size={18} className={product.wishlisted ? "fill-red-500 text-red-500" : "text-gray-500"} />
        </button>
      </div>
      <div className="mt-3 space-y-1" style={{ fontFamily: "var(--font-body-bp)" }}>
        <p className="text-sm font-semibold text-charcoal truncate group-hover:text-maroon transition-colors">
          {product.name}
        </p>
        <div className="flex items-center gap-2 mt-auto">
          {product.pricing ? (
            <ProductPriceDisplay pricing={product.pricing} priceClassName="text-sm" />
          ) : (
            <>
              {product.originalPrice && (
                <span className="text-xs text-maroon-light line-through">
                  &#8377;{product.originalPrice.toLocaleString("en-IN")}
                </span>
              )}
              <span className="text-sm font-bold text-maroon">
                {formatPrice(product.price)}
              </span>
            </>
          )}
        </div>
        <p className="text-xs text-gray-text">
          {product.material} {product.weight && `· ${product.weight}`}
        </p>

      <button className="w-full border border-gray-300 rounded-2xl py-2 text-xs font-semibold text-charcoal flex items-center justify-center gap-1.5 hover:border-charcoal transition-colors uppercase tracking-wide">
        Add to Cart <ShoppingCart size={13} />
      </button>
      </div>
    </Link>
  );
}
