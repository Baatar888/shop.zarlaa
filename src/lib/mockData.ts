export type MockProduct = {
  id: string;
  title: string;
  slug: string;
  originalPrice: number;
  salePrice: number;
  stock: number;
  brand: string | null;
  isFeatured: boolean;
  createdAt: string;
  images: { url: string; isPrimary: boolean }[];
  category: { name: string; slug: string };
  vendor: { shopName: string };
};

export const MOCK_PRODUCTS: MockProduct[] = [
  {
    id: "1", title: "Samsung Galaxy A55", slug: "samsung-galaxy-a55",
    originalPrice: 1200000, salePrice: 990000, stock: 15, brand: "Samsung", isFeatured: true, createdAt: "2024-01-01",
    images: [{ url: "https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?w=400", isPrimary: true }],
    category: { name: "Цахилгаан бараа", slug: "electronics" }, vendor: { shopName: "TechMart" },
  },
  {
    id: "2", title: "Nike Air Max 270", slug: "nike-air-max-270",
    originalPrice: 450000, salePrice: 320000, stock: 8, brand: "Nike", isFeatured: true, createdAt: "2024-01-02",
    images: [{ url: "https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=400", isPrimary: true }],
    category: { name: "Спорт", slug: "sport" }, vendor: { shopName: "SportWorld" },
  },
  {
    id: "3", title: "Дулаан куртка (Хүрэм)", slug: "warm-winter-jacket",
    originalPrice: 280000, salePrice: 199000, stock: 3, brand: null, isFeatured: true, createdAt: "2024-01-03",
    images: [{ url: "https://images.unsplash.com/photo-1547949003-9792a18a2601?w=400", isPrimary: true }],
    category: { name: "Хувцас", slug: "clothing" }, vendor: { shopName: "FashionMN" },
  },
  {
    id: "4", title: "Apple AirPods Pro 2", slug: "apple-airpods-pro-2",
    originalPrice: 750000, salePrice: 680000, stock: 20, brand: "Apple", isFeatured: true, createdAt: "2024-01-04",
    images: [{ url: "https://images.unsplash.com/photo-1600294037681-c80b4cb5b434?w=400", isPrimary: true }],
    category: { name: "Цахилгаан бараа", slug: "electronics" }, vendor: { shopName: "iStore MN" },
  },
  {
    id: "5", title: "Гоо сайхны иж бүрдэл", slug: "beauty-set-01",
    originalPrice: 120000, salePrice: 85000, stock: 50, brand: "L'Oreal", isFeatured: false, createdAt: "2024-01-05",
    images: [{ url: "https://images.unsplash.com/photo-1596462502278-27bfdc403348?w=400", isPrimary: true }],
    category: { name: "Гоо сайхан", slug: "beauty" }, vendor: { shopName: "BeautyShop" },
  },
  {
    id: "6", title: "Xiaomi Robot Vacuum", slug: "xiaomi-robot-vacuum",
    originalPrice: 980000, salePrice: 650000, stock: 7, brand: "Xiaomi", isFeatured: false, createdAt: "2024-01-06",
    images: [{ url: "https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=400", isPrimary: true }],
    category: { name: "Гэр ахуй", slug: "home" }, vendor: { shopName: "SmartHome MN" },
  },
  {
    id: "7", title: "Хүүхдийн тоглоомын иж бүрдэл", slug: "kids-toy-set",
    originalPrice: 95000, salePrice: 72000, stock: 30, brand: null, isFeatured: false, createdAt: "2024-01-07",
    images: [{ url: "https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=400", isPrimary: true }],
    category: { name: "Хүүхдийн", slug: "kids" }, vendor: { shopName: "KidZone" },
  },
  {
    id: "8", title: "Монгол ном: Нутгийн уламжлал", slug: "mongolian-book-tradition",
    originalPrice: 35000, salePrice: 29000, stock: 100, brand: null, isFeatured: false, createdAt: "2024-01-08",
    images: [{ url: "https://images.unsplash.com/photo-1544947950-fa07a98d237f?w=400", isPrimary: true }],
    category: { name: "Ном", slug: "books" }, vendor: { shopName: "BookMart" },
  },
  {
    id: "9", title: "Lenovo IdeaPad Laptop", slug: "lenovo-ideapad-laptop",
    originalPrice: 2500000, salePrice: 1990000, stock: 5, brand: "Lenovo", isFeatured: true, createdAt: "2024-01-09",
    images: [{ url: "https://images.unsplash.com/photo-1496181133206-80ce9b88a853?w=400", isPrimary: true }],
    category: { name: "Цахилгаан бараа", slug: "electronics" }, vendor: { shopName: "TechMart" },
  },
  {
    id: "10", title: "Адидас Гүйлтийн гутал", slug: "adidas-running-shoes",
    originalPrice: 380000, salePrice: 299000, stock: 12, brand: "Adidas", isFeatured: false, createdAt: "2024-01-10",
    images: [{ url: "https://images.unsplash.com/photo-1608231387042-66d1773070a5?w=400", isPrimary: true }],
    category: { name: "Спорт", slug: "sport" }, vendor: { shopName: "SportWorld" },
  },
];

export function getFeaturedProducts() {
  return MOCK_PRODUCTS.filter((p) => p.isFeatured);
}

export function getNewProducts() {
  return [...MOCK_PRODUCTS].sort((a, b) => b.createdAt.localeCompare(a.createdAt)).slice(0, 10);
}

export function getMostDiscountedProducts() {
  return [...MOCK_PRODUCTS]
    .sort((a, b) => {
      const da = ((a.originalPrice - a.salePrice) / a.originalPrice) * 100;
      const db = ((b.originalPrice - b.salePrice) / b.originalPrice) * 100;
      return db - da;
    })
    .slice(0, 10);
}
