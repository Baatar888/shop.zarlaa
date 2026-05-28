"use client";

import { useState } from "react";
import { useCart } from "@/hooks/useCart";
import { formatPrice } from "@/lib/utils";
import Image from "next/image";
import { CheckCircle, Copy, Loader2, Phone, MapPin, CreditCard, Send } from "lucide-react";

type Step = "info" | "payment" | "success";
type PayMethod = "qpay" | "socialpay" | "khanbank" | "golomt";

const DELIVERY_FEE = 20000;

const PAYMENT_METHODS = [
  {
    id: "qpay" as PayMethod,
    name: "QPay",
    desc: "QPay хэтэвчээр төлөх",
    icon: "🟦",
    color: "#1C64F2",
  },
  {
    id: "socialpay" as PayMethod,
    name: "SocialPay",
    desc: "SocialPay-р төлөх",
    icon: "🟣",
    color: "#7C3AED",
  },
  {
    id: "khanbank" as PayMethod,
    name: "Хаан банк",
    desc: "Дансаар шилжүүлэх",
    icon: "🏦",
    color: "#0D9488",
    account: "5034538374",
  },
  {
    id: "golomt" as PayMethod,
    name: "Голомт банк",
    desc: "Дансаар шилжүүлэх",
    icon: "🏛️",
    color: "#EA580C",
    account: "1105196442",
  },
];

export default function CheckoutPage() {
  const { items, totalPrice, clearCart } = useCart();
  const [step, setStep] = useState<Step>("info");
  const [payMethod, setPayMethod] = useState<PayMethod>("qpay");
  const [loading, setLoading] = useState(false);
  const [orderId, setOrderId] = useState("");
  const [copied, setCopied] = useState(false);
  const [savedItems, setSavedItems] = useState<any[]>([]);
  const [savedCustomer, setSavedCustomer] = useState<any>(null);

  const [form, setForm] = useState({
    name: "",
    phone: "",
    district: "Улаанбаатар",
    khoroo: "",
    address: "",
    note: "",
    what3words: "",
  });

  const total = totalPrice() + DELIVERY_FEE;

  const handleCopy = (text: string) => {
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleSubmit = async () => {
    setLoading(true);
    const currentItems = [...items];
    const currentCustomer = { ...form };
    try {
      const res = await fetch("/api/orders", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          customer: form,
          items,
          payMethod,
          total,
          subtotal: totalPrice(),
          deliveryFee: DELIVERY_FEE,
        }),
      });

      if (!res.ok) {
        throw new Error(`Server error: ${res.status}`);
      }

      const data = await res.json();

      if (data.orderId) {
        setSavedItems(currentItems);
        setSavedCustomer(currentCustomer);
        setOrderId(data.orderId);
        clearCart();
        setStep("success");
      } else {
        throw new Error(data.error || "Захиалга үүсгэхэд алдаа гарлаа");
      }
    } catch (e: any) {
      console.error("Order submission error:", e);
      alert(e?.message || "Алдаа гарлаа. Дахин оролдоно уу.");
    } finally {
      setLoading(false);
    }
  };

  if (items.length === 0 && step !== "success") {
    return (
      <div className="min-h-[60vh] flex items-center justify-center">
        <p className="text-gray-500">Сагс хоосон байна</p>
      </div>
    );
  }

  return (
    <div className="max-w-5xl mx-auto px-4 py-8">
      <div className="flex items-center mb-8">
        {[
          { num: 1, label: "Мэдээлэл", key: "info" },
          { num: 2, label: "Төлбөр", key: "payment" },
          { num: 3, label: "Амжилттай", key: "success" },
        ].map((s, i) => {
          const isActive = step === s.key;
          const isDone =
            (s.key === "info" && (step === "payment" || step === "success")) ||
            (s.key === "payment" && step === "success");
          return (
            <div key={s.key} className="flex items-center">
              <div className="flex items-center gap-2">
                <div className={`w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold ${
                  isDone ? "bg-green-500 text-white" : isActive ? "bg-orange-500 text-white" : "bg-gray-100 text-gray-400"
                }`}>
                  {isDone ? "✓" : s.num}
                </div>
                <span className={`text-sm font-semibold ${
                  isActive ? "text-orange-500" : isDone ? "text-green-600" : "text-gray-400"
                }`}>
                  {s.label}
                </span>
              </div>
              {i < 2 && <div className="w-10 h-px bg-gray-200 mx-3" />}
            </div>
          );
        })}
      </div>

      {step === "success" ? (
        <SuccessScreen
          orderId={orderId}
          payMethod={payMethod}
          total={total}
          onCopy={handleCopy}
          copied={copied}
          customer={savedCustomer}
          items={savedItems}
        />
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2">
            {step === "info" && (
              <InfoStep form={form} setForm={setForm} onNext={() => setStep("payment")} />
            )}
            {step === "payment" && (
              <PaymentStep
                payMethod={payMethod}
                setPayMethod={setPayMethod}
                total={total}
                loading={loading}
                onBack={() => setStep("info")}
                onSubmit={handleSubmit}
                onCopy={handleCopy}
                copied={copied}
              />
            )}
          </div>
          <div className="lg:col-span-1">
            <OrderSummary items={items} subtotal={totalPrice()} delivery={DELIVERY_FEE} total={total} />
          </div>
        </div>
      )}
    </div>
  );
}

