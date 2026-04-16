import ProductsCharmMobile from './ProductsCharmMobile';
import FestiveBannerMobile from './FestiveBannerMobile';
import RealPeopleSectionMobile from './RealPeopleSectionMobile';

export default function ProductWrapperMobile({ products = [], cmsData = {} }) {
  return (
    <section className="bp-section  px-2  md:px-4">
      <ProductsCharmMobile products={products} />
      <div className="">
        <FestiveBannerMobile cmsData={cmsData.festiveBanner} />
      </div>
      <div className="">
        <RealPeopleSectionMobile cmsData={cmsData.realPeople} />
      </div>
    </section>
  );
}
