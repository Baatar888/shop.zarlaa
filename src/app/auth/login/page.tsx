"use client";
import { useState } from "react";
import Link from "next/link";
import { User, Lock, Eye, EyeOff } from "lucide-react";

export default function LoginPage() {
  const [show, setShow] = useState(false);
  return (
    <div className="min-h-[80vh] flex items-center justify-center px-4">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <Link href="/" className="text-3xl font-black tracking-tighter text-gray-950">
            MMART<span className="text-orange-500">.</span>
          </Link>
          <h1 className="text-xl font-bold text-gray-800 mt-4">Нэвтрэх</h1>
          <p className="text-sm text-gray-500 mt-1">Таны бүртгэлд нэвтрэх</p>
        </div>
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-8 space-y-5">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1.5">И-мэйл</label>
            <div className="relative">
              <User size={16} className="absolute left-3 top-3 text-gray-400" />
              <input type="email" placeholder="example@mail.com"
                className="w-full pl-9 pr-4 py-2.5 border border-gray-200 rounded-xl text-sm
                  focus:outline-none focus:border-orange-400 focus:ring-2 focus:ring-orange-100" />
            </div>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1.5">Нууц үг</label>
            <div className="relative">
              <Lock size={16} className="absolute left-3 top-3 text-gray-400" />
              <input type={show ? "text" : "password"} placeholder="••••••••"
                className="w-full pl-9 pr-10 py-2.5 border border-gray-200 rounded-xl text-sm
                  focus:outline-none focus:border-orange-400 focus:ring-2 focus:ring-orange-100" />
              <button type="button" onClick={() => setShow(!show)}
                className="absolute right-3 top-3 text-gray-400 hover:text-gray-600">
                {show ? <EyeOff size={16} /> : <Eye size={16} />}
              </button>
            </div>
          </div>
          <button className="w-full py-3 bg-orange-500 hover:bg-orange-600 text-white font-semibold
            rounded-xl transition-colors text-sm">
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
