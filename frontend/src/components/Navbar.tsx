'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { Search, ShoppingCart, User, Menu, X } from 'lucide-react';
import { useCartStore, useAuthStore } from '@/lib/store';

export default function Navbar() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const cartItems = useCartStore((s) => s.items);
  const { isAuthenticated, user } = useAuthStore();

  useEffect(() => {
    useAuthStore.getState().loadFromStorage();
    const handleScroll = () => setIsScrolled(window.scrollY > 10);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const totalItems = cartItems.reduce((sum, item) => sum + item.quantity, 0);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      window.location.href = `/products?search=${encodeURIComponent(searchQuery)}`;
    }
  };

  return (
    <header
      className={`sticky top-0 z-50 transition-all duration-300 ${
        isScrolled
          ? 'bg-[var(--color-canvas)]/95 backdrop-blur-md border-b border-[var(--color-hairline)]'
          : 'bg-[var(--color-canvas)] border-b border-transparent'
      }`}
      style={{ height: '64px' }}
    >
      <div className="max-w-[1200px] mx-auto px-4 h-full flex items-center gap-6">
        {/* Logo */}
        <Link href="/" className="flex items-center gap-2 shrink-0">
          <div className="w-8 h-8 bg-[var(--color-primary)] rounded-[var(--radius-md)] flex items-center justify-center">
            <span className="text-white font-bold text-sm">G</span>
          </div>
          <span className="text-[var(--color-ink)] font-semibold text-lg tracking-tight hidden sm:block">
            GadgetSol
          </span>
        </Link>

        {/* Search Bar — center */}
        <form onSubmit={handleSearch} className="flex-1 max-w-lg mx-auto hidden md:flex">
          <div className="relative w-full">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[var(--color-muted)]" />
            <input
              type="text"
              placeholder="Cari produk atau brand..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2 bg-[var(--color-surface-card)] border border-[var(--color-hairline)] rounded-[var(--radius-pill)] text-sm text-[var(--color-ink)] placeholder:text-[var(--color-muted-soft)] focus:outline-none focus:border-[var(--color-primary)] transition-colors"
            />
          </div>
        </form>

        {/* Nav Links — right */}
        <nav className="hidden md:flex items-center gap-6">
          <Link
            href="/products"
            className="text-sm font-medium text-[var(--color-ink)] hover:text-[var(--color-primary)] transition-colors"
          >
            Produk
          </Link>

          {/* Cart */}
          <Link href="/checkout" className="relative group">
            <ShoppingCart className="w-5 h-5 text-[var(--color-ink)] group-hover:text-[var(--color-primary)] transition-colors" />
            {totalItems > 0 && (
              <span className="absolute -top-2 -right-2 w-5 h-5 bg-[var(--color-primary)] text-white text-[10px] font-bold rounded-full flex items-center justify-center">
                {totalItems}
              </span>
            )}
          </Link>

          {/* User */}
          {isAuthenticated ? (
            <Link href="/checkout" className="flex items-center gap-2 group">
              <div className="w-8 h-8 bg-[var(--color-surface-strong)] rounded-full flex items-center justify-center group-hover:bg-[var(--color-primary)] transition-colors">
                <User className="w-4 h-4 text-[var(--color-ink)] group-hover:text-white transition-colors" />
              </div>
              <span className="text-sm font-medium text-[var(--color-ink)]">
                {user?.firstName || 'Akun'}
              </span>
            </Link>
          ) : (
            <Link
              href="/auth/login"
              className="px-4 py-2 bg-[var(--color-primary)] text-white text-sm font-medium rounded-[var(--radius-md)] hover:bg-[var(--color-primary-active)] transition-colors"
            >
              Masuk
            </Link>
          )}
        </nav>

        {/* Mobile hamburger */}
        <button
          className="md:hidden p-2 text-[var(--color-ink)]"
          onClick={() => setIsMenuOpen(!isMenuOpen)}
        >
          {isMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
        </button>
      </div>

      {/* Mobile menu */}
      {isMenuOpen && (
        <div className="md:hidden bg-[var(--color-surface-card)] border-t border-[var(--color-hairline)] px-4 py-4 space-y-3">
          <form onSubmit={handleSearch}>
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[var(--color-muted)]" />
              <input
                type="text"
                placeholder="Cari produk..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-2.5 bg-[var(--color-canvas)] border border-[var(--color-hairline)] rounded-[var(--radius-md)] text-sm"
              />
            </div>
          </form>
          <Link href="/products" className="block py-2 text-sm font-medium text-[var(--color-ink)]" onClick={() => setIsMenuOpen(false)}>Produk</Link>
          <Link href="/checkout" className="block py-2 text-sm font-medium text-[var(--color-ink)]" onClick={() => setIsMenuOpen(false)}>
            Keranjang {totalItems > 0 && `(${totalItems})`}
          </Link>
          {!isAuthenticated && (
            <Link href="/auth/login" className="block w-full text-center py-2.5 bg-[var(--color-primary)] text-white text-sm font-medium rounded-[var(--radius-md)]" onClick={() => setIsMenuOpen(false)}>
              Masuk
            </Link>
          )}
        </div>
      )}
    </header>
  );
}