/* ─── Info Step ─── */
function InfoStep({
  form,
  setForm,
  onNext,
}: {
  form: any;
  setForm: any;
  onNext: () => void;
}) {
  const valid = form.name && form.phone && form.address;

  return (
    <div className="bg-white rounded-2xl border border-gray-100 p-6 shadow-sm">
      <h2 className="text-lg font-bold text-gray-900 mb-5 flex items-center gap-2">
        <Phone size={18} className="text-orange-500" /> Хүлээн авах мэдээлэл
      </h2>

      <div className="space-y-4">
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-medium text-gray-600 mb-1">Нэр *</label>
            <input
              className="w-full border border-gray-200 rounded-xl px-3 py-2.5 text-sm focus:outline-none focus:border-orange-400 transition"
              placeholder="Таны нэр"
              value={form.name}
              onChange={(e) => setForm({ ...form, name: e.target.value })}
            />
          </div>
          <div>
            <label className="block text-xs font-medium text-gray-600 mb-1">Утасны дугаар *</label>
            <input
              className="w-full border border-gray-200 rounded-xl px-3 py-2.5 text-sm focus:outline-none focus:border-orange-400 transition"
              placeholder="99001234"
              value={form.phone}
              onChange={(e) => setForm({ ...form, phone: e.target.value })}
            />
          </div>
        </div>

        <div>
          <div className="flex items-center gap-1 text-xs font-medium text-gray-600 mb-1">
            <MapPin size={12} /> <label>Аймаг / Хот</label>
          </div>
          <select
            className="w-full border border-gray-200 rounded-xl px-3 py-2.5 text-sm focus:outline-none focus:border-orange-400 bg-white"
            value={form.district}
            onChange={(e) => setForm({ ...form, district: e.target.value })}
          >
            <option>Улаанбаатар</option>
            <option>Дархан-Уул</option>
            <option>Орхон</option>
            <option>Говьсүмбэр</option>
            <option>Архангай</option>
            <option>Баян-Өлгий</option>
            <option>Баянхонгор</option>
            <option>Булган</option>
            <option>Говь-Алтай</option>
            <option>Дорнод</option>
            <option>Дорноговь</option>
            <option>Дундговь</option>
            <option>Завхан</option>
            <option>Өвөрхангай</option>
            <option>Өмнөговь</option>
            <option>Сүхбаатар</option>
            <option>Сэлэнгэ</option>
            <option>Төв</option>
            <option>Увс</option>
            <option>Ховд</option>
            <option>Хөвсгөл</option>
            <option>Хэнтий</option>
          </select>
        </div>

        <div>
          <label className="block text-xs font-medium text-gray-600 mb-1">Дүүрэг / Хороо</label>
          <input
            className="w-full border border-gray-200 rounded-xl px-3 py-2.5 text-sm focus:outline-none focus:border-orange-400 transition"
            placeholder="Сүхбаатар дүүрэг, 1-р хороо"
            value={form.khoroo}
            onChange={(e) => setForm({ ...form, khoroo: e.target.value })}
          />
        </div>

        <div>
          <label className="block text-xs font-medium text-gray-600 mb-1">Хүргүүлэх хаяг *</label>
          <input
            className="w-full border border-gray-200 rounded-xl px-3 py-2.5 text-sm focus:outline-none focus:border-orange-400 transition"
            placeholder="Байр, тоот, тодорхой хаяг"
            value={form.address}
            onChange={(e) => setForm({ ...form, address: e.target.value })}
          />
        </div>

        <div>
          <label className="block text-xs font-medium text-gray-600 mb-1">Нэмэлт мэдээлэл</label>
          <textarea
            rows={3}
            className="w-full border border-gray-200 rounded-xl px-3 py-2.5 text-sm focus:outline-none focus:border-orange-400 transition resize-none"
            placeholder="Жишээ: 2-р давхар, баруун өрөө..."
            value={form.note}
            onChange={(e) => setForm({ ...form, note: e.target.value })}
          />
        </div>

        <div>
          <label className="block text-xs font-medium text-gray-600 mb-1">
            <span className="inline-flex items-center gap-1.5">
              <span className="inline-flex items-center justify-center w-4 h-4 rounded bg-red-500 text-white text-[9px] font-black">///</span>
              what3words хаяг
              <span className="text-gray-400 font-normal">(заавал биш)</span>
            </span>
          </label>
          <div className="relative">
            <span className="absolute left-3 top-1/2 -translate-y-1/2 text-red-500 font-bold text-sm">///</span>
            <input
              className="w-full border border-gray-200 rounded-xl pl-9 pr-3 py-2.5 text-sm focus:outline-none focus:border-red-400 transition"
              placeholder="далай.баримт.ижилсэх"
              value={form.what3words}
              onChange={(e) => setForm({ ...form, what3words: e.target.value.replace(/^\/+/, "") })}
            />
          </div>
          <p className="text-[11px] text-gray-400 mt-1">
            what3words ашиглан яг байршлаа илүү нарийн заах боломжтой.{" "}
            <a href="https://what3words.com" target="_blank" rel="noopener noreferrer" className="text-red-500 hover:underline">
              what3words.com
            </a>
          </p>
        </div>

        <button
          onClick={onNext}
          disabled={!valid}
          className="w-full py-3.5 bg-orange-500 hover:bg-orange-600 disabled:bg-gray-200 disabled:text-gray-400 text-white font-bold rounded-xl transition-colors text-sm"
        >
          Үргэлжлүүлэх →
        </button>
      </div>
    </div>
  );
}

