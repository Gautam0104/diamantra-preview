import { useEffect, useRef } from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import Button from "../ui/Button";

const cards = [
  { hashtag: "#DiamKahani", tagline: "From desk to dinner", image: "/home/real-people-real-shine/image-3.png" },
  { hashtag: "#MenOfDiamantra", tagline: "Not bling. Just balance.", image: "/home/real-people-real-shine/image-4.jpg" },
  { hashtag: "#DailyEdge", tagline: "Silver. Sharp. Statement", image: "/home/real-people-real-shine/image-5.jpg" },
  { hashtag: "#LetsGetReal", tagline: "Lab diamonds > mined guilt.", image: "/home/real-people-real-shine/image-1.png" },
  { hashtag: "#MenOfDiamantra", tagline: "Not bling. Just balance.", image: "/home/real-people-real-shine/image-2.jpg" },

];

const SLIDE_WIDTH = 260;
const TRANSLATE_MULT = 0.1;
const ROTATE_MULT = 0.01;

export default function RealPeopleSectionMobile() {
  const rootRef = useRef(null);
  const rafId = useRef(null);

  useEffect(() => {
    const root = rootRef.current;
    if (!root) return;

    const calculateWheel = () => {
      const singles = root.querySelectorAll(".rp-card-mobile");
      singles.forEach((slide) => {
        const rect = slide.getBoundingClientRect();
        const r = window.innerWidth * 0.5 - (rect.x + rect.width * 0.5);
        let ty = Math.abs(r) * TRANSLATE_MULT - rect.width * TRANSLATE_MULT;
        if (ty < 0) ty = 0;
        const transformOrigin = r < 0 ? "left top" : "right top";
        slide.style.transform = `translate(0, ${ty}px) rotate(${-r * ROTATE_MULT}deg)`;
        slide.style.transformOrigin = transformOrigin;
      });
    };

    const loopFrame = () => {
      calculateWheel();
      rafId.current = requestAnimationFrame(loopFrame);
    };
    rafId.current = requestAnimationFrame(loopFrame);

    const onResize = () => calculateWheel();
    window.addEventListener("resize", onResize);

    return () => {
      if (rafId.current) cancelAnimationFrame(rafId.current);
      window.removeEventListener("resize", onResize);
    };
  }, []);

  return (
    <section className="py-2 md:py-4 relative overflow-hidden max-w-480 mx-auto">
      {/* Decorative diamond shapes – top right */}
      <div className="absolute top-4 right-4 md:top-8 md:right-12 pointer-events-none select-none">

      </div>

            {/* Heading */}
      <div className="flex items-center justify-center gap-4 py-2 shrink-0">
        <div className="flex items-center">
          <div className="w-16 xs:w-10 sm:w-16 md:w-24">
            <img src="/home/why-diamantra/Line-left.svg" alt="" loading="lazy" className="w-full h-[2px]" />
          </div>
          <svg width="12" height="12" viewBox="0 0 10 10" fill="none">
            <polygon points="0,5 5,0 10,5 5,10" fill="#000000" />
          </svg>
        </div>
        <h2 className="font-heading text-lg xs:text-xl sm:text-2xl md:text-[30px] text-charcoal whitespace-nowrap -tracking-[2%] leading-[66px]">
          Real People. Real Shine.
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

      {/* Curved Swiper carousel */}
      <div ref={rootRef} className="relative w-full overflow-hidden">
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
          className="rp-swiper-mobile"
        >
          {cards.map((card, i) => (
            <SwiperSlide key={i} style={{ width: `${SLIDE_WIDTH}px` }}>
              <div className="rp-card-mobile">
                <div className="w-full aspect-3/4 rounded-2xl shadow-lg relative overflow-hidden">
                  {/* Full-cover photo */}
                  <img
                    src={card.image}
                    alt={card.hashtag}
                    className="absolute inset-0 w-full h-full object-cover"
                    loading="lazy"
                  />
                  {/* Bottom gradient for text readability */}
                  <div className="absolute inset-0 bg-gradient-to-t from-black/65 via-black/10 to-transparent" />
                  {/* Text overlay */}
                  <div className="absolute bottom-0 left-0 right-0 px-4 pb-5">
                    <p className="text-white text-sm font-medium leading-snug mb-1">{card.tagline}</p>
                    <p className="text-[#d4a017] text-xs font-semibold">{card.hashtag}</p>
                  </div>
                </div>
              </div>
            </SwiperSlide>
          ))}
        </Swiper>
      </div>

      {/* CTA Button */}
      <div className="flex justify-center text-center mt-2">
        <Button className="py-3" text="Tag us to get featured." />
      </div>

      <style>{`
        .rp-swiper-mobile {
          padding: 3rem 0 4rem;
          overflow: visible;
        }
        .rp-card-mobile {
          position: relative;
          pointer-events: none;
          user-select: none;
          will-change: transform;
          transition: transform 0.06s linear;
        }
        @media (max-width: 768px) {
          .rp-swiper-mobile {
            padding: 1.5rem 0 2.5rem;
          }
          .rp-swiper-mobile .swiper-slide {
            width: 200px !important;
          }
        }
        @media (min-width: 1280px) {
          .rp-swiper-mobile .swiper-slide {
            width: 300px !important;
          }
        }
        @media (min-width: 1536px) {
          .rp-swiper-mobile .swiper-slide {
            width: 320px !important;
          }
        }
      `}</style>
    </section>
  );
}
