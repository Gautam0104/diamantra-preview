import { useState } from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import { ArrowLeft, ArrowRight } from "lucide-react";

const MAGAZINE_STYLE = {
  GRAZIA:  "font-heading text-2xl xs:text-3xl text-charcoal italic",
  FEMINA:  "font-heading text-2xl xs:text-3xl font-bold text-[#D6006E]",
  VOGUE:   "font-heading text-2xl xs:text-3xl font-bold text-charcoal tracking-wider",
  BAZAAR:  "font-heading text-2xl xs:text-3xl font-semibold text-charcoal tracking-widest",
  ELLE:    "font-heading text-2xl xs:text-3xl font-bold text-charcoal tracking-[0.3em]",
};
const DEFAULT_MAGAZINE_STYLE = "font-heading text-2xl xs:text-3xl font-bold text-charcoal tracking-wider";

const DEFAULT_MAGAZINES = [
  { name: "GRAZIA" }, { name: "FEMINA" }, { name: "VOGUE" }, { name: "BAZAAR" }, { name: "ELLE" },
  { name: "GRAZIA" }, { name: "FEMINA" }, { name: "VOGUE" }, { name: "BAZAAR" }, { name: "ELLE" },
];

export default function AsSeenInMobile({ cmsData }) {
  const [swiperInstance, setSwiperInstance] = useState(null);
  const sectionTitle = cmsData?.sectionTitle ?? "As seen In leading fashion & lifestyle magazines";
  const baseMagazines = cmsData?.magazines ?? DEFAULT_MAGAZINES;
  // duplicate for infinite scroll feel if fewer than 6 items
  const magazineCards = baseMagazines.length < 6
    ? [...baseMagazines, ...baseMagazines]
    : baseMagazines;

  return (
    <section className="bg-white py-8 md:py-12 px-3 xs:px-6 md:px-12 lg:px-16">
      {/* Header row: heading left, arrows right */}
      <div className="flex items-center justify-between mb-6 md:mb-8 gap-3">
        {/* Heading */}
        <p className="font-heading  text-[17px] xs:text-[20px]  text-charcoal  md:shrink-0 -tracking-[2%] leading-[20px]  max-w-[160px] xs:max-w-[200px] sm:max-w-none shrink-0">
          {sectionTitle}
        </p>

        {/* Diamond + extending line */}
        <div className="flex items-center flex-1 min-w-0">
          <svg width="12" height="12" viewBox="0 0 10 10" fill="none" className="shrink-0">
            <polygon points="0,5 5,0 10,5 5,10" fill="#000000" />
          </svg>
          <img src="/home/why-diamantra/Line-right.svg" className="flex-1 min-w-[40px] h-[2px]" alt="" />
        </div>

        {/* Navigation arrows */}
        <div className="flex items-center gap-2 shrink-0">
          <button
            onClick={() => swiperInstance?.slidePrev()}
            aria-label="Previous"
            className="w-9 h-9 rounded-full border border-gray-300 flex items-center justify-center text-gray-500 hover:text-charcoal hover:border-gray-500 transition-colors bg-white cursor-pointer"
          >
            <ArrowLeft size={18} />
          </button>
          <button
            onClick={() => swiperInstance?.slideNext()}
            aria-label="Next"
            className="w-9 h-9 rounded-full border border-gray-300 flex items-center justify-center text-gray-500 hover:text-charcoal hover:border-gray-500 transition-colors bg-white cursor-pointer"
          >
            <ArrowRight size={18} />
          </button>
        </div>
      </div>

      {/* Magazine name cards */}
      <Swiper
        slidesPerView={2}
        spaceBetween={16}
        centeredSlides={true}
        loop={true}
        grabCursor={true}
        onSwiper={setSwiperInstance}
        breakpoints={{
          425: { slidesPerView: 2.5, spaceBetween: 16 },
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
