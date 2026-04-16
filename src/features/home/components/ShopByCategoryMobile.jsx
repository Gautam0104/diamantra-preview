import { Link, useNavigate } from "react-router-dom";
import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation } from "swiper/modules";
import "swiper/css";
import "swiper/css/navigation";
import { ArrowLeft, ArrowRight } from "lucide-react";
import Button from "../ui/Button";
import OptimizedImage from "@shared/components/OptimizedImage";

const defaultCategories = [
  { name: "Rings", slug: "rings", imageUrl: "/home/Rings.png" },
  { name: "Bracelets", slug: "bracelets", imageUrl: "/home/Bracelets.png" },
  { name: "Earrings", slug: "earrings", imageUrl: "/home/Fashion-Jewelry.png" },
  { name: "Necklaces", slug: "necklaces", imageUrl: "/home/Everyday-Wear.png" },
  { name: "Men's Jewelry", slug: "mens-jewelry", imageUrl: "/home/Mens-Jewelry.png" },
];

export default function ShopByCategoryMobile({ categories = [] }) {
  const navigate = useNavigate();
  const displayCategories = categories.length > 0 ? categories : defaultCategories;

  return (
    <section className="flex flex-col py-8 md:py-12">
      {/* Header row */}
      <div className="flex items-center justify-between py-5 max-w-7xl mx-auto px-2  md:px-4 w-full">
        <div className="flex items-center gap-3">
          <h2 className="font-heading text-[18px] xs:text-[20px] sm:text-[20px] md:text-[30px] leading-[50.09px] text-charcoal whitespace-nowrap">
            Shop by category
          </h2>
          <div className="flex items-center shrink-0">
            <svg width="12" height="12" viewBox="0 0 10 10" fill="none" className="shrink-0">
              <polygon points="0,5 5,0 10,5 5,10" fill="#000000" />
            </svg>
            <div className="w-16 xs:w-10 sm:w-16 md:w-24">
              <img src="/home/why-diamantra/Line-right.svg" alt="" loading="lazy" className="w-full h-[2px]" />
            </div>
          </div>
        </div>

        {/* Right side: arrows + button */}
        <div className="flex items-center gap-2">
          <button className="cat-prev-mobile hidden md:flex w-9 h-9 rounded-full border border-gray-300 items-center justify-center hover:border-charcoal transition-colors cursor-pointer">
            <ArrowLeft size={18} />
          </button>
          <button className="cat-next-mobile hidden md:flex w-9 h-9 rounded-full border border-gray-300 items-center justify-center hover:border-charcoal transition-colors cursor-pointer">
            <ArrowRight size={18} />
          </button>
          <Button text="More" onClick={() => navigate("/shop-all")} className="py-2 xs:hidden" />
          <Button text="More Categories" onClick={() => navigate("/shop-all")} className="py-3 hidden xs:flex" />
        </div>
      </div>

      {/* Slider */}
      <div className="max-w-7xl mx-auto px-2  md:px-4 w-full">
        <Swiper
          modules={[Navigation]}
          navigation={{ prevEl: ".cat-prev-mobile", nextEl: ".cat-next-mobile" }}
          spaceBetween={16}
          slidesPerView={2}
          grabCursor={true}
          breakpoints={{
            640:  { slidesPerView: 3,   spaceBetween: 16 },
            768:  { slidesPerView: 4,   spaceBetween: 20 },
            1024: { slidesPerView: 5,   spaceBetween: 20 },
          }}
        >
          {displayCategories.map((cat, index) => (
            <SwiperSlide key={cat.name}>
              <Link
                to={`/shop-all?jewelryTypeSlug=${cat.slug || cat.jewelryTypeSlug || ""}`}
                className="group relative flex flex-col items-center bg-[#D9D9D9] rounded-2xl overflow-hidden hover:shadow-md transition-shadow h-[220px] sm:h-[250px] md:h-[277px]"
              >
                {/* Curve on top */}
                <div className="absolute top-0 left-0 right-0 flex justify-center z-10">
                  <img src="/Vector.png" alt="" />
                </div>

                <div className="flex-1 w-full flex items-center justify-center px-6 pt-8">
                  <OptimizedImage
                    src={cat.imageUrl || "/home/Oval.png"}
                    alt={cat.name}
                    sizes="(max-width: 640px) 120px, (max-width: 768px) 140px, 160px"
                    className="h-[120px] sm:h-[140px] md:h-[160px] w-full object-contain"
                    width={160}
                    height={160}
                  />
                </div>
                <span className="py-3 text-[14px] font-semibold tracking-[10%] leading-[33px] text-charcoal uppercase text-center">
                  {cat.name}
                </span>
              </Link>
            </SwiperSlide>
          ))}
        </Swiper>
      </div>
    </section>
  );
}
