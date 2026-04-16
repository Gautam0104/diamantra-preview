import { Phone, Mail } from "lucide-react";
import { Link } from "react-router-dom";

const generateShopAllUrl = (params) => {
  const baseUrl = "/shop-all";
  const queryParams = new URLSearchParams();
  Object.entries(params).forEach(([key, value]) => {
    if (Array.isArray(value)) {
      if (value.length > 0) queryParams.set(key, value.join(","));
    } else if (value !== undefined && value !== null && value !== "") {
      queryParams.set(key, value.toString());
    }
  });
  return queryParams.toString() ? `${baseUrl}?${queryParams.toString()}` : baseUrl;
};

const footerLinks = {
  quickLinksCol1: [
    { name: "About Diamantra", href: "/about-us" },
    { name: "Blogs", href: "/blogs" },
    { name: "Contact Us", href: "/contact-us" },
    { name: "Payment Options", href: "/payment-options" },
    { name: "4C's of Diamond", href: "/diamonds-4cs" },
    { name: "Lab Grown Diamond Vs Natural Diamond", href: "/lab-grown-vs-natural-diamonds" },
    { name: "FAQs", href: "/faqs" },
  ],
  quickLinksCol2: [
    { name: "IGI Lab Grown Diamond Grading Report", href: "/lab-grown-diamond-grading-report" },
    { name: "Ring Size Chart", href: "/rings-size-chart" },
    { name: "Bracelet Size Chart", href: "/bracelets-size-chart" },
    { name: "Necklace Size Chart", href: "/necklaces-size-chart" },
    { name: "Bangles Size Chart", href: "/bangles-size-chart" },
    { name: "Diamond Size Guide", href: "/diamond-size-guide" },
  ],
  aboutUs: [
    { name: "Privacy Policy", href: "/privacy-policy" },
    { name: "Terms & Conditions", href: "/terms-and-conditions" },
    { name: "Exchange, Return & Refund Policy", href: "/exchange-return-and-refund-policy" },
    { name: "Shipping Policy", href: "/shipping-policy" },
    { name: "Lifetime Returns & Exchange Policy", href: "/page/lifetime-returns-and-exchange-policy" },
    { name: "Diamond Color Customization Policy", href: "/page/diamond-color-customization-policy" },
  ],
  resources: [
    { name: "Diamond Jewelry", href: "/shop-all" },
    { name: "Diamond Rings", href: generateShopAllUrl({ jewelryTypeSlug: "rings" }) },
    { name: "Diamond Earrings", href: generateShopAllUrl({ jewelryTypeSlug: "earrings" }) },
    { name: "Diamond Necklaces", href: generateShopAllUrl({ jewelryTypeSlug: "necklaces" }) },
    { name: "Bangles & Bracelets", href: generateShopAllUrl({ productStyleSlug: "bracelets,bangles", jewelryTypeSlug: "bracelets,bangles" }) },
    { name: "Solitaire", href: generateShopAllUrl({ productStyleSlug: "solitaire,solitaire-earrings,studs--tops,solitaire-pendant,mens-stud" }) },
    { name: "Men's Collections", href: generateShopAllUrl({ jewelryTypeSlug: "mens-collection" }) },
    { name: "Gifts", href: generateShopAllUrl({ isGift: "true" }) },
  ],
};


function WhatsAppButton() {
  return (
    <a
      href="https://wa.me/910000000000"
      target="_blank"
      rel="noopener noreferrer"
      className="fixed bottom-3 right-3 z-50 w-12 h-12 bg-[#25D366] rounded-full flex items-center justify-center shadow-lg hover:scale-110 transition-transform"
    >
      <svg width="24" height="24" viewBox="0 0 24 24" fill="white">
        <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
      </svg>
    </a>
  );
}

