import { useState, useEffect, useCallback } from "react";

import { ChevronLeft, ChevronRight } from "lucide-react";

import Button from "../ui/Button";

import { useNavigate } from "react-router-dom";



export default function HeroBannerMobile({ banners = [] }) {

  const navigate = useNavigate();

  const [current, setCurrent] = useState(0);

  const count = banners.length;



  const next = useCallback(() => setCurrent((c) => (c + 1) % count), [count]);

  const prev = useCallback(() => setCurrent((c) => (c - 1 + count) % count), [count]);



  // Auto-advance every 5s

  useEffect(() => {

    if (count <= 1) return;

    const id = setInterval(next, 5000);

    return () => clearInterval(id);

  }, [count, next]);



  // Fallback when no banners from DB — matches Figma design

  if (count === 0) {

    return (

      <section className="flex flex-col w-full">

        {/* SVG clip-path definition */}
        <svg width="0" height="0" className="absolute">
          <defs>
            <clipPath id="heroCurveClipFallbackMobile" clipPathUnits="objectBoundingBox">
              <path d="M0,0 H1 V0.80 C0.6,0.80 0.55,0.80 0.5,0.92 C0.45,0.80 0.4,0.80 0,0.80 Z" />
            </clipPath>
          </defs>

        </svg>
        <div
          className="relative w-full h-[40vh] xs:h-[55vh] sm:h-[55vh] md:h-[60vh] lg:h-[664px] overflow-hidden"
          style={{ backgroundColor: '#ba7135', clipPath: 'url(#heroCurveClipFallbackMobile)' }}
        >
          {/* Background graphic overlays */}
          <img
            src="/home/banner/bg-graphic-left.svg"
            className="absolute left-0 top-0 h-full w-1/2 object-cover pointer-events-none select-none opacity-20"
            alt=""
            draggable={false}
          />
          <img
            src="/home/banner/bg-graphic-right.svg"
            className="absolute right-0 top-0 h-full w-1/2 object-cover pointer-events-none select-none opacity-20"
            alt=""
            draggable={false}
          />

          {/* Layout: always side-by-side (image left, text right) */}
          <div className="relative z-10 flex flex-row  h-full">

            {/* Image: left column at all sizes */}
            <div className="relative z-20 w-[50%] md:w-[60%] h-full ">
              <img
                src="/home/banner/women-image-mobile.png"
                alt="Diamantra Model"
                className=" w-full h-full object-contain"
                style={{ filter: 'drop-shadow(0 0 30px rgba(0,0,0,0.3))' }}
                draggable={false}
              />
            </div>

            {/* Text: right column at all sizes */}
            <div className="flex-1 flex flex-col justify-center items-start text-left gap-3 md:gap-5 px-2 xs:px-3 sm:px-5 md:px-5 lg:px-0 lg:pr-16 xl:pr-24 pb-[8%]">

              <h1 className="text-[clamp(18px,5.5vw,24px)]  font-heading  text-white leading-[clamp(20px,5.5vw,24px)] -tracking-[2%]">
                Shine in Your Story
                Crafted in Silver,
                Set in Soul.
              </h1>

              <p className="text-white text-[10px] sm:text-[10px] md:text-[11px] lg:text-[14px] font-semibold tracking-[13%] leading-[14px] uppercase">
                Lab-Grown Brilliance Meets Timeless Silver Elegance.
              </p>

              <div className="flex flex-col md:flex-row items-stretch gap-2 md:gap-4 mt-1 md:mt-2">
                <Button
                  text="Shop the Collection"
                  bgColor="#D98E04"
                  accentColor="#F5B84B"
                  className="w-full py-3"
                  onClick={() => navigate('/shop-all')}
                />
                <Button
                  text="Watch Our Story"
                  bgColor="#1a1a1a"
                  accentColor="#666666"
                  className="w-full py-3"
                  onClick={() => navigate('/about-us')}
                />
              </div>

            </div>

          </div>

        </div>

      </section>

    );

  }

  return (

    <section className="w-full">

      <div className="relative w-full overflow-hidden">

        {/* Banner slides — first image sizes the container, rest are absolute */}

        {banners.map((b, i) => (

          <picture
            key={b.id}
            className={`${i === 0 ? 'block' : 'absolute inset-0'} w-full transition-opacity duration-700 ease-in-out ${i === current ? 'opacity-100 z-10' : 'opacity-0 z-0'}`}
            onClick={() => b.redirectUrl && navigate(b.redirectUrl)}
            style={{ cursor: b.redirectUrl ? 'pointer' : 'default' }}
          >
            <source
              media="(max-width: 480px), ((hover: none) and (pointer: coarse))"
              srcSet={b.mobileFiles || b.imageUrl}
            />
            <source srcSet={b.imageUrl} type="image/webp" />
            <img
              src={b.imageUrl}
              alt={b.title || ''}
              className={`w-full ${i === 0 ? 'h-auto' : 'h-full object-cover'}`}
              loading={i === 0 ? "eager" : "lazy"}
              fetchPriority={i === 0 ? "high" : "auto"}
            />
          </picture>

        ))}

        {/* Navigation arrows */}

        {count > 1 && (

          <>

            <button
              onClick={prev}
              className="absolute left-2 top-1/2 -translate-y-1/2 z-30 w-7 h-7 rounded-full bg-black/30 backdrop-blur-sm hover:bg-black/50 flex items-center justify-center transition-colors"
            >
              <ChevronLeft size={16} className="text-white" />
            </button>

            <button
              onClick={next}
              className="absolute right-2 top-1/2 -translate-y-1/2 z-30 w-7 h-7 rounded-full bg-black/30 backdrop-blur-sm hover:bg-black/50 flex items-center justify-center transition-colors"
            >
              <ChevronRight size={16} className="text-white" />
            </button>

          </>

        )}

        {/* Dots indicator */}

        {count > 1 && (

          <div className="absolute bottom-2 left-1/2 -translate-x-1/2 z-30 flex items-center gap-1.5">

            {banners.map((_, i) => (

              <button
                key={i}
                onClick={() => setCurrent(i)}
                className={`rounded-full transition-all ${i === current ? 'w-5 h-1.5 bg-gold' : 'w-1.5 h-1.5 bg-white/50 hover:bg-white/80'}`}
              />

            ))}

          </div>

        )}

      </div>

    </section>

  );

}
