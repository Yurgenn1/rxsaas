"use client";

import { useState, useCallback, useEffect } from "react";
import { useDebounce } from "./useDebounce";
import { fetchWithValidation } from "@/lib/validators";

interface Order {
  id: string;
  restaurantId: string;
  customerId: string;
  status: "pending" | "confirmed" | "preparing" | "ready" | "completed" | "cancelled";
  subtotal: number;
  tax: number;
  discount: number;
  tip: number;
  total: number;
  orderType: "dine_in" | "takeout" | "delivery";
  notes?: string;
  createdAt: string;
  updatedAt: string;
}

export function useOrders(restaurantId: string = "default", statusFilter?: string) {
  const [orders, setOrders] = useState<Order[]>([]);
  const [total, setTotal] = useState(0);
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(10);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const debouncedSearch = useDebounce(search, 300);

  const fetchOrders = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const params = new URLSearchParams({
        page: page.toString(),
        limit: limit.toString(),
        search: debouncedSearch,
        restaurantId,
        ...(statusFilter && { status: statusFilter }),
      });

      // ✅ GUARDRAIL: Validação automática de resposta
      const result = await fetchWithValidation(`/api/orders?${params}`);

      setOrders(result.data?.orders || []);
      setTotal(result.data?.total || 0);
    } catch (err) {
      const message = err instanceof Error ? err.message : "Error fetching orders";
      setError(message);
      console.error("🚨 [useOrders] Error:", message);
    } finally {
      setLoading(false);
    }
  }, [page, limit, debouncedSearch, restaurantId, statusFilter]);

  useEffect(() => {
    setPage(1);
  }, [debouncedSearch, statusFilter]);

  useEffect(() => {
    fetchOrders();
  }, [fetchOrders]);

  return {
    orders,
    total,
    page,
    setPage,
    limit,
    setLimit,
    search,
    setSearch,
    loading,
    error,
    refetch: fetchOrders,
  };
}
