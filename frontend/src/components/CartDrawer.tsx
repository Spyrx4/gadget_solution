'use client';

import { X, Minus, Plus, ShoppingBag } from 'lucide-react';
import Link from 'next/link';
import { useCartStore } from '@/lib/store';
import { getProductImage } from '@/lib/mock-data';

interface CartDrawerProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function CartDrawer({ isOpen, onClose }: CartDrawerProps) {
  const { items, removeItem, updateQuantity } = useCartStore();

  const formatPrice = (price: number) =>
    new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', minimumFractionDigits: 0 }).format(price);

  const totalPrice = items.reduce((sum, item) => sum + item.product.price * item.quantity, 0);

  if (!isOpen) return null;

  return (
    <>
      {/* Overlay */}
      <div className="fixed inset-0 bg-black/30 z-50 backdrop-blur-sm" onClick={onClose} />

      {/* Drawer */}
      <div className="fixed right-0 top-0 h-full w-full max-w-md bg-[var(--color-surface-card)] z-50 flex flex-col shadow-xl">
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b border-[var(--color-hairline)]">
          <div className="flex items-center gap-2">
            <ShoppingBag className="w-5 h-5 text-[var(--color-ink)]" />
            <h2 className="text-[var(--color-ink)] font-semibold text-lg">
              Keranjang ({items.length})
            </h2>
          </div>
          <button
            onClick={onClose}
            className="p-2 hover:bg-[var(--color-canvas)] rounded-[var(--radius-md)] transition-colors"
          >
            <X className="w-5 h-5 text-[var(--color-muted)]" />
          </button>
        </div>

        {/* Items */}
        <div className="flex-1 overflow-y-auto p-4 space-y-4">
          {items.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-full text-center">
              <ShoppingBag className="w-12 h-12 text-[var(--color-hairline-strong)] mb-4" />
              <p className="text-[var(--color-muted)] font-medium">Keranjang kosong</p>
              <p className="text-sm text-[var(--color-muted-soft)] mt-1">
                Yuk, mulai belanja gadget impianmu!
              </p>
            </div>
          ) : (
            items.map((item) => (
              <div
                key={item.product.id}
                className="flex gap-3 p-3 bg-[var(--color-canvas-soft)] rounded-[var(--radius-lg)]"
              >
                <img
                  src={getProductImage(item.product)}
                  alt={item.product.name}
                  className="w-16 h-16 object-contain rounded-[var(--radius-md)] bg-white"
                />
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-semibold text-[var(--color-ink)] truncate">
                    {item.product.name}
                  </p>
                  <p className="text-sm font-bold text-[var(--color-primary)] mt-1">
                    {formatPrice(item.product.price)}
                  </p>
                  <div className="flex items-center gap-2 mt-2">
                    <button
                      onClick={() => updateQuantity(item.product.id, item.quantity - 1)}
                      className="w-6 h-6 flex items-center justify-center bg-[var(--color-surface-card)] border border-[var(--color-hairline)] rounded-[var(--radius-sm)] hover:bg-[var(--color-surface-strong)] transition-colors"
                    >
                      <Minus className="w-3 h-3" />
                    </button>
                    <span className="text-sm font-medium text-[var(--color-ink)] w-6 text-center">
                      {item.quantity}
                    </span>
                    <button
                      onClick={() => updateQuantity(item.product.id, item.quantity + 1)}
                      className="w-6 h-6 flex items-center justify-center bg-[var(--color-surface-card)] border border-[var(--color-hairline)] rounded-[var(--radius-sm)] hover:bg-[var(--color-surface-strong)] transition-colors"
                    >
                      <Plus className="w-3 h-3" />
                    </button>
                  </div>
                </div>
                <button
                  onClick={() => removeItem(item.product.id)}
                  className="self-start p-1 hover:bg-[var(--color-surface-card)] rounded transition-colors"
                >
                  <X className="w-4 h-4 text-[var(--color-muted)]" />
                </button>
              </div>
            ))
          )}
        </div>

        {/* Footer */}
        {items.length > 0 && (
          <div className="p-4 border-t border-[var(--color-hairline)] space-y-3">
            <div className="flex justify-between items-center">
              <span className="text-[var(--color-body)] font-medium">Total</span>
              <span className="text-xl font-bold text-[var(--color-ink)]">
                {formatPrice(totalPrice)}
              </span>
            </div>
            <Link
              href="/checkout"
              onClick={onClose}
              className="block w-full text-center py-3 bg-[var(--color-primary)] text-white font-medium rounded-[var(--radius-md)] hover:bg-[var(--color-primary-active)] transition-colors"
            >
              Checkout
            </Link>
          </div>
        )}
      </div>
    </>
  );
}
