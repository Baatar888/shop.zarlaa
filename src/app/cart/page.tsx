"use client";
import { useCart } from "@/hooks/useCart";
import { formatPrice } from "@/lib/utils";
import { Trash2, ShoppingBag, Plus, Minus } from "lucide-react";
import Link from "next/link";
import Image from "next/image";
import { useEffect, useState } from "react";

export default function CartPage() {
  const { items, removeItem, updateQty, totalPrice, clearCart } = useCart();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  // Hydration болох хүртэл skeleton харуулна
  if (!mounted) {
    return (
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="h-8 w-48 bg-gray-100 rounded-xl animate-pulse mb-6" />
        <div className="space-y-3">
          {[1, 2].map((i) => (
            <div key={i} className="h-28 bg-gray-100 rounded-2xl animate-pulse" />
          ))}
        </div>
      </div>
    );
  }

  if (items.length === 0) {
    return (
      <div className="min-h-[70vh] flex flex-col items-center justify-center gap-4 text-center px-4">
        <ShoppingBag size={64} className="text-gray-200" />
        <h2 className="text-xl font-bold text-gray-700">Таны сагс хоосон байна</h2>
        <p className="text-sm text-gray-400">Бараа нэмж эхлэцгээе</p>
        <Link
          href="/products"
          className="px-6 py-3 bg-orange-500 hover:bg-orange-600 text-white font-semibold rounded-xl text-sm transition-colors"
        >
          Дэлгүүр хэсэх
        </Link>
      </div>
    );
  }

  const total = totalPrice();

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-black text-gray-950">Миний сагс</h1>
        <button
          onClick={clearCart}
          className="text-sm text-red-400 hover:text-red-600 transition-colors"
        >
          Бүгдийг устгах
        </button>
      </div>

      <div className="space-y-3 mb-6">
        {items.map((item) => (
          <div
            key={item.productId}
            className="flex items-center gap-4 bg-white rounded-2xl border border-gray-100 p-4"
          >
            <div className="relative w-20 h-20 flex-shrink-0 rounded-xl overflow-hidden bg-gray-100">
              {item.imageUrl && (
                <Image
                  src={item.imageUrl}
                  alt={item.title}
                  fill
                  className="object-cover"
                  sizes="80px"
                />
              )}
            </div>
            <div className="flex-1 min-w-0">
              <p className="font-medium text-gray-800 text-sm line-clamp-2">{item.title}</p>
              <p className="text-orange-500 font-bold text-sm mt-1">{formatPrice(item.price)}</p>
            </div>
            <div className="flex items-center gap-2">
              <button
                onClick={() => updateQty(item.productId, item.quantity - 1)}
                className="w-8 h-8 rounded-lg bg-gray-100 hover:bg-gray-200 flex items-center justify-center transition-colors"
              >
                <Minus size={14} />
              </button>
              <span className="w-8 text-center text-sm font-semibold">{item.quantity}</span>
              <button
                onClick={() => updateQty(item.productId, item.quantity + 1)}
                className="w-8 h-8 rounded-lg bg-gray-100 hover:bg-gray-200 flex items-center justify-center transition-colors"
              >
                <Plus size={14} />
              </button>
            </div>
            <button
              onClick={() => removeItem(item.productId)}
              className="p-2 text-gray-400 hover:text-red-500 transition-colors"
            >
              <Trash2 size={16} />
            </button>
          </div>
        ))}
      </div>

      <div className="bg-white rounded-2xl border border-gray-100 p-6">
        <div className="flex items-center justify-between mb-2">
          <span className="text-sm text-gray-500">Дэд нийт</span>
          <span className="text-sm text-gray-700">{formatPrice(total)}</span>
        </div>
        <div className="flex items-center justify-between mb-4">
          <span className="text-sm text-gray-500">Хүргэлт</span>
          <span className="text-sm text-gray-700">{formatPrice(20000)}</span>
        </div>
        <div className="flex items-center justify-between mb-6 border-t border-gray-100 pt-4">
          <span className="font-bold text-gray-900">Нийт дүн</span>
          <span className="text-xl font-black text-gray-950">{formatPrice(total + 20000)}</span>
        </div>
        <Link
          href="/checkout"
          className="block w-full py-3.5 bg-orange-500 hover:bg-orange-600 text-white font-bold rounded-xl transition-colors text-center"
        >
          Захиалга өгөх →
        </Link>
        <Link
          href="/products"
          className="block w-full py-3 mt-3 text-center text-sm text-gray-500 hover:text-gray-700 transition-colors"
        >
          ← Дэлгүүр хэсэх
        </Link>
      </div>
    </div>
  );
}
