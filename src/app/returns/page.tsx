import Link from "next/link";
import { ArrowLeft } from "lucide-react";

export default function ReturnsPage() {
  return (
    <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <Link href="/" className="flex items-center gap-2 text-sm text-gray-500 hover:text-gray-700 mb-6"><ArrowLeft size={16}/> Нүүр</Link>
      <h1 className="text-2xl font-black text-gray-950 mb-6">Буцаалтын бодлого</h1>
      <div className="bg-white rounded-2xl border border-gray-100 p-8 space-y-5 text-sm text-gray-600 leading-relaxed">
        <div><h2 className="font-bold text-gray-900 mb-2">7 хоногийн баталгаа</h2><p>Худалдан авсан өдрөөс хойш 7 хоногийн дотор буцааж өгөх боломжтой.</p></div>
        <div><h2 className="font-bold text-gray-900 mb-2">Буцаалтын нөхцөл</h2><ul className="list-disc pl-4 space-y-1"><li>Бараа эвдрэлгүй, анхны байдлаараа байх</li><li>Савлагаа бүрэн байх</li><li>Чанарын доголдол байх тохиолдолд</li></ul></div>
        <div><h2 className="font-bold text-gray-900 mb-2">Холбоо барих</h2><p>Буцаалтын асуудлаар <Link href="/contact" className="text-orange-500 hover:underline">холбоо барина уу</Link>.</p></div>
      </div>
    </div>
  );
}
