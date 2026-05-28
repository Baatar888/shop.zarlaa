"use client";

import Link from "next/link";
import { ShoppingCart } from "lucide-react";
import { useCart } from "@/hooks/useCart";
import { useEffect, useState } from "react";

export default function CartButton() {
  const totalCount = useCart((s) => s.totalCount());
  const [mounted, setMounted] = useState(false);

  // Hydration mismatch засах: client mount болсны дараа л харуулна
  useEffect(() => {
    setMounted(true);
  }, []);

  return (
    <Link
      href="/cart"
      className="relative flex items-center gap-1.5 px-3 py-2 rounded-lg
        text-sm text-gray-600 hover:bg-gray-100 hover:text-gray-900 transition-colors"
    >
      <ShoppingCart size={18} />
      {mounted && totalCount > 0 && (
        <span className="absolute -top-0.5 -right-0.5 flex items-center justify-center
          w-5 h-5 bg-orange-500 text-white text-[10px] font-bold rounded-full">
          {totalCount > 99 ? "99+" : totalCount}
        </span>
      )}
      <span className="hidden md:inline">Сагс</span>
    </Link>
  );
}
