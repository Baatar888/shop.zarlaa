"use client";

import { useEffect, useState, useCallback } from "react";
import { Plus, Search, Edit3, Trash2, Star, Eye, EyeOff, X, Check, Package } from "lucide-react";
import Image from "next/image";
import { useSearchParams } from "next/navigation";

function formatPrice(v: number) {
  return "₮" + v.toLocaleString("mn-MN");
}

function discountPct(orig: number, sale: number) {
  return Math.round(((orig - sale) / orig) * 100);
}

const EMPTY_FORM = {
  title: "",
  description: "",
  originalPrice: "",
  salePrice: "",
  stock: "",
  images: [""],
  isFeatured: false,
  notifyUsers: false,
};

export default function AdminProductsPage() {
  const searchParams = useSearchParams();
  const [products, setProducts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [total, setTotal] = useState(0);
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState({ ...EMPTY_FORM });
  const [saving, setSaving] = useState(false);
  const [editId, setEditId] = useState<string | null>(null);
  const [toast, setToast] = useState<{ msg: string; type: "success" | "error" } | null>(null);

  const fetchProducts = useCallback(async () => {
    setLoading(true);
    const params = new URLSearchParams({ page: String(page), limit: "20" });
    if (search) params.set("q", search);
    const res = await fetch(`/api/admin/products?${params}`);
    const data = await res.json();
    setProducts(data.products || []);
    setTotalPages(data.totalPages || 1);
    setTotal(data.total || 0);
    setLoading(false);
  }, [page, search]);

  useEffect(() => {
    fetchProducts();
  }, [fetchProducts]);

  useEffect(() => {
    if (searchParams.get("action") === "new") {
      setShowForm(true);
    }
  }, [searchParams]);

  function showToast(msg: string, type: "success" | "error" = "success") {
    setToast({ msg, type });
    setTimeout(() => setToast(null), 3000);
  }

  async function handleSave() {
    if (!form.title || !form.originalPrice || !form.salePrice) {
      showToast("Гарчиг болон үнэ заавал шаардлагатай", "error");
      return;
    }
    setSaving(true);
    try {
      const body = {
        ...form,
        originalPrice: parseFloat(form.originalPrice),
        salePrice: parseFloat(form.salePrice),
        stock: parseInt(form.stock || "0"),
        images: form.images.filter(Boolean),
        ...(editId && { id: editId }),
      };

      const res = await fetch("/api/admin/products", {
        method: editId ? "PATCH" : "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
      });

      if (res.ok) {
        showToast(editId ? "Бараа шинэчлэгдлээ!" : "Бараа амжилттай нэмэгдлээ!");
        setShowForm(false);
        setForm({ ...EMPTY_FORM });
        setEditId(null);
        fetchProducts();
      } else {
        showToast("Алдаа гарлаа. Дахин оролдоно уу.", "error");
      }
    } finally {
      setSaving(false);
    }
  }

  async function handleToggle(id: string, field: "isActive" | "isFeatured", value: boolean) {
    await fetch("/api/admin/products", {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ id, [field]: value }),
    });
    fetchProducts();
  }

  async function handleDelete(id: string) {
    if (!confirm("Энэ барааг устгах уу?")) return;
    await fetch(`/api/admin/products?id=${id}`, { method: "DELETE" });
    showToast("Бараа устгагдлаа");
    fetchProducts();
  }

  function openEdit(product: any) {
    setForm({
      title: product.title,
      description: product.description || "",
      originalPrice: String(product.originalPrice),
      salePrice: String(product.salePrice),
      stock: String(product.stock),
      images: product.images?.map((img: any) => img.url || img) || [""],
      isFeatured: product.isFeatured,
      notifyUsers: false,
    });
    setEditId(product.id);
    setShowForm(true);
  }

  const primaryImage = (p: any) => {
    const imgs = p.images || [];
    const primary = imgs.find((i: any) => i.isPrimary);
    return primary?.url || imgs[0]?.url || imgs[0] || null;
  };

  return (
    <div className="space-y-5 max-w-7xl">
      {/* Toast */}
      {toast && (
        <div
          className={`fixed top-4 right-4 z-50 px-4 py-3 rounded-xl shadow-lg text-sm font-medium flex items-center gap-2 animate-fade-in ${
            toast.type === "success" ? "bg-green-500 text-white" : "bg-red-500 text-white"
          }`}
        >
          {toast.type === "success" ? <Check size={16} /> : <X size={16} />}
          {toast.msg}
        </div>
      )}

      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-black text-gray-900">Бараа</h1>
          <p className="text-sm text-gray-400 mt-0.5">Нийт {total} бараа</p>
        </div>
        <button
          onClick={() => { setForm({ ...EMPTY_FORM }); setEditId(null); setShowForm(true); }}
          className="flex items-center gap-2 bg-orange-500 text-white px-4 py-2.5 rounded-xl text-sm font-semibold hover:bg-orange-600 transition-colors"
        >
          <Plus size={16} />
          Бараа нэмэх
        </button>
      </div>

      {/* Search */}
      <div className="relative">
        <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
        <input
          type="text"
          placeholder="Барааны нэрээр хайх..."
          value={search}
          onChange={(e) => { setSearch(e.target.value); setPage(1); }}
          className="w-full max-w-sm pl-9 pr-4 py-2.5 bg-white border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-orange-300"
        />
      </div>

      {/* Products table */}
      <div className="bg-white rounded-2xl border border-gray-100 overflow-hidden">
        {loading ? (
          <div className="flex items-center justify-center h-48">
            <div className="w-6 h-6 border-4 border-orange-500 border-t-transparent rounded-full animate-spin" />
          </div>
        ) : products.length === 0 ? (
          <div className="text-center py-12 text-gray-400">
            <Package className="mx-auto mb-2 text-gray-200" size={32} />
            <p className="text-sm">Бараа олдсонгүй</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-gray-100 bg-gray-50">
                  <th className="text-left text-xs font-semibold text-gray-500 px-4 py-3">Бараа</th>
                  <th className="text-left text-xs font-semibold text-gray-500 px-4 py-3 hidden sm:table-cell">Үнэ</th>
                  <th className="text-left text-xs font-semibold text-gray-500 px-4 py-3 hidden md:table-cell">Үлдэгдэл</th>
                  <th className="text-left text-xs font-semibold text-gray-500 px-4 py-3 hidden lg:table-cell">Ангилал</th>
                  <th className="text-right text-xs font-semibold text-gray-500 px-4 py-3">Үйлдэл</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-50">
                {products.map((product) => {
                  const img = primaryImage(product);
                  const discount = discountPct(Number(product.originalPrice), Number(product.salePrice));
                  return (
                    <tr key={product.id} className="hover:bg-gray-50 transition-colors">
                      <td className="px-4 py-3">
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 rounded-lg bg-gray-100 overflow-hidden flex-shrink-0">
                            {img ? (
                              <img src={img} alt={product.title} className="w-full h-full object-cover" />
                            ) : (
                              <div className="w-full h-full flex items-center justify-center text-gray-300 text-lg">📦</div>
                            )}
                          </div>
                          <div className="min-w-0">
                            <p className="text-sm font-semibold text-gray-900 truncate max-w-[200px]">{product.title}</p>
                            <div className="flex items-center gap-1 mt-0.5">
                              {product.isFeatured && (
                                <span className="text-xs bg-amber-50 text-amber-600 px-1.5 py-0.5 rounded font-medium">Онцлох</span>
                              )}
                              {!product.isActive && (
                                <span className="text-xs bg-gray-100 text-gray-400 px-1.5 py-0.5 rounded font-medium">Идэвхгүй</span>
                              )}
                            </div>
                          </div>
                        </div>
                      </td>
                      <td className="px-4 py-3 hidden sm:table-cell">
                        <p className="text-sm font-bold text-gray-900">{formatPrice(Number(product.salePrice))}</p>
                        {discount > 0 && (
                          <p className="text-xs text-gray-400 line-through">{formatPrice(Number(product.originalPrice))}</p>
                        )}
                      </td>
                      <td className="px-4 py-3 hidden md:table-cell">
                        <span className={`text-sm font-medium ${product.stock === 0 ? "text-red-500" : product.stock < 5 ? "text-amber-500" : "text-green-600"}`}>
                          {product.stock}
                        </span>
                      </td>
                      <td className="px-4 py-3 hidden lg:table-cell">
                        <span className="text-xs text-gray-500">{product.category?.name || "—"}</span>
                      </td>
                      <td className="px-4 py-3">
                        <div className="flex items-center gap-1 justify-end">
                          <button
                            onClick={() => handleToggle(product.id, "isFeatured", !product.isFeatured)}
                            title="Онцлох"
                            className={`p-1.5 rounded-lg transition-colors ${product.isFeatured ? "text-amber-500 bg-amber-50" : "text-gray-300 hover:text-amber-500 hover:bg-amber-50"}`}
                          >
                            <Star size={15} />
                          </button>
                          <button
                            onClick={() => handleToggle(product.id, "isActive", !product.isActive)}
                            title={product.isActive ? "Нуух" : "Харуулах"}
                            className={`p-1.5 rounded-lg transition-colors ${product.isActive ? "text-blue-500 hover:bg-blue-50" : "text-gray-300 hover:text-blue-500 hover:bg-blue-50"}`}
                          >
                            {product.isActive ? <Eye size={15} /> : <EyeOff size={15} />}
                          </button>
                          <button
                            onClick={() => openEdit(product)}
                            className="p-1.5 rounded-lg text-gray-400 hover:text-gray-700 hover:bg-gray-100 transition-colors"
                          >
                            <Edit3 size={15} />
                          </button>
                          <button
                            onClick={() => handleDelete(product.id)}
                            className="p-1.5 rounded-lg text-gray-300 hover:text-red-500 hover:bg-red-50 transition-colors"
                          >
                            <Trash2 size={15} />
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}

        {/* Pagination */}
        {totalPages > 1 && (
          <div className="flex items-center justify-between px-4 py-3 border-t border-gray-100">
            <p className="text-xs text-gray-400">{total} барааны {page}-р хуудас</p>
            <div className="flex gap-2">
              <button
                disabled={page === 1}
                onClick={() => setPage((p) => p - 1)}
                className="px-3 py-1.5 text-xs rounded-lg border border-gray-200 disabled:opacity-40 hover:bg-gray-50 transition-colors"
              >
                Өмнөх
              </button>
              <button
                disabled={page === totalPages}
                onClick={() => setPage((p) => p + 1)}
                className="px-3 py-1.5 text-xs rounded-lg border border-gray-200 disabled:opacity-40 hover:bg-gray-50 transition-colors"
              >
                Дараах
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Add/Edit Product Modal */}
      {showForm && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-end sm:items-center justify-center p-0 sm:p-4">
          <div className="bg-white w-full sm:max-w-lg sm:rounded-2xl rounded-t-2xl max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between p-5 border-b border-gray-100 sticky top-0 bg-white">
              <h2 className="font-black text-gray-900">{editId ? "Бараа засах" : "Шинэ бараа нэмэх"}</h2>
              <button onClick={() => setShowForm(false)} className="p-1.5 rounded-lg hover:bg-gray-100 transition-colors">
                <X size={18} />
              </button>
            </div>
            <div className="p-5 space-y-4">
              <div>
                <label className="block text-xs font-semibold text-gray-600 mb-1.5">Барааны нэр *</label>
                <input
                  type="text"
                  value={form.title}
                  onChange={(e) => setForm({ ...form, title: e.target.value })}
                  placeholder="Жишээ: Samsung Galaxy A55"
                  className="w-full px-3 py-2.5 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-orange-300"
                />
              </div>
              <div>
                <label className="block text-xs font-semibold text-gray-600 mb-1.5">Тайлбар</label>
                <textarea
                  value={form.description}
                  onChange={(e) => setForm({ ...form, description: e.target.value })}
                  placeholder="Барааны дэлгэрэнгүй тайлбар..."
                  rows={3}
                  className="w-full px-3 py-2.5 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-orange-300 resize-none"
                />
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-gray-600 mb-1.5">Эх үнэ (₮) *</label>
                  <input
                    type="number"
                    value={form.originalPrice}
                    onChange={(e) => setForm({ ...form, originalPrice: e.target.value })}
                    placeholder="1200000"
                    className="w-full px-3 py-2.5 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-orange-300"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-gray-600 mb-1.5">Борлуулалтын үнэ (₮) *</label>
                  <input
                    type="number"
                    value={form.salePrice}
                    onChange={(e) => setForm({ ...form, salePrice: e.target.value })}
                    placeholder="990000"
                    className="w-full px-3 py-2.5 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-orange-300"
                  />
                </div>
              </div>
              {form.originalPrice && form.salePrice && Number(form.originalPrice) > Number(form.salePrice) && (
                <p className="text-xs text-green-600 font-medium -mt-2">
                  🏷️ {discountPct(Number(form.originalPrice), Number(form.salePrice))}% хямдарсан
                </p>
              )}
              <div>
                <label className="block text-xs font-semibold text-gray-600 mb-1.5">Үлдэгдэл (ширхэг)</label>
                <input
                  type="number"
                  value={form.stock}
                  onChange={(e) => setForm({ ...form, stock: e.target.value })}
                  placeholder="10"
                  className="w-full px-3 py-2.5 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-orange-300"
                />
              </div>
              <div>
                <label className="block text-xs font-semibold text-gray-600 mb-1.5">Зурагны URL</label>
                {form.images.map((url, i) => (
                  <div key={i} className="flex gap-2 mb-2">
                    <input
                      type="text"
                      value={url}
                      onChange={(e) => {
                        const imgs = [...form.images];
                        imgs[i] = e.target.value;
                        setForm({ ...form, images: imgs });
                      }}
                      placeholder="https://example.com/image.jpg"
                      className="flex-1 px-3 py-2.5 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-orange-300"
                    />
                    {i > 0 && (
                      <button
                        onClick={() => setForm({ ...form, images: form.images.filter((_, j) => j !== i) })}
                        className="p-2.5 text-red-400 hover:bg-red-50 rounded-xl"
                      >
                        <X size={14} />
                      </button>
                    )}
                  </div>
                ))}
                <button
                  onClick={() => setForm({ ...form, images: [...form.images, ""] })}
                  className="text-xs text-orange-500 hover:text-orange-600 font-medium"
                >
                  + Зураг нэмэх
                </button>
              </div>
              <div className="flex flex-col gap-3 pt-2">
                <label className="flex items-center gap-3 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={form.isFeatured}
                    onChange={(e) => setForm({ ...form, isFeatured: e.target.checked })}
                    className="w-4 h-4 rounded accent-orange-500"
                  />
                  <span className="text-sm text-gray-700">⭐ Онцлох барааны жагсаалтад оруулах</span>
                </label>
                {!editId && (
                  <label className="flex items-center gap-3 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={form.notifyUsers}
                      onChange={(e) => setForm({ ...form, notifyUsers: e.target.checked })}
                      className="w-4 h-4 rounded accent-orange-500"
                    />
                    <div>
                      <span className="text-sm text-gray-700">📧 Хэрэглэгчдэд имэйлээр мэдэгдэх</span>
                      <p className="text-xs text-gray-400">Бүртгэлтэй хэрэглэгчдэд шинэ барааны мэдэгдэл очно</p>
                    </div>
                  </label>
                )}
              </div>
            </div>
            <div className="flex gap-3 p-5 border-t border-gray-100 sticky bottom-0 bg-white">
              <button
                onClick={() => setShowForm(false)}
                className="flex-1 py-2.5 border border-gray-200 rounded-xl text-sm font-semibold text-gray-600 hover:bg-gray-50 transition-colors"
              >
                Болих
              </button>
              <button
                onClick={handleSave}
                disabled={saving}
                className="flex-1 py-2.5 bg-orange-500 text-white rounded-xl text-sm font-semibold hover:bg-orange-600 disabled:opacity-60 transition-colors flex items-center justify-center gap-2"
              >
                {saving ? (
                  <><div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" /> Хадгалж байна...</>
                ) : (
                  editId ? "Шинэчлэх" : "Нэмэх"
                )}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
