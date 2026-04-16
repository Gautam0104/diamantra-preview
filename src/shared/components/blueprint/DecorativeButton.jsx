import React from 'react';

const DecorativeButton = ({
  text = "Shop the Collection",
  bgColor = "#D98E04",
  accentColor = "#F5B84B",
  onClick,
  className = "",
  disabled = false,
  type = "button",
}) => {
  return (
    <button
      type={type}
      onClick={onClick}
      disabled={disabled}
      className={`group relative flex items-center justify-center px-4 py-2 sm:px-5 sm:py-2.5 md:px-8 md:py-2.5 lg:px-8 lg:py-2.5 transition-transform active:scale-95 ${disabled ? "opacity-60 cursor-not-allowed !active:scale-100" : ""} ${className}`}
    >
      {/* Main Button Body */}
      <div
        className="absolute inset-0 rounded-full"
        style={{ backgroundColor: bgColor }}
      />

      {/* Inner Decorative Border */}
      <div
        className="absolute inset-0.5 sm:inset-1 rounded-full border-[1.5px] sm:border-2 flex items-center justify-between"
        style={{ borderColor: `${accentColor}99` }}
      >
        {/* Left Dot */}
        <div
          className="h-1.5 w-1.5 sm:h-2 sm:w-2 -ml-0.5 sm:-ml-1 rounded-full"
          style={{ backgroundColor: accentColor }}
        />

        {/* Right Dot */}
        <div
          className="h-1.5 w-1.5 sm:h-2 sm:w-2 -mr-0.5 sm:-mr-1 rounded-full"
          style={{ backgroundColor: accentColor }}
        />
      </div>

      {/* Button Text */}
      <span className="relative z-10 text-xs sm:text-sm md:text-base lg:text-lg font-semibold text-white tracking-tight whitespace-nowrap">
        {text}
      </span>
    </button>
  );
};

export default DecorativeButton;