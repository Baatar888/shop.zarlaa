"use client";

import { MOCK_PRODUCTS } from "@/lib/mockData";
import { notFound } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import { formatPrice, calcDiscount } from "@/lib/utils";
import AddToCartButton from "@/components/product/AddToCartButton";
import { useState, useRef, useCallback } from "react";
import { ChevronLeft, ChevronRight, Share2, Truck, RotateCcw, ShieldCheck } from "lucide-react";

type Props = { params: { slug: string } };

export default function ProductDetailPage({ params }: Props) {
  const product = MOCK_PRODUCTS.find((p) => p.slug === params.slug);
  if (!product) notFound();

  const discount = calcDiscount(product.originalPrice, product.salePrice);
  const related = MOCK_PRODUCTS.filter(
    (p) => p.category.slug === product.category.slug && p.id !== product.id
  ).slice(0, 4);

  const [activeImg, setActiveImg] = useState(0);
  const [selectedSize, setSelectedSize] = useState<string | null>(null);
  const [selectedColor, setSelectedColor] = useState<string | null>(null);
  const [lightbox, setLightbox] = useState(false);

  // Zoom state
  const [zooming, setZooming] = useState(false);
  const [zoomPos, setZoomPos] = useState({ x: 50, y: 50 });
  const imgContainerRef = useRef<HTMLDivElement>(null);

  const images = product.images;
  const primaryImage = images[activeImg]?.url ?? "/placeholder.jpg";

  const prevImg = () => setActiveImg((i) => (i - 1 + images.length) % images.length);
  const nextImg = () => setActiveImg((i) => (i + 1) % images.length);

  const handleMouseMove = useCallback((e: React.MouseEvent<HTMLDivElement>) => {
    const rect = imgContainerRef.current?.getBoundingClientRect();
    if (!rect) return;
    const x = ((e.clientX - rect.left) / rect.width) * 100;
    const y = ((e.clientY - rect.top) / rect.height) * 100;
    setZoomPos({ x, y });
  }, []);

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
        {/* ─── Image Gallery ─── */}
        <div className="flex gap-3">
          {/* Thumbnails */}
          {images.length > 1 && (
            <div className="flex flex-col gap-2 w-16 flex-shrink-0">
              {images.map((img, i) => (
                <button
                  key={i}
                  onClick={() => setActiveImg(i)}
                  className={`relative w-16 h-16 rounded-xl overflow-hidden border-2 transition-all flex-shrink-0 ${
                    activeImg === i
                      ? "border-orange-500 shadow-md"
                      : "border-gray-100 hover:border-gray-300"
                  }`}
                >
                  <Image src={img.url} alt={`Зураг ${i + 1}`} fill className="object-cover" sizes="64px" />
                </button>
              ))}
            </div>
          )}

          {/* Main image with zoom */}
          <div
            ref={imgContainerRef}
            className="relative flex-1 aspect-square rounded-2xl overflow-hidden bg-gray-100 select-none"
            style={{ cursor: zooming ? "zoom-out" : "zoom-in" }}
            onMouseEnter={() => setZooming(true)}
            onMouseLeave={() => setZooming(false)}
            onMouseMove={handleMouseMove}
            onClick={() => { if (!zooming) setLightbox(true); }}
          >
            {/* Normal image */}
            <Image
              src={primaryImage}
              alt={product.title}
              fill
              className={`object-cover transition-opacity duration-150 ${zooming ? "opacity-0" : "opacity-100"}`}
              sizes="(max-width:1024px) 100vw, 45vw"
              draggable={false}
            />

            {/* Zoomed image layer */}
            {zooming && (
              <div
                className="absolute inset-0"
                style={{
                  backgroundImage: `url(${primaryImage})`,
                  backgroundSize: "250%",
                  backgroundPosition: `${zoomPos.x}% ${zoomPos.y}%`,
                  backgroundRepeat: "no-repeat",
                }}
              />
            )}

            {discount > 0 && (
              <span className="absolute top-4 left-4 bg-red-500 text-white text-sm font-bold px-3 py-1 rounded-lg z-10">
                -{discount}%
              </span>
            )}

            {images.length > 1 && !zooming && (
              <>
                <button
                  onClick={(e) => { e.stopPropagation(); prevImg(); }}
                  className="absolute left-2 top-1/2 -translate-y-1/2 w-8 h-8 bg-white/80 hover:bg-white rounded-full flex items-center justify-center shadow-md transition z-10"
                >
                  <ChevronLeft size={16} />
                </button>
                <button
                  onClick={(e) => { e.stopPropagation(); nextImg(); }}
                  className="absolute right-2 top-1/2 -translate-y-1/2 w-8 h-8 bg-white/80 hover:bg-white rounded-full flex items-center justify-center shadow-md transition z-10"
                >
                  <ChevronRight size={16} />
                </button>
                <div className="absolute bottom-3 left-1/2 -translate-x-1/2 flex gap-1.5 z-10">
                  {images.map((_, i) => (
                    <button
                      key={i}
                      onClick={(e) => { e.stopPropagation(); setActiveImg(i); }}
                      className={`h-1.5 rounded-full transition-all ${
                        activeImg === i ? "bg-white w-4" : "bg-white/50 w-1.5"
                      }`}
                    />
                  ))}
                </div>
              </>
            )}
          </div>
        </div>

        {/* ─── Product Info ─── */}
        <div className="space-y-5">
          <div className="flex items-start justify-between gap-3">
            <div>
              <p className="text-sm text-gray-400 mb-1">{product.vendor.shopName} • {product.category.name}</p>
              <h1 className="text-2xl sm:text-3xl font-black text-gray-950 leading-tight">{product.title}</h1>
              {product.brand && (
                <p className="text-sm text-gray-500 mt-1">Брэнд: <span className="font-medium">{product.brand}</span></p>
              )}
            </div>
            <button className="w-9 h-9 flex-shrink-0 flex items-center justify-center border border-gray-200 rounded-xl hover:bg-gray-50 transition">
              <Share2 size={16} className="text-gray-500" />
            </button>
          </div>

          {/* Price */}
          <div className="flex items-baseline gap-3 flex-wrap">
            <span className="text-3xl font-black text-gray-950">{formatPrice(product.salePrice)}</span>
            {discount > 0 && (
              <>
                <span className="text-lg text-gray-400 line-through">{formatPrice(product.originalPrice)}</span>
                <span className="text-sm font-semibold text-green-600 bg-green-50 px-2 py-0.5 rounded-lg">
                  {formatPrice(product.originalPrice - product.salePrice)} хэмнэлт
                </span>
              </>
            )}
          </div>

          {/* Stock */}
          <div className="flex items-center gap-2">
            <div className={`w-2.5 h-2.5 rounded-full ${product.stock > 0 ? "bg-green-500" : "bg-red-400"}`} />
            <span className="text-sm text-gray-600">
              {product.stock > 0 ? `${product.stock} ширхэг бэлэн байна` : "Дууссан"}
            </span>
            {product.deliveryDays && (
              <span className="ml-auto text-xs text-orange-500 font-medium">
                🚚 {product.deliveryDays}т хүрнэ
              </span>
            )}
          </div>

          {/* Sizes */}
          {product.sizes && product.sizes.length > 0 && (
            <div>
              <div className="flex items-center justify-between mb-2">
                <label className="text-sm font-semibold text-gray-800">Хэмжээ</label>
                {selectedSize && <span className="text-xs text-orange-500 font-medium">Сонгосон: {selectedSize}</span>}
              </div>
              <div className="flex flex-wrap gap-2">
                {product.sizes.map((size: string) => (
                  <button
                    key={size}
                    onClick={() => setSelectedSize(selectedSize === size ? null : size)}
                    className={`min-w-[44px] px-3 py-2 rounded-xl border-2 text-sm font-semibold transition-all ${
                      selectedSize === size
                        ? "border-gray-900 bg-gray-900 text-white"
                        : "border-gray-200 text-gray-700 hover:border-gray-400"
                    }`}
                  >
                    {size}
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Colors */}
          {product.colors && product.colors.length > 0 && (
            <div>
              <div className="flex items-center justify-between mb-2">
                <label className="text-sm font-semibold text-gray-800">Өнгө</label>
                {selectedColor && <span className="text-xs text-orange-500 font-medium">Сонгосон: {selectedColor}</span>}
              </div>
              <div className="flex flex-wrap gap-2">
                {product.colors.map((color: string) => (
                  <button
                    key={color}
                    onClick={() => setSelectedColor(selectedColor === color ? null : color)}
                    className={`px-4 py-2 rounded-xl border-2 text-sm font-medium transition-all ${
                      selectedColor === color
                        ? "border-orange-500 bg-orange-50 text-orange-700"
                        : "border-gray-200 text-gray-700 hover:border-gray-300"
                    }`}
                  >
                    {color}
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Description */}
          {product.description && (
            <div className="bg-gray-50 rounded-xl p-4">
              <p className="text-sm text-gray-600 leading-relaxed">{product.description}</p>
            </div>
          )}

          <AddToCartButton product={product} />

          {/* Badges */}
          <div className="grid grid-cols-3 gap-3 pt-4 border-t border-gray-100">
            {[
              { icon: <Truck size={18} />, title: "Хүргэлт", desc: "Улаанбаатарт 1-2 өдөр" },
              { icon: <RotateCcw size={18} />, title: "Буцаалт", desc: "7 хоногийн дотор" },
              { icon: <ShieldCheck size={18} />, title: "Баталгаа", desc: "Найдвартай худалдаа" },
            ].map((item) => (
              <div key={item.title} className="text-center p-3 bg-gray-50 rounded-xl">
                <div className="flex justify-center text-gray-500 mb-1">{item.icon}</div>
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

      {/* Lightbox */}
      {lightbox && (
        <div
          className="fixed inset-0 bg-black/90 z-50 flex items-center justify-center p-4"
          onClick={() => setLightbox(false)}
        >
          <button
            className="absolute left-4 top-1/2 -translate-y-1/2 w-10 h-10 bg-white/20 hover:bg-white/30 rounded-full flex items-center justify-center text-white"
            onClick={(e) => { e.stopPropagation(); prevImg(); }}
          >
            <ChevronLeft size={20} />
          </button>
          <div className="relative w-full max-w-2xl aspect-square">
            <Image src={primaryImage} alt={product.title} fill className="object-contain" sizes="100vw" />
          </div>
          <button
            className="absolute right-4 top-1/2 -translate-y-1/2 w-10 h-10 bg-white/20 hover:bg-white/30 rounded-full flex items-center justify-center text-white"
            onClick={(e) => { e.stopPropagation(); nextImg(); }}
          >
            <ChevronRight size={20} />
          </button>
          <button
            className="absolute top-4 right-4 text-white text-2xl w-10 h-10 flex items-center justify-center hover:bg-white/10 rounded-full transition"
            onClick={() => setLightbox(false)}
          >
            ✕
          </button>
          <div className="absolute bottom-4 left-1/2 -translate-x-1/2 text-white/60 text-sm">
            {activeImg + 1} / {images.length}
          </div>
        </div>
      )}
    </div>
  );
}
