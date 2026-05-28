import Link from "next/link";

export default function PromoBanner() {
  return (
    <div className="grid sm:grid-cols-2 gap-4">
      {/* Flash sale */}
      <Link
        href="/products?sort=discount"
        className="relative overflow-hidden rounded-2xl bg-gradient-to-r from-red-600 to-orange-500
          p-6 flex items-center justify-between group hover:shadow-lg transition-shadow"
      >
        <div>
          <p className="text-orange-100 text-xs font-semibold uppercase tracking-wider mb-1">
            Хурдан хямдрал
          </p>
          <h3 className="text-white text-xl font-black mb-1">Хүртэл -80%</h3>
          <p className="text-orange-100 text-xs">Хязгаарлагдмал хугацаатай</p>
        </div>
        <div className="text-5xl group-hover:scale-110 transition-transform">🔥</div>
        <div className="absolute inset-0 bg-white/5 opacity-0 group-hover:opacity-100 transition-opacity" />
      </Link>

      {/* New arrivals */}
      <Link
        href="/products?sort=newest"
        className="relative overflow-hidden rounded-2xl bg-gradient-to-r from-gray-900 to-gray-800
          p-6 flex items-center justify-between group hover:shadow-lg transition-shadow"
      >
        <div>
          <p className="text-gray-400 text-xs font-semibold uppercase tracking-wider mb-1">
            Шинэ ирэлт
          </p>
          <h3 className="text-white text-xl font-black mb-1">Шинэ бараанууд</h3>
          <p className="text-gray-400 text-xs">Өнөөдөр нэмэгдсэн</p>
        </div>
        <div className="text-5xl group-hover:scale-110 transition-transform">✨</div>
        <div className="absolute inset-0 bg-white/5 opacity-0 group-hover:opacity-100 transition-opacity" />
      </Link>
    </div>
  );
}
