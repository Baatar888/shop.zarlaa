import Link from "next/link";

const CATEGORIES = [
  { name: "Хувцас", slug: "clothing", icon: "👗", color: "bg-pink-50 hover:bg-pink-100" },
  { name: "Цахилгаан бараа", slug: "electronics", icon: "📱", color: "bg-blue-50 hover:bg-blue-100" },
  { name: "Гэр ахуй", slug: "home", icon: "🏠", color: "bg-amber-50 hover:bg-amber-100" },
  { name: "Гоо сайхан", slug: "beauty", icon: "💄", color: "bg-rose-50 hover:bg-rose-100" },
  { name: "Спорт", slug: "sport", icon: "⚽", color: "bg-green-50 hover:bg-green-100" },
  { name: "Хүүхдийн", slug: "kids", icon: "🧸", color: "bg-yellow-50 hover:bg-yellow-100" },
  { name: "Ном", slug: "books", icon: "📚", color: "bg-purple-50 hover:bg-purple-100" },
  { name: "Автомашин", slug: "auto", icon: "🚗", color: "bg-slate-50 hover:bg-slate-100" },
];

export default function CategoryGrid() {
  return (
    <section>
      <div className="flex items-center justify-between mb-5">
        <h2 className="text-xl font-bold text-gray-950">Ангиллаар хайх</h2>
        <Link href="/products" className="text-sm text-orange-500 hover:text-orange-600 font-medium">
          Бүгд →
        </Link>
      </div>

      <div className="grid grid-cols-4 sm:grid-cols-8 gap-3">
        {CATEGORIES.map((cat) => (
          <Link
            key={cat.slug}
            href={`/category/${cat.slug}`}
            className={`flex flex-col items-center gap-2 py-4 px-2 rounded-2xl
              ${cat.color} transition-colors group`}
          >
            <span className="text-3xl group-hover:scale-110 transition-transform duration-200">
              {cat.icon}
            </span>
            <span className="text-[11px] font-medium text-gray-700 text-center leading-tight">
              {cat.name}
            </span>
          </Link>
        ))}
      </div>
    </section>
  );
}
