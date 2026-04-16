export default function SectionHeading({ title, subtitle }) {
  return (
    <div className="text-center mb-8 md:mb-12">
      <h2 className="text-2xl md:text-3xl lg:text-4xl font-heading text-charcoal">
        {title}
      </h2>
      {subtitle && (
        <p className="mt-2 text-gray-text text-sm md:text-base">
          {subtitle}
        </p>
      )}
      <div className="w-16 h-0.5 bg-gold mx-auto mt-4" />
    </div>
  );
}
