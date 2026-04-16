import { createRoot } from "react-dom/client";
import "./index.css";
import App from "./App.jsx";
import { BrowserRouter } from "react-router-dom";
import { Toaster } from "sonner";
import { AuthContextProvider } from "@/shared/context/Auth.jsx";
import { ThemeProvider } from "@/shared/context/ThemeContext.jsx";
import { CurrencyProvider } from "@/shared/context/CurrencyContext.jsx";
import { CartProvider } from "@/shared/context/CartContext.jsx";
import { WishlistProvider } from "@/shared/context/WishlistContext.jsx";
import ErrorBoundary from "@/shared/components/common/ErrorBoundary/ErrorBoundary.jsx";

createRoot(document.getElementById("root")).render(
  <BrowserRouter>
    <ErrorBoundary>
      <AuthContextProvider>
        <ThemeProvider>
          <CurrencyProvider>
            <WishlistProvider>
              <CartProvider>
                <Toaster
                  position="top-right"
                  richColors
                  closeButton
                  toastOptions={{
                    style: { fontFamily: "Inter, sans-serif" },
                  }}
                />
                <App />
              </CartProvider>
            </WishlistProvider>
          </CurrencyProvider>
        </ThemeProvider>
      </AuthContextProvider>
    </ErrorBoundary>
  </BrowserRouter>
);
