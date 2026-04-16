import React, { useContext, useEffect, useState } from "react";
import { AuthContext } from "@/shared/context/Auth";
import ListProductCard from "./ListProductCard";

const RecentlyViewed = React.memo(() => {
  const { recentlyViewed } = useContext(AuthContext);
  const [localRecentlyViewed, setLocalRecentlyViewed] = useState([]);

  useEffect(() => {
    const storedItems = JSON.parse(
      localStorage.getItem("recentlyViewed") || "[]"
    );
    setLocalRecentlyViewed(storedItems);
  }, []);

  const allRecentlyViewed = [...recentlyViewed, ...localRecentlyViewed]
    .filter(
      (product, index, self) =>
        index === self.findIndex((p) => p.id === product.id)
    )
    .slice(0, 8);

  if (allRecentlyViewed.length === 0) {
    return null;
  }

  return (
    <>
      <h2 className="font-heading text-3xl md:text-4xl text-charcoal italic leading-tight mb-4">
        Recently Viewed
      </h2>
      <div className="relative overflow-hidden">
        <div className="flex overflow-x-auto scrollbar-hide gap-6 py-2 w-full">
          {allRecentlyViewed.map((product, idx) => (
            <div
              key={idx}
              className="flex-shrink-0 w-[45vw] sm:w-[30vw] md:w-[22vw] lg:w-[18vw]"
            >
              <ListProductCard product={product} />
            </div>
          ))}
        </div>
      </div>
    </>
  );
});

export default RecentlyViewed;
