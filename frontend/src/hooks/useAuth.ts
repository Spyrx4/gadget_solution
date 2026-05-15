'use client';

import { useState } from 'react';
import { api } from '@/lib/api';
import { useAuthStore } from '@/lib/store';

export function useAuth() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const { user, isAuthenticated, setAuth, logout, loadFromStorage } = useAuthStore();

  const login = async (email: string, password: string) => {
    setLoading(true);
    setError(null);
    try {
      const response = await api.post('/api/auth/login', { email, password });
      setAuth(response.data.user, response.data.token);
      return true;
    } catch (err: unknown) {
      const message = (err as { response?: { data?: { message?: string } } })?.response?.data?.message || 'Login gagal. Periksa email dan password Anda.';
      setError(message);
      return false;
    } finally {
      setLoading(false);
    }
  };

  const signup = async (data: { email: string; password: string; firstName: string; lastName: string }) => {
    setLoading(true);
    setError(null);
    try {
      const response = await api.post('/api/auth/signup', data);
      setAuth(response.data.user, response.data.token);
      return true;
    } catch (err: unknown) {
      const message = (err as { response?: { data?: { message?: string } } })?.response?.data?.message || 'Registrasi gagal. Coba lagi.';
      setError(message);
      return false;
    } finally {
      setLoading(false);
    }
  };

  return { user, isAuthenticated, login, signup, logout, loading, error, loadFromStorage };
}
