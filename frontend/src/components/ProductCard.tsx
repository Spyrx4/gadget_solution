'use client';

import Link from 'next/link';
import { ShoppingCart, Shield } from 'lucide-react';
import { Product } from '@/lib/types';
import { getProductImage } from '@/lib/mock-data';
import { useCartStore } from '@/lib/store';

interface ProductCardProps {
  product: Product;
}

export default function ProductCard({ product }: ProductCardProps) {
  const addItem = useCartStore((s) => s.addItem);
  const imageUrl = getProductImage(product);

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', minimumFractionDigits: 0 }).format(price);
  };

  const installment = Math.ceil(product.price / 6);

  return (
    <div className="group bg-[var(--color-surface-card)] rounded-[var(--radius-lg)] border border-[var(--color-hairline)] overflow-hidden hover:border-[var(--color-hairline-strong)] transition-all duration-300">
      {/* Card Header — Brand identity like Syihab Store */}
      <div className="flex items-center justify-between px-4 pt-3 pb-1">
        <span
          className="text-[var(--color-muted)] tracking-widest"
          style={{ fontSize: '10px', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '1.5px' }}
        >
          GADGETSOL
        </span>
        <div className="flex items-center gap-1 text-[var(--color-semantic-success)]">
          <Shield className="w-3 h-3" />
          <span style={{ fontSize: '9px', fontWeight: 600, letterSpacing: '0.5px' }}>Garansi Resmi</span>
        </div>
      </div>

      {/* Product Name — inside card like Syihab Store */}
      <p
        className="px-4 text-center text-[var(--color-ink)] tracking-tight"
        style={{ fontSize: '13px', fontWeight: 600, textTransform: 'uppercase' }}
      >
        {product.name}
      </p>

      {/* Product Image */}
      <Link href={`/products/${product.id}`} className="block px-4 py-4">
        <div className="relative aspect-square flex items-center justify-center overflow-hidden">
          <img
            src={imageUrl}
            alt={product.name}
            className="max-h-full max-w-full object-contain group-hover:scale-105 transition-transform duration-500"
            loading="lazy"
          />
        </div>
      </Link>

      {/* Trust Badge Bar — inspired by Syihab Store */}
      <div
        className="mx-3 mb-3 py-1.5 px-2 bg-[var(--color-ink)] rounded-[var(--radius-sm)] flex items-center justify-around"
      >
        {['100% ORIGINAL', 'FREE ONGKIR', 'GARANSI RESMI'].map((badge) => (
          <span
            key={badge}
            className="text-white"
            style={{ fontSize: '8px', fontWeight: 600, letterSpacing: '0.5px' }}
          >
            {badge}
          </span>
        ))}
      </div>

      {/* Product Info */}
      <div className="px-4 pb-4">
        <Link href={`/products/${product.id}`}>
          <h3 className="text-[var(--color-ink)] font-bold text-base uppercase tracking-tight hover:text-[var(--color-primary)] transition-colors">
            {product.name}
          </h3>
        </Link>

        <p className="text-[var(--color-muted)] mt-0.5" style={{ fontSize: '12px' }}>
          Mulai dari:
        </p>
        <p className="text-[var(--color-primary)] font-extrabold text-xl mt-0.5">
          {formatPrice(product.price)}
        </p>

        <p className="text-[var(--color-muted-soft)] mt-1" style={{ fontSize: '12px' }}>
          Atau cicilan: 6x <span className="text-[var(--color-ink)] font-semibold">{formatPrice(installment)}</span>/bln
        </p>

        {/* Add to Cart */}
        <button
          onClick={() => addItem(product)}
          className="mt-3 w-full flex items-center justify-center gap-2 px-4 py-2.5 bg-[var(--color-primary)] text-white text-sm font-medium rounded-[var(--radius-md)] hover:bg-[var(--color-primary-active)] active:scale-[0.98] transition-all duration-200"
        >
          <ShoppingCart className="w-4 h-4" />
          Tambah ke Keranjang
        </button>
      </div>
    </div>
  );
}
