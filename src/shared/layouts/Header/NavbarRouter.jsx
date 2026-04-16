import { lazy, Suspense } from "react";
import useIsMobile from "@/shared/hooks/useIsMobile";

const BlueprintNavbar = lazy(() => import("./BlueprintNavbar"));
const NavbarMobile = lazy(() => import("./NavbarMobile"));

export default function NavbarRouter() {
  const isMobile = useIsMobile();
  return (
    <Suspense fallback={<div className="h-16 bg-white" />}>
      {isMobile ? <NavbarMobile /> : <BlueprintNavbar />}
    </Suspense>
  );
}
