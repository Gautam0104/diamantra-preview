import { useState, useEffect, useCallback } from "react";

import { ChevronLeft, ChevronRight } from "lucide-react";

import Button from "../ui/Button";

import { useNavigate } from "react-router-dom";



export default function HeroBanner({ banners = [] }) {

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
            <clipPath id="heroCurveClipFallback" clipPathUnits="objectBoundingBox">
              <path d="M0,0 H1 V0.80 C0.6,0.80 0.55,0.80 0.5,0.92 C0.45,0.80 0.4,0.80 0,0.80 Z" />
            </clipPath>
          </defs>

        </svg>
          {/* <defs>
            <clipPath id="heroCurveClipFallback" clipPathUnits="objectBoundingBox">
              <path d="M0,0 H1 V0.85 C0.6,0.85 0.55,0.85 0.5,1 C0.45,0.85 0.4,0.85 0,0.85 Z" />
            </clipPath>
          </defs> */}
        <div
          className="relative w-full h-[50vh] xs:h-[40vh] sm:h-[51vh] md:h-[60vh] lg:h-[664px] overflow-hidden"
          style={{ backgroundColor: '#ba7135', clipPath: 'url(#heroCurveClipFallback)' }}
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
          <div className="relative z-10 flex flex-row h-full">

            {/* Image: left column at all sizes */}
            <div className="relative w-[45%] md:w-[48%] h-full">
              <img
                src="/home/banner/women-image.png"
                alt="Diamantra Model"
                className="absolute top-0 left-0 w-full h-full object-contain object-center md:object-bottom lg:h-[81%] xl:left-20"
                style={{ filter: 'drop-shadow(0 0 30px rgba(0,0,0,0.3))' }}
                draggable={false}
              />
            </div>

            {/* Text: right column at all sizes */}
            <div className="flex-1 flex flex-col justify-center items-start text-left gap-3 md:gap-5 px-3 sm:px-5 md:px-5 lg:px-0 lg:pr-16 xl:pr-24 pb-[8%]">

              <h1 className="text-lg sm:text-xl md:text-3xl lg:text-[2.6rem] xl:text-5xl 2xl:text-[60px] font-heading font-normal text-white leading-tight lg:leading-[59px] -tracking-[2%]">
                Shine in Your Story<br />
                Crafted in Silver,<br />
                Set in Soul.
              </h1>

              <p className="text-white text-[8px] sm:text-[10px] md:text-[11px] lg:text-[14px] font-semibold tracking-[13%] leading-[100%] uppercase">
                Lab-Grown Brilliance Meets Timeless Silver Elegance.
              </p>

              <div className="flex flex-col md:flex-row items-start gap-2 md:gap-4 mt-1 md:mt-2">
                <Button
                  text="Shop the Collection"
                  bgColor="#D98E04"
                  accentColor="#F5B84B"
                  onClick={() => navigate('/shop-all')}
                />
                <Button
                  text="Watch Our Story"
                  bgColor="#1a1a1a"
                  accentColor="#666666"
                  onClick={() => navigate('/about-us')}
                />
              </div>

            </div>

          </div>

        </div>

      </section>

    );

  }



  const banner = banners[current];



  return (

    <section className="flex flex-col w-full">

      {/* SVG clip-path definition */}
      <svg width="0" height="0" className="absolute">
        <defs>
          <clipPath id="heroCurveClip" clipPathUnits="objectBoundingBox">
            <path d="M0,0 H1 V0.85 C0.6,0.85 0.55,0.85 0.5,1 C0.45,0.85 0.4,0.85 0,0.85 Z" />
          </clipPath>
        </defs>
      </svg>

      {/* Image area — clipped to V-shape at bottom */}

      <div
        className="relative w-full h-[50vh] sm:h-[55vh] md:h-[65vh] overflow-hidden"
        style={{ clipPath: 'url(#heroCurveClip)' }}
      >

        {/* Banner slides */}

        {banners.map((b, i) => (

          <picture key={b.id} className={`absolute inset-0 w-full h-full transition-opacity duration-700 ease-in-out ${i === current ? 'opacity-100 z-10' : 'opacity-0 z-0'}`}>
            <source
              media="(max-width: 480px), ((hover: none) and (pointer: coarse))"
              srcSet={b.mobileFiles || b.imageUrl}
            />
            <source srcSet={b.imageUrl} type="image/webp" />
            <img
              src={b.imageUrl}
              alt={b.title || ''}
              className="w-full h-full object-cover"
              loading={i === 0 ? "eager" : "lazy"}
              fetchPriority={i === 0 ? "high" : "auto"}
              width={1920}
              height={800}
            />
          </picture>

        ))}



        {/* Dark overlay + content */}

        <div className="absolute inset-0 z-20 flex flex-col items-center justify-center px-4 sm:px-6 gap-4 sm:gap-6 bg-black/20">

          {banner.title && (

            <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-heading italic text-white text-center leading-tight drop-shadow-lg">

              {banner.title}

            </h1>

          )}

          {banner.subtitle && (

            <p className="text-white text-xs md:text-sm font-semibold tracking-[0.25em] uppercase text-center drop-shadow">

              {banner.subtitle}

            </p>

          )}

          <div className="flex items-center justify-center gap-4 flex-wrap mt-4">

            {banner.buttonName && (

              <Button

                text={banner.buttonName}

                bgColor="#D98E04"

                accentColor="#F5B84B"

                onClick={() => banner.redirectUrl && navigate(banner.redirectUrl)}

              />

            )}

            <Button

              text="Watch Our Story"

              bgColor="#1a1a1a"

              accentColor="#666666"

              onClick={() => navigate('/about-us')}

            />

          </div>

        </div>



        {/* Navigation arrows */}

        {count > 1 && (

          <>

            <button

              onClick={prev}

              className="absolute left-3 sm:left-5 top-1/2 -translate-y-1/2 z-30 w-9 h-9 sm:w-11 sm:h-11 rounded-full bg-white/20 backdrop-blur-sm hover:bg-white/40 flex items-center justify-center transition-colors"

            >

              <ChevronLeft size={20} className="text-white" />

            </button>

            <button

              onClick={next}

              className="absolute right-3 sm:right-5 top-1/2 -translate-y-1/2 z-30 w-9 h-9 sm:w-11 sm:h-11 rounded-full bg-white/20 backdrop-blur-sm hover:bg-white/40 flex items-center justify-center transition-colors"

            >

              <ChevronRight size={20} className="text-white" />

            </button>

          </>

        )}



        {/* Dots indicator */}

        {count > 1 && (

          <div className="absolute bottom-[18%] sm:bottom-[16%] left-1/2 -translate-x-1/2 z-30 flex items-center gap-2">

            {banners.map((_, i) => (

              <button

                key={i}

                onClick={() => setCurrent(i)}

                className={`rounded-full transition-all ${i === current ? 'w-6 h-2 bg-gold' : 'w-2 h-2 bg-white/50 hover:bg-white/80'}`}

              />

            ))}

          </div>

        )}

      </div>

    </section>

  );

}
