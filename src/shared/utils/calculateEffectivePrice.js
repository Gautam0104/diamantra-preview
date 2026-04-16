/**
 * Computes the effective display pricing for a ProductVariant.
 *
 * Priority:
 *  1. previousPrice + active GlobalDiscount → previousPrice is the strikethrough (originalPrice),
 *     GlobalDiscount is applied to sellingPrice (pre-GST), GST re-applied → discountedPrice
 *  2. previousPrice only (no active GlobalDiscount) → previousPrice as original, finalPrice as selling
 *  3. GlobalDiscount only (no previousPrice) → discount on SP (pre-GST), GST re-applied
 *  4. Neither → no discount
 *
 * @param {object} variant - ProductVariant with GlobalDiscount relation included
 * @param {object} [options={}] - Optional overrides for component prices
 * @param {number} [options.makingCharge] - Override variant.makingChargePrice
 * @param {number} [options.diamondPrice] - Override variant.diamondPrice
 * @param {number} [options.metalPrice] - Override variant.metalPrice
 * @param {number} [options.gstRate] - Override variant.gst
 * @returns {{
 *   originalPrice: number,
 *   discountedPrice: number | null,
 *   discountLabel: string | null,
 *   hasDiscount: boolean,
 *   discountPercent: number | null
 * }}
 */
export function calculateEffectivePrice(variant, options = {}) {
  const finalPrice = parseFloat(variant.finalPrice ?? variant.sellingPrice ?? 0);
  const gstRate = options.gstRate ?? (parseFloat(variant.gst) || 0);
  const rawSP = parseFloat(variant.sellingPrice) || 0;
  // Fall back to back-calculating SP from finalPrice when sellingPrice is not stored
  const sp = rawSP > 0 ? rawSP : (gstRate > 0 ? finalPrice / (1 + gstRate / 100) : finalPrice);
  const goldPrice = options.metalPrice ?? (parseFloat(variant.metalPrice) || 0);
  const makingCharge = options.makingCharge ?? (parseFloat(variant.makingChargePrice) || 0);
  const diamondCharges = options.diamondPrice ?? (parseFloat(variant.diamondPrice) || 0);

  const prevPrice = variant.previousPrice ? parseFloat(variant.previousPrice) : null;

  const d = variant.GlobalDiscount;
  const now = new Date();
  const discountActive =
    d?.isActive &&
    (!d.validFrom || new Date(d.validFrom) <= now) &&
    (!d.validTo || new Date(d.validTo) >= now) &&
    !d.isQuantityBased;

  /**
   * Applies an active GlobalDiscount to the pre-GST selling price components,
   * then re-adds GST. Returns the final rounded discounted price.
   */
  function applyDiscountToSP() {
    const target = d.discountTarget ?? "TOTAL";

    if (target === "TOTAL") {
      const discountedSP =
        d.discountType === "PERCENTAGE"
          ? sp * (1 - d.discountValue / 100)
          : sp - d.discountValue;
      return Math.max(0, Math.round(Math.max(0, discountedSP) * (1 + gstRate / 100)));
    }

    // MAKING_CHARGE or DIAMOND_PRICE targeting
    const hasComponentData = goldPrice > 0 || makingCharge > 0 || diamondCharges > 0;
    if (!hasComponentData) {
      // Fall back to total-SP discount when no component breakdown is available
      const discountedSP =
        d.discountType === "PERCENTAGE"
          ? sp * (1 - d.discountValue / 100)
          : sp - d.discountValue;
      return Math.max(0, Math.round(Math.max(0, discountedSP) * (1 + gstRate / 100)));
    }

    const targetValue = target === "MAKING_CHARGE" ? makingCharge : diamondCharges;
    let discountedComponent =
      d.discountType === "PERCENTAGE"
        ? targetValue * (1 - d.discountValue / 100)
        : targetValue - d.discountValue;
    discountedComponent = Math.max(0, discountedComponent);

    const newTotalSP =
      target === "MAKING_CHARGE"
        ? goldPrice + discountedComponent + diamondCharges
        : goldPrice + makingCharge + discountedComponent;

    return Math.max(0, Math.round(newTotalSP * (1 + gstRate / 100)));
  }

  // Case 1: compareAtPrice + GlobalDiscount
  // previousPrice is the strikethrough; discount is applied to the current selling price.
  if (prevPrice && prevPrice > finalPrice && discountActive) {
    const discountedPrice = applyDiscountToSP();
    const discountPercent =
      prevPrice > 0
        ? Math.round(((prevPrice - discountedPrice) / prevPrice) * 100)
        : 0;
    return {
      originalPrice: prevPrice,
      discountedPrice,
      discountLabel: d.discountLabel ?? d.title ?? null,
      hasDiscount: discountedPrice < prevPrice,
      discountPercent: discountedPrice < prevPrice ? discountPercent : null,
    };
  }

  // Case 2: compareAtPrice only (no active GlobalDiscount)
  if (prevPrice && prevPrice > finalPrice) {
    const discountPercent =
      prevPrice > 0 ? Math.round(((prevPrice - finalPrice) / prevPrice) * 100) : 0;
    return {
      originalPrice: prevPrice,
      discountedPrice: finalPrice,
      discountLabel: null,
      hasDiscount: true,
      discountPercent,
    };
  }

  // Case 3: GlobalDiscount only — apply to SP (pre-GST), re-add GST
  if (discountActive) {
    const discountedPrice = applyDiscountToSP();
    const discountPercent =
      finalPrice > 0
        ? Math.round(((finalPrice - discountedPrice) / finalPrice) * 100 * 10) / 10
        : 0;
    return {
      originalPrice: finalPrice,
      discountedPrice,
      discountLabel: d.discountLabel ?? d.title ?? null,
      hasDiscount: discountedPrice < finalPrice,
      discountPercent: discountedPrice < finalPrice ? discountPercent : null,
    };
  }

  // Case 4: no discount
  return {
    originalPrice: finalPrice,
    discountedPrice: null,
    discountLabel: null,
    hasDiscount: false,
    discountPercent: null,
  };
}
