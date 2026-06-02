import Carousel from "../../../components/Carousel";
import FeaturesBanner from "../components/FeaturesBanner";
import CategoriesSection from "../components/CategoriesSection";
import FeaturedProducts from "../components/FeaturedProducts";
import BannerPromotion from "../components/Clip.jsx";
import FeaturedTypes from "../components/FeaturedTypes";
import CTASection from "../components/CTASection";
import Clip from "../components/Clip.jsx";
import useHomeData from "../hooks/useHomeData";

export default function HomePage() {
  const { products, categories } = useHomeData();

  return (
    <div className="min-h-screen">
      <Carousel />
      <FeaturesBanner />
      <CategoriesSection categories={categories} />
      <FeaturedProducts products={products} categories={categories} />
      <Clip/>
      <FeaturedTypes />
      <CTASection />
    </div>
  );
}