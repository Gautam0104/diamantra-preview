import { Swiper, SwiperSlide } from "swiper/react";

const DEFAULT_POSTS = [
  { image: "/home/insta-journey/image-1.png", product: "Twilight Studs – Glow Muse", price: "₹28,213", originalPrice: null },
  { image: "/home/insta-journey/image-2.png", product: "Twilight Studs – Glow Muse", price: "₹7,828", originalPrice: "₹8,828" },
  { image: "/home/insta-journey/image-3.png", product: "Twilight Studs – Glow Muse", price: "₹28,213", originalPrice: null },
  { image: "/home/insta-journey/image-4.png", product: "Twilight Studs – Glow Muse", price: "₹28,213", originalPrice: null },
  { image: "/home/insta-journey/image-5.png", product: "Twilight Studs – Glow Muse", price: "₹28,213", originalPrice: null },
];

export default function InstaJourneyMobile({ cmsData }) {
  const sectionTitle = cmsData?.sectionTitle ?? "Join the Journey on Instagram";
  const cards = cmsData?.posts ?? DEFAULT_POSTS;
  return (
    <section className="bg-white py-8 md:py-12 px-3 xs:px-4 sm:px-8 md:px-12 lg:px-16">
      {/* Heading */}
      <div className="flex items-center justify-center gap-3 mb-8 md:mb-12">
        <div className="flex items-center">
          <img src="/home/why-diamantra/Line-left.svg" className="w-16 xs:w-10 sm:w-16 md:w-24 h-[2px]" alt="" loading="lazy" />
          <svg width="12" height="12" viewBox="0 0 10 10" fill="none">
            <polygon points="0,5 5,0 10,5 5,10" fill="#000000" />
          </svg>
        </div>
        <p className="font-heading text-[20px] text-charcoal text-center leading-[20px] -tracking-[1%] max-w-42 xs:max-w-50">
          {sectionTitle}
        </p>
        <div className="flex items-center">
          <svg width="12" height="12" viewBox="0 0 10 10" fill="none">
            <polygon points="0,5 5,0 10,5 5,10" fill="#000000" />
          </svg>
          <img src="/home/why-diamantra/Line-right.svg" className="w-16 xs:w-10 sm:w-16 md:w-24 h-[2px]" alt="" loading="lazy" />
        </div>
      </div>

      {/* Desktop grid — 5 columns */}
      <div className="hidden md:grid grid-cols-5 gap-5 max-w-7xl mx-auto">
        {cards.map((card, i) => (
          <div key={i} className="flex flex-col gap-3">
            {/* Photo card */}
            <div className="rounded-2xl overflow-hidden shadow-sm" style={{ aspectRatio: "3/4" }}>
              <img
                src={card.image}
                alt={card.product}
                className="w-full h-full object-cover"
                loading="lazy"
              />
            </div>
            {/* Product info */}
            <div className="flex items-center gap-2.5">
              <div className="w-10 h-10 rounded-full overflow-hidden shrink-0 border border-gray-200">
                <img src={card.image} alt={card.product} className="w-full h-full object-cover" loading="lazy" />
              </div>
              <div className="flex flex-col min-w-0">
                <span className="text-xs font-medium text-charcoal leading-snug truncate">
                  {card.product}
                </span>
                <div className="flex items-center gap-1.5 mt-0.5 flex-wrap">
                  {card.originalPrice && (
                    <span className="text-[11px] text-gray-400 line-through">{card.originalPrice}</span>
                  )}
                  <span className="text-sm font-semibold text-[#e63946]">{card.price}</span>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Mobile swiper */}
      <div className="md:hidden overflow-hidden">
        <Swiper
          slidesPerView={2}
          spaceBetween={16}
          grabCursor={true}
          breakpoints={{
            400: { slidesPerView: 2.2, spaceBetween: 16 },
            480: { slidesPerView: 2.5, spaceBetween: 16 },
            640: { slidesPerView: 3, spaceBetween: 20 },
          }}
          className="ij-swiper-mobile"
        >
          {cards.map((card, i) => (
            <SwiperSlide key={i}>
              <div className="flex flex-col gap-3">
                <div className="rounded-2xl overflow-hidden shadow-sm" style={{ aspectRatio: "3/4" }}>
                  <img
                    src={card.image}
                    alt={card.product}
                    className="w-full h-full object-cover"
                    loading="lazy"
                  />
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-9 h-9 rounded-full overflow-hidden shrink-0 border border-gray-200">
                    <img src={card.image} alt={card.product} className="w-full h-full object-cover" loading="lazy" />
                  </div>
                  <div className="flex flex-col min-w-0">
                    <span className="text-[11px] font-medium text-charcoal leading-snug truncate">
                      {card.product}
                    </span>
                    <div className="flex items-center gap-1 mt-0.5 flex-wrap">
                      {card.originalPrice && (
                        <span className="text-[10px] text-gray-400 line-through">{card.originalPrice}</span>
                      )}
                      <span className="text-xs font-semibold text-[#e63946]">{card.price}</span>
                    </div>
                  </div>
                </div>
              </div>
            </SwiperSlide>
          ))}
        </Swiper>
      </div>

      <style>{`
        .ij-swiper-mobile {
          padding: 0.5rem 0 1rem;
          overflow: visible;
        }
      `}</style>
    </section>
  );
}
