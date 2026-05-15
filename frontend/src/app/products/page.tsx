'use client';

import { useState, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import { Search, SlidersHorizontal } from 'lucide-react';
import ProductCard from '@/components/ProductCard';
import CategoryPill from '@/components/CategoryPill';
import { useProducts, useCategories } from '@/hooks/useProducts';

export default function ProductsPage() {
  return (
    <Suspense fallback={
      <div style={{ padding: 'var(--spacing-section) 0' }}>
        <div className="max-w-[1200px] mx-auto px-4 text-center">
          <div className="h-8 bg-[var(--color-surface-card)] rounded-[var(--radius-md)] w-48 mx-auto animate-pulse mb-8" />
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {Array.from({ length: 6 }).map((_, i) => (
              <div key={i} className="bg-[var(--color-surface-card)] rounded-[var(--radius-lg)] border border-[var(--color-hairline)] h-[420px] animate-pulse" />
            ))}
          </div>
        </div>
      </div>
    }>
      <ProductsContent />
    </Suspense>
  );
}

function ProductsContent() {
  const searchParams = useSearchParams();
  const initialCategory = searchParams.get('category') || '';
  const initialSearch = searchParams.get('search') || '';

  const [activeCategory, setActiveCategory] = useState(initialCategory);
  const [searchQuery, setSearchQuery] = useState(initialSearch);
  const [appliedSearch, setAppliedSearch] = useState(initialSearch);
  const [page, setPage] = useState(1);

  const { products, loading, totalPages } = useProducts({
    category: activeCategory || undefined,
    search: appliedSearch || undefined,
    page,
    limit: 12,
  });
  const categories = useCategories();

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    setAppliedSearch(searchQuery);
    setPage(1);
  };

  return (
    <div style={{ padding: 'var(--spacing-section) 0' }}>
      <div className="max-w-[1200px] mx-auto px-4">
        {/* Page Header */}
        <div className="text-center mb-8">
          <h1 className="text-display-lg">Katalog Produk</h1>
          <p className="text-body-md mt-2">
            Jelajahi koleksi gadget terlengkap kami
          </p>
        </div>

        {/* Search & Filter Bar */}
        <div className="flex flex-col md:flex-row items-center gap-4 mb-8">
          <form onSubmit={handleSearch} className="flex-1 w-full md:max-w-lg">
            <div className="relative">
              <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-[var(--color-muted)]" />
              <input
                type="text"
                placeholder="Cari smartphone, laptop, tablet..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-2.5 bg-[var(--color-surface-card)] border border-[var(--color-hairline)] rounded-[var(--radius-pill)] text-sm text-[var(--color-ink)] placeholder:text-[var(--color-muted-soft)] focus:outline-none focus:border-[var(--color-primary)] transition-colors"
              />
            </div>
          </form>

          <div className="flex items-center gap-2 text-sm text-[var(--color-muted)]">
            <SlidersHorizontal className="w-4 h-4" />
            <span>{products.length} produk ditemukan</span>
          </div>
        </div>

        {/* Category Pills */}
        <div className="flex items-center gap-2 mb-8 overflow-x-auto pb-2 scrollbar-hide">
          <CategoryPill
            category="All"
            isActive={activeCategory === ''}
            onClick={() => { setActiveCategory(''); setPage(1); }}
          />
          {categories.map((cat) => (
            <CategoryPill
              key={cat}
              category={cat}
              isActive={activeCategory === cat}
              onClick={() => { setActiveCategory(cat); setPage(1); }}
            />
          ))}
        </div>

        {/* Applied Filters */}
        {(activeCategory || appliedSearch) && (
          <div className="flex items-center gap-2 mb-6 flex-wrap">
            <span className="text-xs text-[var(--color-muted)]">Filter aktif:</span>
            {activeCategory && (
              <button
                onClick={() => setActiveCategory('')}
                className="inline-flex items-center gap-1 px-2.5 py-1 bg-[var(--color-surface-strong)] text-[var(--color-ink)] rounded-[var(--radius-pill)] text-xs font-medium hover:bg-[var(--color-hairline-strong)] transition-colors"
              >
                {activeCategory} ✕
              </button>
            )}
            {appliedSearch && (
              <button
                onClick={() => { setSearchQuery(''); setAppliedSearch(''); }}
                className="inline-flex items-center gap-1 px-2.5 py-1 bg-[var(--color-surface-strong)] text-[var(--color-ink)] rounded-[var(--radius-pill)] text-xs font-medium hover:bg-[var(--color-hairline-strong)] transition-colors"
              >
                &ldquo;{appliedSearch}&rdquo; ✕
              </button>
            )}
          </div>
        )}

        {/* Product Grid */}
        {loading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {Array.from({ length: 6 }).map((_, i) => (
              <div
                key={i}
                className="bg-[var(--color-surface-card)] rounded-[var(--radius-lg)] border border-[var(--color-hairline)] h-[420px] animate-pulse"
              />
            ))}
          </div>
        ) : products.length === 0 ? (
          <div className="text-center py-20">
            <p className="text-display-sm text-[var(--color-muted)]">😔</p>
            <p className="text-title-md mt-4">Tidak ada produk ditemukan</p>
            <p className="text-body-sm text-[var(--color-muted)] mt-2">
              Coba ubah filter atau kata kunci pencarian Anda
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {products.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        )}

        {/* Pagination */}
        {totalPages > 1 && (
          <div className="flex items-center justify-center gap-2 mt-10">
            {Array.from({ length: totalPages }).map((_, i) => (
              <button
                key={i}
                onClick={() => setPage(i + 1)}
                className={`w-10 h-10 rounded-[var(--radius-md)] text-sm font-medium transition-colors ${
                  page === i + 1
                    ? 'bg-[var(--color-primary)] text-white'
                    : 'bg-[var(--color-surface-card)] text-[var(--color-ink)] border border-[var(--color-hairline)] hover:bg-[var(--color-surface-strong)]'
                }`}
              >
                {i + 1}
              </button>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