/* ─── Payment Step ─── */
function PaymentStep({
  payMethod, setPayMethod, total, loading, onBack, onSubmit, onCopy, copied,
}: {
  payMethod: PayMethod; setPayMethod: (m: PayMethod) => void; total: number;
  loading: boolean; onBack: () => void; onSubmit: () => void;
  onCopy: (t: string) => void; copied: boolean;
}) {
  const selected = PAYMENT_METHODS.find((m) => m.id === payMethod)!;

  return (
    <div className="bg-white rounded-2xl border border-gray-100 p-6 shadow-sm">
      <h2 className="text-lg font-bold text-gray-900 mb-5 flex items-center gap-2">
        <CreditCard size={18} className="text-orange-500" /> Төлбөрийн арга
      </h2>

      <div className="space-y-3 mb-6">
        {PAYMENT_METHODS.map((m) => (
          <button
            key={m.id}
            onClick={() => setPayMethod(m.id)}
            className={`w-full flex items-center gap-4 p-4 rounded-xl border-2 transition-all text-left ${
              payMethod === m.id
                ? "border-orange-400 bg-orange-50"
                : "border-gray-100 hover:border-gray-200"
            }`}
          >
            <span className="text-2xl">{m.icon}</span>
            <div className="flex-1">
              <p className="font-semibold text-sm text-gray-800">{m.name}</p>
              <p className="text-xs text-gray-500">{m.desc}</p>
            </div>
            <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center transition-colors ${
              payMethod === m.id ? "border-orange-500 bg-orange-500" : "border-gray-300"
            }`}>
              {payMethod === m.id && <div className="w-2 h-2 bg-white rounded-full" />}
            </div>
          </button>
        ))}
      </div>

      {(payMethod === "khanbank" || payMethod === "golomt") && (
        <div className="bg-gray-50 rounded-xl p-4 mb-5 border border-dashed border-gray-200">
          <p className="text-xs text-gray-500 mb-2">Дансны мэдээлэл</p>
          <div className="flex items-center justify-between">
            <div>
              <p className="font-bold text-gray-800">{selected.name}</p>
              <p className="text-lg font-black text-gray-900 tracking-wider">
                {(selected as any).account}
              </p>
              <p className="text-xs text-gray-500 mt-1">Хүлээн авагч: Баатар</p>
            </div>
            <button
              onClick={() => onCopy((selected as any).account)}
              className="flex items-center gap-1 px-3 py-2 bg-white border border-gray-200 rounded-lg text-xs font-medium hover:bg-gray-50 transition"
            >
              <Copy size={12} />
              {copied ? "Хуулагдлаа!" : "Хуулах"}
            </button>
          </div>
          <div className="mt-3 pt-3 border-t border-gray-200">
            <p className="text-xs text-gray-500">Шилжүүлэх дүн</p>
            <p className="font-black text-orange-500 text-lg">{formatPrice(total)}</p>
          </div>
          <p className="text-xs text-amber-600 bg-amber-50 rounded-lg p-2 mt-3">
            ⚠️ Гүйлгээний утганд захиалгын дугаараа заавал бичнэ үү
          </p>
        </div>
      )}

      {(payMethod === "qpay" || payMethod === "socialpay") && (
        <div className="bg-blue-50 rounded-xl p-4 mb-5 border border-blue-100">
          <p className="text-xs text-blue-600 font-medium">
            {payMethod === "qpay" ? "🟦 QPay" : "🟣 SocialPay"} — Захиалга батлагдсаны дараа төлбөрийн QR код илгээгдэх болно
          </p>
        </div>
      )}

      <div className="flex gap-3">
        <button
          onClick={onBack}
          className="px-5 py-3 border border-gray-200 text-gray-600 rounded-xl text-sm font-medium hover:bg-gray-50 transition"
        >
          ← Буцах
        </button>
        <button
          onClick={onSubmit}
          disabled={loading}
          className="flex-1 py-3 bg-gray-900 hover:bg-gray-800 text-white font-bold rounded-xl transition-colors text-sm flex items-center justify-center gap-2"
        >
          {loading ? (
            <><Loader2 size={16} className="animate-spin" /> Илгээж байна...</>
          ) : (
            "Захиалга баталгаажуулах ✓"
          )}
        </button>
      </div>
    </div>
  );
}

/* ─── Order Summary ─── */
function OrderSummary({
  items, subtotal, delivery, total,
}: {
  items: any[]; subtotal: number; delivery: number; total: number;
}) {
  return (
    <div className="bg-white rounded-2xl border border-gray-100 p-5 shadow-sm sticky top-4">
      <h3 className="font-bold text-gray-900 mb-4">Захиалгын дэлгэрэнгүй</h3>
      <div className="space-y-3 mb-4">
        {items.map((item) => (
          <div key={item.productId} className="flex items-center gap-3">
            <div className="relative w-14 h-14 rounded-xl overflow-hidden bg-gray-100 flex-shrink-0">
              {item.imageUrl && (
                <Image src={item.imageUrl} alt={item.title} fill className="object-cover" sizes="56px" />
              )}
              <span className="absolute -top-1 -right-1 w-5 h-5 bg-orange-500 text-white text-xs rounded-full flex items-center justify-center font-bold">
                {item.quantity}
              </span>
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-xs text-gray-700 line-clamp-2 font-medium">{item.title}</p>
              <p className="text-xs text-orange-500 font-bold mt-0.5">{formatPrice(item.price)}</p>
            </div>
          </div>
        ))}
      </div>
      <div className="border-t border-gray-100 pt-4 space-y-2">
        <div className="flex justify-between text-sm text-gray-600">
          <span>Бараа</span>
          <span>{formatPrice(subtotal)}</span>
        </div>
        <div className="flex justify-between text-sm text-gray-600">
          <span>Хүргэлт</span>
          <span>{formatPrice(delivery)}</span>
        </div>
        <div className="flex justify-between font-black text-gray-900 pt-2 border-t border-gray-100 text-base">
          <span>Нийт</span>
          <span className="text-orange-500">{formatPrice(total)}</span>
        </div>
      </div>
    </div>
  );
}

/* ─── Success Screen ─── */
function SuccessScreen({
  orderId, payMethod, total, onCopy, copied, customer, items,
}: {
  orderId: string; payMethod: PayMethod; total: number;
  onCopy: (t: string) => void; copied: boolean;
  customer: any; items: any[];
}) {
  const method = PAYMENT_METHODS.find((m) => m.id === payMethod)!;
  const [verifyLoading, setVerifyLoading] = useState(false);
  const [verifySent, setVerifySent] = useState(false);

  const handleVerifyPayment = async () => {
    setVerifyLoading(true);
    try {
      await fetch("/api/verify-payment", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ orderId, customer, total, payMethod, items }),
      });
      setVerifySent(true);
    } catch (e) {
      console.error("Verify error:", e);
    } finally {
      setVerifyLoading(false);
    }
  };

  return (
    <div className="max-w-lg mx-auto text-center py-12">
      <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
        <CheckCircle size={40} className="text-green-500" />
      </div>
      <h2 className="text-2xl font-black text-gray-900 mb-2">Захиалга амжилттай!</h2>
      <p className="text-gray-500 text-sm mb-6">Захиалгын дугаар:</p>
      <div className="bg-gray-50 rounded-2xl p-5 mb-6 border border-dashed border-gray-200">
        <p className="text-2xl font-black text-orange-500 tracking-wider">{orderId}</p>
        <p className="text-xs text-gray-400 mt-1">Дээрх дугаарыг хадгалж авна уу</p>
      </div>

      {(payMethod === "khanbank" || payMethod === "golomt") && (
        <div className="bg-amber-50 rounded-2xl p-5 mb-6 border border-amber-100 text-left">
          <p className="font-bold text-amber-800 mb-3">💳 Одоо дараах дансанд шилжүүлнэ үү:</p>
          <div className="flex items-center justify-between mb-2">
            <div>
              <p className="text-sm font-semibold text-gray-700">{method.name}</p>
              <p className="text-xl font-black tracking-wider text-gray-900">
                {(method as any).account}
              </p>
            </div>
            <button
              onClick={() => onCopy((method as any).account)}
              className="flex items-center gap-1 px-3 py-2 bg-white border border-amber-200 rounded-lg text-xs font-medium hover:bg-amber-50 transition"
            >
              <Copy size={12} />
              {copied ? "✓" : "Хуулах"}
            </button>
          </div>
          <p className="text-sm font-black text-orange-500">{formatPrice(total)}</p>
          <p className="text-xs text-amber-700 mt-2 bg-amber-100 rounded-lg p-2">
            Гүйлгээний утганд: <strong>{orderId}</strong> гэж бичнэ үү
          </p>
        </div>
      )}

      {(payMethod === "qpay" || payMethod === "socialpay") && (
        <div className="bg-blue-50 rounded-2xl p-5 mb-6 border border-blue-100">
          <p className="text-blue-700 text-sm font-medium">
            📱 {method.name} QR код болон төлбөрийн мэдээллийг и-мэйл болон утсанд таны руу илгээсэн байна.
          </p>
        </div>
      )}

      {/* ✅ Төлбөр шалгах товч */}
      <div className="bg-white rounded-2xl p-5 mb-6 border border-gray-200 shadow-sm">
        <p className="text-sm font-semibold text-gray-800 mb-1">Төлбөр төлсөн үү?</p>
        <p className="text-xs text-gray-500 mb-4">
          Төлбөр шилжүүлсний дараа доорх товч дарж манай багийг мэдэгдэнэ үү
        </p>
        {verifySent ? (
          <div className="flex items-center justify-center gap-2 py-3 bg-green-50 rounded-xl border border-green-200">
            <CheckCircle size={18} className="text-green-500" />
            <span className="text-green-700 font-semibold text-sm">Мэдэгдэл илгээгдлээ!</span>
          </div>
        ) : (
          <button
            onClick={handleVerifyPayment}
            disabled={verifyLoading}
            className="w-full flex items-center justify-center gap-2 py-3 bg-orange-500 hover:bg-orange-600 disabled:bg-orange-300 text-white font-bold rounded-xl transition-colors text-sm"
          >
            {verifyLoading ? (
              <><Loader2 size={16} className="animate-spin" /> Илгээж байна...</>
            ) : (
              <><Send size={16} /> Төлбөр шалгах хүсэлт илгээх</>
            )}
          </button>
        )}
      </div>

      <div className="bg-green-50 rounded-xl p-4 border border-green-100">
        <p className="text-xs text-green-700">
          ✅ Захиалгын баталгаажуулалт <strong>info@zarlaa.com</strong> руу илгээгдлээ.<br />
          📬 Telegram болон и-мэйлээр мэдэгдэл ирнэ.
        </p>
      </div>

      <a href="/products"
        className="inline-block mt-6 px-6 py-3 bg-orange-500 hover:bg-orange-600 text-white font-bold rounded-xl transition-colors text-sm">
        Дэлгүүр үзэх
      </a>
    </div>
  );
}
