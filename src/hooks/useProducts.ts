"use client";

import { useState, useCallback, useEffect } from "react";
import { useDebounce } from "./useDebounce";
import { fetchWithValidation } from "@/lib/validators";

interface Product {
  id: string;
  name: string;
  description?: string;
  price: number;
  isActive: boolean;
  isFeatured: boolean;
  categoryId: string;
  category?: { id: string; name: string };
  createdAt: string;
  updatedAt: string;
}

export function useProducts(restaurantId: string = "default", categoryId?: string) {
  const [products, setProducts] = useState<Product[]>([]);
  const [total, setTotal] = useState(0);
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(10);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const debouncedSearch = useDebounce(search, 300);

  const fetchProducts = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const params = new URLSearchParams({
        page: page.toString(),
        limit: limit.toString(),
        search: debouncedSearch,
        restaurantId,
        ...(categoryId && { categoryId }),
      });

      // ✅ GUARDRAIL: Validação automática de resposta
      const result = await fetchWithValidation(`/api/products?${params}`);

      setProducts(result.data?.products || []);
      setTotal(result.data?.total || 0);
    } catch (err) {
      const message = err instanceof Error ? err.message : "Error fetching products";
      setError(message);
      console.error("🚨 [useProducts] Error:", message);
    } finally {
      setLoading(false);
    }
  }, [page, limit, debouncedSearch, restaurantId, categoryId]);

  useEffect(() => {
    setPage(1);
  }, [debouncedSearch, categoryId]);

  useEffect(() => {
    fetchProducts();
  }, [fetchProducts]);

  return {
    products,
    total,
    page,
    setPage,
    limit,
    setLimit,
    search,
    setSearch,
    loading,
    error,
    refetch: fetchProducts,
  };
}
