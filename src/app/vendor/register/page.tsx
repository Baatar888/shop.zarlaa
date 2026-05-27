"use client";
import { Store, Upload } from "lucide-react";
import Link from "next/link";

export default function VendorRegisterPage() {
  return (
    <div className="min-h-[80vh] flex items-center justify-center px-4 py-12">
      <div className="w-full max-w-lg">
        <div className="text-center mb-8">
          <div className="w-16 h-16 bg-orange-100 rounded-2xl flex items-center justify-center mx-auto mb-4">
            <Store size={32} className="text-orange-500" />
          </div>
          <h1 className="text-2xl font-black text-gray-950">Дэлгүүр нээх</h1>
          <p className="text-sm text-gray-500 mt-2">MMART дээр өөрийн дэлгүүрийг нээж, олон мянган худалдан авагчдад хүрнэ</p>
        </div>
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-8 space-y-5">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1.5">Дэлгүүрийн нэр</label>
            <input type="text" placeholder="Жишээ: MyShop MN"
              className="w-full px-4 py-2.5 border border-gray-200 rounded-xl text-sm
                focus:outline-none focus:border-orange-400 focus:ring-2 focus:ring-orange-100" />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1.5">Тайлбар</label>
            <textarea rows={3} placeholder="Дэлгүүрийнхээ тухай бичнэ үү..."
              className="w-full px-4 py-2.5 border border-gray-200 rounded-xl text-sm resize-none
                focus:outline-none focus:border-orange-400 focus:ring-2 focus:ring-orange-100" />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1.5">И-мэйл</label>
            <input type="email" placeholder="example@mail.com"
              className="w-full px-4 py-2.5 border border-gray-200 rounded-xl text-sm
                focus:outline-none focus:border-orange-400 focus:ring-2 focus:ring-orange-100" />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1.5">Лого (заавал биш)</label>
            <div className="border-2 border-dashed border-gray-200 rounded-xl p-6 text-center hover:border-orange-300 transition-colors cursor-pointer">
              <Upload size={24} className="text-gray-300 mx-auto mb-2" />
              <p className="text-xs text-gray-400">Зураг оруулах эсвэл чирэх</p>
            </div>
          </div>
          <button className="w-full py-3.5 bg-orange-500 hover:bg-orange-600 text-white font-bold
            rounded-xl transition-colors">
            Хүсэлт илгээх
          </button>
          <p className="text-center text-xs text-gray-400">
            Бүртгэлтэй юу?{" "}
            <Link href="/vendor" className="text-orange-500 hover:text-orange-600">Хяналтын самбар</Link>
          </p>
        </div>
      </div>
    </div>
  );
}
