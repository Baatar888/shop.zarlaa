import Link from "next/link";

export default function HeroBanner() {
  return (
    <section className="relative overflow-hidden rounded-2xl bg-gray-950
      min-h-[320px] sm:min-h-[400px] flex items-center">
      {/* Background pattern */}
      <div className="absolute inset-0 opacity-10"
        style={{
          backgroundImage: `radial-gradient(circle at 20% 50%, #f97316 0%, transparent 50%),
            radial-gradient(circle at 80% 20%, #3b82f6 0%, transparent 40%)`,
        }}
      />
      <div className="absolute inset-0"
        style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ffffff' fill-opacity='0.03'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
        }}
      />

      <div className="relative z-10 px-8 sm:px-12 py-12 max-w-2xl">
        <span className="inline-flex items-center gap-2 bg-orange-500/20 text-orange-400
          text-xs font-semibold px-3 py-1 rounded-full mb-4 border border-orange-500/30">
          🔥 Шинэ улирлын хямдрал
        </span>
        <h1 className="text-3xl sm:text-5xl font-black text-white leading-tight mb-4">
          Монголын хамгийн том
          <span className="text-orange-400"> онлайн</span> зах
        </h1>
        <p className="text-gray-400 text-sm sm:text-base mb-8 leading-relaxed">
          Хувь хүн болон байгууллагууд өөрсдөө бараагаа байршуулж,
          хямдралын хувиа тохируулж, хаанаас ч худалдаалах боломж.
        </p>
        <div className="flex flex-wrap gap-3">
          <Link
            href="/products"
            className="px-6 py-3 bg-orange-500 hover:bg-orange-600 text-white
              font-semibold rounded-xl transition-colors text-sm"
          >
            Дэлгүүр хэсэх
          </Link>
          <Link
            href="/vendor/register"
            className="px-6 py-3 bg-white/10 hover:bg-white/20 text-white
              font-semibold rounded-xl transition-colors text-sm border border-white/20"
          >
            Дэлгүүр нээх →
          </Link>
        </div>

        {/* Stats */}
        <div className="flex gap-6 mt-10">
          {[
            { value: "10,000+", label: "Бараа" },
            { value: "500+", label: "Дэлгүүр" },
            { value: "50,000+", label: "Худалдан авагч" },
          ].map((stat) => (
            <div key={stat.label}>
              <div className="text-xl font-bold text-white">{stat.value}</div>
              <div className="text-xs text-gray-500">{stat.label}</div>
            </div>
          ))}
        </div>
      </div>

      {/* Right decoration */}
      <div className="absolute right-0 top-0 bottom-0 w-64 hidden lg:flex
        items-center justify-center text-[120px] opacity-20 select-none">
        🛒
      </div>
    </section>
  );
}
