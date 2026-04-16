const DEFAULT_BANNERS = [
  { imageUrl: "/home/festive-banner/img02.jpg", alt: "Festive Jewelry", link: "/" },
  { imageUrl: "/home/festive-banner/img01.svg", alt: "20% Off Diamond", link: "/" },
  { imageUrl: "/home/festive-banner/img03.png", alt: "Shine Brighter", link: "/" },
];

export default function FestiveBanner({ cmsData }) {
  const banners = cmsData?.banners ?? DEFAULT_BANNERS;
  return (
    <section className="flex flex-col w-full ml-0 sm:ml-16 lg:ml-30 overflow-x-hidden">
      <div className="flex gap-4 overflow-x-auto lg:overflow-x-visible scrollbar-hide pb-2 lg:pb-0">
        {banners.map((banner, i) => (
          <div key={i} className="relative rounded-2xl h-[25vh] cursor-pointer flex-shrink-0 w-[80vw] sm:w-[42vw] lg:w-[calc((100%-20rem)/2.5)]">
            <img
              src={banner.imageUrl}
              alt={banner.alt}
              className="w-full h-full object-cover object-center rounded-md"
              onError={(e) => { e.currentTarget.style.display = "none"; }}
              draggable="false"
            />
          </div>
        ))}
      </div>
    </section>
  );
}
