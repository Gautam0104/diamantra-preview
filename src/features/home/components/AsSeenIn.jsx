import { useState } from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import { ArrowLeft, ArrowRight } from "lucide-react";

const MAGAZINE_STYLE = {
  GRAZIA:  "font-heading text-2xl md:text-3xl text-charcoal italic",
  FEMINA:  "font-heading text-2xl md:text-3xl font-bold text-[#D6006E]",
  VOGUE:   "font-heading text-2xl md:text-3xl font-bold text-charcoal tracking-wider",
  BAZAAR:  "font-heading text-2xl md:text-3xl font-semibold text-charcoal tracking-widest",
  ELLE:    "font-heading text-2xl md:text-3xl font-bold text-charcoal tracking-[0.3em]",
};
const DEFAULT_MAGAZINE_STYLE = "font-heading text-2xl md:text-3xl font-bold text-charcoal tracking-wider";

const DEFAULT_MAGAZINES = [
  { name: "GRAZIA" }, { name: "FEMINA" }, { name: "VOGUE" }, { name: "BAZAAR" }, { name: "ELLE" },
  { name: "GRAZIA" }, { name: "FEMINA" }, { name: "VOGUE" }, { name: "BAZAAR" }, { name: "ELLE" },
];

export default function AsSeenIn({ cmsData }) {
  const [swiperInstance, setSwiperInstance] = useState(null);
  const sectionTitle = cmsData?.sectionTitle ?? "As seen In leading fashion & lifestyle magazines";
  const baseMagazines = cmsData?.magazines ?? DEFAULT_MAGAZINES;
  // duplicate for infinite scroll feel if fewer than 6 items
  const magazineCards = baseMagazines.length < 6
    ? [...baseMagazines, ...baseMagazines]
    : baseMagazines;

  return (
    <section className="bg-white py-8 md:py-12 px-6 md:px-12 lg:px-16">
      {/* Header row: heading left, arrows right */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between mb-6 md:mb-8 gap-2 sm:gap-4">
        {/* Heading + diamond + extending line */}
        <div className="flex items-center gap-3 min-w-0 flex-1">
          <h2 className="font-heading text-base sm:text-lg md:text-[30px] text-charcoal md:whitespace-nowrap md:shrink-0 -tracking-[2%] leading-[66px]">
            {sectionTitle}
          </h2>
          <div className="flex items-center">
          <svg width="12" height="12" viewBox="0 0 10 10" fill="none">
            <polygon points="0,5 5,0 10,5 5,10" fill="#000000" />
          </svg>
          <img src="/home/why-diamantra/Line-right.svg" className="w-10 sm:w-16 md:w-24 h-[2px]" alt="" />
        </div>
        </div>

        {/* Navigation arrows */}
        <div className="flex items-center gap-2 shrink-0">
          <button
            onClick={() => swiperInstance?.slidePrev()}
            aria-label="Previous"
            className="w-9 h-9 rounded-full border border-gray-300 flex items-center justify-center text-gray-500 hover:text-charcoal hover:border-gray-500 transition-colors bg-white cursor-pointer"
          >
            <ArrowLeft size={15} />
          </button>
          <button
            onClick={() => swiperInstance?.slideNext()}
            aria-label="Next"
            className="w-9 h-9 rounded-full border border-gray-300 flex items-center justify-center text-gray-500 hover:text-charcoal hover:border-gray-500 transition-colors bg-white cursor-pointer"
          >
            <ArrowRight size={15} />
          </button>
        </div>
      </div>

      {/* Magazine name cards */}
      <Swiper
        slidesPerView={2}
        spaceBetween={16}
        loop={true}
        grabCursor={true}
        onSwiper={setSwiperInstance}
        breakpoints={{
          480: { slidesPerView: 3, spaceBetween: 16 },
          768: { slidesPerView: 4, spaceBetween: 20 },
          1024: { slidesPerView: 5, spaceBetween: 24 },
        }}
      >
        {magazineCards.map((mag, i) => (
          <SwiperSlide key={i}>
            <div className="border border-gray-200 rounded-xl flex items-center justify-center py-8 px-4 bg-white hover:border-gray-400 transition-colors select-none">
              <h3 className={MAGAZINE_STYLE[mag.name] ?? DEFAULT_MAGAZINE_STYLE}>{mag.name}</h3>
            </div>
          </SwiperSlide>
        ))}
      </Swiper>
    </section>
  );
}
