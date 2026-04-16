import DecorativeButton from "../../blueprint/DecorativeButton";
import RoundedPill from "../../blueprint/RoundedPill";

const diamonds = [
  { top: "8%",  left: "5%",   width: "clamp(60px, 12vw, 140px)",  rotate: -20 },
  { top: "5%",  left: "38%",  width: "clamp(24px, 5vw, 44px)",    rotate:  10 },
  { top: "70%", left: "20%",  width: "clamp(40px, 7vw, 80px)",    rotate: -15 },
  { top: "4%",  right: "14%", width: "clamp(60px, 12vw, 140px)",  rotate:  30 },
  { top: "72%", right: "15%", width: "clamp(36px, 6vw, 70px)",    rotate:  20 },
];

export default function NewsletterCTA() {
  return (
    <>
      {/* Ready to Glow Up CTA */}
      <section
        className="flex justify-center py-5 md:py-12"
      >
        <div
         className="relative overflow-hidden flex justify-center items-center h-[200px] md:h-[268px] w-[90%] md:w-[92%] rounded-[10px]"
        style={{
          backgroundImage: `url('/home/gold-chains/luxury-shine-diamonds-digital-art 1.svg')`,
          backgroundSize: "cover",
          backgroundPosition: "center",
          backgroundColor: "#666666",
        }}
        >
                  {/* Scattered diamonds */}
        {diamonds.map((d, i) => (
          <img
            key={i}
            src="/home/diamond.png"
            alt=""
            className="absolute object-contain pointer-events-none select-none"
            style={{
              top: d.top,
              left: d.left,
              right: d.right,
              bottom: d.bottom,
              width: d.width,
              height: d.width,
              transform: `rotate(${d.rotate}deg)`,
              opacity: 0.92,
            }}
          />
        ))}

        {/* Content */}
        <div className="relative z-10 max-w-2xl mx-auto px-6 md:px-4 flex flex-col items-center text-center">
          <h2
            className="text-[32px]  text-white leading-[30px]  tracking-[0%] mb-2.5 md:mb-3 max-w-[180px] sm:max-w-none"
           
          >
            Ready to Glow Up?
          </h2>
          <p className="text-white text-[8.5px]  tracking-[2%]  uppercase mb-3 md:mb-8 max-w-[260px] sm:max-w-md font-medium">
            Thousands already have their sparkle. Time to get yours with
            Diamantra.
          </p>
          <DecorativeButton text="Shop Now" />
        </div>
        </div>
      </section>

      {/* Newsletter */}
      <section className="py-8 md:py-10 ">
        <div className="max-w-7xl mx-auto  flex flex-col md:flex-row items-center justify-between gap-4 md:gap-6">
          <h2 className="text-base sm:text-lg md:text-xl font-bold text-charcoal text-center md:text-left">
            Join Our Newsletter to keep up to date with US!
          </h2>

          <div className="w-full md:w-auto">
            <div className="flex flex-row items-center gap-3 rounded-full border border-gray-300 bg-gray-100 px-1 py-1">
              <input
                type="email"
                placeholder="Enter your email"
                className="flex-1 min-w-0 sm:w-64 px-5 py-3 text-sm text-charcoal placeholder-gray-400 focus:outline-none focus:border-gold transition-colors"
              />
              <RoundedPill text="Subscribe" />
            </div>
            <label className="flex items-start gap-2 mt-3 text-xs text-gray-500 cursor-pointer">
              <input type="checkbox" className="accent-gold mt-0.5 shrink-0" />
              <span>
                By proceeding you agree to our{" "}
                <a href="#" className="underline text-gray-600 hover:text-charcoal">
                  Platform Terms & Privacy Notice
                </a>
                .
              </span>
            </label>
          </div>
        </div>
      </section>
    </>
  );
}
