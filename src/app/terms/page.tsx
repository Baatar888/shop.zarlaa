import Link from "next/link";
import { ArrowLeft } from "lucide-react";
export default function TermsPage() {
  return (
    <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <Link href="/" className="flex items-center gap-2 text-sm text-gray-500 hover:text-gray-700 mb-6"><ArrowLeft size={16}/> Нүүр</Link>
      <h1 className="text-2xl font-black text-gray-950 mb-6">Үйлчилгээний нөхцөл</h1>
      <div className="bg-white rounded-2xl border border-gray-100 p-8 space-y-5 text-sm text-gray-600 leading-relaxed">
        <div><h2 className="font-bold text-gray-900 mb-2">Ерөнхий нөхцөл</h2><p>Shop Zarlaa платформыг ашигласнаар та эдгээр нөхцөлийг хүлээн зөвшөөрч байна.</p></div>
        <div><h2 className="font-bold text-gray-900 mb-2">Худалдагчийн үүрэг</h2><ul className="list-disc pl-4 space-y-1"><li>Зөвхөн чанартай, бодит бараа байршуулна</li><li>Захиалгыг цаг тухайд нь биелүүлнэ</li><li>Буцаалтыг бодлогын дагуу хүлээн авна</li></ul></div>
        <div><h2 className="font-bold text-gray-900 mb-2">Худалдан авагчийн үүрэг</h2><ul className="list-disc pl-4 space-y-1"><li>Зөв мэдээлэл оруулах</li><li>Захиалгын төлбөрийг цаг тухайд нь хийх</li></ul></div>
      </div>
    </div>
  );
}
