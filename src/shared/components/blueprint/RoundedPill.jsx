import React from 'react';

const RoundedPill = ({
  text = "Apply",
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
      className={`group relative flex items-center justify-center px-3 py-1.5 sm:px-4 sm:py-2 transition-transform active:scale-95 ${disabled ? "opacity-60 cursor-not-allowed !active:scale-100" : ""} ${className}`}
    >
      {/* Main Button Body */}
      <div
        className="absolute inset-0 rounded-full"
        style={{ backgroundColor: bgColor }}
      />

      {/* Inner Decorative Border */}
      <div
        className="absolute inset-[1px] sm:inset-0.5 rounded-full border sm:border-[1.5px] flex items-center justify-between"
        style={{ borderColor: `${accentColor}99` }}
      >
        {/* Left Dot */}
        <div
          className="h-1 w-1 sm:h-1.5 sm:w-1.5 -ml-0.5 rounded-full"
          style={{ backgroundColor: accentColor }}
        />

        {/* Right Dot */}
        <div
          className="h-1 w-1 sm:h-1.5 sm:w-1.5 -mr-0.5 rounded-full"
          style={{ backgroundColor: accentColor }}
        />
      </div>

      {/* Button Text */}
      <span className="relative z-10 text-[11px] sm:text-xs md:text-sm font-medium text-white tracking-tight whitespace-nowrap">
        {text}
      </span>
    </button>
  );
};

export default RoundedPill
