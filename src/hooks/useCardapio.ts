"use client";

import { useState, useCallback, useEffect } from "react";
import { useDebounce } from "./useDebounce";
import { fetchWithValidation } from "@/lib/validators";

interface CardapioProduct {
  id: string;
  nome: string;
  descricao?: string;
  precoCusto: number;
  precoVenda: number;
  disponivel: boolean;
  categoria?: { id: string; nome: string };
  categoriaId: string;
  imagem?: string;
  createdAt: string;
  updatedAt: string;
}

export interface CardapioCreatePayload {
  nome: string;
  descricao?: string;
  precoCusto: number;
  precoVenda: number;
  disponivel?: boolean;
  categoriaId: string;
  imagem?: string;
}

export function useCardapio() {
  const [produtos, setProdutos] = useState<CardapioProduct[]>([]);
  const [total, setTotal] = useState(0);
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(10);
  const [search, setSearch] = useState("");
  const [categoriaFilter, setCategoriaFilter] = useState<string>("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const debouncedSearch = useDebounce(search, 300);

  const fetchProdutos = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const params = new URLSearchParams({
        page: page.toString(),
        limit: limit.toString(),
        search: debouncedSearch,
        ...(categoriaFilter && { categoriaId: categoriaFilter }),
      });

      const result = await fetchWithValidation(`/api/cardapio?${params}`);
      setProdutos(result.data?.produtos || result.data || []);
      setTotal(result.data?.total || (result.data?.length || 0));
    } catch (err) {
      const message = err instanceof Error ? err.message : "Error fetching cardapio";
      setError(message);
      console.error("🚨 [useCardapio] Error:", message);
    } finally {
      setLoading(false);
    }
  }, [page, limit, debouncedSearch, categoriaFilter]);

  const createProduto = useCallback(
    async (data: CardapioCreatePayload) => {
      try {
        const response = await fetch("/api/cardapio", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(data),
        });

        if (!response.ok) {
          throw new Error("Failed to create product");
        }

        const newProduct = await response.json();
        setProdutos((prev) => [newProduct, ...prev]);
        return newProduct;
      } catch (err) {
        const message = err instanceof Error ? err.message : "Error creating product";
        setError(message);
        throw err;
      }
    },
    []
  );

  const updateProduto = useCallback(
    async (id: string, data: Partial<CardapioCreatePayload>) => {
      try {
        const response = await fetch(`/api/cardapio/${id}`, {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(data),
        });

        if (!response.ok) {
          throw new Error("Failed to update product");
        }

        const updatedProduct = await response.json();
        setProdutos((prev) =>
          prev.map((p) => (p.id === id ? updatedProduct : p))
        );
        return updatedProduct;
      } catch (err) {
        const message = err instanceof Error ? err.message : "Error updating product";
        setError(message);
        throw err;
      }
    },
    []
  );

  const deleteProduto = useCallback(
    async (id: string) => {
      try {
        const response = await fetch(`/api/cardapio/${id}`, {
          method: "DELETE",
        });

        if (!response.ok) {
          throw new Error("Failed to delete product");
        }

        setProdutos((prev) => prev.filter((p) => p.id !== id));
      } catch (err) {
        const message = err instanceof Error ? err.message : "Error deleting product";
        setError(message);
        throw err;
      }
    },
    []
  );

  useEffect(() => {
    setPage(1);
  }, [debouncedSearch, categoriaFilter]);

  useEffect(() => {
    fetchProdutos();
  }, [fetchProdutos]);

  return {
    produtos,
    total,
    page,
    setPage,
    limit,
    setLimit,
    search,
    setSearch,
    categoriaFilter,
    setCategoriaFilter,
    loading,
    error,
    refetch: fetchProdutos,
    createProduto,
    updateProduto,
    deleteProduto,
  };
}
