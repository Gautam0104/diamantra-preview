import { useNavigate } from "react-router-dom";

export default function GoldChainsMobile({ cmsData }) {
  const navigate = useNavigate();
  const label = cmsData?.label ?? "Bold. Powerful. Elegant.";
  const heading = cmsData?.heading ?? "Gold Chains\nStarting @ ₹9,999";
  const subText = cmsData?.subText ?? "Bracelets • Rings • Pendants";
  const buttonText = cmsData?.buttonText ?? "Shop Now";
  const buttonLink = cmsData?.buttonLink ?? "/shop-all?category=gold-chains";
  const bgImage = cmsData?.bgImage ?? "/home/gold-chains/luxury-shine-diamonds-digital-art 1.svg";
  const modelImage = cmsData?.modelImage ?? "/home/gold-chains/image 13.svg";
  const [headingLine1, headingLine2] = heading.split("\n");
  return (
    <section className="py-8 md:py-12 bg-white">
      <div className="max-w-7xl mx-auto px-2  md:px-4">
        <div
          className="relative rounded-lg overflow-hidden flex items-center justify-center h-40 sm:h-40 md:h-[249px]"
          style={{ backgroundColor: "#666666" }}
        >
          {/* Decorative background SVG */}
          <img
            src={bgImage}
            alt=""
            className="absolute inset-0 w-full h-full object-cover pointer-events-none select-none"
            loading="lazy"
          />

          {/* Centered content: model + text */}
          <div className="relative z-10 flex items-center gap-2 xs:gap-4 md:gap-8">
            {/* Model image */}
            <img
              src={modelImage}
              alt="Gold Chains"
              className="h-36 xs:h-40 sm:h-40 md:h-[249px] w-auto object-contain flex-shrink-0 mt-4"
              loading="lazy"
            />

            {/* Text content */}
            <div className="flex flex-col items-start text-left">
              <p className="text-white text-xs md:text-[14px] font-semibold tracking-[10%] leading-tight md:leading-[40px] uppercase">
                {label}
              </p>
              <h2 className="font-heading text-lg xs:text-xl sm:text-2xl md:text-[57px] text-white font-normal leading-tight md:leading-[48px] tracking-[0%] mb-1 md:mb-2">
                {headingLine1}
                {headingLine2 && <><br /> {headingLine2}</>}
              </h2>
              <div className="flex flex-col items-start gap-1 mt-1 md:flex-row md:items-center md:gap-6 md:mt-4">
                <p className="text-white text-[10px] sm:text-xs font-semibold tracking-[10%] leading-tight md:leading-[40px] uppercase">
                  {subText}
                </p>
                <button
                  onClick={() => navigate(buttonLink)}
                  className="border bg-white text-black text-[10px] font-semibold tracking-widest uppercase px-4 py-1.5 md:px-8 md:py-4 rounded-full hover:bg-white hover:text-charcoal transition-colors cursor-pointer"
                >
                  {buttonText}
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
