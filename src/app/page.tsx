import HeroBanner from "@/components/layout/HeroBanner";
import CategoryGrid from "@/components/layout/CategoryGrid";
import PromoBanner from "@/components/layout/PromoBanner";
import ProductGrid from "@/components/product/ProductGrid";
import type { Metadata } from "next";
import { getFeaturedProducts, getNewProducts, getMostDiscountedProducts } from "@/lib/mockData";

export const metadata: Metadata = {
  title: "Shop Zarlaa — Монголын онлайн зах",
};

export default async function HomePage() {
  const featuredProducts = getFeaturedProducts();
  const newProducts = getNewProducts();
  const discountedProducts = getMostDiscountedProducts();

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 space-y-10">
      <HeroBanner />
      <CategoryGrid />
      <PromoBanner />

      {featuredProducts.length > 0 && (
        <ProductGrid
          products={featuredProducts}
          title="⭐ Онцлох бараанууд"
          viewAllHref="/products?featured=true"
        />
      )}

      {discountedProducts.length > 0 && (
        <ProductGrid
          products={discountedProducts}
          title="🔥 Хамгийн их хямдарсан"
          viewAllHref="/products?sort=discount"
        />
      )}

      {newProducts.length > 0 && (
        <ProductGrid
          products={newProducts}
          title="✨ Шинэ бараанууд"
          viewAllHref="/products?sort=newest"
        />
      )}
    </div>
  );
}
