import { useContext } from "react";
import { CurrencyContext } from "@/shared/context/CurrencyContext";

/**
 * Renders the effective price for a product variant.
 *
 * Props:
 *  - pricing: output of calculateEffectivePrice() — shape:
 *      { originalPrice, discountedPrice, discountLabel, hasDiscount, discountPercent }
 *  - priceClassName: extra Tailwind classes for the main price text
 */
export default function ProductPriceDisplay({ pricing, priceClassName = "", fractionDigits = 2 }) {
  const { convertPrice, currency, getCurrencySymbol } = useContext(CurrencyContext);

  if (!pricing) return null;

  const symbol = getCurrencySymbol(currency);
  const fmt = (val) =>
    convertPrice(val).toLocaleString("en-IN", {
      minimumFractionDigits: fractionDigits,
      maximumFractionDigits: fractionDigits,
    });

  if (!pricing.hasDiscount) {
    return (
      <p className={`text-maroon font-bold ${priceClassName}`}>
        {symbol}
        {fmt(pricing.originalPrice)}
      </p>
    );
  }

  return (
    <div className="flex flex-wrap items-baseline gap-x-2 gap-y-1">
      {/* Main selling price */}
      <span className={`text-maroon font-semibold text-[20px] leading-[18px] -tracking-[2%] ${priceClassName}`}>
        {symbol}
        {fmt(pricing.discountedPrice)}
      </span>

      {/* Strikethrough original price */}
      <span className="text-[10px] leading-[18px] -tracking-[2%] text-charcoal font-semibold line-through">
        {symbol}
        {fmt(pricing.originalPrice)}
      </span>

      {/* (X% OFF) in gold */}
      {pricing.discountPercent > 0 && (
        <span className="text-[16px] font-bold text-[#B8860B] leading-[16px] tracking-[0%]">
          ({pricing.discountPercent}% OFF)
        </span>
      )}
    </div>
  );
}
