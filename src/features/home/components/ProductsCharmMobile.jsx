import { Link } from "react-router-dom";
import { Swiper, SwiperSlide } from "swiper/react";
import "swiper/css";

const defaultProducts = [
  { id: "default-1", image: "/home/product-charm/image-1.png", title: "Diamond Ring", slug: "" },
  { id: "default-2", image: "/home/product-charm/image-2.png", title: "Diamond Bracelet", slug: "" },
  { id: "default-3", image: "/home/product-charm/image-3.png", title: "Engagement Ring", slug: "" },
  { id: "default-4", image: "/home/product-charm/image-4.png", title: "Eternity Ring", slug: "" },
  { id: "default-5", image: "/home/product-charm/image-5.png", title: "Diamond Band", slug: "" },
];

export default function ProductsCharmMobile() {
  return (
    <section className="relative py-4 overflow-hidden">
      <div className="max-w-7xl">
        {/* Heading */}
        <div className="flex items-center justify-center gap-4 py-2  shrink-0">
          <div className="flex items-center">
            <div className="w-16 xs:w-10 sm:w-16 md:w-24">
              <img src="/home/why-diamantra/Line-left.svg" alt="" loading="lazy" className="w-full h-[2px]" />
            </div>
            <svg width="12" height="12" viewBox="0 0 10 10" fill="none">
              <polygon points="0,5 5,0 10,5 5,10" fill="#000000" />
            </svg>
          </div>
          <h2 className="font-heading text-lg xs:text-xl sm:text-2xl md:text-[30px] text-charcoal whitespace-nowrap -tracking-[2%] leading-[66px]">
            Product Charm
          </h2>
          <div className="flex items-center">
            <svg width="12" height="12" viewBox="0 0 10 10" fill="none">
              <polygon points="0,5 5,0 10,5 5,10" fill="#000000" />
            </svg>
            <div className="w-16 xs:w-10 sm:w-16 md:w-24">
              <img src="/home/why-diamantra/Line-right.svg" alt="" loading="lazy" className="w-full h-[2px]" />
            </div>
          </div>
        </div>

        {/* Slider */}
        <div className="relative w-full overflow-hidden">
          <Swiper
            slidesPerView="auto"
            spaceBetween={20}
            loop={true}
            grabCursor={true}
            freeMode={true}
            allowTouchMove={true}
            centeredSlides={true}
            breakpoints={{
              640: { spaceBetween: 40 },
              1024: { spaceBetween: 60 },
              1536: { spaceBetween: 70 },
            }}
            className="charm-swiper-mobile"
          >
            {defaultProducts.map((product) => (
              <SwiperSlide key={product.id} style={{ width: "260px" }}>
                <Link
                  to="/shop-all"
                  className="group relative aspect-3/4 overflow-hidden cursor-pointer block"
                >
                  <img
                    src={product.image}
                    alt={product.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300 rounded-2xl"
                    loading="lazy"
                  />
                  <div className="absolute inset-0 group-hover:bg-black/10 transition-colors" />
                </Link>
              </SwiperSlide>
            ))}
          </Swiper>
        </div>
      </div>

      <style>{`
        .charm-swiper-mobile {
          padding: 1.5rem 0 2.5rem;
          overflow: visible;
        }
        @media (max-width: 768px) {
          .charm-swiper-mobile .swiper-slide {
            width: 200px !important;
          }
        }
        @media (min-width: 1280px) {
          .charm-swiper-mobile .swiper-slide {
            width: 300px !important;
          }
        }
        @media (min-width: 1536px) {
          .charm-swiper-mobile .swiper-slide {
            width: 320px !important;
          }
        }
      `}</style>
    </section>
  );
}
