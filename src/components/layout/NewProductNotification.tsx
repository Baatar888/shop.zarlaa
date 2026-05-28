"use client";
import { useEffect, useState } from "react";
import { useSession } from "next-auth/react";
import { X, ShoppingBag } from "lucide-react";
import Link from "next/link";
import Image from "next/image";
import { MOCK_PRODUCTS } from "@/lib/mockData";
import { formatPrice } from "@/lib/utils";

const STORAGE_KEY = "zarlaa_seen_products";
const NOTIFY_DELAY = 3000; // 3 секундын дараа харуулна

export default function NewProductNotification() {
  const { data: session } = useSession();
  const [notification, setNotification] = useState<null | typeof MOCK_PRODUCTS[0]>(null);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    // Зөвхөн нэвтэрсэн хэрэглэгчдэд харуулна
    if (!session?.user) return;

    const timer = setTimeout(() => {
      try {
        const seen: string[] = JSON.parse(localStorage.getItem(STORAGE_KEY) ?? "[]");
        // Шинэ (үзээгүй) бараанууд
        const unseen = MOCK_PRODUCTS.filter((p) => !seen.includes(p.id));
        if (unseen.length === 0) return;

        // Хамгийн сүүлийн бараа харуулна
        const toShow = unseen[0];
        setNotification(toShow);
        setVisible(true);

        // Үзсэн гэж тэмдэглэнэ
        const updated = [...seen, toShow.id];
        localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
      } catch {
        // localStorage error - ignore
      }
    }, NOTIFY_DELAY);

    return () => clearTimeout(timer);
  }, [session]);

  const dismiss = () => {
    setVisible(false);
    setTimeout(() => setNotification(null), 300);
  };

  if (!notification) return null;

  const img = notification.images[0]?.url ?? "";
  const discount = notification.originalPrice > notification.salePrice
    ? Math.round(((notification.originalPrice - notification.salePrice) / notification.originalPrice) * 100)
    : 0;

  return (
    <div
      className={`fixed bottom-20 right-4 sm:right-6 z-50 w-80 bg-white rounded-2xl shadow-2xl border border-gray-100 overflow-hidden transition-all duration-300 ${
        visible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4 pointer-events-none"
      }`}
    >
      {/* Header */}
      <div className="flex items-center justify-between px-4 py-2.5 bg-orange-500">
        <div className="flex items-center gap-2">
          <ShoppingBag size={14} className="text-white" />
          <span className="text-xs font-semibold text-white">Шинэ бараа нэмэгдлээ!</span>
        </div>
        <button onClick={dismiss} className="text-white/80 hover:text-white transition-colors">
          <X size={16} />
        </button>
      </div>

      {/* Content */}
      <Link href={`/products/${notification.slug}`} onClick={dismiss}>
        <div className="flex gap-3 p-4 hover:bg-gray-50 transition-colors">
          {img && (
            <div className="relative w-16 h-16 flex-shrink-0 rounded-xl overflow-hidden bg-gray-100">
              <Image src={img} alt={notification.title} fill className="object-cover" sizes="64px" />
            </div>
          )}
          <div className="flex-1 min-w-0">
            <p className="text-xs text-gray-500 mb-0.5">{notification.vendor.shopName}</p>
            <p className="text-sm font-semibold text-gray-800 line-clamp-2 leading-snug">
              {notification.title}
            </p>
            <div className="flex items-center gap-2 mt-1.5">
              <span className="text-sm font-bold text-orange-500">{formatPrice(notification.salePrice)}</span>
              {discount > 0 && (
                <span className="text-[10px] bg-red-100 text-red-600 font-bold px-1.5 py-0.5 rounded-md">
                  -{discount}%
                </span>
              )}
            </div>
          </div>
        </div>
      </Link>
    </div>
  );
}
