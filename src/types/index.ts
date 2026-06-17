
export interface Address {
  street: string;
  city: string;
  state: string;
  zipCode: string;
  country: string;
}

export interface Product {
  id: string;
  name: string;
  description: string;
  price: number;
  originalPrice?: number;
  images: string[];
  category: string;
  brand: string;
  rating: number;
  reviewCount: number;
  stock: number;
  sellerId: string;
  createdAt: string;
}

// export interface CartItem {
//   product: Product;
//   quantity: number;
// }

// export interface WishlistItem {
//   product: Product;
//   addedAt: string;
// }

export interface Order {
  id: string;
  items: CartItem[];
  total: number;
  status: 'pending' | 'processing' | 'shipped' | 'delivered' | 'cancelled';
  shippingAddress: Address;
  paymentMethod: string;
  createdAt: string;
}

export interface Category {
  id: string;
  name: string;
  slug: string;
  image?: string;
}



export interface PaginatedResponse<T> {
  data: T[];
  total: number;
  page: number;
  limit: number;
}
