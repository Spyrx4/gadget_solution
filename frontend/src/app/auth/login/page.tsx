'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Eye, EyeOff } from 'lucide-react';
import { useAuth } from '@/hooks/useAuth';

export default function LoginPage() {
  const router = useRouter();
  const { login, loading, error } = useAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const success = await login(email, password);
    if (success) {
      router.push('/');
    }
  };

  return (
    <div className="min-h-[calc(100vh-64px-200px)] flex items-center justify-center px-4" style={{ padding: 'var(--spacing-section) 0' }}>
      <div className="w-full max-w-md">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="w-12 h-12 bg-[var(--color-primary)] rounded-[var(--radius-lg)] flex items-center justify-center mx-auto mb-4">
            <span className="text-white font-bold text-xl">G</span>
          </div>
          <h1 className="text-display-md">Masuk ke Akun</h1>
          <p className="text-body-sm text-[var(--color-muted)] mt-2">
            Selamat datang kembali di GadgetSol
          </p>
        </div>

        {/* Card */}
        <div className="bg-[var(--color-surface-card)] rounded-[var(--radius-lg)] border border-[var(--color-hairline)] p-6">
          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Error */}
            {error && (
              <div className="px-4 py-3 bg-red-50 border border-red-100 rounded-[var(--radius-md)] text-sm text-[var(--color-semantic-error)]">
                {error}
              </div>
            )}

            {/* Email */}
            <div>
              <label className="block text-sm font-medium text-[var(--color-ink)] mb-1.5">
                Email
              </label>
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="nama@email.com"
                className="w-full px-4 py-3 bg-[var(--color-surface-card)] border border-[var(--color-hairline)] rounded-[var(--radius-md)] text-sm text-[var(--color-ink)] placeholder:text-[var(--color-muted-soft)] focus:outline-none focus:border-[var(--color-primary)] transition-colors"
              />
            </div>

            {/* Password */}
            <div>
              <label className="block text-sm font-medium text-[var(--color-ink)] mb-1.5">
                Password
              </label>
              <div className="relative">
                <input
                  type={showPassword ? 'text' : 'password'}
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Masukkan password"
                  className="w-full px-4 py-3 pr-10 bg-[var(--color-surface-card)] border border-[var(--color-hairline)] rounded-[var(--radius-md)] text-sm text-[var(--color-ink)] placeholder:text-[var(--color-muted-soft)] focus:outline-none focus:border-[var(--color-primary)] transition-colors"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-[var(--color-muted)]"
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            {/* Demo hint */}
            <div className="px-3 py-2 bg-[var(--color-canvas-soft)] rounded-[var(--radius-md)] border border-[var(--color-hairline-soft)]">
              <p className="text-[11px] text-[var(--color-muted)]">
                <strong>Demo:</strong> admin@gadgetsolution.com / admin123
              </p>
            </div>

            {/* Submit */}
            <button
              type="submit"
              disabled={loading}
              className="w-full py-3 bg-[var(--color-primary)] text-white font-medium rounded-[var(--radius-md)] hover:bg-[var(--color-primary-active)] disabled:opacity-50 transition-colors"
            >
              {loading ? 'Memproses...' : 'Masuk'}
            </button>
          </form>

          {/* Signup link */}
          <p className="text-center text-sm text-[var(--color-muted)] mt-6">
            Belum punya akun?{' '}
            <Link href="/auth/signup" className="text-[var(--color-primary)] font-medium hover:underline">
              Daftar sekarang
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
