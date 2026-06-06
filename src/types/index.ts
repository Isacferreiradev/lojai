import {
  User,
  Address,
  Category,
  Product,
  ProductImage,
  Order,
  OrderItem,
  Payment,
  Review,
  Coupon,
} from "@prisma/client";

// Product compositions
export type ProductWithImages = Product & {
  images: ProductImage[];
};

export type ProductWithAll = Product & {
  images: ProductImage[];
  category: Category;
  reviews: Review[];
};

// Order compositions
export type OrderItemWithProduct = OrderItem & {
  product: Product;
};

export type OrderWithAll = Order & {
  items: OrderItem[];
  payment: Payment | null;
  coupon: Coupon | null;
  address: Address | null;
};

// Cart structures
export interface CartItem {
  id: string; // Unique combination of productId + color + size
  productId: string;
  name: string;
  sku: string;
  price: number;
  promoPrice: number | null;
  quantity: number;
  color?: string;
  size?: string;
  imageUrl?: string;
  stock: number;
}

// Filter definitions
export interface ProductFilters {
  category?: string;
  minPrice?: number;
  maxPrice?: number;
  colors?: string[];
  sizes?: string[];
  materials?: string[];
  washable?: boolean;
  sort?: "best_selling" | "price_asc" | "price_desc" | "newest";
  search?: string;
  page?: number;
  limit?: number;
}
