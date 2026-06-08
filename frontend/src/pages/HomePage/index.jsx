import { useEffect } from "react";
import { useLocation } from "react-router-dom";
import Carousel from "../../components/Carousel";
import HomeFeaturesBanner from "./components/HomeFeaturesBanner";
import HomeCategories from "./components/HomeCategories";
import HomeFeaturedProducts from "./components/HomeFeaturedProducts";
import HomeFeaturedTypes from "./components/HomeFeaturedTypes";
import useHomeData from "./hooks/useHomeData";
import Clip1 from "./components/HomeClip1";
import Clip2 from "./components/HomeClip2";

export default function HomePage() {
  const { products, categories, homeContent } = useHomeData();
  const location = useLocation();

  useEffect(() => {
    const slug = sessionStorage.getItem('scrollToCategory');
    if (!slug || categories.length === 0) return;
    const doScroll = (el) => {
      const headerHeight = document.querySelector('header')?.offsetHeight || 0;
      const top = el.getBoundingClientRect().top + window.scrollY - headerHeight - 16;
      window.scrollTo({ top, behavior: 'smooth' });
    };
    const el = document.getElementById(`fp-${slug}`)
      || document.getElementById(`category-${slug}`);
    if (el) {
      doScroll(el);
    }
    sessionStorage.removeItem('scrollToCategory');
  }, [categories, location.state?._st]);

  return (
    <div className="min-h-screen">
      <Carousel data={homeContent?.carousel} />
      <HomeFeaturesBanner features={homeContent?.featuresBanner?.features} />
      <HomeCategories
        categories={categories}
        title={homeContent?.categoriesSection?.title}
        subtitle={homeContent?.categoriesSection?.subtitle}
      />
      <HomeFeaturedProducts
        products={products}
        categories={categories}
        title={homeContent?.featuredProducts?.title}
        subtitle={homeContent?.featuredProducts?.subtitle}
      />
      <Clip1 data={homeContent?.clip} />
      <HomeFeaturedTypes
        data={homeContent?.featuredTypes}
      />
      <Clip2 data={homeContent?.ctaSection} />
    </div>
  );
}