export default function Footer() {
  return (
    <>
      <footer className="bg-[#110808] text-white relative overflow-hidden">
        {/* Decorative star watermark */}
        <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
          <svg
            width="500"
            height="500"
            viewBox="0 0 500 500"
            fill="none"
            className="opacity-[0.04]"
          >
            <path
              d="M250 50L295 190L440 190L320 270L360 410L250 330L140 410L180 270L60 190L205 190Z"
              stroke="white"
              strokeWidth="2"
              fill="none"
            />
            <path
              d="M250 80L290 200L420 200L310 270L345 390L250 320L155 390L190 270L80 200L210 200Z"
              stroke="white"
              strokeWidth="1"
              fill="none"
            />
          </svg>
        </div>

        

        {/* Main footer content */}
        <div className="max-w-7xl mx-auto px-6 py-10 relative z-10">
          <div className="flex flex-col lg:flex-row lg:items-stretch gap-8 lg:gap-20">
            {/* Logo section with vertical line - desktop only */}
            <div className="shrink-0 hidden lg:flex items-center relative">
              <div className="absolute left-1/2 -translate-x-1/2 -top-10 -bottom-10 w-0.5 bg-white"></div>
              <div className="w-40 h-40 bg-white rounded-full flex items-center justify-center p-4 shadow-[0_0_30px_rgba(255,255,255,0.1)] relative z-10">
                <img
                  src="/logo.png"
                  alt="DiaMantra"
                  className="w-[85%] h-[85%] object-contain"
                />
              </div>
            </div>
            {/* Logo for tablet & mobile (no lines) */}
            <div className="shrink-0 self-center lg:hidden">
              <div className="w-28 h-28 md:w-36 md:h-36 bg-white rounded-full flex items-center justify-center p-4 shadow-[0_0_30px_rgba(255,255,255,0.1)]">
                <img
                  src="/logo.png"
                  alt="DiaMantra"
                  className="w-[85%] h-[85%] object-contain"
                />
              </div>
            </div>

            {/* Link sections wrapper: 2-col grid on mobile, 4-col on tablet, flex row on desktop */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-8 md:gap-6 lg:flex lg:gap-20 lg:flex-1 lg:ml-20">
              {/* Quick Links col 1 */}
              <div>
                <h4 className="text-sm font-semibold mb-4 tracking-wide">
                  Quick Links
                </h4>
                <ul className="space-y-1.5">
                  {footerLinks.quickLinksCol1.map((link) => (
                    <li key={link.name}>
                      <Link
                        to={link.href}
                        className="text-[13px] text-white/50 hover:text-gold transition-colors"
                      >
                        {link.name}
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>

              {/* Quick Links col 2 */}
              <div>
                <h4 className="text-sm font-semibold mb-4 tracking-wide lg:invisible">
                  &nbsp;
                </h4>
                <ul className="space-y-1.5">
                  {footerLinks.quickLinksCol2.map((link) => (
                    <li key={link.name}>
                      <Link
                        to={link.href}
                        className="text-[13px] text-white/50 hover:text-gold transition-colors"
                      >
                        {link.name}
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>

              {/* About Us + Here to Assist */}
              <div>
                <h4 className="text-sm font-semibold mb-4 tracking-wide">
                  About Us
                </h4>
                <ul className="space-y-1.5">
                  {footerLinks.aboutUs.map((link) => (
                    <li key={link.name}>
                      <Link
                        to={link.href}
                        className="text-[13px] text-white/50 hover:text-gold transition-colors"
                      >
                        {link.name}
                      </Link>
                    </li>
                  ))}
                </ul>

                <h4 className="text-sm font-semibold mt-6 mb-3 tracking-wide">
                  Here to Assist
                </h4>
                <div className="flex flex-col gap-2">
                  <a
                    href="tel:+910000000000"
                    className="flex items-center gap-1.5 text-[13px] text-white/50 hover:text-gold transition-colors"
                  >
                    <Phone size={13} className="shrink-0" />
                    (+91) 0000000000
                  </a>
                  <a
                    href="mailto:support@diamantra.com"
                    className="flex items-center gap-1.5 text-[13px] text-white/50 hover:text-gold transition-colors"
                  >
                    <Mail size={13} className="shrink-0" />
                    support@diamantra.com
                  </a>
                </div>
              </div>

              {/* Resources */}
              <div className="lg:whitespace-nowrap">
                <h4 className="text-sm font-semibold mb-4 tracking-wide">
                  Resources
                </h4>
                <ul className="space-y-1.5">
                  {footerLinks.resources.map((link) => (
                    <li key={link.name}>
                      <Link
                        to={link.href}
                        className="text-[13px] text-white/50 hover:text-gold transition-colors"
                      >
                        {link.name}
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom bar */}
        <div className="bg-maroon">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 py-3 flex flex-col sm:flex-row items-center justify-center gap-2 sm:gap-6">
            {/* Social icons */}
            <div className="flex items-center gap-12">
              <a
                href="https://www.facebook.com/profile.php?id=61577839056658"
                target="_blank"
                rel="noopener noreferrer"
                className="text-white hover:text-gold transition-colors"
              >
                <img src="/social-media-icon/fb.svg" alt="Facebook Icon" />
              </a>
              <a
                href="https://www.youtube.com/@Diamantra"
                target="_blank"
                rel="noopener noreferrer"
                className="text-white hover:text-gold transition-colors"
              >
                <img src="/social-media-icon/yt.svg" alt="YouTube Icon" />
              </a>
              <a
                href="https://www.linkedin.com/in/diamantra/"
                target="_blank"
                rel="noopener noreferrer"
                className="text-white hover:text-gold transition-colors"
              >
                <img src="/social-media-icon/x.svg" alt="X Icon" />
              </a>
              <a
                href="https://www.instagram.com/diamantra/"
                target="_blank"
                rel="noopener noreferrer"
                className="text-white hover:text-gold transition-colors"
              >
                <img src="/social-media-icon/insta.svg" alt="Instagram Icon" />
              </a>
            </div>

            {/* Separator */}
            <span className="text-white/40 hidden sm:inline">|</span>

            {/* Copyright */}
            <p className="text-xs text-white/80">
              Copyright &copy; {new Date().getFullYear()} DIAMANTRA. All rights reserved.
            </p>
          </div>
        </div>
      </footer>
      <WhatsAppButton />
    </>
  );
}
