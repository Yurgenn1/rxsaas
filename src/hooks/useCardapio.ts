"use client";

import { useState, useCallback, useEffect } from "react";
import { useDebounce } from "./useDebounce";
import { fetchWithValidation } from "@/lib/validators";

interface CardapioProduct {
  id: string;
  name: string;
  description?: string;
  price: number;
  isAvailable: boolean;
  category?: { id: string; name: string };
  categoryId: string;
  image?: string;
  createdAt: string;
  updatedAt: string;
  // Aliases for backward compatibility with page
  nome?: string;
  descricao?: string;
  precoCusto?: number;
  precoVenda?: number;
  disponivel?: boolean;
  categoria?: { id: string; name: string };
  categoriaId?: string;
  imagem?: string;
}

export interface CardapioCreatePayload {
  // New field names (preferred)
  name?: string;
  description?: string;
  price?: number;
  categoryId?: string;
  image?: string;
  isAvailable?: boolean;
  // Old field names (for backward compatibility with page)
  nome?: string;
  descricao?: string;
  precoCusto?: number;
  precoVenda?: number;
  categoriaId?: string;
  imagem?: string;
}

// Helper function to normalize payload - converts old field names to new ones
function normalizePayload(data: CardapioCreatePayload) {
  return {
    name: data.name || data.nome || "",
    description: data.description || data.descricao || "",
    price: data.price ?? data.precoCusto ?? data.precoVenda ?? 0,
    categoryId: data.categoryId || data.categoriaId || "",
    isActive: data.isAvailable !== undefined ? data.isAvailable : true,
    isFeatured: false,
  };
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
        ...(categoriaFilter && { categoryId: categoriaFilter }),
      });

      const result = await fetchWithValidation(`/api/products?${params}`);
      // Map products to include aliases for backward compatibility with page component
      const produtosData = (result.data?.products || []).map((p: any) => ({
        ...p,
        nome: p.name,
        descricao: p.description,
        precoCusto: p.price,
        precoVenda: p.price,
        disponivel: p.isAvailable,
        categoria: p.category ? { ...p.category, nome: p.category.name } : undefined,
        categoriaId: p.categoryId,
        imagem: p.image,
      }));
      setProdutos(produtosData);
      setTotal(result.data?.total || 0);
    } catch (err) {
      const message = err instanceof Error ? err.message : "Error fetching cardapio";
      setError(message);
      console.error("🚨 [useCardapio] Error:", message);
      setProdutos([]);
      setTotal(0);
    } finally {
      setLoading(false);
    }
  }, [page, limit, debouncedSearch, categoriaFilter]);

  const createProduto = useCallback(
    async (data: CardapioCreatePayload) => {
      try {
        const normalizedData = normalizePayload(data);
        const response = await fetch("/api/products", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(normalizedData),
        });

        if (!response.ok) {
          throw new Error("Failed to create product");
        }

        const result = await response.json();
        const newProduct = result.data;
        // Add aliases for backward compatibility
        const mappedProduct = {
          ...newProduct,
          nome: newProduct.name,
          descricao: newProduct.description,
          precoCusto: newProduct.price,
          precoVenda: newProduct.price,
          disponivel: newProduct.isAvailable,
          categoria: newProduct.category ? { ...newProduct.category, nome: newProduct.category.name } : undefined,
          categoriaId: newProduct.categoryId,
          imagem: newProduct.image,
        };
        setProdutos((prev) => [mappedProduct, ...prev]);
        return mappedProduct;
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
        const normalizedData = normalizePayload(data as CardapioCreatePayload);
        const response = await fetch(`/api/products/${id}`, {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(normalizedData),
        });

        if (!response.ok) {
          throw new Error("Failed to update product");
        }

        const result = await response.json();
        const updatedProduct = result.data;
        // Add aliases for backward compatibility
        const mappedProduct = {
          ...updatedProduct,
          nome: updatedProduct.name,
          descricao: updatedProduct.description,
          precoCusto: updatedProduct.price,
          precoVenda: updatedProduct.price,
          disponivel: updatedProduct.isAvailable,
          categoria: updatedProduct.category ? { ...updatedProduct.category, nome: updatedProduct.category.name } : undefined,
          categoriaId: updatedProduct.categoryId,
          imagem: updatedProduct.image,
        };
        setProdutos((prev) =>
          prev.map((p) => (p.id === id ? mappedProduct : p))
        );
        return mappedProduct;
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
        const response = await fetch(`/api/products/${id}`, {
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
