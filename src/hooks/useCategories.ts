"use client";

import { useState, useCallback, useEffect } from "react";
import { useDebounce } from "./useDebounce";
import { fetchWithValidation } from "@/lib/validators";

interface Category {
  id: string;
  name: string;
  description?: string;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

export function useCategories(restaurantId: string = "default") {
  const [categories, setCategories] = useState<Category[]>([]);
  const [total, setTotal] = useState(0);
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(10);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const debouncedSearch = useDebounce(search, 300);

  const fetchCategories = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const params = new URLSearchParams({
        page: page.toString(),
        limit: limit.toString(),
        search: debouncedSearch,
        restaurantId,
      });

      const result = await fetchWithValidation(`/api/categories?${params}`);

      setCategories(result.data?.categories || []);
      setTotal(result.data?.total || 0);
    } catch (err) {
      const message = err instanceof Error ? err.message : "Error fetching categories";
      setError(message);
      console.error("🚨 [useCategories]", message);
    } finally {
      setLoading(false);
    }
  }, [page, limit, debouncedSearch, restaurantId]);

  useEffect(() => {
    setPage(1);
  }, [debouncedSearch]);

  useEffect(() => {
    fetchCategories();
  }, [fetchCategories]);

  return {
    categories,
    total,
    page,
    setPage,
    limit,
    setLimit,
    search,
    setSearch,
    loading,
    error,
    refetch: fetchCategories,
  };
}
