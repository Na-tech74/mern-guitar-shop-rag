import Carousel from "../../../components/Carousel";
import FeaturesBanner from "../components/FeaturesBanner";
import CategoriesSection from "../components/CategoriesSection";
import FeaturedProducts from "../components/FeaturedProducts";
import FeaturedTypes from "../components/FeaturedTypes";
import CTASection from "../components/CTASection";
import Clip from "../components/Clip.jsx";
import useHomeData from "../hooks/useHomeData";

export default function HomePage() {
  const { products, categories, homeContent } = useHomeData();

  return (
    <div className="min-h-screen">
      <Carousel data={homeContent?.carousel} />
      <FeaturesBanner features={homeContent?.featuresBanner?.features} />
      <CategoriesSection
        categories={categories}
        title={homeContent?.categoriesSection?.title}
        subtitle={homeContent?.categoriesSection?.subtitle}
      />
      <FeaturedProducts
        products={products}
        categories={categories}
        title={homeContent?.featuredProducts?.title}
        subtitle={homeContent?.featuredProducts?.subtitle}
      />
      <Clip data={homeContent?.clip} />
      <FeaturedTypes
        data={homeContent?.featuredTypes}
      />
      <CTASection data={homeContent?.ctaSection} />
    </div>
  );
}
