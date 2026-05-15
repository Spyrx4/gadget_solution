import Link from 'next/link';
import { Smartphone, Laptop, Tablet, Watch, Mail } from 'lucide-react';

export default function Footer() {
  return (
    <footer className="bg-[var(--color-canvas)] border-t border-[var(--color-hairline)]" style={{ padding: '64px 0 32px' }}>
      <div className="max-w-[1200px] mx-auto px-4">
        <div className="grid grid-cols-2 md:grid-cols-5 gap-8 mb-12">
          {/* Brand Column */}
          <div className="col-span-2 md:col-span-1">
            <div className="flex items-center gap-2 mb-4">
              <div className="w-8 h-8 bg-[var(--color-primary)] rounded-[var(--radius-md)] flex items-center justify-center">
                <span className="text-white font-bold text-sm">G</span>
              </div>
              <span className="text-[var(--color-ink)] font-semibold text-lg">GadgetSol</span>
            </div>
            <p className="text-sm text-[var(--color-body)] leading-relaxed">
              Toko gadget online terpercaya dengan konsultan AI pribadi untuk solusi gawai produktif Anda.
            </p>
          </div>

          {/* Products */}
          <div>
            <h4 className="text-caption-uppercase text-[var(--color-muted)] mb-4" style={{ fontSize: '11px', fontWeight: 600, letterSpacing: '0.88px', textTransform: 'uppercase' }}>
              Produk
            </h4>
            <ul className="space-y-2.5">
              <li>
                <Link href="/products?category=Gaming+Smartphone" className="flex items-center gap-2 text-sm text-[var(--color-body)] hover:text-[var(--color-primary)] transition-colors">
                  <Smartphone className="w-3.5 h-3.5" /> Smartphone
                </Link>
              </li>
              <li>
                <Link href="/products?category=Gaming+Laptop" className="flex items-center gap-2 text-sm text-[var(--color-body)] hover:text-[var(--color-primary)] transition-colors">
                  <Laptop className="w-3.5 h-3.5" /> Laptop
                </Link>
              </li>
              <li>
                <Link href="/products?category=Gaming+Monitor" className="flex items-center gap-2 text-sm text-[var(--color-body)] hover:text-[var(--color-primary)] transition-colors">
                  <Tablet className="w-3.5 h-3.5" /> Monitor
                </Link>
              </li>
              <li>
                <Link href="/products?category=Gaming+Headset" className="flex items-center gap-2 text-sm text-[var(--color-body)] hover:text-[var(--color-primary)] transition-colors">
                  <Watch className="w-3.5 h-3.5" /> Aksesoris
                </Link>
              </li>
            </ul>
          </div>

          {/* Layanan */}
          <div>
            <h4 style={{ fontSize: '11px', fontWeight: 600, letterSpacing: '0.88px', textTransform: 'uppercase' }} className="text-[var(--color-muted)] mb-4">
              Layanan
            </h4>
            <ul className="space-y-2.5">
              <li><span className="text-sm text-[var(--color-body)]">Konsultan AI</span></li>
              <li><span className="text-sm text-[var(--color-body)]">Garansi Resmi</span></li>
              <li><span className="text-sm text-[var(--color-body)]">Free Ongkir</span></li>
              <li><span className="text-sm text-[var(--color-body)]">Cicilan 0%</span></li>
            </ul>
          </div>

          {/* Perusahaan */}
          <div>
            <h4 style={{ fontSize: '11px', fontWeight: 600, letterSpacing: '0.88px', textTransform: 'uppercase' }} className="text-[var(--color-muted)] mb-4">
              Perusahaan
            </h4>
            <ul className="space-y-2.5">
              <li><span className="text-sm text-[var(--color-body)]">Tentang Kami</span></li>
              <li><span className="text-sm text-[var(--color-body)]">Hubungi Kami</span></li>
              <li><span className="text-sm text-[var(--color-body)]">Kebijakan Privasi</span></li>
              <li><span className="text-sm text-[var(--color-body)]">Syarat & Ketentuan</span></li>
            </ul>
          </div>

          {/* Newsletter */}
          <div>
            <h4 style={{ fontSize: '11px', fontWeight: 600, letterSpacing: '0.88px', textTransform: 'uppercase' }} className="text-[var(--color-muted)] mb-4">
              Newsletter
            </h4>
            <p className="text-sm text-[var(--color-body)] mb-3">Dapatkan info promo terbaru</p>
            <div className="flex gap-2">
              <input
                type="email"
                placeholder="Email kamu"
                className="flex-1 px-3 py-2 bg-[var(--color-surface-card)] border border-[var(--color-hairline)] rounded-[var(--radius-md)] text-sm focus:outline-none focus:border-[var(--color-primary)]"
              />
              <button className="p-2 bg-[var(--color-primary)] text-white rounded-[var(--radius-md)] hover:bg-[var(--color-primary-active)] transition-colors">
                <Mail className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>

        {/* Bottom bar */}
        <div className="border-t border-[var(--color-hairline)] pt-6 flex flex-col md:flex-row justify-between items-center gap-4">
          <p className="text-xs text-[var(--color-muted)]">
            © 2026 GadgetSol. All rights reserved.
          </p>
          <div className="flex items-center gap-4">
            <span className="text-xs text-[var(--color-muted-soft)]">Pembayaran:</span>
            <div className="flex gap-2">
              {['QRIS', 'BCA', 'Mandiri', 'GoPay'].map((method) => (
                <span
                  key={method}
                  className="px-2 py-1 text-[10px] font-medium bg-[var(--color-surface-strong)] text-[var(--color-muted)] rounded-[var(--radius-xs)]"
                >
                  {method}
                </span>
              ))}
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
