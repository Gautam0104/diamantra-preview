import { Link } from "react-router-dom";

const DEFAULT_IMAGE = "/hero-bg/Rectangle 1.png";

const BANNER_IMAGES = {
  rings: "/home/Ring-1.webp",
  necklaces: "/home/necklace.webp",
  earrings: "/home/earrings1.webp",
  bracelets: "/home/Bracelet-1.webp",
  bangles: "/home/Bracelets2.png",
  pendants: "/home/necklaces2.png",
};

export default function HeroBanner({ jewelryTypeSlug = [], categoryName = "", backgroundImage = "" }) {
  const activeSlug = jewelryTypeSlug.length === 1 ? jewelryTypeSlug[0] : null;
  const bannerImage = backgroundImage || (activeSlug && BANNER_IMAGES[activeSlug]) || DEFAULT_IMAGE;

  return (
    <section className="flex flex-col w-full">
      {/* SVG clip-path definition */}
      <svg width="0" height="0" className="absolute">
        <defs>
          <clipPath id="productCurveClip" clipPathUnits="objectBoundingBox">
            <path d="M0,0 H1 V0.85 C0.6,0.85 0.55,0.85 0.5,1 C0.45,0.85 0.4,0.85 0,0.85 Z" />
          </clipPath>
        </defs>
      </svg>

      {/* Main hero content with background image */}
      <div
        className="flex flex-col items-center justify-center px-4 sm:px-6 py-16 sm:py-24 md:py-32 gap-4 sm:gap-6 bg-cover bg-center bg-no-repeat h-[50vh] sm:h-[55vh] md:h-[65vh]"
        style={{
          backgroundImage: `url('${bannerImage}')`,
          clipPath: 'url(#productCurveClip)',
        }}
      >
        <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-7xl font-heading text-white text-center leading-tight">
         Everyday Elegance,
          <br />
          Reimagined
        </h1>

        <p className="text-white text-xs md:text-sm font-semibold tracking-[0.25em] uppercase text-center">
          <Link to="/" className="font-normal transition-colors opacity-75">HOME</Link>
          {" / "}
          <Link to="/shop-all" className="font-normal transition-colors opacity-75">Jewelry</Link>
          {categoryName && (
            <>
              {" / "}
              <span>{categoryName}</span>
            </>
          )}
        </p>
      </div>
    </section>
  );
}
