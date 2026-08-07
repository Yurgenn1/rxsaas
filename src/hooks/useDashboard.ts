"use client";

import { useEffect, useState, useCallback } from "react";
import { fetchWithValidation } from "@/lib/validators";

interface KpiValue {
  value: number;
  trendPct: number | null;
}

interface DashboardData {
  kpis: {
    pedidosHoje: KpiValue;
    faturamentoHoje: KpiValue;
    pedidosEmAndamento: KpiValue;
    clientesRecorrentes: KpiValue;
  };
  chart: { date: string; revenue: number; orders: number }[];
  topProducts: { productId: string; name: string; quantity: number }[];
}

export function useDashboard() {
  const [data, setData] = useState<DashboardData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchDashboard = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const result = await fetchWithValidation("/api/dashboard");
      setData(result.data);
    } catch (err) {
      const message = err instanceof Error ? err.message : "Error fetching dashboard";
      setError(message);
      console.error("🚨 [useDashboard]", message);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchDashboard();
  }, [fetchDashboard]);

  return { data, loading, error, refetch: fetchDashboard };
}
