import Link from "next/link";
import { Package, TrendingUp, ShoppingBag, Plus } from "lucide-react";
import { MOCK_PRODUCTS } from "@/lib/mockData";
import { formatPrice } from "@/lib/utils";

export default function VendorDashboard() {
  const products = MOCK_PRODUCTS.slice(0, 4);
  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-2xl font-black text-gray-950">Хяналтын самбар</h1>
          <p className="text-sm text-gray-500 mt-1">Тавтай морил, Худалдагч</p>
        </div>
        <Link href="/vendor/products/new"
          className="flex items-center gap-2 px-4 py-2.5 bg-orange-500 hover:bg-orange-600
            text-white font-semibold rounded-xl text-sm transition-colors">
          <Plus size={16} /> Бараа нэмэх
        </Link>
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-8">
        {[
          { icon: Package, label: "Нийт бараа", value: "24", color: "bg-blue-50 text-blue-600" },
          { icon: ShoppingBag, label: "Нийт захиалга", value: "138", color: "bg-green-50 text-green-600" },
          { icon: TrendingUp, label: "Сарын орлого", value: "₮4,200,000", color: "bg-orange-50 text-orange-600" },
        ].map((stat) => (
          <div key={stat.label} className="bg-white rounded-2xl border border-gray-100 p-5 flex items-center gap-4">
            <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${stat.color}`}>
              <stat.icon size={22} />
            </div>
            <div>
              <p className="text-xs text-gray-400">{stat.label}</p>
              <p className="text-xl font-black text-gray-950">{stat.value}</p>
            </div>
          </div>
        ))}
      </div>
      <div className="bg-white rounded-2xl border border-gray-100 p-6">
        <h2 className="font-bold text-gray-950 mb-4">Миний бараанууд</h2>
        <div className="space-y-3">
          {products.map((p) => (
            <div key={p.id} className="flex items-center gap-3 py-3 border-b border-gray-50 last:border-0">
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-gray-800 truncate">{p.title}</p>
                <p className="text-xs text-gray-400">{p.category.name} • {p.stock} үлдсэн</p>
              </div>
              <span className="text-sm font-bold text-gray-950">{formatPrice(p.salePrice)}</span>
              <span className={`text-xs px-2 py-1 rounded-full font-medium ${p.stock > 0 ? "bg-green-50 text-green-600" : "bg-red-50 text-red-500"}`}>
                {p.stock > 0 ? "Идэвхтэй" : "Дууссан"}
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
