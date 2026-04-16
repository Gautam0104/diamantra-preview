import { useRef, useState } from "react";
import { Link } from "react-router-dom";

const TRENDING_PRODUCTS = [
  { name: "Rings", tagline: "Minimal Edge", image: "/home/Rings.png", href: "/shop-all?jewelryTypeSlug=rings" },
  { name: "Chains", tagline: "Urban Luxe", image: "/home/necklaces.png", href: "/shop-all?jewelryTypeSlug=chains" },
  { name: "Bracelets", tagline: "Power Fit", image: "/home/Bracelets.png", href: "/shop-all?jewelryTypeSlug=bracelets" },
  { name: "Studs", tagline: "Clean Finish", image: "/home/earrings.png", href: "/shop-all?jewelryTypeSlug=earrings" },
];

export default function ForMenSectionMobile() {
  const scrollRef = useRef(null);
  const [isDragging, setIsDragging] = useState(false);
  const [startX, setStartX] = useState(0);
  const [scrollLeft, setScrollLeft] = useState(0);

  const handleMouseDown = (e) => {
    setIsDragging(true);
    setStartX(e.pageX - scrollRef.current.offsetLeft);
    setScrollLeft(scrollRef.current.scrollLeft);
  };

  const handleMouseUp = () => setIsDragging(false);
  const handleMouseLeave = () => setIsDragging(false);

  const handleMouseMove = (e) => {
    if (!isDragging) return;
    e.preventDefault();
    const x = e.pageX - scrollRef.current.offsetLeft;
    scrollRef.current.scrollLeft = scrollLeft - (x - startX);
  };

  return (
    <section className="bg-black overflow-hidden h-auto md:h-[341px]">
      <div className="flex flex-col md:flex-row items-center h-full w-full">

        {/* Left Side - Text */}
        <div className="w-full md:w-1/2 flex flex-col items-center justify-center px-3 xs:px-4 md:px-10 py-8 md:py-0 h-auto md:h-full relative overflow-hidden">
          {/* Heading with border box + diamond + lines */}
          <div className="flex items-center w-full relative z-10">
            {/* Left line */}
            <div className="flex-1">
              <img src="/home/Line-right-white.svg" className="w-full scale-x-[-1]" loading="lazy" />
            </div>
            {/* Left diamond */}
            <span className="text-white text-[10px] shrink-0">&#9670;</span>
            {/* Bordered title box */}
            <h2 className="px-4 py-2 text-[18px] xs:text-[20px] font-heading text-white leading-[20px] -tracking-[2%] whitespace-nowrap">
              For Men who<br />move different
            </h2>
            {/* Right diamond */}
            <span className="text-white text-[10px] shrink-0">&#9670;</span>
            {/* Right line */}
            <div className="flex-1">
              <img src="/home/Line-right-white.svg" className="w-full" loading="lazy" />
            </div>
          </div>

          {/* Subtitle */}
          <p className="text-white text-[10px] tracking-[12%] leading-[18px] uppercase relative z-10 mt-2 text-center">
            Handpicked sparkle from our latest<br /> drops and trending picks.
          </p>
        </div>

        {/* Right Side - Cards */}
        <div className="w-full md:w-1/2 overflow-hidden h-64 md:h-full flex items-center">
          <div
            ref={scrollRef}
            className="flex gap-4 overflow-x-auto scrollbar-hide select-none px-4 xs:px-6 h-full items-center"
            style={{ cursor: isDragging ? "grabbing" : "grab" }}
            onMouseDown={handleMouseDown}
            onMouseUp={handleMouseUp}
            onMouseLeave={handleMouseLeave}
            onMouseMove={handleMouseMove}
          >
            {TRENDING_PRODUCTS.map((p) => (
              <Link
                key={p.name}
                to={p.href}
                className="group shrink-0 w-[175px] cursor-pointer"
              >
                <div className="bg-white rounded-2xl overflow-hidden group-hover:scale-[1.03] transition-transform duration-300 flex flex-col h-[192px]">
                  {/* Image area */}
                  <div className="flex-1 flex items-center justify-center p-4">
                    <img
                      src={p.image}
                      alt={p.name}
                      className="w-30 h-30 object-contain"
                      loading="lazy"
                    />
                  </div>
                  {/* Text area */}
                  <div className="px-4 pb-4 shrink-0">
                    <p className="text-gray-900 text-sm font-semibold leading-tight">
                      {p.name}
                    </p>
                    <p className="text-gray-400 text-xs mt-0.5">
                      {p.tagline}
                    </p>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </div>

      </div>
    </section>
  );
}
