import { Heart } from 'lucide-react';

const formatPrice = (price) =>
  new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR', maximumFractionDigits: 0 }).format(price);

export default function ProductCard({ product }) {
  if (!product) return null;

  return (
    <div className="group cursor-pointer">
      {/* Image placeholder */}
      <div className="relative aspect-square bg-[#c4c4c4] rounded-lg overflow-hidden">
        {/* Badge */}
        {product.badge && (
          <span className="absolute top-3 left-3 bg-gold text-white text-xs font-semibold px-2.5 py-1 rounded z-10">
            {product.badge}
          </span>
        )}
        {/* Heart icon */}
        <button className="absolute top-3 right-3 p-1.5 bg-white/80 rounded-full hover:bg-white transition-colors z-10">
          <Heart
            size={18}
            className={product.wishlisted ? 'fill-red-500 text-red-500' : 'text-gray-500'}
          />
        </button>
      </div>

      {/* Info */}
      <div className="mt-3 space-y-1">
        <h3 className="text-sm font-medium text-charcoal truncate group-hover:text-maroon transition-colors">
          {product.name}
        </h3>
        <p className="text-base font-semibold text-charcoal">{formatPrice(product.price)}</p>
        <p className="text-xs text-gray-text">
          {product.material} {product.weight && `· ${product.weight}`}
        </p>
      </div>
    </div>
  );
}
