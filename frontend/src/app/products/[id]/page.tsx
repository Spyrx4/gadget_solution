'use client';

import { use } from 'react';
import { ShoppingCart, Shield, Truck, ArrowLeft, Sparkles, Package } from 'lucide-react';
import Link from 'next/link';
import { useProduct } from '@/hooks/useProducts';
import { useCartStore } from '@/lib/store';
import { getProductImage } from '@/lib/mock-data';

export default function ProductDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);
  const { product, loading, error } = useProduct(id);
  const addItem = useCartStore((s) => s.addItem);

  const formatPrice = (price: number) =>
    new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', minimumFractionDigits: 0 }).format(price);

  if (loading) {
    return (
      <div className="max-w-[1200px] mx-auto px-4" style={{ padding: 'var(--spacing-section) 0' }}>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
          <div className="aspect-square bg-[var(--color-surface-card)] rounded-[var(--radius-lg)] animate-pulse" />
          <div className="space-y-4">
            <div className="h-8 bg-[var(--color-surface-card)] rounded-[var(--radius-md)] w-3/4 animate-pulse" />
            <div className="h-6 bg-[var(--color-surface-card)] rounded-[var(--radius-md)] w-1/2 animate-pulse" />
            <div className="h-32 bg-[var(--color-surface-card)] rounded-[var(--radius-md)] animate-pulse" />
          </div>
        </div>
      </div>
    );
  }

  if (error || !product) {
    return (
      <div className="max-w-[1200px] mx-auto px-4 text-center" style={{ padding: 'var(--spacing-section) 0' }}>
        <p className="text-display-sm mb-4">Produk tidak ditemukan</p>
        <Link href="/products" className="text-[var(--color-primary)] hover:underline">
          ← Kembali ke katalog
        </Link>
      </div>
    );
  }

  const imageUrl = getProductImage(product);
  const installment = Math.ceil(product.price / 6);

  return (
    <div style={{ padding: 'var(--spacing-section) 0' }}>
      <div className="max-w-[1200px] mx-auto px-4">
        {/* Breadcrumb */}
        <Link
          href="/products"
          className="inline-flex items-center gap-1.5 text-sm text-[var(--color-muted)] hover:text-[var(--color-primary)] transition-colors mb-8"
        >
          <ArrowLeft className="w-4 h-4" />
          Kembali ke Katalog
        </Link>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
          {/* Left — Product Image */}
          <div>
            <div className="bg-[var(--color-surface-card)] rounded-[var(--radius-xl)] border border-[var(--color-hairline)] p-8 aspect-square flex items-center justify-center">
              <img
                src={imageUrl}
                alt={product.name}
                className="max-h-full max-w-full object-contain"
              />
            </div>

            {/* Trust badges below image */}
            <div className="grid grid-cols-3 gap-3 mt-4">
              {[
                { icon: Shield, label: '100% Original', sub: 'Produk Asli' },
                { icon: Truck, label: 'Free Ongkir', sub: 'Se-Indonesia' },
                { icon: Package, label: 'Garansi Resmi', sub: 'Distributor' },
              ].map((item) => (
                <div
                  key={item.label}
                  className="flex flex-col items-center gap-1.5 p-3 bg-[var(--color-surface-card)] rounded-[var(--radius-lg)] border border-[var(--color-hairline)]"
                >
                  <item.icon className="w-5 h-5 text-[var(--color-semantic-success)]" />
                  <span className="text-xs font-semibold text-[var(--color-ink)] text-center">{item.label}</span>
                  <span className="text-[10px] text-[var(--color-muted)]">{item.sub}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Right — Product Info */}
          <div>
            {/* Category badge */}
            <span
              className="inline-block px-3 py-1 bg-[var(--color-surface-strong)] text-[var(--color-muted)] rounded-[var(--radius-pill)] mb-4"
              style={{ fontSize: '11px', fontWeight: 600, letterSpacing: '0.88px', textTransform: 'uppercase' }}
            >
              {product.category}
            </span>

            <h1 className="text-display-md mb-2">{product.name}</h1>
            <p className="text-body-md mb-6">{product.description}</p>

            {/* Price */}
            <div className="bg-[var(--color-canvas-soft)] rounded-[var(--radius-lg)] p-5 mb-6 border border-[var(--color-hairline-soft)]">
              <p className="text-xs text-[var(--color-muted)] mb-1">Harga:</p>
              <p className="text-3xl font-bold text-[var(--color-primary)]">
                {formatPrice(product.price)}
              </p>
              <p className="text-sm text-[var(--color-muted)] mt-2">
                Atau cicilan 6x <span className="font-semibold text-[var(--color-ink)]">{formatPrice(installment)}</span>/bulan
              </p>
            </div>

            {/* Stock */}
            <div className="flex items-center gap-2 mb-6">
              <div className={`w-2 h-2 rounded-full ${product.stock > 0 ? 'bg-[var(--color-semantic-success)]' : 'bg-[var(--color-semantic-error)]'}`} />
              <span className="text-sm text-[var(--color-body)]">
                {product.stock > 0 ? `Stok tersedia (${product.stock} unit)` : 'Stok habis'}
              </span>
            </div>

            {/* Action buttons */}
            <div className="flex flex-col sm:flex-row gap-3 mb-8">
              <button
                onClick={() => addItem(product)}
                disabled={product.stock === 0}
                className="flex-1 flex items-center justify-center gap-2 px-6 py-3.5 bg-[var(--color-primary)] text-white font-medium rounded-[var(--radius-md)] hover:bg-[var(--color-primary-active)] disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              >
                <ShoppingCart className="w-5 h-5" />
                Tambah ke Keranjang
              </button>
              <button
                onClick={() => {
                  const event = new CustomEvent('open-chat');
                  window.dispatchEvent(event);
                }}
                className="flex items-center justify-center gap-2 px-6 py-3.5 bg-[var(--color-surface-card)] text-[var(--color-ink)] font-medium rounded-[var(--radius-md)] border border-[var(--color-hairline-strong)] hover:bg-[var(--color-surface-strong)] transition-colors"
              >
                <Sparkles className="w-4 h-4 text-[var(--color-primary)]" />
                Tanya AI
              </button>
            </div>

            {/* Tech Specs */}
            {product.techSpecs && Object.keys(product.techSpecs).length > 0 && (
              <div>
                <h3 className="text-title-md mb-4">Spesifikasi Teknis</h3>
                <div className="bg-[var(--color-surface-card)] rounded-[var(--radius-lg)] border border-[var(--color-hairline)] overflow-hidden">
                  {Object.entries(product.techSpecs).map(([key, value], i) => (
                    <div
                      key={key}
                      className={`flex items-center px-4 py-3 ${
                        i % 2 === 0 ? 'bg-[var(--color-canvas-soft)]' : ''
                      }`}
                    >
                      <span className="w-1/3 text-sm font-medium text-[var(--color-muted)] capitalize">
                        {key.replace(/([A-Z])/g, ' $1').trim()}
                      </span>
                      <span className="flex-1 text-sm text-[var(--color-ink)]">
                        {typeof value === 'string' ? value : JSON.stringify(value)}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
