"use client";
import { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { signIn } from "next-auth/react";
import { Lock, Eye, EyeOff, Mail } from "lucide-react";

export default function LoginPage() {
  const [show, setShow] = useState(false);

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
          {/* Facebook Login */}
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
            <span className="text-xs text-gray-400 flex-shrink-0">эсвэл и-мэйлээр</span>
            <div className="flex-1 h-px bg-gray-200" />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1.5">И-мэйл</label>
            <div className="relative">
              <Mail size={16} className="absolute left-3 top-3 text-gray-400" />
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
