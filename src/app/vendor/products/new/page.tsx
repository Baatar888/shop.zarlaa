"use client";
import { useState } from "react";
import Link from "next/link";
import { ArrowLeft, Upload } from "lucide-react";

const CATEGORIES = ["Хувцас","Цахилгаан бараа","Гэр ахуй","Гоо сайхан","Спорт","Хүүхдийн","Ном","Автомашин"];

export default function NewProductPage() {
  const [form, setForm] = useState({ title: "", description: "", originalPrice: "", salePrice: "", stock: "", brand: "", category: "" });
  const set = (k: string, v: string) => setForm((f) => ({ ...f, [k]: v }));

  return (
    <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <Link href="/vendor" className="flex items-center gap-2 text-sm text-gray-500 hover:text-gray-700 mb-6 transition-colors">
        <ArrowLeft size={16} /> Хяналтын самбар руу буцах
      </Link>
      <h1 className="text-2xl font-black text-gray-950 mb-8">Шинэ бараа нэмэх</h1>
      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-8 space-y-5">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1.5">Барааны нэр *</label>
          <input value={form.title} onChange={(e) => set("title", e.target.value)} placeholder="Барааны нэрийг оруулна уу"
            className="w-full px-4 py-2.5 border border-gray-200 rounded-xl text-sm focus:outline-none focus:border-orange-400 focus:ring-2 focus:ring-orange-100" />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1.5">Тайлбар</label>
          <textarea rows={3} value={form.description} onChange={(e) => set("description", e.target.value)}
            placeholder="Барааны тайлбарыг оруулна уу..."
            className="w-full px-4 py-2.5 border border-gray-200 rounded-xl text-sm resize-none focus:outline-none focus:border-orange-400 focus:ring-2 focus:ring-orange-100" />
        </div>
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1.5">Үндсэн үнэ (₮) *</label>
            <input type="number" value={form.originalPrice} onChange={(e) => set("originalPrice", e.target.value)}
              placeholder="0" className="w-full px-4 py-2.5 border border-gray-200 rounded-xl text-sm focus:outline-none focus:border-orange-400 focus:ring-2 focus:ring-orange-100" />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1.5">Хямдарсан үнэ (₮) *</label>
            <input type="number" value={form.salePrice} onChange={(e) => set("salePrice", e.target.value)}
              placeholder="0" className="w-full px-4 py-2.5 border border-gray-200 rounded-xl text-sm focus:outline-none focus:border-orange-400 focus:ring-2 focus:ring-orange-100" />
          </div>
        </div>
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1.5">Нөөц (ширхэг)</label>
            <input type="number" value={form.stock} onChange={(e) => set("stock", e.target.value)}
              placeholder="0" className="w-full px-4 py-2.5 border border-gray-200 rounded-xl text-sm focus:outline-none focus:border-orange-400 focus:ring-2 focus:ring-orange-100" />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1.5">Брэнд</label>
            <input value={form.brand} onChange={(e) => set("brand", e.target.value)}
              placeholder="Брэндийн нэр" className="w-full px-4 py-2.5 border border-gray-200 rounded-xl text-sm focus:outline-none focus:border-orange-400 focus:ring-2 focus:ring-orange-100" />
          </div>
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1.5">Ангилал *</label>
          <select value={form.category} onChange={(e) => set("category", e.target.value)}
            className="w-full px-4 py-2.5 border border-gray-200 rounded-xl text-sm bg-white focus:outline-none focus:border-orange-400 focus:ring-2 focus:ring-orange-100">
            <option value="">Ангилал сонгох</option>
            {CATEGORIES.map((c) => <option key={c} value={c}>{c}</option>)}
          </select>
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1.5">Зурагнууд</label>
          <div className="border-2 border-dashed border-gray-200 rounded-xl p-8 text-center hover:border-orange-300 transition-colors cursor-pointer">
            <Upload size={28} className="text-gray-300 mx-auto mb-2" />
            <p className="text-sm text-gray-400">Зураг оруулах эсвэл чирэх</p>
            <p className="text-xs text-gray-300 mt-1">PNG, JPG хүртэл 5MB</p>
          </div>
        </div>
        <div className="flex gap-3 pt-2">
          <Link href="/vendor" className="flex-1 py-3 border border-gray-200 text-gray-600 font-semibold rounded-xl text-sm text-center hover:bg-gray-50 transition-colors">
            Цуцлах
          </Link>
          <button className="flex-1 py-3 bg-orange-500 hover:bg-orange-600 text-white font-bold rounded-xl text-sm transition-colors">
            Бараа нэмэх
          </button>
        </div>
      </div>
    </div>
  );
}
