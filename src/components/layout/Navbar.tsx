"use client";

import Link from "next/link";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { Search, Menu, X, User, LogOut } from "lucide-react";
import { useSession, signOut } from "next-auth/react";
import CartButton from "./CartButton";

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
  const { data: session } = useSession();
  const [query, setQuery] = useState("");
  const [menuOpen, setMenuOpen] = useState(false);
  const [userMenuOpen, setUserMenuOpen] = useState(false);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (query.trim()) router.push(`/products?q=${encodeURIComponent(query)}`);
  };

  return (
    <header className="sticky top-0 z-50 bg-white border-b border-gray-100 shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center gap-4 h-16">
          {/* Logo */}
          <Link href="/" className="flex-shrink-0">
            <Image src="/logo.png" alt="Shop Zarlaa" width={160} height={44} priority className="h-11 w-auto" />
          </Link>

          {/* Search */}
          <form onSubmit={handleSearch} className="flex-1 max-w-2xl">
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
              <button type="submit" className="absolute right-2 p-1.5 rounded-lg bg-orange-500 hover:bg-orange-600 text-white transition-colors">
                <Search size={16} />
              </button>
            </div>
          </form>

          {/* Actions */}
          <div className="flex items-center gap-1 flex-shrink-0">
            {session?.user ? (
              <div className="relative hidden sm:block">
                <button
                  onClick={() => setUserMenuOpen(!userMenuOpen)}
                  className="flex items-center gap-2 px-3 py-2 rounded-lg text-sm text-gray-700 hover:bg-gray-100 transition-colors"
                >
                  {session.user.image ? (
                    <Image src={session.user.image} alt="" width={24} height={24} className="rounded-full" />
                  ) : (
                    <div className="w-6 h-6 rounded-full bg-orange-500 flex items-center justify-center text-white text-xs font-bold">
                      {session.user.name?.charAt(0) ?? "U"}
                    </div>
                  )}
                  <span className="hidden md:inline max-w-[100px] truncate">{session.user.name}</span>
                </button>
                {userMenuOpen && (
                  <div className="absolute right-0 top-full mt-1 w-44 bg-white rounded-xl border border-gray-100 shadow-lg py-1 z-50">
                    <Link href="/dashboard/orders" className="flex items-center gap-2 px-4 py-2 text-sm text-gray-700 hover:bg-gray-50" onClick={() => setUserMenuOpen(false)}>
                      Захиалгууд
                    </Link>
                    <button
                      onClick={() => { signOut({ callbackUrl: "/" }); setUserMenuOpen(false); }}
                      className="w-full flex items-center gap-2 px-4 py-2 text-sm text-red-500 hover:bg-red-50"
                    >
                      <LogOut size={14} /> Гарах
                    </button>
                  </div>
                )}
              </div>
            ) : (
              <Link href="/auth/login" className="hidden sm:flex items-center gap-1.5 px-3 py-2 rounded-lg text-sm text-gray-600 hover:bg-gray-100 hover:text-gray-900 transition-colors">
                <User size={16} />
                <span className="hidden md:inline">Нэвтрэх</span>
              </Link>
            )}

            <CartButton />

            <button onClick={() => setMenuOpen(!menuOpen)} className="sm:hidden p-2 rounded-lg text-gray-600 hover:bg-gray-100">
              {menuOpen ? <X size={20} /> : <Menu size={20} />}
            </button>
          </div>
        </div>

        {/* Category nav */}
        <nav className="hidden sm:flex items-center gap-1 py-2 border-t border-gray-100 overflow-x-auto scrollbar-hide">
          <Link href="/products" className="flex-shrink-0 px-3 py-1.5 text-xs font-semibold text-orange-600 bg-orange-50 rounded-full hover:bg-orange-100 transition-colors">
            🔥 Бүгд
          </Link>
          {categories.map((cat) => (
            <Link key={cat.slug} href={`/category/${cat.slug}`}
              className="flex-shrink-0 px-3 py-1.5 text-xs text-gray-600 rounded-full hover:bg-gray-100 hover:text-gray-900 transition-colors whitespace-nowrap">
              {cat.name}
            </Link>
          ))}
        </nav>
      </div>

      {/* Mobile menu */}
      {menuOpen && (
        <div className="sm:hidden border-t border-gray-100 bg-white px-4 py-4 space-y-3">
          <form onSubmit={handleSearch}>
            <div className="relative">
              <input type="text" value={query} onChange={(e) => setQuery(e.target.value)} placeholder="Хайх..."
                className="w-full pl-4 pr-10 py-2.5 rounded-xl border border-gray-200 bg-gray-50 focus:outline-none focus:border-orange-400 text-sm" />
              <button type="submit" className="absolute right-2 top-2 p-1.5">
                <Search size={16} className="text-gray-400" />
              </button>
            </div>
          </form>
          <div className="grid grid-cols-3 gap-2">
            {categories.map((cat) => (
              <Link key={cat.slug} href={`/category/${cat.slug}`} onClick={() => setMenuOpen(false)}
                className="text-center py-2 px-2 text-xs text-gray-600 bg-gray-50 rounded-lg hover:bg-orange-50 hover:text-orange-600 transition-colors">
                {cat.name}
              </Link>
            ))}
          </div>
          {session?.user ? (
            <div className="flex items-center justify-between py-2 border-t border-gray-100">
              <span className="text-sm text-gray-700">{session.user.name}</span>
              <button onClick={() => signOut({ callbackUrl: "/" })} className="flex items-center gap-1.5 text-sm text-red-500">
                <LogOut size={14} /> Гарах
              </button>
            </div>
          ) : (
            <Link href="/auth/login" className="flex items-center gap-2 py-2 text-sm text-gray-600" onClick={() => setMenuOpen(false)}>
              <User size={16} /> Нэвтрэх / Бүртгүүлэх
            </Link>
          )}
        </div>
      )}
    </header>
  );
}
