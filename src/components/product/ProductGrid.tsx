import ProductCard from "./ProductCard";
import type { Product } from "@/lib/types";

type Props = {
  products: Product[];
  title?: string;
  viewAllHref?: string;
};

export default function ProductGrid({ products, title, viewAllHref }: Props) {
  if (products.length === 0) {
    return (
      <div className="text-center py-16 text-gray-400">
        <p className="text-lg">Бараа олдсонгүй</p>
      </div>
    );
  }

  return (
    <section>
      {title && (
        <div className="flex items-center justify-between mb-5">
          <h2 className="text-xl font-bold text-gray-950">{title}</h2>
          {viewAllHref && (
            <a
              href={viewAllHref}
              className="text-sm text-orange-500 hover:text-orange-600 font-medium"
            >
              Бүгдийг харах →
            </a>
          )}
        </div>
      )}

      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-3 sm:gap-4">
        {products.map((product) => (
          <ProductCard key={product.id} product={product} />
        ))}
      </div>
    </section>
  );
}
