import React, { createContext, useContext, useEffect, useState } from "react";
import { toast } from "sonner";

const WishlistContext = createContext();
const STORAGE_KEY = "wishlist";

const loadWishlist = () => {
  if (typeof window === "undefined") return [];
  try {
    return JSON.parse(localStorage.getItem(STORAGE_KEY) || "[]");
  } catch {
    return [];
  }
};

export const WishlistProvider = ({ children }) => {
  const [wishlistItems, setWishlistItems] = useState(loadWishlist);
  const [addWishLoading, setAddWishLoading] = useState({});

  useEffect(() => {
    if (typeof window !== "undefined") {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(wishlistItems));
    }
  }, [wishlistItems]);

  const addToWishlist = async (productVariantId, variantSnapshot = null) => {
    setAddWishLoading((p) => ({ ...p, [productVariantId]: true }));
    await new Promise((r) => setTimeout(r, 200));
    setWishlistItems((prev) => {
      if (prev.some((i) => i.productVariantId === productVariantId)) return prev;
      return [
        ...prev,
        {
          id: `wl-${Date.now()}`,
          productVariantId,
          productVariant: variantSnapshot,
          createdAt: new Date().toISOString(),
        },
      ];
    });
    setAddWishLoading((p) => ({ ...p, [productVariantId]: false }));
    toast.success("Item added to wishlist");
    return { success: true };
  };

  const removeFromWishlist = async (itemId, productVariantId) => {
    setAddWishLoading((p) => ({ ...p, [productVariantId]: true }));
    await new Promise((r) => setTimeout(r, 200));
    setWishlistItems((prev) =>
      prev.filter((i) => i.id !== itemId && i.productVariantId !== productVariantId)
    );
    setAddWishLoading((p) => ({ ...p, [productVariantId]: false }));
    toast.success("Item removed from wishlist");
    return { success: true };
  };

  const removeFromWishlistForDetail = (itemId) =>
    setWishlistItems((prev) => prev.filter((i) => i.id !== itemId));

  const isInWishlist = (productVariantId) =>
    wishlistItems.some((i) => i.productVariantId === productVariantId);

  const isProductLoading = (productVariantId) => !!addWishLoading[productVariantId];

  return (
    <WishlistContext.Provider
      value={{
        wishlistItems,
        wishlistCount: wishlistItems.length,
        loading: false,
        addWishLoading,
        error: null,
        fetchWishlistItems: () => {},
        addToWishlist,
        removeFromWishlist,
        removeFromWishlistForDetail,
        isInWishlist,
        isProductLoading,
      }}
    >
      {children}
    </WishlistContext.Provider>
  );
};

export const useWishlist = () => {
  const ctx = useContext(WishlistContext);
  if (!ctx) throw new Error("useWishlist must be used within a WishlistProvider");
  return ctx;
};
