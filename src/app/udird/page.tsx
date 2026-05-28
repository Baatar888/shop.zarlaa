"use client";

import { useEffect, useState } from "react";
import {
  ShoppingCart,
  Users,
  Package,
  TrendingUp,
  ArrowUpRight,
  Clock,
} from "lucide-react";
import Link from "next/link";

const STATUS_MAP: Record<string, { label: string; color: string }> = {
  PENDING: { label: "Хүлээж байна", color: "bg-amber-50 text-amber-700" },
  CONFIRMED: { label: "Баталгаажсан", color: "bg-blue-50 text-blue-700" },
  SHIPPED: { label: "Илгээсэн", color: "bg-purple-50 text-purple-700" },
  DELIVERED: { label: "Хүргэгдсэн", color: "bg-green-50 text-green-700" },
  CANCELLED: { label: "Цуцлагдсан", color: "bg-red-50 text-red-600" },
};

function formatPrice(v: number) {
  return "₮" + v.toLocaleString("mn-MN");
}

function timeAgo(date: string | Date) {
  const diff = Date.now() - new Date(date).getTime();
  const mins = Math.floor(diff / 60000);
  if (mins < 1) return "Дөнгөж сая";
  if (mins < 60) return `${mins} минутын өмнө`;
  const hours = Math.floor(mins / 60);
  if (hours < 24) return `${hours} цагийн өмнө`;
  return `${Math.floor(hours / 24)} өдрийн өмнө`;
}

