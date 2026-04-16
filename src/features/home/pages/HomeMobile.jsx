import React, { lazy, Suspense, useEffect, useState } from "react";
import HeroBannerMobile from "../components/HeroBannerMobile";
import ShopByCategoryMobile from "../components/ShopByCategoryMobile";
import ForHerForHimMobile from "../components/ForHerForHimMobile";
import SEOProvider from "@/shared/components/common/SEOProvider/SEOProvider";
import { fetchIndexPageData } from "@/features/home/api/homeApi";
import { Skeleton } from "@/shared/components/ui/skeleton";

const VideoSectionMobile = lazy(() => import("../components/VideoSectionMobile"));
const FeaturedForYouMobile = lazy(() => import("../components/FeaturedForYouMobile"));
const GoldChainsMobile = lazy(() => import("../components/GoldChainsMobile"));
const VideoCardsMobile = lazy(() => import("../components/VideoCardsMobile"));
const WhyDiamantraMobile = lazy(() => import("../components/WhyDiamantraMobile"));
const ForMenSectionMobile = lazy(() => import("../components/ForMenSectionMobile"));
const ProductWrapperMobile = lazy(() => import("../components/ProductWrapperMobile"));
const AsSeenInMobile = lazy(() => import("../components/AsSeenInMobile"));
const InstaJourneyMobile = lazy(() => import("../components/InstaJourneyMobile"));
const NewsletterCTA = lazy(() => import("@/shared/components/common/newsletter/NewsletterCTA"));

const HomeMobile = React.memo(() => {
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
      <section className="w-full">
        <div className="relative w-full aspect-[3/1] overflow-hidden bg-gray-200">
          <Skeleton className="absolute inset-0 w-full h-full rounded-none" />
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
      <HeroBannerMobile banners={pageData?.banner || []} />
      <div className="flex flex-col relative -mt-4">
        {/* Background graphic behind content */}
        <div className="absolute inset-0 flex items-center justify-center z-0 pointer-events-none opacity-25">
          <img src="bg-graphic.png" alt="" className="h-[135%]" loading="lazy" />
        </div>
        <ShopByCategoryMobile categories={pageData?.jewelleryType} />
        <ForHerForHimMobile cmsData={cmsMap["for-her-for-him"]} />
      </div>
      <Suspense fallback={null}><VideoSectionMobile cmsData={cmsMap["video-section"]} /></Suspense>
      <Suspense fallback={null}><FeaturedForYouMobile products={pageData?.trendingProduct} /></Suspense>
      <Suspense fallback={null}><GoldChainsMobile cmsData={cmsMap["gold-chains"]} /></Suspense>
      <Suspense fallback={null}><VideoCardsMobile cmsData={cmsMap["video-cards"]} /></Suspense>
      <Suspense fallback={null}><WhyDiamantraMobile cmsData={cmsMap["why-diamantra"]} /></Suspense>
      <Suspense fallback={null}><ForMenSectionMobile /></Suspense>
      <Suspense fallback={null}><ProductWrapperMobile products={pageData?.newArrivals} cmsData={{ festiveBanner: cmsMap["festive-banner"], realPeople: cmsMap["real-people-section"] }} /></Suspense>
      <Suspense fallback={null}><AsSeenInMobile cmsData={cmsMap["as-seen-in"]} /></Suspense>
      <Suspense fallback={null}><InstaJourneyMobile cmsData={cmsMap["insta-journey"]} /></Suspense>
      <Suspense fallback={null}><NewsletterCTA /></Suspense>
    </>
  );
});

export default HomeMobile;
