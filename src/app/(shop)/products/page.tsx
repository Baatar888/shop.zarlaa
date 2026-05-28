import ProductGrid from "@/components/product/ProductGrid";
import type { Metadata } from "next";
import { MOCK_PRODUCTS } from "@/lib/mockData";

export const metadata: Metadata = { title: "Бүх бараа" };

type SearchParams = {
  q?: string;
  category?: string;
  sort?: string;
  minPrice?: string;
  maxPrice?: string;
  page?: string;
  featured?: string;
};

const SORT_OPTIONS = [
  { value: "newest", label: "Шинэ эхэнд" },
  { value: "discount", label: "Хамгийн их хямдарсан" },
  { value: "price_asc", label: "Үнэ: бага → их" },
  { value: "price_desc", label: "Үнэ: их → бага" },
];

const CATEGORIES = [
  { name: "Хувцас", slug: "clothing" },
  { name: "Цахилгаан бараа", slug: "electronics" },
  { name: "Гэр ахуй", slug: "home" },
  { name: "Гоо сайхан", slug: "beauty" },
  { name: "Спорт", slug: "sport" },
  { name: "Хүүхдийн", slug: "kids" },
  { name: "Ном", slug: "books" },
  { name: "Автомашин", slug: "auto" },
];

export default function ProductsPage({
  searchParams,
}: {
  searchParams: SearchParams;
}) {
  const resolvedParams = searchParams;
  const { q, category, sort = "newest", minPrice, maxPrice, page = "1" } = resolvedParams;

  const PAGE_SIZE = 20;
  const currentPage = parseInt(page);

  let products = [...MOCK_PRODUCTS];

  if (q) {
    const lower = q.toLowerCase();
    products = products.filter(
      (p) =>
        p.title.toLowerCase().includes(lower) ||
        (p.brand?.toLowerCase().includes(lower) ?? false)
    );
  }

  if (category) {
    products = products.filter((p) => p.category.slug === category);
  }

  if (minPrice) products = products.filter((p) => p.salePrice >= parseFloat(minPrice));
  if (maxPrice) products = products.filter((p) => p.salePrice <= parseFloat(maxPrice));

  if (sort === "price_asc") products.sort((a, b) => a.salePrice - b.salePrice);
  else if (sort === "price_desc") products.sort((a, b) => b.salePrice - a.salePrice);
  else if (sort === "discount")
    products.sort((a, b) => {
      const da = ((a.originalPrice - a.salePrice) / a.originalPrice) * 100;
      const db = ((b.originalPrice - b.salePrice) / b.originalPrice) * 100;
      return db - da;
    });
  else products.sort((a, b) => b.createdAt.localeCompare(a.createdAt));

  const total = products.length;
  const totalPages = Math.ceil(total / PAGE_SIZE);
  const paginated = products.slice((currentPage - 1) * PAGE_SIZE, currentPage * PAGE_SIZE);

  const categoryCounts = CATEGORIES.map((cat) => ({
    ...cat,
    count: MOCK_PRODUCTS.filter((p) => p.category.slug === cat.slug).length,
  }));

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
      <div className="flex flex-col lg:flex-row gap-6">
        <aside className="w-full lg:w-56 flex-shrink-0">
          <div className="bg-white rounded-2xl border border-gray-100 p-4 space-y-5 sticky top-24">
            <h2 className="font-bold text-gray-950">Шүүлтүүр</h2>

            <div>
              <h3 className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2">
                Ангилал
              </h3>
              <div className="space-y-1">
                <a
                  href="/products"
                  className={`block px-2 py-1.5 rounded-lg text-sm transition-colors ${
                    !category
                      ? "bg-orange-50 text-orange-600 font-medium"
                      : "text-gray-600 hover:bg-gray-50"
                  }`}
                >
                  Бүгд ({total})
                </a>
                {categoryCounts.map((cat) => (
                  <a
                    key={cat.slug}
                    href={`/products?category=${cat.slug}${q ? `&q=${q}` : ""}`}
                    className={`flex items-center justify-between px-2 py-1.5 rounded-lg
                      text-sm transition-colors ${
                        category === cat.slug
                          ? "bg-orange-50 text-orange-600 font-medium"
                          : "text-gray-600 hover:bg-gray-50"
                      }`}
                  >
                    <span>{cat.name}</span>
                    <span className="text-xs text-gray-400">{cat.count}</span>
                  </a>
                ))}
              </div>
            </div>

            <div>
              <h3 className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2">
                Үнийн хязгаар
              </h3>
              <form className="space-y-2">
                <div className="flex gap-2">
                  <input
                    type="number"
                    name="minPrice"
                    defaultValue={minPrice}
                    placeholder="Мин"
                    className="w-full px-2 py-1.5 text-xs border border-gray-200 rounded-lg
                      focus:outline-none focus:border-orange-400"
                  />
                  <input
                    type="number"
                    name="maxPrice"
                    defaultValue={maxPrice}
                    placeholder="Макс"
                    className="w-full px-2 py-1.5 text-xs border border-gray-200 rounded-lg
                      focus:outline-none focus:border-orange-400"
                  />
                </div>
                <button
                  type="submit"
                  className="w-full py-1.5 bg-gray-950 text-white text-xs rounded-lg
                    hover:bg-orange-500 transition-colors"
                >
                  Хэрэглэх
                </button>
              </form>
            </div>
          </div>
        </aside>

        <div className="flex-1">
          <div className="flex items-center justify-between mb-5 flex-wrap gap-3">
            <p className="text-sm text-gray-500">
              {total.toLocaleString()} бараа олдлоо
              {q && <span className="font-medium text-gray-700"> — &quot;{q}&quot;</span>}
            </p>
            <div className="flex gap-2">
              {SORT_OPTIONS.map((opt) => (
                <a
                  key={opt.value}
                  href={`/products?sort=${opt.value}${q ? `&q=${q}` : ""}${
                    category ? `&category=${category}` : ""
                  }`}
                  className={`px-3 py-1.5 text-xs rounded-full border transition-colors ${
                    sort === opt.value
                      ? "border-orange-500 bg-orange-50 text-orange-600 font-medium"
                      : "border-gray-200 text-gray-500 hover:border-gray-300"
                  }`}
                >
                  {opt.label}
                </a>
              ))}
            </div>
          </div>

          <ProductGrid products={paginated} />

          {totalPages > 1 && (
            <div className="flex items-center justify-center gap-2 mt-10">
              {Array.from({ length: totalPages }, (_, i) => i + 1).map((p) => (
                <a
                  key={p}
                  href={`/products?page=${p}${q ? `&q=${q}` : ""}${
                    category ? `&category=${category}` : ""
                  }&sort=${sort}`}
                  className={`w-9 h-9 flex items-center justify-center rounded-xl text-sm
                    border transition-colors ${
                      p === currentPage
                        ? "bg-gray-950 text-white border-gray-950 font-semibold"
                        : "border-gray-200 text-gray-600 hover:border-gray-300"
                    }`}
                >
                  {p}
                </a>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
