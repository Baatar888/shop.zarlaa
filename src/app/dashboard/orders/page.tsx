import Link from "next/link";
import { Package, ArrowLeft } from "lucide-react";

const MOCK_ORDERS = [
  { id: "ORD-001", date: "2025-01-10", status: "DELIVERED", total: 990000, items: 1 },
  { id: "ORD-002", date: "2025-01-08", status: "SHIPPED", total: 320000, items: 2 },
  { id: "ORD-003", date: "2025-01-05", status: "PENDING", total: 199000, items: 1 },
];

const STATUS_MAP: Record<string, { label: string; class: string }> = {
  PENDING:   { label: "Хүлээж байна", class: "bg-yellow-50 text-yellow-600" },
  CONFIRMED: { label: "Баталгаажсан", class: "bg-blue-50 text-blue-600" },
  SHIPPED:   { label: "Илгээсэн", class: "bg-purple-50 text-purple-600" },
  DELIVERED: { label: "Хүргэгдсэн", class: "bg-green-50 text-green-600" },
  CANCELLED: { label: "Цуцлагдсан", class: "bg-red-50 text-red-500" },
};

export default function OrdersPage() {
  return (
    <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <Link href="/" className="flex items-center gap-2 text-sm text-gray-500 hover:text-gray-700 mb-6 transition-colors">
        <ArrowLeft size={16} /> Нүүр хуудас
      </Link>
      <h1 className="text-2xl font-black text-gray-950 mb-6">Миний захиалгууд</h1>
      {MOCK_ORDERS.length === 0 ? (
        <div className="text-center py-16 text-gray-400">
          <Package size={48} className="mx-auto mb-3 text-gray-200" />
          <p>Захиалга байхгүй байна</p>
        </div>
      ) : (
        <div className="space-y-4">
          {MOCK_ORDERS.map((order) => {
            const st = STATUS_MAP[order.status];
            return (
              <div key={order.id} className="bg-white rounded-2xl border border-gray-100 p-5 flex items-center justify-between gap-4">
                <div>
                  <p className="font-bold text-gray-950">{order.id}</p>
                  <p className="text-xs text-gray-400 mt-0.5">{order.date} • {order.items} бараа</p>
                </div>
                <div className="text-right flex items-center gap-3">
                  <span className={`text-xs px-2.5 py-1 rounded-full font-medium ${st.class}`}>{st.label}</span>
                  <span className="font-bold text-gray-950">₮{order.total.toLocaleString()}</span>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
