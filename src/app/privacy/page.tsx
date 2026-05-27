import Link from "next/link";
import { ArrowLeft } from "lucide-react";
export default function PrivacyPage() {
  return (
    <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <Link href="/" className="flex items-center gap-2 text-sm text-gray-500 hover:text-gray-700 mb-6"><ArrowLeft size={16}/> Нүүр</Link>
      <h1 className="text-2xl font-black text-gray-950 mb-6">Нууцлалын бодлого</h1>
      <div className="bg-white rounded-2xl border border-gray-100 p-8 space-y-5 text-sm text-gray-600 leading-relaxed">
        <div><h2 className="font-bold text-gray-900 mb-2">Мэдээлэл цуглуулах</h2><p>Бид таны нэр, и-мэйл, хаяг болон захиалгын мэдээллийг цуглуулна. Энэ мэдээллийг зөвхөн үйлчилгээ үзүүлэхэд ашиглана.</p></div>
        <div><h2 className="font-bold text-gray-900 mb-2">Мэдээлэл хамгаалалт</h2><p>Таны хувийн мэдээллийг гуравдагч талд зарахгүй, дамжуулахгүй.</p></div>
        <div><h2 className="font-bold text-gray-900 mb-2">Холбоо барих</h2><p>Нууцлалын талаар асуулт байвал <Link href="/contact" className="text-orange-500 hover:underline">холбогдоно уу</Link>.</p></div>
      </div>
    </div>
  );
}
