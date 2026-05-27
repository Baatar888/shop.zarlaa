import { MOCK_PRODUCTS } from "@/lib/mockData";
import { notFound } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import { formatPrice, calcDiscount } from "@/lib/utils";
import AddToCartButton from "@/components/product/AddToCartButton";
import type { Metadata } from "next";

type Props = { params: { slug: string } };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const product = MOCK_PRODUCTS.find((p) => p.slug === params.slug);
  if (!product) return { title: "Бараа олдсонгүй" };
  return { title: product.title };
}

export default function ProductDetailPage({ params }: Props) {
  const product = MOCK_PRODUCTS.find((p) => p.slug === params.slug);
  if (!product) notFound();

  const discount = calcDiscount(product.originalPrice, product.salePrice);
  const primaryImage = product.images.find((i) => i.isPrimary)?.url ?? product.images[0]?.url ?? "/placeholder.jpg";
  const related = MOCK_PRODUCTS.filter((p) => p.category.slug === product.category.slug && p.id !== product.id).slice(0, 4);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Breadcrumb */}
      <nav className="flex items-center gap-2 text-sm text-gray-400 mb-6">
        <Link href="/" className="hover:text-gray-600">Нүүр</Link>
        <span>/</span>
        <Link href="/products" className="hover:text-gray-600">Бараанууд</Link>
        <span>/</span>
        <Link href={`/products?category=${product.category.slug}`} className="hover:text-gray-600">
          {product.category.name}
        </Link>
        <span>/</span>
        <span className="text-gray-700 font-medium truncate">{product.title}</span>
      </nav>

      <div className="grid lg:grid-cols-2 gap-10 mb-16">
        {/* Image */}
        <div className="relative aspect-square rounded-2xl overflow-hidden bg-gray-100">
          <Image src={primaryImage} alt={product.title} fill className="object-cover" sizes="(max-width:1024px) 100vw, 50vw" />
          {discount > 0 && (
            <span className="absolute top-4 left-4 bg-red-500 text-white text-sm font-bold px-3 py-1 rounded-lg">
              -{discount}%
            </span>
          )}
        </div>

        {/* Info */}
        <div className="space-y-5">
          <div>
            <p className="text-sm text-gray-400 mb-1">{product.vendor.shopName} • {product.category.name}</p>
            <h1 className="text-2xl sm:text-3xl font-black text-gray-950 leading-tight">{product.title}</h1>
            {product.brand && <p className="text-sm text-gray-500 mt-1">Брэнд: <span className="font-medium">{product.brand}</span></p>}
          </div>

          <div className="flex items-baseline gap-3">
            <span className="text-3xl font-black text-gray-950">{formatPrice(product.salePrice)}</span>
            {discount > 0 && (
              <span className="text-lg text-gray-400 line-through">{formatPrice(product.originalPrice)}</span>
            )}
            {discount > 0 && (
              <span className="text-sm font-semibold text-green-600 bg-green-50 px-2 py-0.5 rounded-lg">
                {formatPrice(product.originalPrice - product.salePrice)} хэмнэлт
              </span>
            )}
          </div>

          <div className="flex items-center gap-2">
            <div className={`w-2.5 h-2.5 rounded-full ${product.stock > 0 ? "bg-green-500" : "bg-red-400"}`} />
            <span className="text-sm text-gray-600">
              {product.stock > 0 ? `${product.stock} ширхэг бэлэн байна` : "Дууссан"}
            </span>
          </div>

          <AddToCartButton product={product} />

          <div className="grid grid-cols-3 gap-3 pt-4 border-t border-gray-100">
            {[
              { icon: "🚚", title: "Хүргэлт", desc: "Улаанбаатарт 1-2 өдөр" },
              { icon: "↩️", title: "Буцаалт", desc: "7 хоногийн дотор" },
              { icon: "🔒", title: "Баталгаа", desc: "Найдвартай худалдаа" },
            ].map((item) => (
              <div key={item.title} className="text-center p-3 bg-gray-50 rounded-xl">
                <div className="text-xl mb-1">{item.icon}</div>
                <div className="text-xs font-semibold text-gray-700">{item.title}</div>
                <div className="text-[10px] text-gray-400 mt-0.5">{item.desc}</div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Related */}
      {related.length > 0 && (
        <div>
          <h2 className="text-xl font-bold text-gray-950 mb-5">Холбоотой бараанууд</h2>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
            {related.map((p) => {
              const img = p.images.find((i) => i.isPrimary)?.url ?? p.images[0]?.url ?? "/placeholder.jpg";
              const disc = calcDiscount(p.originalPrice, p.salePrice);
              return (
                <Link key={p.id} href={`/products/${p.slug}`}
                  className="group bg-white rounded-2xl border border-gray-100 hover:shadow-md transition-shadow overflow-hidden">
                  <div className="relative aspect-square bg-gray-100">
                    <Image src={img} alt={p.title} fill className="object-cover group-hover:scale-105 transition-transform duration-300" sizes="25vw" />
                    {disc > 0 && (
                      <span className="absolute top-2 left-2 bg-red-500 text-white text-[10px] font-bold px-1.5 py-0.5 rounded">
                        -{disc}%
                      </span>
                    )}
                  </div>
                  <div className="p-3">
                    <p className="text-xs text-gray-400 mb-0.5">{p.vendor.shopName}</p>
                    <h3 className="text-sm font-medium text-gray-800 line-clamp-2 leading-snug">{p.title}</h3>
                    <p className="text-sm font-bold text-gray-950 mt-1">{formatPrice(p.salePrice)}</p>
                  </div>
                </Link>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
}
