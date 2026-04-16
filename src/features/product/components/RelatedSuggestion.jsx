import React from "react";
import ListProductCard from "./ListProductCard";

const RelatedSuggestions = React.memo(({ product }) => {
  if (!product || !Array.isArray(product) || product.length === 0) {
    return null;
  }

  return (
    <div className="relative overflow-hidden">
      <div className="flex overflow-x-auto scrollbar-hide gap-6 py-2 w-full">
        {product.map((item, idx) => (
          <div
            key={idx}
            className="flex-shrink-0 w-[45vw] sm:w-[30vw] md:w-[22vw] lg:w-[18vw]"
          >
            <ListProductCard product={item} />
          </div>
        ))}
      </div>
    </div>
  );
});

export default RelatedSuggestions;
