"use client";
import Link from "next/link";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { Search, Menu, X, User } from "lucide-react";

const categories = [
  { name: "Хувцас", slug: "clothing" },
  { name: "Цахилгаан бараа", slug: "electronics" },
  { name: "Гэр ахуй", slug: "home" },
  { name: "Гоо сайхан", slug: "beauty" },
  { name: "Спорт", slug: "sport" },
  { name: "Хүүхдийн", slug: "kids" },
];

export default function Navbar() {
  const router = useRouter();
  const [query, setQuery] = useState("");
  const [menuOpen, setMenuOpen] = useState(false);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (query.trim()) router.push(`/products?q=${encodeURIComponent(query)}`);
  };

  return (
    <header className="sticky top-0 z-50 bg-white border-b border-gray-100 shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between gap-4 h-16">
          
          {/* Logo Хэсэг */}
          <Link href="/" className="flex-shrink-0">
            <Image
              src="/logo.png"
              alt="Shop Zarlaa"
              width={160}
              height={44}
              priority
              className="h-11 w-auto"
            />
          </Link>

          {/* Хайлтын хэсэг */}
          <form onSubmit={handleSearch} className="flex-1 max-w-2xl hidden sm:block">
            <div className="relative flex items-center">
              <input
                type="text"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Бараа, брэнд, ангилал хайх..."
                className="w-full pl-4 pr-12 py-2.5 rounded-xl border border-gray-200 bg-gray-50
                  focus:outline-none focus:border-orange-400 focus:bg-white focus:ring-2
                  focus:ring-orange-100 text-sm transition-all"
              />
              <button
                type="submit"
                className="absolute right-2 p-1.5 rounded-lg bg-orange-500 hover:bg-orange-600
                  text-white transition-colors"
              >
                <Search size={16} />
              </button>
            </div>
          </form>

          {/* Баруун талын цэс */}
          <div className="flex items-center gap-3">
            <Link
              href="/auth/login"
              className="hidden sm:flex items-center gap-1.5 px-3 py-2 rounded-lg
                text-sm text-gray-600 hover:bg-gray-100 transition-colors"
            >
              <User size={16} />
              <span>Нэвтрэх</span>
            </Link>

            <button
              onClick={() => setMenuOpen(!menuOpen)}
              className="sm:hidden p-2 rounded-lg text-gray-600 hover:bg-gray-100"
            >
              {menuOpen ? <X size={20} /> : <Menu size={20} />}
            </button>
          </div>
        </div>

        {/* Ангилалууд */}
        <nav className="hidden sm:flex items-center gap-1 py-2 border-t border-gray-100 overflow-x-auto">
          <Link
            href="/products"
            className="flex-shrink-0 px-3 py-1.5 text-xs font-semibold text-orange-600
              bg-orange-50 rounded-full hover:bg-orange-100 transition-colors"
          >
            🔥 Бүгд
          </Link>
          {categories.map((cat) => (
            <Link
              key={cat.slug}
              href={`/category/${cat.slug}`}
              className="flex-shrink-0 px-3 py-1.5 text-xs text-gray-600 rounded-full
                hover:bg-gray-100 hover:text-gray-900 transition-colors whitespace-nowrap"
            >
              {cat.name}
            </Link>
          ))}
        </nav>
      </div>

      {/* Мобайл цэс */}
      {menuOpen && (
        <div className="sm:hidden border-t border-gray-100 bg-white px-4 py-4 space-y-3">
          <form onSubmit={handleSearch}>
            <div className="relative">
              <input
                type="text"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Хайх..."
                className="w-full pl-4 pr-10 py-2.5 rounded-xl border border-gray-200 bg-gray-50
                  focus:outline-none focus:border-orange-400 text-sm"
              />
              <button type="submit" className="absolute right-2 top-2 p-1.5">
                <Search size={16} className="text-gray-400" />
              </button>
            </div>
          </form>
          <div className="grid grid-cols-3 gap-2">
            {categories.map((cat) => (
              <Link
                key={cat.slug}
                href={`/category/${cat.slug}`}
                onClick={() => setMenuOpen(false)}
                className="text-center py-2 px-2 text-xs text-gray-600 bg-gray-50
                  rounded-lg hover:bg-orange-50 hover:text-orange-600 transition-colors"
              >
                {cat.name}
              </Link>
            ))}
          </div>
        </div>
      )}
    </header>
  );
}