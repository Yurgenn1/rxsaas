"use client";

import { useEffect, useState, useCallback } from "react";
import { DollarSign, ShoppingCart, Grid3x3, Menu, AlertCircle } from "lucide-react";
import { fetchWithValidation } from "@/lib/validators";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Skeleton } from "@/components/ui/skeleton";
import { cn } from "@/lib/utils";

interface KpiData {
  receita_do_dia: number;
  pedidos_do_dia: number;
  mesas_ativas: number;
  produtos_no_cardapio: number;
  pedidos_em_andamento?: number;
}

interface RecentOrder {
  id: string;
  orderNumber: string;
  status: string;
  total: number;
  createdAt: string;
  tableId?: string;
}

interface Alert {
  id: string;
  type: "warning" | "error" | "info";
  message: string;
  createdAt: string;
}

function formatCurrency(value: number) {
  return new Intl.NumberFormat("pt-BR", { style: "currency", currency: "BRL" }).format(value);
}

function formatDate(dateString: string) {
  const date = new Date(dateString);
  return date.toLocaleTimeString("pt-BR", { hour: "2-digit", minute: "2-digit" });
}

interface KpiCardProps {
  title: string;
  value: string | number;
  icon: React.ReactNode;
  color: "green" | "blue" | "purple" | "gray";
}

function KpiCardComponent({ title, value, icon, color }: KpiCardProps) {
  const colorClasses = {
    green: "bg-green-50 text-green-600 dark:bg-green-950/20 dark:text-green-400",
    blue: "bg-blue-50 text-blue-600 dark:bg-blue-950/20 dark:text-blue-400",
    purple: "bg-purple-50 text-purple-600 dark:bg-purple-950/20 dark:text-purple-400",
    gray: "bg-gray-50 text-gray-600 dark:bg-gray-950/20 dark:text-gray-400",
  };

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-sm font-medium text-muted-foreground">{title}</CardTitle>
        <div className={cn("flex size-8 items-center justify-center rounded-lg", colorClasses[color])}>
          {icon}
        </div>
      </CardHeader>
      <CardContent>
        <div className="text-2xl font-bold">{value}</div>
        <p className="text-xs text-muted-foreground mt-1">Hoje</p>
      </CardContent>
    </Card>
  );
}

function KpiSkeleton() {
  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <Skeleton className="h-4 w-24" />
        <Skeleton className="h-8 w-8 rounded-lg" />
      </CardHeader>
      <CardContent>
        <Skeleton className="h-8 w-16 mb-2" />
        <Skeleton className="h-3 w-12" />
      </CardContent>
    </Card>
  );
}

