import { useNavigate } from "react-router-dom";
import Button from "../ui/Button";

function Sparkle({ className = "" }) {
  return (
    <svg
      className={className}
      width="18"
      height="18"
      viewBox="0 0 20 20"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        d="M10 0 L12 8 L20 10 L12 12 L10 20 L8 12 L0 10 L8 8 Z"
        fill="#C9A84C"
      />
    </svg>
  );
}

const DEFAULT_CARDS = [
  { title: "For Her", subtitle: "Grace with Edge", button: "Shop Now", imgTop: "/home/for-her/woman-green-sari-with-gold-necklace-her-head 1.png", imgBottom: "/home/for-her/image.svg", link: "/shop-all?gender=WOMEN", bgColor: "#767057", btnBg:"#D98E04", btnAccentColor:"#F5B84B", },
  { title: "For Him", subtitle: "Grace with Edge", button: "Shop Now", imgTop: "/home/for-him/image-15.png", imgBottom: "/home/for-him/image-13.svg", link: "/shop-all?gender=MEN", bgColor: "#A79B7A", btnBg:"#000000", btnAccentColor:"#505050" },
];

export default function ForHerForHimMobile({ cmsData }) {
  const navigate = useNavigate();
  const cards = cmsData?.cards ?? DEFAULT_CARDS;
  return (
    <section className="py-8 md:py-12 bg-white relative">
      <div className="relative z-10 max-w-7xl mx-auto px-2  md:px-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6">
          {cards.map((card, index) => (
            <div key={card.title} className="relative group cursor-pointer">
              {/* Card body */}
              <div
                className="relative h-80 sm:h-87.5 md:h-105 rounded-xl overflow-hidden"
                style={{ backgroundColor: card.bgColor }}
              >
                {/* Decorative background image (mandala / pattern) */}
                <img
                  src={card.imgBottom}
                  alt=""
                  className="absolute top-[-20%] right-[-2%] w-90 h-[70%] object-contain opacity-75 pointer-events-none select-none"
                  loading="lazy"
                />

                {/* Person image — right side, top-aligned */}
                <img
                  src={card.imgTop}
                  alt={card.title}
                  className="absolute right-0 top-0 h-full object-contain object-right-top z-10"
                  loading="lazy"
                />

                {/* Left gradient for text legibility */}
                <div className="absolute inset-y-0 left-0 w-3/5 bg-gradient-to-r from-black/25 to-transparent pointer-events-none z-20" />

                {/* Text content */}
                <div className="absolute bottom-20 left-0 p-6 sm:p-8 md:p-10 z-30">
                  <h3 className="font-heading text-[45px] sm:text-[45px] md:text-[65px] text-[#FFFCF0] font-normal mb-1 tracking-[-2%] leading-[45.95px]">
                    {card.title}
                  </h3>
                  <p className="text-[#CEC8AE] text-[10px] mb-2 tracking-[59%] uppercase font-semibold leading-[22.97px]">{card.subtitle}</p>
                  <Button text={card.button} bgColor={card.btnBg} accentColor={card.btnAccentColor} className="text-[14px] px-6 py-4 " onClick={() => navigate(card.link)} />
                </div>
              </div>

              {/* Curve on right for "For Her" (index 0) — hidden on mobile single-col */}
              {index === 0 && (
                <div className="block absolute right-3 bottom-20 -translate-y-1/2 translate-x-1/2 z-50">
                  <img src="/Vector.png" alt="" className="rotate-90" loading="lazy" />
                </div>
              )}

              {/* Curve on right for "For Him" (index 1) — hidden on mobile single-col */}
              {index === 1 && (
                <div className="block absolute right-3 bottom-20 -translate-y-1/2 translate-x-1/2 z-50">
                  <img src="/Vector.png" alt="" className="rotate-90" loading="lazy" />
                </div>
              )}



            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
