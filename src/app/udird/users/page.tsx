"use client";

import { useEffect, useState, useCallback } from "react";
import { Search, Send, Users, X, Check, Mail, ChevronDown } from "lucide-react";

const ROLE_MAP: Record<string, { label: string; color: string }> = {
  BUYER: { label: "Худалдан авагч", color: "bg-blue-50 text-blue-600" },
  VENDOR: { label: "Худалдагч", color: "bg-green-50 text-green-600" },
  ADMIN: { label: "Админ", color: "bg-orange-50 text-orange-600" },
};

function formatDate(d: string) {
  return new Date(d).toLocaleDateString("mn-MN");
}

export default function AdminUsersPage() {
  const [users, setUsers] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [total, setTotal] = useState(0);
  const [selected, setSelected] = useState<Set<string>>(new Set());
  const [showBulk, setShowBulk] = useState(false);
  const [bulkForm, setBulkForm] = useState({ subject: "", message: "" });
  const [sending, setSending] = useState(false);
  const [sendResult, setSendResult] = useState<{ sent: number; failed: number } | null>(null);
  const [toast, setToast] = useState<string | null>(null);

  const fetchUsers = useCallback(async () => {
    setLoading(true);
    const params = new URLSearchParams({ page: String(page), limit: "20" });
    if (search) params.set("q", search);
    const res = await fetch(`/api/admin/users?${params}`);
    const data = await res.json();
    setUsers(data.users || []);
    setTotalPages(data.totalPages || 1);
    setTotal(data.total || 0);
    setLoading(false);
  }, [page, search]);

  useEffect(() => { fetchUsers(); }, [fetchUsers]);

  function toggleSelect(id: string) {
    const next = new Set(selected);
    if (next.has(id)) next.delete(id);
    else next.add(id);
    setSelected(next);
  }

  function selectAll() {
    if (selected.size === users.length) {
      setSelected(new Set());
    } else {
      setSelected(new Set(users.map((u) => u.id)));
    }
  }

  async function handleBulkSend() {
    if (!bulkForm.subject || !bulkForm.message) {
      setToast("Гарчиг болон мессежийг бөглөнө үү");
      setTimeout(() => setToast(null), 3000);
      return;
    }

    const recipients = users
      .filter((u) => selected.has(u.id))
      .map((u) => ({ email: u.email, name: u.name }));

    setSending(true);
    try {
      const res = await fetch("/api/admin/bulk-notify", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          recipients,
          subject: bulkForm.subject,
          message: bulkForm.message,
        }),
      });
      const data = await res.json();
      setSendResult({ sent: data.sent || recipients.length, failed: data.failed || 0 });
    } catch {
      setSendResult({ sent: 0, failed: recipients.length });
    } finally {
      setSending(false);
    }
  }

  const selectedUsers = users.filter((u) => selected.has(u.id));

  return (
    <div className="space-y-5 max-w-5xl">
      {/* Toast */}
      {toast && (
        <div className="fixed top-4 right-4 z-50 bg-red-500 text-white px-4 py-3 rounded-xl text-sm font-medium">
          {toast}
        </div>
      )}

      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-black text-gray-900">Хэрэглэгчид</h1>
          <p className="text-sm text-gray-400 mt-0.5">Нийт {total} хэрэглэгч</p>
        </div>
        {selected.size > 0 && (
          <button
            onClick={() => setShowBulk(true)}
            className="flex items-center gap-2 bg-orange-500 text-white px-4 py-2.5 rounded-xl text-sm font-semibold hover:bg-orange-600 transition-colors"
          >
            <Mail size={16} />
            {selected.size} хэрэглэгчид мэдэгдэл илгээх
          </button>
        )}
      </div>

      {/* Search */}
      <div className="relative max-w-sm">
        <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
        <input
          type="text"
          placeholder="Нэр, имэйлээр хайх..."
          value={search}
          onChange={(e) => { setSearch(e.target.value); setPage(1); }}
          className="w-full pl-9 pr-4 py-2.5 bg-white border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-orange-300"
        />
      </div>

      {/* Users table */}
      <div className="bg-white rounded-2xl border border-gray-100 overflow-hidden">
        {selected.size > 0 && (
          <div className="bg-orange-50 border-b border-orange-100 px-4 py-2.5 flex items-center justify-between">
            <span className="text-sm font-medium text-orange-700">
              {selected.size} хэрэглэгч сонгогдсон
            </span>
            <button onClick={() => setSelected(new Set())} className="text-xs text-orange-500 hover:text-orange-700">
              Цуцлах
            </button>
          </div>
        )}

        {loading ? (
          <div className="flex items-center justify-center h-48">
            <div className="w-6 h-6 border-4 border-orange-500 border-t-transparent rounded-full animate-spin" />
          </div>
        ) : users.length === 0 ? (
          <div className="text-center py-12 text-gray-400">
            <Users size={32} className="mx-auto mb-2 text-gray-200" />
            <p className="text-sm">Хэрэглэгч олдсонгүй</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-gray-100 bg-gray-50">
                  <th className="px-4 py-3 text-left w-10">
                    <input
                      type="checkbox"
                      checked={selected.size === users.length && users.length > 0}
                      onChange={selectAll}
                      className="w-4 h-4 accent-orange-500 rounded cursor-pointer"
                    />
                  </th>
                  <th className="text-left text-xs font-semibold text-gray-500 px-4 py-3">Хэрэглэгч</th>
                  <th className="text-left text-xs font-semibold text-gray-500 px-4 py-3 hidden sm:table-cell">Имэйл</th>
                  <th className="text-left text-xs font-semibold text-gray-500 px-4 py-3 hidden md:table-cell">Эрх</th>
                  <th className="text-left text-xs font-semibold text-gray-500 px-4 py-3 hidden lg:table-cell">Захиалга</th>
                  <th className="text-left text-xs font-semibold text-gray-500 px-4 py-3 hidden lg:table-cell">Бүртгүүлсэн</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-50">
                {users.map((user) => {
                  const role = ROLE_MAP[user.role] || ROLE_MAP.BUYER;
                  const initials = user.name.split(" ").map((n: string) => n[0]).join("").toUpperCase().slice(0, 2);
                  const isSelected = selected.has(user.id);
                  return (
                    <tr key={user.id} className={`transition-colors ${isSelected ? "bg-orange-50" : "hover:bg-gray-50"}`}>
                      <td className="px-4 py-3">
                        <input
                          type="checkbox"
                          checked={isSelected}
                          onChange={() => toggleSelect(user.id)}
                          className="w-4 h-4 accent-orange-500 rounded cursor-pointer"
                        />
                      </td>
                      <td className="px-4 py-3">
                        <div className="flex items-center gap-3">
                          <div className="w-8 h-8 rounded-full bg-orange-100 flex items-center justify-center flex-shrink-0">
                            <span className="text-orange-600 font-bold text-xs">{initials}</span>
                          </div>
                          <div className="min-w-0">
                            <p className="text-sm font-semibold text-gray-900">{user.name}</p>
                            <p className="text-xs text-gray-400 sm:hidden truncate">{user.email}</p>
                          </div>
                        </div>
                      </td>
                      <td className="px-4 py-3 hidden sm:table-cell">
                        <p className="text-sm text-gray-600">{user.email}</p>
                      </td>
                      <td className="px-4 py-3 hidden md:table-cell">
                        <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${role.color}`}>{role.label}</span>
                      </td>
                      <td className="px-4 py-3 hidden lg:table-cell">
                        <span className="text-sm text-gray-600">{user._count?.orders ?? 0}</span>
                      </td>
                      <td className="px-4 py-3 hidden lg:table-cell">
                        <span className="text-xs text-gray-400">{formatDate(user.createdAt)}</span>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}

        {totalPages > 1 && (
          <div className="flex items-center justify-between px-4 py-3 border-t border-gray-100">
            <p className="text-xs text-gray-400">{total} хэрэглэгчийн {page}-р хуудас</p>
            <div className="flex gap-2">
              <button disabled={page === 1} onClick={() => setPage((p) => p - 1)} className="px-3 py-1.5 text-xs rounded-lg border border-gray-200 disabled:opacity-40 hover:bg-gray-50">Өмнөх</button>
              <button disabled={page === totalPages} onClick={() => setPage((p) => p + 1)} className="px-3 py-1.5 text-xs rounded-lg border border-gray-200 disabled:opacity-40 hover:bg-gray-50">Дараах</button>
            </div>
          </div>
        )}
      </div>

      {/* Bulk message modal */}
      {showBulk && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-end sm:items-center justify-center p-0 sm:p-4">
          <div className="bg-white w-full sm:max-w-lg sm:rounded-2xl rounded-t-2xl">
            <div className="flex items-center justify-between p-5 border-b border-gray-100">
              <div>
                <h2 className="font-black text-gray-900">Имэйл мэдэгдэл илгээх</h2>
                <p className="text-xs text-gray-400 mt-0.5">{selected.size} хэрэглэгч сонгогдсон</p>
              </div>
              <button onClick={() => { setShowBulk(false); setSendResult(null); }} className="p-1.5 rounded-lg hover:bg-gray-100">
                <X size={18} />
              </button>
            </div>

            {sendResult ? (
              <div className="p-6 text-center">
                <div className={`w-16 h-16 rounded-full mx-auto mb-4 flex items-center justify-center ${sendResult.failed === 0 ? "bg-green-100" : "bg-amber-100"}`}>
                  {sendResult.failed === 0 ? <Check size={32} className="text-green-600" /> : <Mail size={32} className="text-amber-600" />}
                </div>
                <h3 className="font-bold text-gray-900 text-lg mb-1">
                  {sendResult.failed === 0 ? "Амжилттай илгээгдлээ!" : "Дутуу илгээгдлээ"}
                </h3>
                <p className="text-sm text-gray-500">
                  {sendResult.sent} имэйл амжилттай · {sendResult.failed} амжилтгүй
                </p>
                <button
                  onClick={() => { setShowBulk(false); setSendResult(null); setSelected(new Set()); setBulkForm({ subject: "", message: "" }); }}
                  className="mt-4 px-6 py-2.5 bg-orange-500 text-white rounded-xl text-sm font-semibold hover:bg-orange-600 transition-colors"
                >
                  Хаах
                </button>
              </div>
            ) : (
              <>
                <div className="p-5 space-y-4">
                  {/* Selected users preview */}
                  <div className="bg-orange-50 rounded-xl p-3">
                    <p className="text-xs font-semibold text-orange-700 mb-2">Сонгогдсон хэрэглэгчид</p>
                    <div className="flex flex-wrap gap-1">
                      {selectedUsers.slice(0, 5).map((u) => (
                        <span key={u.id} className="text-xs bg-white text-gray-700 px-2 py-0.5 rounded-full border border-orange-200">
                          {u.name}
                        </span>
                      ))}
                      {selectedUsers.length > 5 && (
                        <span className="text-xs text-orange-600 font-medium">+{selectedUsers.length - 5} дахь</span>
                      )}
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-gray-600 mb-1.5">Имэйлийн гарчиг *</label>
                    <input
                      type="text"
                      value={bulkForm.subject}
                      onChange={(e) => setBulkForm({ ...bulkForm, subject: e.target.value })}
                      placeholder="Жишээ: ✨ Шинэ бараа нэмэгдлээ!"
                      className="w-full px-3 py-2.5 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-orange-300"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-gray-600 mb-1.5">Мессеж *</label>
                    <textarea
                      value={bulkForm.message}
                      onChange={(e) => setBulkForm({ ...bulkForm, message: e.target.value })}
                      placeholder="Хэрэглэгчдэд илгээх мессежийг бичнэ үү..."
                      rows={5}
                      className="w-full px-3 py-2.5 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-orange-300 resize-none"
                    />
                    <p className="text-xs text-gray-400 mt-1">HTML тэг ашиглах боломжтой. Жишээ: &lt;b&gt;тод&lt;/b&gt;</p>
                  </div>
                </div>
                <div className="flex gap-3 p-5 border-t border-gray-100">
                  <button
                    onClick={() => setShowBulk(false)}
                    className="flex-1 py-2.5 border border-gray-200 rounded-xl text-sm font-semibold text-gray-600 hover:bg-gray-50"
                  >
                    Болих
                  </button>
                  <button
                    onClick={handleBulkSend}
                    disabled={sending}
                    className="flex-1 py-2.5 bg-orange-500 text-white rounded-xl text-sm font-semibold hover:bg-orange-600 disabled:opacity-60 flex items-center justify-center gap-2"
                  >
                    {sending ? (
                      <><div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" /> Илгээж байна...</>
                    ) : (
                      <><Send size={15} /> {selected.size} хэрэглэгчид илгээх</>
                    )}
                  </button>
                </div>
              </>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
