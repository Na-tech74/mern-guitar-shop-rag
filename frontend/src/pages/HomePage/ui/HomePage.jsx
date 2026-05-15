import { useState, useEffect } from "react";
import { API } from "../../../api/axiosClient.js";
import Carousel from "../../../components/Carousel";
import FeaturesBanner from "../components/FeaturesBanner";
import CategoriesSection from "../components/CategoriesSection";
import FeaturedProducts from "../components/FeaturedProducts";
import BannerPromotion from "../components/BannerPromotion";
import FeaturedTypes from "../components/FeaturedTypes";
import CTASection from "../components/CTASection";

export default function HomePage() {
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [productsRes, categoriesRes] = await Promise.all([
          API.get("/products/get-all-products?limit=8"),
          API.get("/categories/get-all-categories")
        ]);
        setProducts(productsRes.data?.data || []);
        setCategories(categoriesRes.data?.data || []);
      } catch (error) {
        // Handle error
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  return (
    <div className="min-h-screen">
      <Carousel />
      <FeaturesBanner />
      <CategoriesSection categories={categories} />
      <FeaturedProducts products={products} loading={loading} />
      <BannerPromotion />
      <FeaturedTypes />
      <CTASection />
    </div>
  );
}