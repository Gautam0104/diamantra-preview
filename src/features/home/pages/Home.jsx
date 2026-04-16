import React, { lazy, Suspense, useEffect, useState } from "react";
import HeroBanner from "../components/HeroBanner";
import ShopByCategory from "../components/ShopByCategory";
import ForHerForHim from "../components/ForHerForHim";
import SEOProvider from "@/shared/components/common/SEOProvider/SEOProvider";
import { fetchIndexPageData } from "@/features/home/api/homeApi";
import { Skeleton } from "@/shared/components/ui/skeleton";

const VideoSection = lazy(() => import("../components/VideoSection"));
const FeaturedForYou = lazy(() => import("../components/FeaturedForYou"));
const GoldChains = lazy(() => import("../components/GoldChains"));
const VideoCards = lazy(() => import("../components/VideoCards"));
const WhyDiamantra = lazy(() => import("../components/WhyDiamantra"));
const ForMenSection = lazy(() => import("../components/ForMenSection"));
const ProductWrapper = lazy(() => import("../components/ProductWrapper"));
const AsSeenIn = lazy(() => import("../components/AsSeenIn"));
const InstaJourney = lazy(() => import("../components/InstaJourney"));
const NewsletterCTA = lazy(() => import("@/shared/components/common/newsletter/NewsletterCTA"));

const Home = React.memo(() => {
  const [pageData, setPageData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetchIndexPageData();
        setPageData(response.data.data);
        setLoading(false);
      } catch (err) {
        console.log(err.message);
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const cmsMap = {};
  (pageData?.homePageSections || []).forEach((s) => {
    cmsMap[s.sectionKey] = s.content;
  });

  if (loading)
    return (
      <section className="flex flex-col w-full">
        {/* SVG clip-path definition — matches HeroBanner */}
        <svg width="0" height="0" className="absolute">
          <defs>
            <clipPath id="heroCurveClipSkeleton" clipPathUnits="objectBoundingBox">
              <path d="M0,0 H1 V0.85 C0.6,0.85 0.55,0.85 0.5,1 C0.45,0.85 0.4,0.85 0,0.85 Z" />
            </clipPath>
          </defs>
        </svg>

        <div
          className="relative w-full h-[50vh] sm:h-[55vh] md:h-[65vh] overflow-hidden bg-gray-300"
          style={{ clipPath: "url(#heroCurveClipSkeleton)" }}
        >
          <Skeleton className="absolute inset-0 w-full h-full rounded-none" />

          {/* Centered content — matches HeroBanner overlay */}
          <div className="absolute inset-0 z-20 flex flex-col items-center justify-center px-4 sm:px-6 gap-4 sm:gap-6">
            {/* Title */}
            <div className="space-y-2 flex flex-col items-center">
              <Skeleton className="h-9 sm:h-10 md:h-12 lg:h-14 w-64 sm:w-80 md:w-96 rounded" />
              <Skeleton className="h-9 sm:h-10 md:h-12 lg:h-14 w-48 sm:w-64 md:w-72 rounded" />
            </div>

            {/* Subtitle */}
            <Skeleton className="h-3 md:h-4 w-48 md:w-72 rounded" />

            {/* Two buttons */}
            <div className="flex items-center justify-center gap-4 flex-wrap mt-4">
              <Skeleton className="h-10 w-40 rounded-full" />
              <Skeleton className="h-10 w-36 rounded-full" />
            </div>
          </div>

          {/* Nav arrows */}
          <Skeleton className="absolute left-3 sm:left-5 top-1/2 -translate-y-1/2 z-30 w-9 h-9 sm:w-11 sm:h-11 rounded-full" />
          <Skeleton className="absolute right-3 sm:right-5 top-1/2 -translate-y-1/2 z-30 w-9 h-9 sm:w-11 sm:h-11 rounded-full" />

          {/* Dot indicators */}
          <div className="absolute bottom-[18%] sm:bottom-[16%] left-1/2 -translate-x-1/2 z-30 flex items-center gap-2">
            <Skeleton className="w-6 h-2 rounded-full" />
            <Skeleton className="w-2 h-2 rounded-full" />
            <Skeleton className="w-2 h-2 rounded-full" />
          </div>
        </div>
      </section>
    );

  return (
    <>
      <SEOProvider
        title="Diamantra | Exquisite Collections for Every Occasion"
        description="Discover Diamantra for beautifully crafted, premium diamond jewellery designed for every occasion. Elevate your look with our exquisite collection and timeless elegance."
        keywords={[
          "luxury jewelry",
          "diamond rings",
          "gold necklaces",
          "wedding jewellery",
          "engagement rings",
          "handcrafted jewelry",
          "premium jewelry collection",
        ]}
        image="/logo.png"
        url={window.location.href}
      />
      <HeroBanner banners={pageData?.banner || []} />
      <div className="flex flex-col relative -mt-4">
        {/* Background graphic behind content */}
        <div className="absolute inset-0 flex items-center justify-center z-0 pointer-events-none opacity-25">
          <img src="bg-graphic.png" alt="" className="h-[135%]" loading="lazy" />
        </div>
        <ShopByCategory categories={pageData?.jewelleryType} />
        <ForHerForHim cmsData={cmsMap["for-her-for-him"]} />
      </div>
      <Suspense fallback={null}><VideoSection cmsData={cmsMap["video-section"]} /></Suspense>
      <Suspense fallback={null}><FeaturedForYou products={pageData?.trendingProduct} /></Suspense>
      <Suspense fallback={null}><GoldChains cmsData={cmsMap["gold-chains"]} /></Suspense>
      <Suspense fallback={null}><VideoCards cmsData={cmsMap["video-cards"]} /></Suspense>
      <Suspense fallback={null}><WhyDiamantra cmsData={cmsMap["why-diamantra"]} /></Suspense>
      <Suspense fallback={null}><ForMenSection /></Suspense>
      <Suspense fallback={null}><ProductWrapper products={pageData?.newArrivals} cmsData={{ festiveBanner: cmsMap["festive-banner"], realPeople: cmsMap["real-people-section"] }} /></Suspense>
      <Suspense fallback={null}><AsSeenIn cmsData={cmsMap["as-seen-in"]} /></Suspense>
      <Suspense fallback={null}><InstaJourney cmsData={cmsMap["insta-journey"]} /></Suspense>
      <Suspense fallback={null}><NewsletterCTA /></Suspense>
    </>
  );
});

export default Home;