function TableSkeleton() {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Últimos Pedidos</CardTitle>
        <CardDescription>5 pedidos mais recentes</CardDescription>
      </CardHeader>
      <CardContent>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Pedido</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Total</TableHead>
              <TableHead>Hora</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {[...Array(5)].map((_, i) => (
              <TableRow key={i}>
                <TableCell>
                  <Skeleton className="h-4 w-20" />
                </TableCell>
                <TableCell>
                  <Skeleton className="h-6 w-20" />
                </TableCell>
                <TableCell>
                  <Skeleton className="h-4 w-16" />
                </TableCell>
                <TableCell>
                  <Skeleton className="h-4 w-12" />
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  );
}

const statusColors: Record<string, "default" | "primary" | "secondary" | "success" | "warning" | "error" | "info"> = {
  PENDING: "warning",
  CONFIRMED: "info",
  PREPARING: "warning",
  READY: "success",
  COMPLETED: "success",
  CANCELLED: "error",
};

const statusLabels: Record<string, string> = {
  PENDING: "Pendente",
  CONFIRMED: "Confirmado",
  PREPARING: "Preparando",
  READY: "Pronto",
  COMPLETED: "Completo",
  CANCELLED: "Cancelado",
};

export default function AdminDashboardPage() {
  const [kpis, setKpis] = useState<KpiData | null>(null);
  const [recentOrders, setRecentOrders] = useState<RecentOrder[]>([]);
  const [alerts, setAlerts] = useState<Alert[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchDashboardData = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      // Fetch KPIs
      const kpisResult = await fetchWithValidation("/api/dashboard/kpis");
      setKpis(kpisResult.data);

      // Fetch recent orders
      const ordersResult = await fetchWithValidation("/api/orders?limit=5");
      if (ordersResult.success && ordersResult.data) {
        setRecentOrders(
          (ordersResult.data.orders || []).slice(0, 5).map((order: any) => ({
            id: order.id,
            orderNumber: order.orderNumber,
            status: order.status,
            total: order.total,
            createdAt: order.createdAt,
            tableId: order.tableId,
          }))
        );
      }

      // Generate alerts based on KPIs
      const newAlerts: Alert[] = [];
      if (kpisResult.data.pedidos_em_andamento > 5) {
        newAlerts.push({
          id: "orders_backlog",
          type: "warning",
          message: `Você tem ${kpisResult.data.pedidos_em_andamento} pedidos em andamento`,
          createdAt: new Date().toISOString(),
        });
      }
      if (kpisResult.data.mesas_ativas === 0) {
        newAlerts.push({
          id: "no_active_tables",
          type: "info",
          message: "Nenhuma mesa ativa no momento",
          createdAt: new Date().toISOString(),
        });
      }
      setAlerts(newAlerts);
    } catch (err) {
      const message = err instanceof Error ? err.message : "Erro ao carregar dashboard";
      setError(message);
      console.error("🚨 [AdminDashboardPage]", message);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchDashboardData();
    // Refetch every 30 seconds
    const interval = setInterval(fetchDashboardData, 30000);
    return () => clearInterval(interval);
  }, [fetchDashboardData]);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold">Dashboard</h1>
        <p className="text-muted-foreground text-sm">Visão geral do seu restaurante em tempo real</p>
      </div>

      {/* Error Alert */}
      {error && (
        <div className="rounded-lg border border-destructive/30 bg-destructive/5 p-4 text-destructive text-sm">
          <div className="flex items-center gap-2">
            <AlertCircle className="h-4 w-4" />
            <span>{error}</span>
          </div>
        </div>
      )}

      {/* KPI Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {loading ? (
          <>
            <KpiSkeleton />
            <KpiSkeleton />
            <KpiSkeleton />
            <KpiSkeleton />
          </>
        ) : kpis ? (
          <>
            <KpiCardComponent
              title="Receita do Dia"
              value={formatCurrency(kpis.receita_do_dia)}
              icon={<DollarSign className="h-4 w-4" />}
              color="green"
            />
            <KpiCardComponent
              title="Pedidos do Dia"
              value={kpis.pedidos_do_dia}
              icon={<ShoppingCart className="h-4 w-4" />}
              color="blue"
            />
            <KpiCardComponent
              title="Mesas Ativas"
              value={kpis.mesas_ativas}
              icon={<Grid3x3 className="h-4 w-4" />}
              color="purple"
            />
            <KpiCardComponent
              title="Produtos no Cardápio"
              value={kpis.produtos_no_cardapio}
              icon={<Menu className="h-4 w-4" />}
              color="gray"
            />
          </>
        ) : null}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Recent Orders */}
        <div className="lg:col-span-2">
          {loading ? (
            <TableSkeleton />
          ) : (
            <Card>
              <CardHeader>
                <CardTitle>Últimos Pedidos</CardTitle>
                <CardDescription>5 pedidos mais recentes</CardDescription>
              </CardHeader>
              <CardContent>
                {recentOrders.length === 0 ? (
                  <div className="text-center py-8 text-muted-foreground">
                    <p>Nenhum pedido recente</p>
                  </div>
                ) : (
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Pedido</TableHead>
                        <TableHead>Status</TableHead>
                        <TableHead>Total</TableHead>
                        <TableHead>Hora</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {recentOrders.map((order) => (
                        <TableRow key={order.id}>
                          <TableCell className="font-medium">{order.orderNumber}</TableCell>
                          <TableCell>
                            <Badge variant={statusColors[order.status] || "default"}>
                              {statusLabels[order.status] || order.status}
                            </Badge>
                          </TableCell>
                          <TableCell>{formatCurrency(order.total)}</TableCell>
                          <TableCell className="text-muted-foreground">
                            {formatDate(order.createdAt)}
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                )}
              </CardContent>
            </Card>
          )}
        </div>

        {/* Alerts */}
        <div>
          <Card>
            <CardHeader>
              <CardTitle>Alertas</CardTitle>
              <CardDescription>
                {alerts.length === 0 ? "Nenhum alerta" : `${alerts.length} alerta${alerts.length > 1 ? "s" : ""}`}
              </CardDescription>
            </CardHeader>
            <CardContent>
              {alerts.length === 0 ? (
                <div className="text-center py-8 text-muted-foreground">
                  <p className="text-sm">Tudo funcionando bem!</p>
                </div>
              ) : (
                <div className="space-y-3">
                  {alerts.map((alert) => (
                    <div
                      key={alert.id}
                      className="flex items-start gap-3 p-3 rounded-lg bg-muted/50 border border-muted"
                    >
                      <AlertCircle className="h-4 w-4 mt-0.5 flex-shrink-0 text-yellow-600 dark:text-yellow-400" />
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium text-foreground">{alert.message}</p>
                        <p className="text-xs text-muted-foreground mt-1">
                          {formatDate(alert.createdAt)}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
