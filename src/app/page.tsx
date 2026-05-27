import HeroBanner from "@/components/layout/HeroBanner";
import CategoryGrid from "@/components/layout/CategoryGrid";
import PromoBanner from "@/components/layout/PromoBanner";
import ProductGrid from "@/components/product/ProductGrid";
import type { Metadata } from "next";
import { getFeaturedProducts, getNewProducts, getMostDiscountedProducts } from "@/lib/mockData";

export const metadata: Metadata = {
  title: "MMART — Монголын онлайн зах",
};

export default async function HomePage() {
  const featuredProducts = getFeaturedProducts();
  const newProducts = getNewProducts();
  const discountedProducts = getMostDiscountedProducts();

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 space-y-10">
      {/* Hero */}
      <HeroBanner />

      {/* Categories */}
      <CategoryGrid />

      {/* Promo banners */}
      <PromoBanner />

      {/* Featured products */}
      {featuredProducts.length > 0 && (
        <ProductGrid
          products={featuredProducts}
          title="⭐ Онцлох бараанууд"
          viewAllHref="/products?featured=true"
        />
      )}

      {/* Most discounted */}
      {discountedProducts.length > 0 && (
        <ProductGrid
          products={discountedProducts}
          title="🔥 Хамгийн их хямдарсан"
          viewAllHref="/products?sort=discount"
        />
      )}

      {/* New arrivals */}
      {newProducts.length > 0 && (
        <ProductGrid
          products={newProducts}
          title="✨ Шинэ бараанууд"
          viewAllHref="/products?sort=newest"
        />
      )}

      {/* Vendor CTA */}
      <section className="rounded-2xl bg-gray-950 text-white p-8 sm:p-12
        flex flex-col sm:flex-row items-center justify-between gap-6">
        <div>
          <h2 className="text-2xl font-black mb-2">Дэлгүүрээ нээхэд бэлэн үү?</h2>
          <p className="text-gray-400 text-sm">
            Өнөөдрөөс эхлэн өөрийн бараагаа байршуулж, олон мянган худалдан авагчдад хүрнэ.
          </p>
        </div>
        <a
          href="/vendor/register"
          className="flex-shrink-0 px-8 py-3 bg-orange-500 hover:bg-orange-600
            text-white font-bold rounded-xl transition-colors whitespace-nowrap"
        >
          Одоо эхлэх →
        </a>
      </section>
    </div>
  );
}
