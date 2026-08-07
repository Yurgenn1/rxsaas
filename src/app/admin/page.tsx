"use client";

import { ClipboardList, DollarSign, Repeat, Clock } from "lucide-react";

import { useDashboard } from "@/hooks/useDashboard";
import { KpiCard } from "@/components/admin/kpi-card";
import { OrdersChart } from "@/components/admin/orders-chart";
import { TopProducts } from "@/components/admin/top-products";

function formatCurrency(value: number) {
  return new Intl.NumberFormat("pt-BR", { style: "currency", currency: "BRL" }).format(value);
}

export default function AdminDashboardPage() {
  const { data, loading, error } = useDashboard();

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <p className="text-muted-foreground">⏳ Carregando dashboard...</p>
      </div>
    );
  }

  if (error || !data) {
    return (
      <div className="rounded-lg border border-destructive/30 bg-destructive/5 p-6 text-destructive">
        ❌ {error || "Erro ao carregar dashboard"}
      </div>
    );
  }

  const { kpis, chart, topProducts } = data;

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold">Dashboard</h1>
        <p className="text-muted-foreground text-sm">
          Visão geral do seu restaurante em tempo real
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <KpiCard
          title="Pedidos Hoje"
          value={String(kpis.pedidosHoje.value)}
          trendPct={kpis.pedidosHoje.trendPct}
          icon={ClipboardList}
        />
        <KpiCard
          title="Faturamento Hoje"
          value={formatCurrency(kpis.faturamentoHoje.value)}
          trendPct={kpis.faturamentoHoje.trendPct}
          icon={DollarSign}
        />
        <KpiCard
          title="Pedidos em Andamento"
          value={String(kpis.pedidosEmAndamento.value)}
          trendPct={kpis.pedidosEmAndamento.trendPct}
          icon={Clock}
        />
        <KpiCard
          title="Clientes Recorrentes"
          value={String(kpis.clientesRecorrentes.value)}
          trendPct={kpis.clientesRecorrentes.trendPct}
          icon={Repeat}
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        <div className="lg:col-span-2">
          <OrdersChart data={chart} />
        </div>
        <TopProducts data={topProducts} />
      </div>
    </div>
  );
}
