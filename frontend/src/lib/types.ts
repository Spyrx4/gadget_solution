// ============================================
// Core TypeScript interfaces for GadgetSol
// ============================================

export interface Product {
  id: string;
  name: string;
  description: string;
  price: number;
  stock: number;
  category: string;
  techSpecs: Record<string, string>;
  images: string[];
  createdAt: string;
  updatedAt: string;
}

export interface CartItem {
  product: Product;
  quantity: number;
}

export interface User {
  id: string;
  email: string;
  firstName: string | null;
  lastName: string | null;
  role: 'ADMIN' | 'CUSTOMER';
}

export interface AuthResponse {
  token: string;
  user: User;
}

export interface Order {
  id: string;
  userId: string;
  totalPrice: number;
  status: 'PENDING' | 'CONFIRMED' | 'SHIPPED' | 'DELIVERED' | 'CANCELLED';
  items: OrderItem[];
  createdAt: string;
}

export interface OrderItem {
  id: string;
  productId: string;
  product?: Product;
  quantity: number;
  priceAtTime: number;
}

export interface ChatMessage {
  role: 'user' | 'assistant';
  content: string;
  sources?: ChatSource[];
  timestamp?: string;
}

export interface ChatSource {
  product_id: string;
  name: string;
}

export interface ChatResponse {
  message: string;
  sources: ChatSource[];
  timestamp: string;
}

export interface ProductsResponse {
  data: Product[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

export interface ProductFilters {
  category?: string;
  search?: string;
  priceMin?: number;
  priceMax?: number;
  page?: number;
  limit?: number;
}
