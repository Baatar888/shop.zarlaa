export type Product = {
  id: string;
  title: string;
  slug: string;
  originalPrice: number;
  salePrice: number;
  stock: number;
  brand?: string | null;
  isFeatured?: boolean;
  createdAt?: string;
  images: { url: string; isPrimary: boolean }[];
  category: { name: string; slug: string };
  vendor: { shopName: string };
  sizes?: string[];
  colors?: string[];
  description?: string;
  deliveryDays?: string;
};

export type MockProduct = Product;

export type Category = {
  id: string;
  name: string;
  slug: string;
  icon?: string;
  _count?: { products: number };
};

export type CartItem = {
  id: string;
  productId: string;
  quantity: number;
  product: Product;
};
