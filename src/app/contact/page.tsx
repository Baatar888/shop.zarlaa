"use client";
import { Mail, Phone, MapPin } from "lucide-react";

export default function ContactPage() {
  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <h1 className="text-2xl font-black text-gray-950 mb-2">Холбоо барих</h1>
      <p className="text-gray-500 text-sm mb-8">Асуух зүйл байвал бидэнтэй холбогдоорой</p>
      <div className="grid sm:grid-cols-2 gap-8">
        <div className="space-y-5">
          {[
            { icon: Mail, label: "И-мэйл", value: "support@zarlaashop.mn" },
            { icon: Phone, label: "Утас", value: "+976 7700-0000" },
            { icon: MapPin, label: "Хаяг", value: "Улаанбаатар, Монгол" },
          ].map((item) => (
            <div key={item.label} className="flex items-center gap-4 bg-white rounded-2xl border border-gray-100 p-4">
              <div className="w-10 h-10 bg-orange-50 rounded-xl flex items-center justify-center">
                <item.icon size={18} className="text-orange-500" />
              </div>
              <div><p className="text-xs text-gray-400">{item.label}</p><p className="text-sm font-medium text-gray-800">{item.value}</p></div>
            </div>
          ))}
        </div>
        <div className="bg-white rounded-2xl border border-gray-100 p-6 space-y-4">
          <h2 className="font-bold text-gray-950">Мессеж илгээх</h2>
          <input placeholder="Нэр" className="w-full px-4 py-2.5 border border-gray-200 rounded-xl text-sm focus:outline-none focus:border-orange-400" />
          <input type="email" placeholder="И-мэйл" className="w-full px-4 py-2.5 border border-gray-200 rounded-xl text-sm focus:outline-none focus:border-orange-400" />
          <textarea rows={4} placeholder="Таны асуулт..." className="w-full px-4 py-2.5 border border-gray-200 rounded-xl text-sm resize-none focus:outline-none focus:border-orange-400" />
          <button className="w-full py-3 bg-orange-500 hover:bg-orange-600 text-white font-bold rounded-xl text-sm transition-colors">Илгээх</button>
        </div>
      </div>
    </div>
  );
}
