"use client";

import Image from "next/image";
import Link from "next/link";
import { ShoppingCart, Heart, Check } from "lucide-react";
import { calcDiscount, formatPrice } from "@/lib/utils";
import { useCart } from "@/hooks/useCart";
import { useState, useEffect } from "react";
import type { Product } from "@/lib/types";

export default function ProductCard({ product }: { product: Product }) {
  const addItem = useCart((s) => s.addItem);
  const [mounted, setMounted] = useState(false);
  const [added, setAdded] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const discount = calcDiscount(product.originalPrice, product.salePrice);
  const primaryImage =
    product.images.find((img) => img.isPrimary)?.url ??
    product.images[0]?.url ??
    "https://images.unsplash.com/photo-1560472354-b33ff0c44a43?w=400";

  const handleAdd = () => {
    addItem(product);
    setAdded(true);
    setTimeout(() => setAdded(false), 1500);
  };

  return (
    <div className="group relative bg-white rounded-2xl border border-gray-100
      hover:border-gray-200 hover:shadow-lg transition-all duration-200 overflow-hidden">

      {/* Image */}
      <Link href={`/products/${product.slug}`} className="block relative aspect-square overflow-hidden">
        <Image
          src={primaryImage}
          alt={product.title}
          fill
          className="object-cover group-hover:scale-105 transition-transform duration-300"
          sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 25vw"
        />

        {discount > 0 && (
          <span className="absolute top-2 left-2 bg-red-500 text-white text-[11px]
            font-bold px-2 py-0.5 rounded-md z-10">
            -{discount}%
          </span>
        )}

        {product.stock <= 5 && product.stock > 0 && (
          <span className="absolute top-2 right-2 bg-amber-500 text-white text-[10px]
            font-semibold px-2 py-0.5 rounded-md z-10">
            {product.stock} үлдсэн
          </span>
        )}

        {product.stock === 0 && (
          <div className="absolute inset-0 bg-white/60 flex items-center justify-center z-10">
            <span className="text-sm font-semibold text-gray-500">Дууссан</span>
          </div>
        )}

        <button className="absolute bottom-2 right-2 w-8 h-8 rounded-full bg-white/90
          flex items-center justify-center opacity-0 group-hover:opacity-100
          transition-opacity hover:bg-red-50 hover:text-red-500 z-10 shadow-sm">
          <Heart size={15} />
        </button>
      </Link>

      {/* Info */}
      <div className="p-3 pb-4">
        <p className="text-[11px] text-gray-400 mb-0.5">{product.vendor.shopName}</p>
        <Link href={`/products/${product.slug}`}>
          <h3 className="text-sm font-medium text-gray-800 line-clamp-2 leading-snug
            hover:text-orange-500 transition-colors">
            {product.title}
          </h3>
        </Link>

        <div className="flex items-baseline gap-1.5 mt-2">
          <span className="text-base font-bold text-gray-950">
            {formatPrice(product.salePrice)}
          </span>
          {discount > 0 && (
            <span className="text-xs text-gray-400 line-through">
              {formatPrice(product.originalPrice)}
            </span>
          )}
        </div>

        {/* Mounted болсны дараа л cart товч харуулна */}
        {mounted ? (
          <button
            onClick={handleAdd}
            disabled={product.stock === 0}
            className={`mt-3 w-full flex items-center justify-center gap-2 py-2 rounded-xl
              text-white text-xs font-semibold transition-all duration-200
              disabled:opacity-40 disabled:cursor-not-allowed
              ${added ? "bg-green-500" : "bg-gray-950 hover:bg-orange-500"}`}
          >
            {added ? <Check size={14} /> : <ShoppingCart size={14} />}
            {added ? "Нэмэгдлээ!" : product.stock === 0 ? "Дууссан" : "Сагсанд нэмэх"}
          </button>
        ) : (
          <div className="mt-3 w-full h-8 rounded-xl bg-gray-100 animate-pulse" />
        )}
      </div>
    </div>
  );
}
