"use client";

import { useEffect, useState, useCallback } from "react";
import { Search, ChevronDown, Phone, MapPin, Package } from "lucide-react";

const STATUS_MAP: Record<string, { label: string; color: string; bg: string }> = {
  PENDING: { label: "Хүлээж байна", color: "text-amber-700", bg: "bg-amber-50" },
  CONFIRMED: { label: "Баталгаажсан", color: "text-blue-700", bg: "bg-blue-50" },
  SHIPPED: { label: "Илгээсэн", color: "text-purple-700", bg: "bg-purple-50" },
  DELIVERED: { label: "Хүргэгдсэн", color: "text-green-700", bg: "bg-green-50" },
  CANCELLED: { label: "Цуцлагдсан", color: "text-red-600", bg: "bg-red-50" },
};

const STATUS_OPTIONS = ["", "PENDING", "CONFIRMED", "SHIPPED", "DELIVERED", "CANCELLED"];

function formatPrice(v: number) {
  return "₮" + v.toLocaleString("mn-MN");
}

function formatDate(d: string | Date) {
  return new Date(d).toLocaleString("mn-MN", {
    year: "numeric", month: "2-digit", day: "2-digit",
    hour: "2-digit", minute: "2-digit",
  });
}

export default function AdminOrdersPage() {
  const [orders, setOrders] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [statusFilter, setStatusFilter] = useState("");
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [total, setTotal] = useState(0);
  const [expanded, setExpanded] = useState<string | null>(null);
  const [updating, setUpdating] = useState<string | null>(null);

  const fetchOrders = useCallback(async () => {
    setLoading(true);
    const params = new URLSearchParams({ page: String(page), limit: "15" });
    if (statusFilter) params.set("status", statusFilter);
    const res = await fetch(`/api/admin/orders?${params}`);
    const data = await res.json();
    setOrders(data.orders || []);
    setTotalPages(data.totalPages || 1);
    setTotal(data.total || 0);
    setLoading(false);
  }, [page, statusFilter]);

  useEffect(() => { fetchOrders(); }, [fetchOrders]);

  async function updateStatus(orderId: string, status: string) {
    setUpdating(orderId);
    await fetch("/api/admin/orders", {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ id: orderId, status }),
    });
    setUpdating(null);
    fetchOrders();
  }

  const NEXT_STATUS: Record<string, string> = {
    PENDING: "CONFIRMED",
    CONFIRMED: "SHIPPED",
    SHIPPED: "DELIVERED",
  };

  const NEXT_LABEL: Record<string, string> = {
    PENDING: "Баталгаажуулах",
    CONFIRMED: "Илгээсэн болгох",
    SHIPPED: "Хүргэгдсэн болгох",
  };

  return (
    <div className="space-y-5 max-w-5xl">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-black text-gray-900">Захиалгууд</h1>
          <p className="text-sm text-gray-400 mt-0.5">Нийт {total} захиалга</p>
        </div>
      </div>

      {/* Filter */}
      <div className="flex flex-wrap gap-2">
        {STATUS_OPTIONS.map((s) => {
          const st = s ? STATUS_MAP[s] : null;
          return (
            <button
              key={s}
              onClick={() => { setStatusFilter(s); setPage(1); }}
              className={`px-3 py-1.5 rounded-full text-xs font-semibold transition-colors ${
                statusFilter === s
                  ? "bg-gray-900 text-white"
                  : "bg-white border border-gray-200 text-gray-600 hover:border-gray-300"
              }`}
            >
              {s ? st?.label : "Бүгд"}
            </button>
          );
        })}
      </div>

      {/* Orders list */}
      {loading ? (
        <div className="flex items-center justify-center h-48">
          <div className="w-6 h-6 border-4 border-orange-500 border-t-transparent rounded-full animate-spin" />
        </div>
      ) : orders.length === 0 ? (
        <div className="bg-white rounded-2xl border border-gray-100 p-12 text-center text-gray-400">
          <Package size={32} className="mx-auto mb-2 text-gray-200" />
          <p className="text-sm">Захиалга олдсонгүй</p>
        </div>
      ) : (
        <div className="space-y-3">
          {orders.map((order) => {
            const st = STATUS_MAP[order.status] || STATUS_MAP.PENDING;
            const isOpen = expanded === order.id;
            const nextStatus = NEXT_STATUS[order.status];

            return (
              <div key={order.id} className="bg-white rounded-2xl border border-gray-100 overflow-hidden">
                {/* Order header */}
                <div
                  className="flex items-center gap-3 p-4 cursor-pointer hover:bg-gray-50 transition-colors"
                  onClick={() => setExpanded(isOpen ? null : order.id)}
                >
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 flex-wrap">
                      <span className="font-bold text-gray-900 text-sm font-mono">{order.id}</span>
                      <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${st.bg} ${st.color}`}>
                        {st.label}
                      </span>
                    </div>
                    <div className="flex items-center gap-3 mt-0.5 flex-wrap">
                      <span className="text-xs text-gray-500">{order.user?.name || order.customer}</span>
                      <span className="text-xs text-gray-400">{formatDate(order.createdAt)}</span>
                    </div>
                  </div>
                  <div className="text-right flex-shrink-0">
                    <p className="font-black text-gray-900">{formatPrice(Number(order.totalAmount))}</p>
                    <p className="text-xs text-gray-400">{order.items?.length || 0} бараа</p>
                  </div>
                  <ChevronDown
                    size={16}
                    className={`text-gray-400 transition-transform flex-shrink-0 ${isOpen ? "rotate-180" : ""}`}
                  />
                </div>

                {/* Expanded details */}
                {isOpen && (
                  <div className="border-t border-gray-100 p-4 space-y-4">
                    {/* Customer info */}
                    <div className="grid sm:grid-cols-2 gap-3">
                      <div className="bg-gray-50 rounded-xl p-3 space-y-1">
                        <p className="text-xs font-semibold text-gray-500 mb-2">Захиалагч</p>
                        <p className="text-sm font-semibold text-gray-900">{order.user?.name}</p>
                        <p className="text-xs text-gray-500">{order.user?.email}</p>
                        {order.phone && (
                          <p className="text-xs text-gray-500 flex items-center gap-1">
                            <Phone size={11} /> {order.phone}
                          </p>
                        )}
                        {order.address && (
                          <p className="text-xs text-gray-500 flex items-center gap-1">
                            <MapPin size={11} /> {order.address}
                          </p>
                        )}
                      </div>

                      {/* Items */}
                      <div className="bg-gray-50 rounded-xl p-3">
                        <p className="text-xs font-semibold text-gray-500 mb-2">Бараа</p>
                        <div className="space-y-1.5">
                          {(order.items || []).map((item: any, i: number) => (
                            <div key={i} className="flex items-center justify-between gap-2">
                              <span className="text-xs text-gray-700 truncate">
                                {item.product?.title || "Бараа"} ×{item.quantity}
                              </span>
                              <span className="text-xs font-semibold text-gray-900 flex-shrink-0">
                                {formatPrice(Number(item.price) * item.quantity)}
                              </span>
                            </div>
                          ))}
                          <div className="border-t border-gray-200 pt-1.5 flex justify-between">
                            <span className="text-xs font-semibold text-gray-700">Нийт</span>
                            <span className="text-sm font-black text-orange-500">{formatPrice(Number(order.totalAmount))}</span>
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Actions */}
                    <div className="flex flex-wrap gap-2 pt-1">
                      {nextStatus && (
                        <button
                          onClick={() => updateStatus(order.id, nextStatus)}
                          disabled={updating === order.id}
                          className="flex items-center gap-2 px-4 py-2 bg-orange-500 text-white rounded-xl text-xs font-semibold hover:bg-orange-600 disabled:opacity-60 transition-colors"
                        >
                          {updating === order.id ? (
                            <div className="w-3 h-3 border-2 border-white border-t-transparent rounded-full animate-spin" />
                          ) : null}
                          {NEXT_LABEL[order.status]}
                        </button>
                      )}
                      {order.status !== "CANCELLED" && order.status !== "DELIVERED" && (
                        <button
                          onClick={() => updateStatus(order.id, "CANCELLED")}
                          disabled={updating === order.id}
                          className="px-4 py-2 border border-red-200 text-red-500 rounded-xl text-xs font-semibold hover:bg-red-50 disabled:opacity-60 transition-colors"
                        >
                          Цуцлах
                        </button>
                      )}
                    </div>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="flex items-center justify-between">
          <p className="text-xs text-gray-400">{total} захиалгын {page}-р хуудас</p>
          <div className="flex gap-2">
            <button disabled={page === 1} onClick={() => setPage((p) => p - 1)} className="px-3 py-1.5 text-xs rounded-lg border border-gray-200 disabled:opacity-40 hover:bg-gray-50">Өмнөх</button>
            <button disabled={page === totalPages} onClick={() => setPage((p) => p + 1)} className="px-3 py-1.5 text-xs rounded-lg border border-gray-200 disabled:opacity-40 hover:bg-gray-50">Дараах</button>
          </div>
        </div>
      )}
    </div>
  );
}
