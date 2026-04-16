import { Link } from "react-router-dom";
import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation } from "swiper/modules";
import "swiper/css";
import "swiper/css/navigation";
import { ArrowLeft, ArrowRight } from "lucide-react";

const defaultProducts = [
  { id: "default-1", image: "/home/product-charm/image-1.png", title: "Diamond Ring", slug: "" },
  { id: "default-2", image: "/home/product-charm/image-2.png", title: "Diamond Bracelet", slug: "" },
  { id: "default-3", image: "/home/product-charm/image-3.png", title: "Engagement Ring", slug: "" },
  { id: "default-4", image: "/home/product-charm/image-4.png", title: "Eternity Ring", slug: "" },
  { id: "default-5", image: "/home/product-charm/image-5.png", title: "Diamond Band", slug: "" },
];

export default function ProductsCharm() {
  return (
    <section className="relative py-2 overflow-hidden">
      <div className="max-w-8xl mx-auto px-2  md:px-4">
        {/* Heading row with nav arrows */}
        <div className="flex items-center justify-between py-5 shrink-0">
          {/* Prev arrow */}
          <button className="charm-prev hidden md:flex w-9 h-9 rounded-full border border-gray-300 items-center justify-center hover:border-charcoal transition-colors cursor-pointer shrink-0">
            <ArrowLeft size={18} />
          </button>

          {/* Centered heading */}
          <div className="flex items-center justify-center gap-4 flex-1">
            <div className="flex items-center">
              <div className="w-10 sm:w-16 md:w-24">
                <img src="/home/why-diamantra/Line-left.svg" alt="" loading="lazy" className="w-full h-[2px]" />
              </div>
              <svg width="12" height="12" viewBox="0 0 10 10" fill="none">
                <polygon points="0,5 5,0 10,5 5,10" fill="#000000" />
              </svg>
            </div>
            <h2 className="font-heading text-xl sm:text-2xl md:text-[30px] text-charcoal whitespace-nowrap -tracking-[2%] leading-[66px]">
              Product Charm
            </h2>
            <div className="flex items-center">
              <svg width="12" height="12" viewBox="0 0 10 10" fill="none">
                <polygon points="0,5 5,0 10,5 5,10" fill="#000000" />
              </svg>
              <div className="w-10 sm:w-16 md:w-24">
                <img src="/home/why-diamantra/Line-right.svg" alt="" loading="lazy" className="w-full h-[2px]" />
              </div>
            </div>
          </div>

          {/* Next arrow */}
          <button className="charm-next hidden md:flex w-9 h-9 rounded-full border border-gray-300 items-center justify-center hover:border-charcoal transition-colors cursor-pointer shrink-0">
            <ArrowRight size={18} />
          </button>
        </div>

        {/* Slider */}
        <Swiper
          modules={[Navigation]}
          navigation={{ prevEl: ".charm-prev", nextEl: ".charm-next" }}
          spaceBetween={16}
          slidesPerView={2}
          grabCursor={true}
          breakpoints={{
            640:  { slidesPerView: 2.5, spaceBetween: 16 },
            768:  { slidesPerView: 3.5, spaceBetween: 20 },
            1024: { slidesPerView: 5,   spaceBetween: 20 },
          }}
        >
          {defaultProducts.map((product) => (
            <SwiperSlide key={product.id}>
              <Link
                to="/shop-all"
                className="group relative aspect-3/4 rounded-2xl overflow-hidden cursor-pointer block"
              >
                <img
                  src={product.image}
                  alt={product.title}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                  loading="lazy"
                />
                <div className="absolute inset-0 bg-black/10 group-hover:bg-black/20 transition-colors" />
              </Link>
            </SwiperSlide>
          ))}
        </Swiper>
      </div>
    </section>
  );
}
