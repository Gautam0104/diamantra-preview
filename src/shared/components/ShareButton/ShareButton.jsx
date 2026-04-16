import { useState, useRef, useEffect } from "react";
import { FaTimes, FaWhatsapp, FaFacebookF, FaTwitter } from "react-icons/fa";
import { FiShare2, FiMail } from "react-icons/fi";
import { toast } from "sonner";

const ShareButton = ({
  url,
  title,
  price,
  variantTitle,
  className = "",
  buttonClassName,
  iconSize = "default",
  position = "absolute",
}) => {
  const [showSharePopup, setShowSharePopup] = useState(false);
  const popupRef = useRef(null);

  const positionClasses = {
    absolute: "absolute right-4 top-4",
    fixed: "fixed right-4 top-4",
    static: "",
  };

  const shareText = `${title} - ${variantTitle || title} for ${price}`;
  const size = iconSize === "small" ? 16 : 20;

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (popupRef.current && !popupRef.current.contains(event.target)) {
        setShowSharePopup(false);
      }
    };
    if (showSharePopup) document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [showSharePopup]);

  const links = [
    {
      label: "WhatsApp",
      icon: <FaWhatsapp size={size} className="text-[#25D366]" />,
      href: `https://api.whatsapp.com/send?text=${encodeURIComponent(`${shareText} ${url}`)}`,
    },
    {
      label: "Twitter",
      icon: <FaTwitter size={size} className="text-sky-500" />,
      href: `https://twitter.com/intent/tweet?url=${encodeURIComponent(url)}&text=${encodeURIComponent(shareText)}`,
    },
    {
      label: "Facebook",
      icon: <FaFacebookF size={size} className="text-[#1877F2]" />,
      href: `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(url)}`,
    },
    {
      label: "Email",
      icon: <FiMail size={size} className="text-gray-600" />,
      href: `mailto:?subject=${encodeURIComponent(title)}&body=${encodeURIComponent(`${shareText}\n\n${url}`)}`,
    },
  ];

  return (
    <>
      <button
        onClick={() => setShowSharePopup(true)}
        className={
          buttonClassName ??
          `${positionClasses[position]} cp bg-white/60 hover:bg-white p-2 rounded-full shadow-md ${className}`
        }
        aria-label="Share product"
      >
        <FiShare2 size={16} className="text-gray-500" />
      </button>

      {showSharePopup && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
          <div ref={popupRef} className="bg-white rounded-md p-4 w-full max-w-md">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-md sm:text-lg font-semibold">Share this product</h3>
              <button
                onClick={() => setShowSharePopup(false)}
                className="text-gray-500 hover:text-gray-700"
                aria-label="Close share menu"
              >
                <FaTimes />
              </button>
            </div>
            <div className="flex flex-wrap gap-6 justify-center">
              {links.map((l) => (
                <a
                  key={l.label}
                  href={l.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex flex-col items-center gap-2"
                >
                  <div className="w-10 h-10 border border-gray-200 rounded flex items-center justify-center hover:scale-110 transition-transform">
                    {l.icon}
                  </div>
                  <span className="text-xs">{l.label}</span>
                </a>
              ))}
            </div>
            <div className="mt-6 flex border rounded-md overflow-hidden">
              <input
                type="text"
                value={url}
                readOnly
                className="flex-1 px-3 py-2 text-xs sm:text-sm border-none outline-none bg-gray-50"
              />
              <button
                onClick={() => {
                  navigator.clipboard.writeText(url);
                  toast.success("Link copied to clipboard!");
                }}
                className="bg-[#8B0000] text-white px-4 py-2 text-xs sm:text-sm"
              >
                Copy
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default ShareButton;
