import React, { createContext, useContext, useEffect, useState } from "react";
import { toast } from "sonner";

const CartContext = createContext();
const STORAGE_KEY = "guestCart";

const loadCart = () => {
  if (typeof window === "undefined") return { items: [], count: 0, total: 0 };
  try {
    return JSON.parse(localStorage.getItem(STORAGE_KEY)) || { items: [], count: 0, total: 0 };
  } catch {
    return { items: [], count: 0, total: 0 };
  }
};

const recompute = (items) => ({
  items,
  count: items.reduce((s, i) => s + i.quantity, 0),
  total: items.reduce((s, i) => s + i.priceAtAddition, 0),
});

export const CartProvider = ({ children }) => {
  const [guestCart, setGuestCart] = useState(loadCart);
  const [addLoading, setAddLoading] = useState(false);
  const [buyNowLoading, setBuyNowLoading] = useState(false);

  useEffect(() => {
    if (typeof window !== "undefined") {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(guestCart));
    }
  }, [guestCart]);

  const addToCart = async (
    productVariantId,
    optionId,
    quantity = 1,
    optionType,
    chainStyle = null,
    nameOnJewelry = null,
    remark = null,
    variantSnapshot = null
  ) => {
    setAddLoading(true);
    await new Promise((r) => setTimeout(r, 250));
    setGuestCart((prev) => {
      const existingIdx = prev.items.findIndex(
        (i) => i.productVariantId === productVariantId && i.optionId === optionId
      );
      let items;
      const unitPrice = variantSnapshot?.finalPrice || 0;
      if (existingIdx >= 0) {
        items = [...prev.items];
        const newQty = items[existingIdx].quantity + quantity;
        items[existingIdx] = {
          ...items[existingIdx],
          quantity: newQty,
          priceAtAddition: unitPrice * newQty,
        };
      } else {
        items = [
          ...prev.items,
          {
            id: `guest-${Date.now()}`,
            productVariantId,
            optionId,
            optionType,
            chainStyle,
            nameOnJewelry,
            remark,
            quantity,
            priceAtAddition: unitPrice * quantity,
            productVariant: variantSnapshot,
            optionDetails: null,
          },
        ];
      }
      return recompute(items);
    });
    setAddLoading(false);
    toast.success("Item added to cart");
    return { success: true };
  };

  const updateItemQuantity = async (cartItemId, action) => {
    setGuestCart((prev) => {
      const items = prev.items.map((i) => {
        if (i.id !== cartItemId) return i;
        const newQty = action === "increment" ? i.quantity + 1 : Math.max(1, i.quantity - 1);
        const unit = i.productVariant?.finalPrice || 0;
        return { ...i, quantity: newQty, priceAtAddition: unit * newQty };
      });
      return recompute(items);
    });
    return { success: true };
  };

  const removeFromCart = async (cartItemId) => {
    setGuestCart((prev) => recompute(prev.items.filter((i) => i.id !== cartItemId)));
    toast.success("Item removed from cart");
    return { success: true };
  };

  const isItemInCart = (productVariantId, optionId = null) =>
    guestCart.items.some(
      (i) => i.productVariantId === productVariantId && (!optionId || i.optionId === optionId)
    );

  const buyNow = async (...args) => {
    setBuyNowLoading(true);
    const result = await addToCart(...args);
    setBuyNowLoading(false);
    toast.info("Checkout is disabled in preview mode");
    return result;
  };

  const value = {
    cartData: {
      cart: { id: "guest-cart", cartItems: guestCart.items },
      cartSummery: { cartItemsCount: guestCart.count, grandTotal: guestCart.total },
    },
    cartCount: guestCart.count,
    loading: false,
    guestCart,
    addLoading,
    buyNowLoading,
    setCartData: () => {},
    setCartCount: () => {},
    addToCart,
    updateItemQuantity,
    removeFromCart,
    fetchCart: () => {},
    isItemInCart,
    buyNow,
    isGuest: true,
  };

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
};

export const useCart = () => {
  const ctx = useContext(CartContext);
  if (!ctx) throw new Error("useCart must be used within a CartProvider");
  return ctx;
};
