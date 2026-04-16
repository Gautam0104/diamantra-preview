import { lazy } from "react";
import useIsMobile from "@/shared/hooks/useIsMobile";

const Home = lazy(() => import("./Home"));
const HomeMobile = lazy(() => import("./HomeMobile"));

export default function HomeRouter() {
  const isMobile = useIsMobile();
  return isMobile ? <HomeMobile /> : <Home />;
}
