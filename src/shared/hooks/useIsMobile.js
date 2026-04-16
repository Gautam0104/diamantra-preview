import { useState, useEffect } from "react";

const WIDTH_QUERY = "(max-width: 768px)";
const TOUCH_QUERY = "(hover: none) and (pointer: coarse)";

export default function useIsMobile() {
  const [isMobile, setIsMobile] = useState(() => {
    const isNarrow = window.matchMedia(WIDTH_QUERY).matches;
    const isTouch = window.matchMedia(TOUCH_QUERY).matches;
    return isNarrow || isTouch;
  });

  useEffect(() => {
    const widthMq = window.matchMedia(WIDTH_QUERY);
    const touchMq = window.matchMedia(TOUCH_QUERY);

    const handler = () => {
      setIsMobile(widthMq.matches || touchMq.matches);
    };

    widthMq.addEventListener("change", handler);
    touchMq.addEventListener("change", handler);

    return () => {
      widthMq.removeEventListener("change", handler);
      touchMq.removeEventListener("change", handler);
    };
  }, []);

  return isMobile;
}
