"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import { signIn } from "next-auth/react";
import { User, Lock, Mail, Phone } from "lucide-react";

type Method = "email" | "phone";

export default function RegisterPage() {
  const router = useRouter();
  const [method, setMethod] = useState<Method>("email");
  const [show, setShow] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const [form, setForm] = useState({
    name: "",
    email: "",
    phone: "",
    password: "",
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));
    setError("");
  };

  const handleSubmit = async () => {
    setError("");
    setLoading(true);
    try {
      const res = await fetch("/api/auth/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: form.name,
          email: method === "email" ? form.email : undefined,
          phone: method === "phone" ? form.phone : undefined,
          password: form.password,
        }),
      });

      const data = await res.json();
      if (!res.ok) {
        setError(data.error || "Алдаа гарлаа");
        return;
      }

      // Auto login after register
      const loginEmail =
        method === "email" ? form.email : `phone_${form.phone}@zarlaa.local`;
      const result = await signIn("credentials", {
        email: loginEmail,
        password: form.password,
        redirect: false,
      });

      if (result?.ok) {
        router.push("/");
      } else {
        router.push("/auth/login");
      }
    } catch {
      setError("Сүлжээний алдаа гарлаа");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-[80vh] flex items-center justify-center px-4">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <Link href="/" className="inline-block">
            <Image
              src="/logo.png"
              alt="Shop Zarlaa"
              width={160}
              height={44}
              priority
              className="h-11 w-auto mx-auto"
            />
          </Link>
          <h1 className="text-xl font-bold text-gray-800 mt-4">Бүртгүүлэх</h1>
          <p className="text-sm text-gray-500 mt-1">Шинэ бүртгэл үүсгэх</p>
        </div>

        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-8 space-y-5">
          {/* Facebook */}
          <button
            onClick={() => signIn("facebook", { callbackUrl: "/" })}
            className="w-full flex items-center justify-center gap-3 py-3 bg-[#1877F2] hover:bg-[#166FE5] text-white font-semibold rounded-xl transition-colors text-sm"
          >
            <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="white">
              <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
            </svg>
            Facebook-ээр бүртгүүлэх
          </button>

          <div className="relative flex items-center gap-3">
            <div className="flex-1 h-px bg-gray-200" />
            <span className="text-xs text-gray-400 flex-shrink-0">эсвэл</span>
            <div className="flex-1 h-px bg-gray-200" />
          </div>

          {/* Toggle: Email / Phone */}
          <div className="flex rounded-xl border border-gray-200 overflow-hidden">
            <button
              onClick={() => setMethod("email")}
              className={`flex-1 flex items-center justify-center gap-2 py-2.5 text-sm font-medium transition-colors ${
                method === "email"
                  ? "bg-orange-500 text-white"
                  : "bg-white text-gray-500 hover:bg-gray-50"
              }`}
            >
              <Mail size={15} /> И-мэйл
            </button>
            <button
              onClick={() => setMethod("phone")}
              className={`flex-1 flex items-center justify-center gap-2 py-2.5 text-sm font-medium transition-colors ${
                method === "phone"
                  ? "bg-orange-500 text-white"
                  : "bg-white text-gray-500 hover:bg-gray-50"
              }`}
            >
              <Phone size={15} /> Утасны дугаар
            </button>
          </div>

          {/* Error */}
          {error && (
            <div className="bg-red-50 border border-red-200 rounded-xl px-4 py-3 text-sm text-red-600">
              {error}
            </div>
          )}

          {/* Name */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1.5">Нэр</label>
            <div className="relative">
              <User size={16} className="absolute left-3 top-3 text-gray-400" />
              <input
                type="text"
                name="name"
                value={form.name}
                onChange={handleChange}
                placeholder="Таны нэр"
                className="w-full pl-9 pr-4 py-2.5 border border-gray-200 rounded-xl text-sm focus:outline-none focus:border-orange-400 focus:ring-2 focus:ring-orange-100"
              />
            </div>
          </div>

          {/* Email or Phone */}
          {method === "email" ? (
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1.5">И-мэйл</label>
              <div className="relative">
                <Mail size={16} className="absolute left-3 top-3 text-gray-400" />
                <input
                  type="email"
                  name="email"
                  value={form.email}
                  onChange={handleChange}
                  placeholder="example@mail.com"
                  className="w-full pl-9 pr-4 py-2.5 border border-gray-200 rounded-xl text-sm focus:outline-none focus:border-orange-400 focus:ring-2 focus:ring-orange-100"
                />
              </div>
            </div>
          ) : (
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1.5">Утасны дугаар</label>
              <div className="relative flex">
                <span className="inline-flex items-center px-3 border border-r-0 border-gray-200 rounded-l-xl bg-gray-50 text-sm text-gray-600 font-medium">
                  🇲🇳 +976
                </span>
                <input
                  type="tel"
                  name="phone"
                  value={form.phone}
                  onChange={handleChange}
                  placeholder="8899 0010"
                  maxLength={8}
                  className="flex-1 px-3 py-2.5 border border-gray-200 rounded-r-xl text-sm focus:outline-none focus:border-orange-400 focus:ring-2 focus:ring-orange-100"
                />
              </div>
              <p className="text-xs text-gray-400 mt-1">8 оронтой дугаар оруулна уу</p>
            </div>
          )}

          {/* Password */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1.5">Нууц үг</label>
            <div className="relative">
              <Lock size={16} className="absolute left-3 top-3 text-gray-400" />
              <input
                type={show ? "text" : "password"}
                name="password"
                value={form.password}
                onChange={handleChange}
                placeholder="••••••••"
                className="w-full pl-9 pr-10 py-2.5 border border-gray-200 rounded-xl text-sm focus:outline-none focus:border-orange-400 focus:ring-2 focus:ring-orange-100"
              />
              <button
                type="button"
                onClick={() => setShow(!show)}
                className="absolute right-3 top-2.5 text-gray-400 hover:text-gray-600 text-xs"
              >
                {show ? "Нуух" : "Харах"}
              </button>
            </div>
          </div>

          <button
            onClick={handleSubmit}
            disabled={loading}
            className="w-full py-3 bg-orange-500 hover:bg-orange-600 disabled:opacity-60 text-white font-semibold rounded-xl transition-colors text-sm"
          >
            {loading ? "Бүртгэж байна..." : "Бүртгүүлэх"}
          </button>

          <p className="text-center text-sm text-gray-500">
            Бүртгэлтэй юу?{" "}
            <Link href="/auth/login" className="text-orange-500 hover:text-orange-600 font-medium">
              Нэвтрэх
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
