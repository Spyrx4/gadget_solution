'use client';

import { useState } from 'react';
import Link from 'next/link';
import { Trash2, ArrowLeft, ShoppingBag, CheckCircle } from 'lucide-react';
import { useCartStore, useAuthStore } from '@/lib/store';
import { getProductImage } from '@/lib/mock-data';
import { api } from '@/lib/api';

export default function CheckoutPage() {
  const { items, removeItem, updateQuantity, clearCart } = useCartStore();
  const { isAuthenticated, user } = useAuthStore();
  const [orderPlaced, setOrderPlaced] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const formatPrice = (price: number) =>
    new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', minimumFractionDigits: 0 }).format(price);

  const totalPrice = items.reduce((sum, item) => sum + item.product.price * item.quantity, 0);

  const handlePlaceOrder = async () => {
    if (!isAuthenticated) {
      window.location.href = '/auth/login';
      return;
    }

    setLoading(true);
    setError(null);
    try {
      await api.post('/api/orders', {
        items: items.map((item) => ({
          productId: item.product.id,
          quantity: item.quantity,
        })),
      });
      clearCart();
      setOrderPlaced(true);
    } catch (err: unknown) {
      const message = (err as { response?: { data?: { message?: string } } })?.response?.data?.message || 'Gagal membuat pesanan. Coba lagi.';
      setError(message);
    } finally {
      setLoading(false);
    }
  };

  // Success state
  if (orderPlaced) {
    return (
      <div className="min-h-[60vh] flex items-center justify-center px-4">
        <div className="text-center max-w-md">
          <div className="w-16 h-16 bg-green-50 rounded-full flex items-center justify-center mx-auto mb-6">
            <CheckCircle className="w-8 h-8 text-[var(--color-semantic-success)]" />
          </div>
          <h1 className="text-display-md mb-3">Pesanan Berhasil! 🎉</h1>
          <p className="text-body-md text-[var(--color-body)] mb-8">
            Terima kasih telah berbelanja di GadgetSol. Pesanan Anda sedang diproses dan akan segera dikirim.
          </p>
          <Link
            href="/products"
            className="inline-flex items-center gap-2 px-6 py-3 bg-[var(--color-primary)] text-white font-medium rounded-[var(--radius-md)] hover:bg-[var(--color-primary-active)] transition-colors"
          >
            Lanjut Belanja
          </Link>
        </div>
      </div>
    );
  }

  // Empty cart
  if (items.length === 0) {
    return (
      <div className="min-h-[60vh] flex items-center justify-center px-4">
        <div className="text-center">
          <ShoppingBag className="w-16 h-16 text-[var(--color-hairline-strong)] mx-auto mb-4" />
          <h1 className="text-display-md mb-3">Keranjang Kosong</h1>
          <p className="text-body-md text-[var(--color-muted)] mb-8">
            Yuk, mulai belanja gadget impianmu!
          </p>
          <Link
            href="/products"
            className="inline-flex items-center gap-2 px-6 py-3 bg-[var(--color-primary)] text-white font-medium rounded-[var(--radius-md)] hover:bg-[var(--color-primary-active)] transition-colors"
          >
            Jelajahi Produk
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div style={{ padding: 'var(--spacing-section) 0' }}>
      <div className="max-w-[1200px] mx-auto px-4">
        {/* Back */}
        <Link
          href="/products"
          className="inline-flex items-center gap-1.5 text-sm text-[var(--color-muted)] hover:text-[var(--color-primary)] transition-colors mb-8"
        >
          <ArrowLeft className="w-4 h-4" />
          Lanjut Belanja
        </Link>

        <h1 className="text-display-lg mb-8">Checkout</h1>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left — Cart Items */}
          <div className="lg:col-span-2 space-y-4">
            {items.map((item) => (
              <div
                key={item.product.id}
                className="flex gap-4 p-4 bg-[var(--color-surface-card)] rounded-[var(--radius-lg)] border border-[var(--color-hairline)]"
              >
                <img
                  src={getProductImage(item.product)}
                  alt={item.product.name}
                  className="w-20 h-20 object-contain rounded-[var(--radius-md)] bg-[var(--color-canvas-soft)]"
                />
                <div className="flex-1 min-w-0">
                  <h3 className="text-sm font-semibold text-[var(--color-ink)] truncate">
                    {item.product.name}
                  </h3>
                  <p className="text-xs text-[var(--color-muted)] mt-0.5">{item.product.category}</p>
                  <p className="text-[var(--color-primary)] font-bold mt-1">
                    {formatPrice(item.product.price)}
                  </p>
                </div>

                {/* Quantity */}
                <div className="flex flex-col items-end justify-between">
                  <button
                    onClick={() => removeItem(item.product.id)}
                    className="p-1 text-[var(--color-muted)] hover:text-[var(--color-semantic-error)] transition-colors"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => updateQuantity(item.product.id, item.quantity - 1)}
                      className="w-7 h-7 flex items-center justify-center bg-[var(--color-canvas)] border border-[var(--color-hairline)] rounded-[var(--radius-sm)] text-sm hover:bg-[var(--color-surface-strong)] transition-colors"
                    >
                      −
                    </button>
                    <span className="text-sm font-medium text-[var(--color-ink)] w-5 text-center">
                      {item.quantity}
                    </span>
                    <button
                      onClick={() => updateQuantity(item.product.id, item.quantity + 1)}
                      className="w-7 h-7 flex items-center justify-center bg-[var(--color-canvas)] border border-[var(--color-hairline)] rounded-[var(--radius-sm)] text-sm hover:bg-[var(--color-surface-strong)] transition-colors"
                    >
                      +
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Right — Order Summary */}
          <div className="lg:col-span-1">
            <div className="sticky top-24 bg-[var(--color-surface-card)] rounded-[var(--radius-lg)] border border-[var(--color-hairline)] p-6">
              <h3 className="text-title-md mb-4">Ringkasan Pesanan</h3>

              <div className="space-y-3 mb-4">
                <div className="flex justify-between text-sm">
                  <span className="text-[var(--color-body)]">Subtotal ({items.length} item)</span>
                  <span className="text-[var(--color-ink)] font-medium">{formatPrice(totalPrice)}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-[var(--color-body)]">Ongkos Kirim</span>
                  <span className="text-[var(--color-semantic-success)] font-medium">GRATIS</span>
                </div>
              </div>

              <div className="border-t border-[var(--color-hairline)] pt-4 mb-6">
                <div className="flex justify-between">
                  <span className="text-[var(--color-ink)] font-semibold">Total</span>
                  <span className="text-xl font-bold text-[var(--color-primary)]">
                    {formatPrice(totalPrice)}
                  </span>
                </div>
              </div>

              {/* Auth check */}
              {!isAuthenticated && (
                <div className="px-4 py-3 bg-yellow-50 border border-yellow-100 rounded-[var(--radius-md)] text-sm text-yellow-700 mb-4">
                  Silakan <Link href="/auth/login" className="font-semibold underline">masuk</Link> terlebih dahulu untuk melanjutkan checkout.
                </div>
              )}

              {error && (
                <div className="px-4 py-3 bg-red-50 border border-red-100 rounded-[var(--radius-md)] text-sm text-[var(--color-semantic-error)] mb-4">
                  {error}
                </div>
              )}

              {isAuthenticated && (
                <div className="px-3 py-2 bg-[var(--color-canvas-soft)] rounded-[var(--radius-md)] text-xs text-[var(--color-muted)] mb-4">
                  Dipesan oleh: <strong className="text-[var(--color-ink)]">{user?.firstName} {user?.lastName}</strong>
                </div>
              )}

              <button
                onClick={handlePlaceOrder}
                disabled={loading || !isAuthenticated}
                className="w-full py-3.5 bg-[var(--color-primary)] text-white font-medium rounded-[var(--radius-md)] hover:bg-[var(--color-primary-active)] disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              >
                {loading ? 'Memproses...' : 'Buat Pesanan'}
              </button>

              {/* Trust */}
              <div className="flex items-center justify-center gap-4 mt-4">
                {['🔒 Aman', '🚚 Free Ongkir', '✅ Garansi'].map((item) => (
                  <span key={item} className="text-[10px] text-[var(--color-muted)]">{item}</span>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
