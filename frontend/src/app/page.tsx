'use client';

import { useState } from 'react';
import Link from 'next/link';
import { ArrowRight } from 'lucide-react';
import HeroBanner from '@/components/HeroBanner';
import ProductCard from '@/components/ProductCard';
import CategoryPill from '@/components/CategoryPill';
import { useProducts, useCategories } from '@/hooks/useProducts';

export default function HomePage() {
  const [activeCategory, setActiveCategory] = useState<string>('');
  const { products, loading } = useProducts({
    category: activeCategory || undefined,
    limit: 8,
  });
  const categories = useCategories();

  return (
    <div>
      {/* Hero */}
      <HeroBanner />

      {/* Products Section */}
      <section style={{ padding: 'var(--spacing-section) 0' }}>
        <div className="max-w-[1200px] mx-auto px-4">
          {/* Section Header */}
          <div className="text-center mb-8">
            <h2 className="text-display-lg">Semua Produk</h2>
            <p className="text-body-md mt-2">
              Temukan berbagai produk unggulan di GadgetSol
            </p>
          </div>

          {/* Category Pills */}
          <div className="flex items-center justify-center gap-2 mb-10 flex-wrap">
            <CategoryPill
              category="All"
              isActive={activeCategory === ''}
              onClick={() => setActiveCategory('')}
            />
            {categories.map((cat) => (
              <CategoryPill
                key={cat}
                category={cat}
                isActive={activeCategory === cat}
                onClick={() => setActiveCategory(cat)}
              />
            ))}
          </div>

          {/* Product Grid */}
          {loading ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
              {Array.from({ length: 8 }).map((_, i) => (
                <div
                  key={i}
                  className="bg-[var(--color-surface-card)] rounded-[var(--radius-lg)] border border-[var(--color-hairline)] h-[420px] animate-pulse"
                />
              ))}
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
              {products.map((product) => (
                <ProductCard key={product.id} product={product} />
              ))}
            </div>
          )}

          {/* View All CTA */}
          <div className="text-center mt-10">
            <Link
              href="/products"
              className="inline-flex items-center gap-2 px-6 py-3 bg-[var(--color-surface-card)] text-[var(--color-ink)] font-medium rounded-[var(--radius-md)] border border-[var(--color-hairline-strong)] hover:bg-[var(--color-surface-strong)] transition-colors"
              style={{ fontSize: '14px' }}
            >
              Lihat Semua Produk
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        </div>
      </section>

      {/* CTA Band */}
      <section className="bg-[var(--color-canvas)] border-t border-[var(--color-hairline)]" style={{ padding: '96px 0' }}>
        <div className="max-w-[800px] mx-auto px-4 text-center">
          <h2 className="text-display-lg mb-4">
            Bingung Pilih Gadget?
          </h2>
          <p className="text-body-md mb-8 max-w-lg mx-auto">
            Konsultan AI kami siap membantu Anda menemukan gadget yang paling sesuai
            dengan kebutuhan dan anggaran Anda. Gratis dan instan!
          </p>
          <button
            onClick={() => {
              const event = new CustomEvent('open-chat');
              window.dispatchEvent(event);
            }}
            className="inline-flex items-center gap-2 px-8 py-3.5 bg-[var(--color-primary)] text-white font-medium rounded-[var(--radius-md)] hover:bg-[var(--color-primary-active)] transition-colors"
            style={{ fontSize: '14px' }}
          >
            Mulai Konsultasi AI
          </button>
        </div>
      </section>
    </div>
  );
}
