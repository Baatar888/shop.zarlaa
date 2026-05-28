"use client";
import { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { signIn } from "next-auth/react";
import { Lock, Eye, EyeOff, Mail, Phone } from "lucide-react";

type Method = "email" | "phone";

export default function LoginPage() {
  const [show, setShow] = useState(false);
  const [method, setMethod] = useState<Method>("email");

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
          <h1 className="text-xl font-bold text-gray-800 mt-4">Нэвтрэх</h1>
          <p className="text-sm text-gray-500 mt-1">Таны бүртгэлд нэвтрэх</p>
        </div>

        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-8 space-y-5">
          {/* Facebook */}
          <button
            onClick={() => signIn("facebook", { callbackUrl: "/" })}
            className="w-full flex items-center justify-center gap-3 py-3 bg-[#1877F2] hover:bg-[#166FE5] text-white font-semibold rounded-xl transition-colors text-sm"
          >
            <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="white">
              <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
            </svg>
            Facebook-ээр нэвтрэх
          </button>

          <div className="relative flex items-center gap-3">
            <div className="flex-1 h-px bg-gray-200" />
            <span className="text-xs text-gray-400 flex-shrink-0">эсвэл</span>
            <div className="flex-1 h-px bg-gray-200" />
          </div>

          {/* Toggle */}
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

          {/* Email or Phone input */}
          {method === "email" ? (
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1.5">И-мэйл</label>
              <div className="relative">
                <Mail size={16} className="absolute left-3 top-3 text-gray-400" />
                <input
                  type="email"
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
                  placeholder="8899 0010"
                  maxLength={8}
                  className="flex-1 px-3 py-2.5 border border-gray-200 rounded-r-xl text-sm focus:outline-none focus:border-orange-400 focus:ring-2 focus:ring-orange-100"
                />
              </div>
            </div>
          )}

          {/* Password */}
          <div>
            <div className="flex items-center justify-between mb-1.5">
              <label className="block text-sm font-medium text-gray-700">Нууц үг</label>
              <a href="#" className="text-xs text-orange-500 hover:text-orange-600">Нууц үг мартсан?</a>
            </div>
            <div className="relative">
              <Lock size={16} className="absolute left-3 top-3 text-gray-400" />
              <input
                type={show ? "text" : "password"}
                placeholder="••••••••"
                className="w-full pl-9 pr-10 py-2.5 border border-gray-200 rounded-xl text-sm focus:outline-none focus:border-orange-400 focus:ring-2 focus:ring-orange-100"
              />
              <button type="button" onClick={() => setShow(!show)}
                className="absolute right-3 top-3 text-gray-400 hover:text-gray-600">
                {show ? <EyeOff size={16} /> : <Eye size={16} />}
              </button>
            </div>
          </div>

          <button className="w-full py-3 bg-orange-500 hover:bg-orange-600 text-white font-semibold rounded-xl transition-colors text-sm">
            Нэвтрэх
          </button>

          <p className="text-center text-sm text-gray-500">
            Бүртгэл байхгүй юу?{" "}
            <Link href="/auth/register" className="text-orange-500 hover:text-orange-600 font-medium">
              Бүртгүүлэх
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
