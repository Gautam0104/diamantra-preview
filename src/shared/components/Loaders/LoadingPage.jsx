import React from "react";

const DiamondLoader = () => {
  return (
    <div className="fixed inset-0 bg-cream flex flex-col items-center justify-center gap-6 z-50">
      {/* Ring + gem */}
      <div className="relative w-24 h-24">
        {/* Static dim track */}
        <svg className="absolute inset-0 w-full h-full" viewBox="0 0 100 100">
          <circle
            cx="50"
            cy="50"
            r="40"
            fill="none"
            stroke="#D4AF37"
            strokeOpacity="0.25"
            strokeWidth="3"
          />
        </svg>

        {/* Spinning arc */}
        <svg
          className="absolute inset-0 w-full h-full animate-[spin_1.8s_linear_infinite]"
          style={{ transformOrigin: "50px 50px" }}
          viewBox="0 0 100 100"
        >
          <circle
            cx="50"
            cy="50"
            r="40"
            fill="none"
            stroke="#D4AF37"
            strokeWidth="3.5"
            strokeLinecap="round"
            strokeDasharray="188 63"
          />
        </svg>

        {/* Center 4-point sparkle gem */}
        <div className="absolute inset-0 flex items-center justify-center animate-pulse">
          <svg width="22" height="22" viewBox="0 0 100 100">
            <path
              d="M50,18 L57,43 L82,50 L57,57 L50,82 L43,57 L18,50 L43,43 Z"
              fill="#8B0000"
            />
          </svg>
        </div>
      </div>

      {/* Brand name */}
      <div className="animate-[loader-text-reveal_0.7s_0.4s_ease_forwards] opacity-0 font-heading text-xl text-maroon tracking-[0.3em]">
        DIAMANTRA
      </div>
    </div>
  );
};

export default DiamondLoader;
