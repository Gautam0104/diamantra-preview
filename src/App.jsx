import { Suspense, lazy } from "react";
import { Routes, Route, Navigate, Outlet } from "react-router-dom";
import NavbarRouter from "@/shared/layouts/Header/NavbarRouter";
import BlueprintFooter from "@/shared/layouts/Footer/BlueprintFooter";
import ScrollToTop from "@/shared/components/ScrollToTop/ScrollToTop";

const HomeRouter = lazy(() => import("@/features/home/pages/HomeRouter"));
const JewelleryList = lazy(() => import("@/features/product/pages/JewelleryList"));
const ProductDetailPage = lazy(() => import("@/features/product/pages/ProductDetailPage"));

function Layout() {
  return (
    <>
      <ScrollToTop />
      <NavbarRouter />
      <main>
        <Suspense fallback={<div className="min-h-[60vh]" />}>
          <Outlet />
        </Suspense>
      </main>
      <BlueprintFooter />
    </>
  );
}

export default function App() {
  return (
    <Routes>
      <Route element={<Layout />}>
        <Route path="/" element={<HomeRouter />} />
        <Route path="/shop-all" element={<JewelleryList />} />
        <Route path="/shop-all/details/:productVariantSlug" element={<ProductDetailPage />} />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Route>
    </Routes>
  );
}
