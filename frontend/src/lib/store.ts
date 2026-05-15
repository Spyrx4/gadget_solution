import { create } from 'zustand';
import { CartItem, Product, User } from './types';

// ============================================
// CART STORE
// ============================================
interface CartState {
  items: CartItem[];
  addItem: (product: Product, quantity?: number) => void;
  removeItem: (productId: string) => void;
  updateQuantity: (productId: string, quantity: number) => void;
  clearCart: () => void;
  getTotalItems: () => number;
  getTotalPrice: () => number;
}

export const useCartStore = create<CartState>((set, get) => ({
  items: typeof window !== 'undefined'
    ? JSON.parse(localStorage.getItem('gadgetsol-cart') || '[]')
    : [],

  addItem: (product, quantity = 1) => {
    set((state) => {
      const existingItem = state.items.find((item) => item.product.id === product.id);
      let newItems: CartItem[];

      if (existingItem) {
        newItems = state.items.map((item) =>
          item.product.id === product.id
            ? { ...item, quantity: item.quantity + quantity }
            : item
        );
      } else {
        newItems = [...state.items, { product, quantity }];
      }

      if (typeof window !== 'undefined') {
        localStorage.setItem('gadgetsol-cart', JSON.stringify(newItems));
      }
      return { items: newItems };
    });
  },

  removeItem: (productId) => {
    set((state) => {
      const newItems = state.items.filter((item) => item.product.id !== productId);
      if (typeof window !== 'undefined') {
        localStorage.setItem('gadgetsol-cart', JSON.stringify(newItems));
      }
      return { items: newItems };
    });
  },

  updateQuantity: (productId, quantity) => {
    set((state) => {
      const newItems = quantity <= 0
        ? state.items.filter((item) => item.product.id !== productId)
        : state.items.map((item) =>
            item.product.id === productId ? { ...item, quantity } : item
          );
      if (typeof window !== 'undefined') {
        localStorage.setItem('gadgetsol-cart', JSON.stringify(newItems));
      }
      return { items: newItems };
    });
  },

  clearCart: () => {
    if (typeof window !== 'undefined') {
      localStorage.removeItem('gadgetsol-cart');
    }
    set({ items: [] });
  },

  getTotalItems: () => get().items.reduce((sum, item) => sum + item.quantity, 0),
  getTotalPrice: () =>
    get().items.reduce((sum, item) => sum + item.product.price * item.quantity, 0),
}));

// ============================================
// AUTH STORE
// ============================================
interface AuthState {
  user: User | null;
  token: string | null;
  isAuthenticated: boolean;
  setAuth: (user: User, token: string) => void;
  logout: () => void;
  loadFromStorage: () => void;
}

export const useAuthStore = create<AuthState>((set) => ({
  user: null,
  token: null,
  isAuthenticated: false,

  setAuth: (user, token) => {
    if (typeof window !== 'undefined') {
      localStorage.setItem('gadgetsol-token', token);
      localStorage.setItem('gadgetsol-user', JSON.stringify(user));
    }
    set({ user, token, isAuthenticated: true });
  },

  logout: () => {
    if (typeof window !== 'undefined') {
      localStorage.removeItem('gadgetsol-token');
      localStorage.removeItem('gadgetsol-user');
    }
    set({ user: null, token: null, isAuthenticated: false });
  },

  loadFromStorage: () => {
    if (typeof window !== 'undefined') {
      const token = localStorage.getItem('gadgetsol-token');
      const userStr = localStorage.getItem('gadgetsol-user');
      if (token && userStr) {
        try {
          const user = JSON.parse(userStr);
          set({ user, token, isAuthenticated: true });
        } catch {
          set({ user: null, token: null, isAuthenticated: false });
        }
      }
    }
  },
}));
