"use client";
import { ShoppingCart, Check } from "lucide-react";
import { useCart } from "@/hooks/useCart";
import { useState } from "react";
import type { MockProduct } from "@/lib/mockData";

export default function AddToCartButton({ product }: { product: MockProduct }) {
  const addItem = useCart((s) => s.addItem);
  const [added, setAdded] = useState(false);

  const handleAdd = () => {
    addItem(product as any);
    setAdded(true);
    setTimeout(() => setAdded(false), 2000);
  };

  return (
    <button
      onClick={handleAdd}
      disabled={product.stock === 0}
      className={`w-full flex items-center justify-center gap-2 py-4 rounded-xl font-bold
        text-white transition-all duration-200 disabled:opacity-40 disabled:cursor-not-allowed
        ${added ? "bg-green-500" : "bg-gray-950 hover:bg-orange-500"}`}
    >
      {added ? <Check size={18} /> : <ShoppingCart size={18} />}
      {added ? "Нэмэгдлээ!" : product.stock === 0 ? "Дууссан" : "Сагсанд нэмэх"}
    </button>
  );
}
