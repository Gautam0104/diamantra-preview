import React, { createContext, useContext, useEffect, useState } from "react";

export const AuthContext = createContext(null);

const RECENTLY_VIEWED_KEY = "recentlyViewed";

const loadRecentlyViewed = () => {
  if (typeof window === "undefined") return [];
  try {
    return JSON.parse(localStorage.getItem(RECENTLY_VIEWED_KEY) || "[]");
  } catch {
    return [];
  }
};

export const AuthContextProvider = ({ children }) => {
  const [recentlyViewed, setRecentlyViewed] = useState(loadRecentlyViewed);

  useEffect(() => {
    if (typeof window !== "undefined") {
      localStorage.setItem(RECENTLY_VIEWED_KEY, JSON.stringify(recentlyViewed));
    }
  }, [recentlyViewed]);

  const addToRecentlyViewed = (product) => {
    if (!product?.id) return;
    setRecentlyViewed((prev) => {
      const filtered = prev.filter((p) => p.id !== product.id);
      return [product, ...filtered].slice(0, 8);
    });
  };

  const value = {
    user: null,
    isAuthenticated: false,
    loading: false,
    login: () => Promise.resolve({ success: false }),
    logout: () => Promise.resolve({ success: true }),
    setUser: () => {},
    recentlyViewed,
    addToRecentlyViewed,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuthContext = () => useContext(AuthContext) || {};
export default AuthContext;
