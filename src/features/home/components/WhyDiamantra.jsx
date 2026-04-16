const DEFAULT_LEFT_FEATURES = [
  { img: "/home/why-diamantra/Group1.svg", title: "Certified Lab Diamonds" },
  { img: "/home/why-diamantra/Group2.svg", title: "Lifetime Polishing" },
];

const DEFAULT_RIGHT_FEATURES = [
  { img: "/home/why-diamantra/Group3.svg", title: "925 Sterling Silver" },
  { img: "/home/why-diamantra/Group4.svg", title: "Free Shipping & Warranty" },
];

export default function WhyDiamantra({ cmsData }) {
  const sectionTitle = cmsData?.sectionTitle ?? "Why Diamantra";
  const centerImage = cmsData?.centerImage ?? "/home/why-diamantra/image.png";
  const bottomImage = cmsData?.bottomImage ?? "/home/why-diamantra/image-bottom.svg";
  const allFeatures = cmsData?.features ?? [...DEFAULT_LEFT_FEATURES, ...DEFAULT_RIGHT_FEATURES];
  const leftFeatures = allFeatures.slice(0, 2);
  const rightFeatures = allFeatures.slice(2, 4);
  return (
    <section className="bg-[#faf5f0] h-auto md:h-[481px] flex flex-col md:overflow-hidden px-6 sm:px-10 md:px-16 lg:px-24 mt-12">
      {/* Heading */}
      <div className="flex items-center justify-center gap-4 py-5 shrink-0">
        <div className="flex items-center">
          <div className="w-10 sm:w-16 md:w-24">
            <img src="/home/why-diamantra/Line-left.svg" alt="" loading="lazy" className="w-full h-[2px]" />
          </div>
          <svg width="12" height="12" viewBox="0 0 10 10" fill="none">
            <polygon points="0,5 5,0 10,5 5,10" fill="#000000" />
          </svg>
        </div>
        <h2 className="font-heading text-xl sm:text-2xl md:text-[30px] text-charcoal whitespace-nowrap -tracking-[2%] leading-[66px]">
          {sectionTitle}
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

      {/* Three-column content — fills remaining height */}
      <div className="flex flex-1 items-center justify-center gap-6 md:gap-10 lg:gap-16 min-h-0">
        {/* Left features — spaced top/bottom across the column height */}
        <div className="hidden md:flex flex-col justify-between h-[72%] shrink-0 w-[160px] lg:w-[260px]">
          {leftFeatures.map(({ img, title }) => (
            <div key={title} className="flex items-center gap-3">
              <img
                src={img}
                alt={title}
                className="w-14 h-14 lg:w-[118px] lg:h-[118px] object-contain shrink-0"
                loading="lazy"
              />
              <span className="font-semibold uppercase text-[12px]  text-charcoal tracking-[10%] leading-[17px]">
                {title}
              </span>
            </div>
          ))}
        </div>

        {/* Center portrait — fills full column height */}
        <div className="hidden md:flex relative md:h-full w-full max-w-[481px] flex-shrink-0 items-end overflow-visible">
          <img
            src={bottomImage}
            alt=""
            aria-hidden="true"
            className="absolute -bottom-10 left-1/2 -translate-x-1/2 pointer-events-none"
            style={{ zIndex: 0, width: "100%", maxWidth: "600px", height: "auto" }}
            loading="lazy"
          />
          <img
            src={centerImage}
            alt="Why Diamantra"
            className="h-full w-full object-contain object-bottom"
            style={{ position: "relative", zIndex: 1 }}
            loading="lazy"
          />
        </div>

        {/* Right features — spaced top/bottom across the column height */}
        <div className="hidden md:flex flex-col justify-between h-[72%] shrink-0 w-[160px] lg:w-[260px]">
          {rightFeatures.map(({ img, title }) => (
            <div key={title} className="flex items-center gap-3">
              <img
                src={img}
                alt={title}
                className="w-14 h-14 lg:w-[118px] lg:h-[118px] object-contain shrink-0"
                loading="lazy"
              />
              <span className="font-semibold uppercase text-[12px]  text-charcoal tracking-[10%] leading-[17px]">
                {title}
              </span>
            </div>
          ))}
        </div>
      </div>

      {/* Mobile — features below portrait */}
      <div className="grid grid-cols-2 md:hidden gap-x-4 gap-y-4 pb-6 px-2 shrink-0">
        {[...leftFeatures, ...rightFeatures].map(({ img, title }) => (
          <div key={title} className="flex flex-col md:flex-row items-center gap-3">
            <img src={img} alt={title} className="w-12 h-12 object-contain shrink-0" loading="lazy" />
            <span className="font-semibold uppercase text-[11px] text-charcoal leading-tight tracking-wide">
              {title}
            </span>
          </div>
        ))}
      </div>
    </section>
  );
}
