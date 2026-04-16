import ProductsCharm from './ProductsCharm';
import FestiveBanner from './FestiveBanner';
import RealPeopleSection from './RealPeopleSection';

export default function ProductWrapper({ products = [], cmsData = {} }) {
  return (
    <section className="bp-section py-8 md:py-12 px-2  md:px-4">
      <ProductsCharm products={products} />
      <div className="mt-10 md:mt-12">
        <FestiveBanner cmsData={cmsData.festiveBanner} />
      </div>
      <div className="mt-12 md:mt-16">
        <RealPeopleSection cmsData={cmsData.realPeople} />
      </div>
    </section>
  );
}
