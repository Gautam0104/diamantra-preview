import { Search, FileText } from "lucide-react";

export default function SearchSuggestionDropdown({
  suggestions,
  onSelect,
  highlightedIndex = -1,
}) {
  if (!suggestions.length) return null;

  return (
    <div className="absolute top-full left-0 right-0 z-50 mt-1 bg-white border border-gray-200 rounded-xl shadow-lg max-h-72 overflow-auto">
      {suggestions.map((suggestion, index) => (
        <button
          key={suggestion.id}
          type="button"
          onClick={() => onSelect(suggestion)}
          className={`flex items-center gap-3 w-full px-4 py-2.5 text-sm text-left transition-colors cursor-pointer ${
            index === highlightedIndex
              ? "bg-amber-50"
              : "hover:bg-gray-50"
          }`}
        >
          {suggestion.type === "product" ? (
            <Search size={14} className="text-maroon shrink-0" />
          ) : (
            <FileText size={14} className="text-gray-400 shrink-0" />
          )}
          <span
            className={
              suggestion.type === "product"
                ? "text-charcoal"
                : "text-gray-500"
            }
          >
            {suggestion.title}
          </span>
          {suggestion.type === "page" && (
            <span className="ml-auto text-xs text-gray-400">Page</span>
          )}
        </button>
      ))}
    </div>
  );
}
