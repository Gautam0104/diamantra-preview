import { useState } from "react";

function FilterSection({ title, children }) {
  return (
    <div>
      {/* Title with red left accent */}
      <div className="flex flex-row items-center gap-2 mb-3">
        <div className="w-0.5 h-5 bg-maroon rounded-full" />
        <h3 className="font-heading text-[18px] leading-none tracking-[0%] text-charcoal whitespace-nowrap">
          {title}
        </h3>
        {/* Divider line */}
        <div className="flex-1 h-px bg-gray-200" />
      </div>

      {children}
    </div>
  );
}

function Checkbox({ label, count, checked, onChange }) {
  return (
    <div
      className="flex items-center gap-2.5 py-1 cursor-pointer group"
      onClick={onChange}
      role="checkbox"
      aria-checked={checked}
    >
      <div
        className={`w-3.75 h-3.75 rounded-[3px] border-[1.5px] flex items-center justify-center shrink-0 transition-colors ${
          checked
            ? "bg-maroon border-maroon"
            : "border-gray-300 group-hover:border-gray-400"
        }`}
      >
        {checked && (
          <svg width="9" height="7" viewBox="0 0 9 7" fill="none">
            <path
              d="M1 3.5L3.25 5.75L8 1"
              stroke="white"
              strokeWidth="1.5"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        )}
      </div>
      <span
        className={`text-[13px] leading-none select-none capitalize ${
          checked ? "text-maroon" : "text-charcoal"
        }`}
      >
        {label}
        {count !== undefined && count > 0 && (
          <span className="text-gray-400">({count})</span>
        )}
      </span>
    </div>
  );
}

export default function FilterSidebar({
  filterDisplayData = [],
  filters = {},
  handleFilterMultipleChangeHook,
  handleFilterChangeHook,
}) {
  const SHOW_LIMIT = 5;
  const [showMoreMap, setShowMoreMap] = useState({});

  const toggleShowMore = (idx) => {
    setShowMoreMap((prev) => ({ ...prev, [idx]: !prev[idx] }));
  };

  const handleCheckboxChange = (filter, option, isChecked) => {
    if (option.individualSlugs) {
      // Group toggle: add/remove all individualSlugs at once
      const currentSlugs = Array.isArray(filters[filter.title])
        ? filters[filter.title]
        : [];
      const allSelected = option.individualSlugs.every((s) =>
        currentSlugs.includes(s)
      );
      handleFilterChangeHook({
        target: {
          name: filter.title,
          value: allSelected
            ? currentSlugs.filter((s) => !option.individualSlugs.includes(s))
            : [...new Set([...currentSlugs, ...option.individualSlugs])],
        },
      });
    } else if (filter.isRadio) {
      // Single-select: toggle off if same slug, replace if different
      handleFilterChangeHook({
        target: {
          name: filter.title,
          value: isChecked ? "" : option.slug,
        },
      });
    } else {
      handleFilterMultipleChangeHook({
        target: {
          name: filter.title,
          value: option.slug,
          checked: !isChecked,
          type: "checkbox",
        },
      });
    }
  };

  return (
    <aside className="w-full space-y-6">
      {filterDisplayData.map((filter, idx) => {
        if (!filter.options || filter.options.length === 0) return null;

        const showAll = showMoreMap[idx] ?? false;
        const visibleOptions = showAll
          ? filter.options
          : filter.options.slice(0, SHOW_LIMIT);

        return (
          <FilterSection key={idx} title={filter.displayTitle}>
            <div className="space-y-0">
              {visibleOptions.map((option, i) => {
                const isChecked = option.individualSlugs
                  ? option.individualSlugs.some((slug) =>
                      filters[filter.title]?.includes(slug)
                    )
                  : filter.isRadio
                  ? filters[filter.title] === option.slug
                  : filters[filter.title]?.includes(option.slug);

                return (
                  <Checkbox
                    key={`${option.slug}-${i}`}
                    label={option.label}
                    count={option.count}
                    checked={!!isChecked}
                    onChange={() => handleCheckboxChange(filter, option, isChecked)}
                  />
                );
              })}

              {filter.options.length > SHOW_LIMIT && (
                <button
                  onClick={() => toggleShowMore(idx)}
                  className="text-charcoal text-xs underline underline-offset-2 mt-2 ml-6"
                >
                  {showAll ? "Show Less" : "Show More"}
                </button>
              )}
            </div>
          </FilterSection>
        );
      })}
    </aside>
  );
}
