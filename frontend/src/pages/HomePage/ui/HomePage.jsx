import { useState, useEffect } from "react";
import { API } from "../../../api/axiosClient.js";
import Carousel from "../../../components/Carousel";
import FeaturesBanner from "../components/FeaturesBanner";
import CategoriesSection from "../components/CategoriesSection";
import FeaturedProducts from "../components/FeaturedProducts";
import BannerPromotion from "../components/Clip.jsx";
import FeaturedTypes from "../components/FeaturedTypes";
import CTASection from "../components/CTASection";
import Clip from "../components/Clip.jsx";

export default function HomePage() {
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const abortController = new AbortController();
    const fetchData = async () => {
      try {
        const [productsRes, categoriesRes] = await Promise.all([
          API.get("/products?limit=8", { signal: abortController.signal }),
          API.get("/categories", { signal: abortController.signal })
        ]);
        if (!abortController.signal.aborted) {
          setProducts(productsRes.data?.data?.products || []);
          setCategories(categoriesRes.data?.data?.categories || []);
        }
      } catch (error) {
        if (error.name !== 'CanceledError' && !abortController.signal.aborted) {
          // Handle error
        }
      } finally {
        if (!abortController.signal.aborted) {
          setLoading(false);
        }
      }
    };
    fetchData();
    return () => abortController.abort();
  }, []);

  return (
    <div className="min-h-screen">
      <Carousel />
      <FeaturesBanner />
      <CategoriesSection categories={categories} />
      <FeaturedProducts products={products} loading={loading} />
      <Clip/>
      <FeaturedTypes />
      <CTASection />
    </div>
  );
}