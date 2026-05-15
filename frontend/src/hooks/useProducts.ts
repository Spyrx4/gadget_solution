'use client';

import { useState, useEffect, useCallback } from 'react';
import { api } from '@/lib/api';
import { Product, ProductFilters } from '@/lib/types';
import { MOCK_PRODUCTS, MOCK_CATEGORIES } from '@/lib/mock-data';

export function useProducts(filters?: ProductFilters) {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [totalPages, setTotalPages] = useState(1);

  const fetchProducts = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const params = new URLSearchParams();
      if (filters?.category) params.set('category', filters.category);
      if (filters?.search) params.set('search', filters.search);
      if (filters?.priceMin) params.set('priceMin', String(filters.priceMin));
      if (filters?.priceMax) params.set('priceMax', String(filters.priceMax));
      if (filters?.page) params.set('page', String(filters.page));
      if (filters?.limit) params.set('limit', String(filters.limit));

      const response = await api.get(`/api/products?${params.toString()}`);
      setProducts(response.data.data || response.data);
      setTotalPages(response.data.totalPages || 1);
    } catch {
      // Fallback to mock data when backend is offline
      console.warn('Backend offline, using mock data');
      let filtered = [...MOCK_PRODUCTS];
      if (filters?.category) {
        filtered = filtered.filter((p) => p.category === filters.category);
      }
      if (filters?.search) {
        const q = filters.search.toLowerCase();
        filtered = filtered.filter(
          (p) => p.name.toLowerCase().includes(q) || p.description.toLowerCase().includes(q)
        );
      }
      setProducts(filtered);
      setTotalPages(1);
      setError(null);
    } finally {
      setLoading(false);
    }
  }, [filters?.category, filters?.search, filters?.priceMin, filters?.priceMax, filters?.page, filters?.limit]);

  useEffect(() => {
    fetchProducts();
  }, [fetchProducts]);

  return { products, loading, error, totalPages, refetch: fetchProducts };
}

export function useProduct(id: string) {
  const [product, setProduct] = useState<Product | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchProduct = async () => {
      setLoading(true);
      try {
        const response = await api.get(`/api/products/${id}`);
        setProduct(response.data);
      } catch {
        const mock = MOCK_PRODUCTS.find((p) => p.id === id);
        if (mock) {
          setProduct(mock);
        } else {
          setError('Product not found');
        }
      } finally {
        setLoading(false);
      }
    };
    fetchProduct();
  }, [id]);

  return { product, loading, error };
}

export function useCategories() {
  const [categories, setCategories] = useState<string[]>([]);

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const response = await api.get('/api/products/categories');
        setCategories(response.data);
      } catch {
        setCategories(MOCK_CATEGORIES);
      }
    };
    fetchCategories();
  }, []);

  return categories;
}
