import { ChevronDown } from "lucide-react";
import { useEffect, useRef, useState } from "react";

/**
 * Reusable color selector that toggles between a visual color-plate (swatches)
 * and a dropdown based on the current metal type / category.
 *
 * Rule set per product spec:
 *   - Silver          → circular swatches (visual plate)
 *   - Gold OR Enamel  → dropdown
 *   - Otherwise       → swatches (same as silver)
 *
 * Colors with `isVisible === false` are filtered out before rendering.
 * Swatches prefer `color.hexCode` for fill; if absent, they fall back to the
 * existing `/metal-color-plate/{slug}.svg` asset (keeps pre-migration behavior).
 */
export default function ColorSelector({
  metalType,
  isEnamel = false,
  colors = [],
  selectedColor,
  onChange,
  purityLabel,
}) {
  const visibleColors = (colors || []).filter(
    (c) => c?.isVisible !== false && c?.color !== "__no_color__"
  );

  const metalName = (metalType?.name || "").toString().toUpperCase();
  const shouldUseDropdown = metalName === "GOLD" || isEnamel === true;

  const dropdownRef = useRef(null);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    if (!open) return undefined;
    function handleClickOutside(event) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [open]);

  if (visibleColors.length === 0) return null;
  if (visibleColors.length === 1 && visibleColors[0].color === "__no_color__") return null;

  if (shouldUseDropdown) {
    const current = selectedColor?.color || visibleColors[0]?.color;
    return (
      <div className="mt-4">
        <p className="text-sm font-medium text-charcoal mb-2">Metal Color</p>
        <div ref={dropdownRef} className="relative inline-block">
          <button
            type="button"
            onClick={() => setOpen((prev) => !prev)}
            className="flex items-center justify-between gap-3 min-w-[200px] border border-gray-300 rounded-full px-4 py-2 text-sm hover:border-maroon transition-colors bg-white text-charcoal"
          >
            <span className="capitalize">{current || "Select color"}</span>
            <ChevronDown
              size={14}
              className={`transition-transform ${open ? "rotate-180" : ""}`}
            />
          </button>
          {open && (
            <div className="absolute top-full left-0 mt-1 w-full bg-white border border-gray-200 rounded-lg shadow-lg z-20 max-h-60 overflow-y-auto">
              {visibleColors.map((colorOption) => (
                <button
                  key={colorOption.color}
                  type="button"
                  onClick={() => {
                    onChange?.(colorOption);
                    setOpen(false);
                  }}
                  className="w-full text-left px-4 py-2 text-sm capitalize hover:bg-cream transition-colors"
                >
                  {colorOption.color}
                </button>
              ))}
            </div>
          )}
        </div>
      </div>
    );
  }

  return (
    <div className="mt-4">
      <p className="text-sm font-medium text-charcoal mb-2">Metal Color</p>
      <div className="flex gap-3 flex-wrap">
        {visibleColors.map((colorOption) => {
          const isSelected = selectedColor?.color === colorOption.color;
          const swatchBg = colorOption.hexCode
            ? { backgroundColor: colorOption.hexCode }
            : undefined;
          const platePath = `/metal-color-plate/${(colorOption.color || "")
            .toString()
            .toLowerCase()
            .replace(/\s+/g, "-")}.svg`;
          return (
            <button
              key={colorOption.color}
              type="button"
              onClick={() => onChange?.(colorOption)}
              className="flex flex-col items-center gap-1"
            >
              <span
                className={`w-16 h-16 rounded-full border-2 transition-all overflow-hidden relative flex items-center justify-center ${
                  isSelected ? "border-gold scale-110" : "border-gray-200"
                }`}
                style={swatchBg}
              >
                {!colorOption.hexCode && (
                  <img
                    src={platePath}
                    alt={colorOption.color}
                    className="w-full h-full object-cover"
                    onError={(e) => {
                      e.currentTarget.style.display = "none";
                    }}
                  />
                )}
                {purityLabel && (
                  <span className="absolute inset-0 flex items-center justify-center text-sm font-bold text-charcoal">
                    {purityLabel}
                  </span>
                )}
              </span>
              <span className="text-xs text-gray-text capitalize">
                {colorOption.color}
              </span>
            </button>
          );
        })}
      </div>
    </div>
  );
}
