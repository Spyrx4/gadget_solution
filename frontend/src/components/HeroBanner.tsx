'use client';

import Link from 'next/link';
import { Sparkles, ArrowRight } from 'lucide-react';

export default function HeroBanner() {
  return (
    <section
      className="bg-[var(--color-canvas)]"
      style={{ padding: 'var(--spacing-section) 0' }}
    >
      <div className="max-w-[1200px] mx-auto px-4">
        <div className="flex flex-col lg:flex-row items-center gap-12">
          {/* Left — Copy */}
          <div className="flex-1 text-center lg:text-left">
            {/* Badge */}
            <div
              className="inline-flex items-center gap-2 mb-6"
              style={{
                padding: '4px 12px',
                borderRadius: '9999px',
                backgroundColor: 'var(--color-surface-strong)',
              }}
            >
              <Sparkles className="w-3.5 h-3.5 text-[var(--color-primary)]" />
              <span
                style={{
                  fontSize: '11px',
                  fontWeight: 600,
                  letterSpacing: '0.88px',
                  textTransform: 'uppercase',
                  color: 'var(--color-muted)',
                }}
              >
                AI-Powered Shopping
              </span>
            </div>

            {/* Headline */}
            <h1 className="text-display-mega mb-4">
              Temukan Gadget{' '}
              <span className="text-[var(--color-primary)]">Impianmu</span>
            </h1>

            {/* Subheadline */}
            <p
              className="text-body-md max-w-lg mx-auto lg:mx-0 mb-8"
              style={{ color: 'var(--color-body)' }}
            >
              Smartphone, Laptop, Tablet & Smartwatch terbaik dengan{' '}
              <strong className="text-[var(--color-ink)]">Konsultan AI</strong> pribadi
              yang membantu Anda menemukan gadget paling tepat sesuai kebutuhan dan budget.
            </p>

            {/* CTAs */}
            <div className="flex flex-col sm:flex-row items-center gap-3 justify-center lg:justify-start">
              <Link
                href="/products"
                className="inline-flex items-center gap-2 px-6 py-3 bg-[var(--color-primary)] text-white font-medium rounded-[var(--radius-md)] hover:bg-[var(--color-primary-active)] transition-colors"
                style={{ fontSize: '14px' }}
              >
                Jelajahi Produk
                <ArrowRight className="w-4 h-4" />
              </Link>
              <button
                onClick={() => {
                  const event = new CustomEvent('open-chat');
                  window.dispatchEvent(event);
                }}
                className="inline-flex items-center gap-2 px-6 py-3 bg-[var(--color-surface-card)] text-[var(--color-ink)] font-medium rounded-[var(--radius-md)] border border-[var(--color-hairline-strong)] hover:bg-[var(--color-surface-strong)] transition-colors"
                style={{ fontSize: '14px' }}
              >
                <Sparkles className="w-4 h-4 text-[var(--color-primary)]" />
                Tanya AI Konsultan
              </button>
            </div>

            {/* Trust indicators */}
            <div className="flex items-center gap-6 mt-8 justify-center lg:justify-start">
              {[
                { label: '100% Original', icon: '🛡️' },
                { label: 'Free Ongkir', icon: '🚚' },
                { label: 'Garansi Resmi', icon: '✅' },
              ].map((item) => (
                <div key={item.label} className="flex items-center gap-1.5">
                  <span className="text-base">{item.icon}</span>
                  <span className="text-xs font-medium text-[var(--color-muted)]">
                    {item.label}
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* Right — Featured product visual */}
          <div className="flex-1 max-w-md lg:max-w-lg">
            <div className="relative">
              {/* Decorative gradient blob */}
              <div
                className="absolute -inset-4 rounded-[32px] opacity-20 blur-3xl"
                style={{
                  background: 'linear-gradient(135deg, var(--color-timeline-thinking), var(--color-timeline-read), var(--color-timeline-edit))',
                }}
              />
              {/* Product card */}
              <div className="relative bg-[var(--color-surface-card)] rounded-[var(--radius-xl)] border border-[var(--color-hairline)] p-8">
                <img
                  src="https://images.unsplash.com/photo-1592899677977-9c10ca588bbd?w=600&h=600&fit=crop"
                  alt="Featured Gadget"
                  className="w-full aspect-square object-contain"
                />
                <div className="mt-4 text-center">
                  <p className="text-sm font-semibold text-[var(--color-ink)]">Koleksi Terbaru 2026</p>
                  <p className="text-xs text-[var(--color-muted)]">Produk pilihan untuk kamu</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
