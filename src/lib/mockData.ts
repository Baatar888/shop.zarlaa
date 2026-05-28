import type { Product } from "@/lib/types";

export type MockProduct = Product;

export const MOCK_PRODUCTS: Product[] = [
  {
    id: "1", title: "Samsung Galaxy A55", slug: "samsung-galaxy-a55",
    originalPrice: 1200000, salePrice: 990000, stock: 15, brand: "Samsung", isFeatured: true, createdAt: "2024-01-01",
    images: [
      { url: "https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?w=600", isPrimary: true },
      { url: "https://images.unsplash.com/photo-1565849904461-04a58ad377e0?w=600", isPrimary: false },
      { url: "https://images.unsplash.com/photo-1598327106026-d9521da673d3?w=600", isPrimary: false },
    ],
    category: { name: "Цахилгаан бараа", slug: "electronics" }, vendor: { shopName: "TechMart" },
    colors: ["Хар", "Цагаан", "Цэнхэр"],
    description: "Samsung Galaxy A55 — дунд зэрэглэлийн шилдэг утас. 50MP камер, 5000mAh батарей, AMOLED дэлгэц.",
    deliveryDays: "2-3 өдөр",
  },
  {
    id: "2", title: "Nike Air Max 270", slug: "nike-air-max-270",
    originalPrice: 450000, salePrice: 320000, stock: 8, brand: "Nike", isFeatured: true, createdAt: "2024-01-02",
    images: [
      { url: "https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=600", isPrimary: true },
      { url: "https://images.unsplash.com/photo-1606107557195-0e29a4b5b4aa?w=600", isPrimary: false },
    ],
    category: { name: "Спорт", slug: "sport" }, vendor: { shopName: "SportWorld" },
    sizes: ["38", "39", "40", "41", "42", "43", "44"],
    colors: ["Цагаан/Улаан", "Хар", "Саарал"],
    description: "Nike Air Max 270 — тав тухтай агаарын зөөлөн дэр бүхий гутал.",
    deliveryDays: "1-2 өдөр",
  },
  {
    id: "3", title: "Apple AirPods Pro 2", slug: "apple-airpods-pro-2",
    originalPrice: 650000, salePrice: 580000, stock: 5, brand: "Apple", isFeatured: true, createdAt: "2024-01-03",
    images: [
      { url: "https://images.unsplash.com/photo-1600294037681-c80b4cb5b434?w=600", isPrimary: true },
    ],
    category: { name: "Цахилгаан бараа", slug: "electronics" }, vendor: { shopName: "AppleStore MN" },
    colors: ["Цагаан"],
    description: "Apple AirPods Pro 2 — идэвхтэй чимээ намсгах чихэвч. H2 chip, 30 цагийн батарей.",
    deliveryDays: "1-2 өдөр",
  },
  {
    id: "4", title: "Adidas Ultraboost 23", slug: "adidas-ultraboost-23",
    originalPrice: 380000, salePrice: 285000, stock: 12, brand: "Adidas", isFeatured: false, createdAt: "2024-01-04",
    images: [
      { url: "https://images.unsplash.com/photo-1608231387042-66d1773070a5?w=600", isPrimary: true },
    ],
    category: { name: "Спорт", slug: "sport" }, vendor: { shopName: "SportWorld" },
    sizes: ["39", "40", "41", "42", "43"],
    description: "Adidas Ultraboost 23 — гүйлтэд зориулсан өндөр гүйцэтгэлтэй гутал.",
    deliveryDays: "2-3 өдөр",
  },
  {
    id: "5", title: "Xiaomi Mi Band 8", slug: "xiaomi-mi-band-8",
    originalPrice: 120000, salePrice: 89000, stock: 20, brand: "Xiaomi", isFeatured: false, createdAt: "2024-01-05",
    images: [
      { url: "https://images.unsplash.com/photo-1575311373937-040b8e1fd5b6?w=600", isPrimary: true },
    ],
    category: { name: "Цахилгаан бараа", slug: "electronics" }, vendor: { shopName: "TechMart" },
    colors: ["Хар", "Цагаан", "Улаан"],
    description: "Xiaomi Mi Band 8 — ухаалаг бугуйвч. Зүрхний цохилт, унтлагын хяналт.",
    deliveryDays: "1-2 өдөр",
  },
  {
    id: "6", title: "Zara Casual Dress", slug: "zara-casual-dress",
    originalPrice: 189000, salePrice: 95000, stock: 7, brand: "Zara", isFeatured: true, createdAt: "2024-01-06",
    images: [
      { url: "https://images.unsplash.com/photo-1515372039744-b8f02a3ae446?w=600", isPrimary: true },
    ],
    category: { name: "Хувцас", slug: "clothing" }, vendor: { shopName: "FashionMN" },
    sizes: ["XS", "S", "M", "L", "XL"],
    colors: ["Цэнхэр", "Улаан", "Хар"],
    description: "Zara өдөр тутмын хувцас — тав тухтай, загварлаг.",
    deliveryDays: "2-3 өдөр",
  },
  {
    id: "7", title: "Sony WH-1000XM5", slug: "sony-wh-1000xm5",
    originalPrice: 750000, salePrice: 620000, stock: 4, brand: "Sony", isFeatured: true, createdAt: "2024-01-07",
    images: [
      { url: "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=600", isPrimary: true },
    ],
    category: { name: "Цахилгаан бараа", slug: "electronics" }, vendor: { shopName: "TechMart" },
    colors: ["Хар", "Цагаан"],
    description: "Sony WH-1000XM5 — дэлхийн шилдэг чимээ намсгах чихэвч.",
    deliveryDays: "2-3 өдөр",
  },
  {
    id: "8", title: "IKEA Poäng Armchair", slug: "ikea-poang-armchair",
    originalPrice: 450000, salePrice: 380000, stock: 3, brand: "IKEA", isFeatured: false, createdAt: "2024-01-08",
    images: [
      { url: "https://images.unsplash.com/photo-1555041469-a586c61ea9bc?w=600", isPrimary: true },
    ],
    category: { name: "Гэр ахуй", slug: "home" }, vendor: { shopName: "HomeStyle" },
    colors: ["Шар", "Саарал", "Цэнхэр"],
    description: "IKEA Poäng — тав тухтай хаалтны сандал. Унших, амрахад тохиромжтой.",
    deliveryDays: "3-5 өдөр",
  },
  {
    id: "9", title: "L'Oreal Revitalift Serum", slug: "loreal-revitalift-serum",
    originalPrice: 85000, salePrice: 62000, stock: 18, brand: "L'Oreal", isFeatured: false, createdAt: "2024-01-09",
    images: [
      { url: "https://images.unsplash.com/photo-1608248543803-ba4f8c70ae0b?w=600", isPrimary: true },
    ],
    category: { name: "Гоо сайхан", slug: "beauty" }, vendor: { shopName: "BeautyMN" },
    description: "L'Oreal Revitalift — арьсыг залуу байлгах серум.",
    deliveryDays: "1-2 өдөр",
  },
  {
    id: "10", title: "LEGO Technic Bugatti", slug: "lego-technic-bugatti",
    originalPrice: 280000, salePrice: 199000, stock: 6, brand: "LEGO", isFeatured: false, createdAt: "2024-01-10",
    images: [
      { url: "https://images.unsplash.com/photo-1587654780291-39c9404d746b?w=600", isPrimary: true },
    ],
    category: { name: "Хүүхдийн", slug: "kids" }, vendor: { shopName: "KidsToy" },
    description: "LEGO Technic Bugatti Chiron — 3599 хэсэгтэй дэлгэрэнгүй загвар.",
    deliveryDays: "2-3 өдөр",
  },
];

export function getFeaturedProducts(): Product[] {
  return MOCK_PRODUCTS.filter((p) => p.isFeatured);
}

export function getNewProducts(): Product[] {
  return [...MOCK_PRODUCTS].sort((a, b) =>
    (b.createdAt ?? "").localeCompare(a.createdAt ?? "")
  ).slice(0, 8);
}

export function getMostDiscountedProducts(): Product[] {
  return [...MOCK_PRODUCTS]
    .filter((p) => p.originalPrice > p.salePrice)
    .sort((a, b) => {
      const da = ((a.originalPrice - a.salePrice) / a.originalPrice) * 100;
      const db = ((b.originalPrice - b.salePrice) / b.originalPrice) * 100;
      return db - da;
    })
    .slice(0, 8);
}
