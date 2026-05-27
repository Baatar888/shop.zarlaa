import ProductGrid from "@/components/product/ProductGrid";

export default function Home() {
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Бүх баннер, хямдралын хэсгийг устгасан тул шууд бараанууд харагдана */}
      <h2 className="text-xl font-bold text-gray-900 mb-6">
        Онцлох бараа бүтээгдэхүүн
      </h2>
      <ProductGrid />
    </div>
  );
}