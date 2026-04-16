import Button from "@features/home/ui/Button";

export default function PromoBanner() {
  return (
    <div className="col-span-1 sm:col-span-2 md:col-span-3 rounded-[20px] overflow-hidden bg-gray-border flex flex-col md:flex-row items-stretch my-2">
      {/* Left - Heading */}
      <div className="flex-1 flex items-center justify-center px-8 py-10 md:py-12">
        <h2 className="font-heading text-[39px] md:text-4xl text-white leading-tight italic">
          Rings That
          <br />
          Feel Like You
        </h2>
      </div>

      {/* Right - Description */}
      <div className="flex-1 flex flex-col justify-center px-8 py-8 md:py-12 bg-gray-border">
        <p className="text-white/80 text-sm leading-relaxed mb-6">
          Minimal, meaningful, and made to last.
          <br />
          Discover silver rings crafted for everyday elegance —
          <br />
          with lab-grown brilliance and conscious design.
        </p>
        <div>
          <Button text="Shop Now" />
        </div>
      </div>
    </div>
  );
}