export default function AdminDashboard() {
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("/api/admin/stats")
      .then((r) => r.json())
      .then((d) => { setData(d); setLoading(false); })
      .catch(() => setLoading(false));
  }, []);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="w-8 h-8 border-4 border-orange-500 border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  const stats = data?.stats || {};
  const recentOrders = data?.recentOrders || [];
  const dailyData = data?.dailyData || [];

  const maxRevenue = Math.max(...dailyData.map((d: any) => d.revenue), 1);

  const STAT_CARDS = [
    {
      label: "Өнөөдрийн захиалга",
      value: stats.todayOrders ?? 0,
      suffix: "захиалга",
      icon: ShoppingCart,
      color: "text-orange-500",
      bg: "bg-orange-50",
    },
    {
      label: "Энэ сарын орлого",
      value: formatPrice(stats.monthRevenue ?? 0),
      suffix: "",
      icon: TrendingUp,
      color: "text-green-600",
      bg: "bg-green-50",
    },
    {
      label: "Нийт хэрэглэгч",
      value: stats.totalUsers ?? 0,
      suffix: "хэрэглэгч",
      icon: Users,
      color: "text-blue-600",
      bg: "bg-blue-50",
    },
    {
      label: "Нийт бараа",
      value: stats.totalProducts ?? 0,
      suffix: "бараа",
      icon: Package,
      color: "text-purple-600",
      bg: "bg-purple-50",
    },
  ];

  return (
    <div className="space-y-6 max-w-7xl">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-black text-gray-900">Дашборд</h1>
        <p className="text-sm text-gray-400 mt-0.5">
          {new Date().toLocaleDateString("mn-MN", { weekday: "long", year: "numeric", month: "long", day: "numeric" })}
        </p>
      </div>

      {/* Stat cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {STAT_CARDS.map((card) => {
          const Icon = card.icon;
          return (
            <div key={card.label} className="bg-white rounded-2xl border border-gray-100 p-4 sm:p-5">
              <div className="flex items-center justify-between mb-3">
                <p className="text-xs text-gray-400 font-medium">{card.label}</p>
                <div className={`w-8 h-8 rounded-lg ${card.bg} flex items-center justify-center`}>
                  <Icon size={16} className={card.color} />
                </div>
              </div>
              <p className="text-2xl font-black text-gray-900">{card.value}</p>
              {card.suffix && <p className="text-xs text-gray-400 mt-0.5">{card.suffix}</p>}
            </div>
          );
        })}
      </div>

      <div className="grid lg:grid-cols-3 gap-6">
        {/* Revenue chart */}
        <div className="lg:col-span-2 bg-white rounded-2xl border border-gray-100 p-5">
          <div className="flex items-center justify-between mb-4">
            <h2 className="font-bold text-gray-900">7 хоногийн орлого</h2>
          </div>
          <div className="flex items-end gap-2 h-40">
            {dailyData.map((d: any, i: number) => {
              const height = Math.round((d.revenue / maxRevenue) * 100);
              return (
                <div key={i} className="flex-1 flex flex-col items-center gap-1">
                  <div
                    className="w-full bg-orange-100 rounded-t-lg relative group cursor-default transition-all hover:bg-orange-200"
                    style={{ height: `${Math.max(height, 4)}%` }}
                  >
                    <div className="absolute -top-7 left-1/2 -translate-x-1/2 bg-gray-900 text-white text-xs px-2 py-0.5 rounded whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity z-10 pointer-events-none">
                      {formatPrice(d.revenue)}
                    </div>
                  </div>
                  <span className="text-xs text-gray-400 whitespace-nowrap">{d.date}</span>
                </div>
              );
            })}
          </div>
          <div className="flex items-center gap-4 mt-3 pt-3 border-t border-gray-50">
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 rounded-full bg-orange-200" />
              <span className="text-xs text-gray-400">Орлого</span>
            </div>
            <div className="flex items-center gap-1 ml-auto">
              <ArrowUpRight size={14} className="text-green-500" />
              <span className="text-xs text-green-600 font-medium">Энэ сар {stats.monthOrders} захиалга</span>
            </div>
          </div>
        </div>

        {/* Quick actions */}
        <div className="bg-white rounded-2xl border border-gray-100 p-5">
          <h2 className="font-bold text-gray-900 mb-4">Хурдан үйлдэл</h2>
          <div className="space-y-2">
            <Link
              href="/udird/products?action=new"
              className="flex items-center gap-3 p-3 rounded-xl hover:bg-gray-50 transition-colors group"
            >
              <div className="w-9 h-9 bg-orange-50 rounded-lg flex items-center justify-center group-hover:bg-orange-100 transition-colors">
                <Package size={18} className="text-orange-500" />
              </div>
              <div>
                <p className="text-sm font-semibold text-gray-900">Шинэ бараа нэмэх</p>
                <p className="text-xs text-gray-400">Барааны удирдлага</p>
              </div>
              <ArrowUpRight size={14} className="text-gray-300 ml-auto group-hover:text-orange-500 transition-colors" />
            </Link>
            <Link
              href="/udird/orders"
              className="flex items-center gap-3 p-3 rounded-xl hover:bg-gray-50 transition-colors group"
            >
              <div className="w-9 h-9 bg-blue-50 rounded-lg flex items-center justify-center group-hover:bg-blue-100 transition-colors">
                <ShoppingCart size={18} className="text-blue-500" />
              </div>
              <div>
                <p className="text-sm font-semibold text-gray-900">Захиалга харах</p>
                <p className="text-xs text-gray-400">{stats.totalOrders} нийт захиалга</p>
              </div>
              <ArrowUpRight size={14} className="text-gray-300 ml-auto group-hover:text-blue-500 transition-colors" />
            </Link>
            <Link
              href="/udird/users"
              className="flex items-center gap-3 p-3 rounded-xl hover:bg-gray-50 transition-colors group"
            >
              <div className="w-9 h-9 bg-green-50 rounded-lg flex items-center justify-center group-hover:bg-green-100 transition-colors">
                <Users size={18} className="text-green-500" />
              </div>
              <div>
                <p className="text-sm font-semibold text-gray-900">Хэрэглэгчид</p>
                <p className="text-xs text-gray-400">{stats.totalUsers} бүртгэлтэй</p>
              </div>
              <ArrowUpRight size={14} className="text-gray-300 ml-auto group-hover:text-green-500 transition-colors" />
            </Link>
          </div>
        </div>
      </div>

      {/* Recent orders */}
      <div className="bg-white rounded-2xl border border-gray-100 p-5">
        <div className="flex items-center justify-between mb-4">
          <h2 className="font-bold text-gray-900">Сүүлийн захиалгууд</h2>
          <Link href="/udird/orders" className="text-xs text-orange-500 hover:text-orange-600 font-medium flex items-center gap-1">
            Бүгдийг харах <ArrowUpRight size={12} />
          </Link>
        </div>
        <div className="space-y-3">
          {recentOrders.length === 0 ? (
            <div className="text-center py-8 text-gray-400">
              <ShoppingCart size={32} className="mx-auto mb-2 text-gray-200" />
              <p className="text-sm">Захиалга байхгүй байна</p>
            </div>
          ) : (
            recentOrders.map((order: any) => {
              const st = STATUS_MAP[order.status] || STATUS_MAP.PENDING;
              return (
                <div
                  key={order.id}
                  className="flex items-center gap-3 p-3 rounded-xl hover:bg-gray-50 transition-colors"
                >
                  <div className="w-9 h-9 rounded-lg bg-gray-100 flex items-center justify-center flex-shrink-0">
                    <ShoppingCart size={15} className="text-gray-400" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2">
                      <p className="text-sm font-semibold text-gray-900 truncate">{order.customer}</p>
                      <span className={`text-xs px-2 py-0.5 rounded-full font-medium flex-shrink-0 ${st.color}`}>
                        {st.label}
                      </span>
                    </div>
                    <p className="text-xs text-gray-400 truncate">{order.firstItem} · {order.itemCount} бараа</p>
                  </div>
                  <div className="text-right flex-shrink-0">
                    <p className="text-sm font-bold text-gray-900">{formatPrice(order.total)}</p>
                    <p className="text-xs text-gray-400 flex items-center gap-0.5 justify-end">
                      <Clock size={10} />
                      {timeAgo(order.createdAt)}
                    </p>
                  </div>
                </div>
              );
            })
          )}
        </div>
      </div>
    </div>
  );
}
