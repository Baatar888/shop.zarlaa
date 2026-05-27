export type Product = {
  id: string;
  title: string;
  slug: string;
  originalPrice: number;
  salePrice: number;
  stock: number;
  brand?: string;
  isFeatured?: boolean;
  images: { url: string; isPrimary: boolean }[];
  category: { name: string; slug: string };
  vendor: { shopName: string };
};

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
