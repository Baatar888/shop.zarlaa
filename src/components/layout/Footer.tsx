import Link from "next/link";
import Image from "next/image";

export default function Footer() {
  return (
    <footer className="bg-gray-950 text-gray-400 mt-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-8 mb-10">
          <div className="col-span-2 sm:col-span-1">
            <Link href="/">
              <Image src="/logo.png" alt="Shop Zarlaa" width={140} height={38} className="h-9 w-auto brightness-0 invert" />
            </Link>
            <p className="mt-3 text-sm leading-relaxed">
              Монголын хамгийн том онлайн захын платформ.
            </p>
          </div>

          {[
            {
              title: "Худалдан авагч",
              links: [
                { label: "Бүх бараа", href: "/products" },
                { label: "Захиалга хянах", href: "/dashboard/orders" },
                { label: "Буцаалт", href: "/returns" },
              ],
            },
            {
              title: "Худалдагч",
              links: [
                { label: "Дэлгүүр нээх", href: "/vendor/register" },
                { label: "Бараа нэмэх", href: "/vendor/products/new" },
                { label: "Борлуулалт", href: "/vendor" },
              ],
            },
            {
              title: "Тусламж",
              links: [
                { label: "Холбоо барих", href: "/contact" },
                { label: "Нууцлалын бодлого", href: "/privacy" },
                { label: "Үйлчилгээний нөхцөл", href: "/terms" },
              ],
            },
          ].map((col) => (
            <div key={col.title}>
              <h4 className="text-white text-sm font-semibold mb-3">{col.title}</h4>
              <ul className="space-y-2">
                {col.links.map((link) => (
                  <li key={link.href}>
                    <Link href={link.href} className="text-sm hover:text-white transition-colors">
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        <div className="border-t border-gray-800 pt-6 flex flex-col sm:flex-row
          items-center justify-between gap-4 text-xs text-gray-600">
          <p>© 2025 Shop Zarlaa. Бүх эрх хуулиар хамгаалагдсан.</p>
          <p>Улаанбаатар, Монгол 🇲🇳</p>
        </div>
      </div>
    </footer>
  );
}
