"use client";

import { useEffect, useState } from "react";
import { DndContext, type DragEndEvent } from "@dnd-kit/core";

import { useOrders, type Order, type OrderStatus } from "@/hooks/useOrders";
import { KanbanColumn } from "@/components/admin/kanban-column";
import { Input } from "@/components/ui/input";

const COLUMNS: { status: OrderStatus; title: string; colorClass: string }[] = [
  { status: "PENDING", title: "Pendente", colorClass: "bg-amber-500" },
  { status: "CONFIRMED", title: "Confirmado", colorClass: "bg-blue-500" },
  { status: "PREPARING", title: "Preparando", colorClass: "bg-orange-500" },
  { status: "READY", title: "Pronto", colorClass: "bg-primary" },
  { status: "COMPLETED", title: "Completo", colorClass: "bg-emerald-500" },
];

export default function OrdersPage() {
  const { orders, setLimit, loading, error, refetch } = useOrders();
  const [localOrders, setLocalOrders] = useState<Order[]>([]);
  const [search, setSearch] = useState("");

  useEffect(() => {
    setLimit(100);
  }, [setLimit]);

  useEffect(() => {
    setLocalOrders(orders);
  }, [orders]);

  const filtered = localOrders.filter(
    (o) =>
      o.status !== "CANCELLED" &&
      (search === "" || o.orderNumber.toLowerCase().includes(search.toLowerCase()))
  );

  async function handleDragEnd(event: DragEndEvent) {
    const { active, over } = event;
    if (!over) return;

    const orderId = active.id as string;
    const newStatus = over.id as OrderStatus;
    const order = localOrders.find((o) => o.id === orderId);
    if (!order || order.status === newStatus) return;

    setLocalOrders((prev) =>
      prev.map((o) => (o.id === orderId ? { ...o, status: newStatus } : o))
    );

    try {
      const response = await fetch(`/api/orders/${orderId}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status: newStatus }),
      });
      const result = await response.json();
      if (!result.success) throw new Error(result.error);
    } catch (err) {
      console.error("🚨 [OrdersPage] Failed to update status:", err);
      refetch();
    }
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">Pedidos</h1>
          <p className="text-muted-foreground text-sm">
            Arraste os cards para atualizar o status
          </p>
        </div>
        <Input
          placeholder="Buscar por número..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="max-w-xs"
        />
      </div>

      {error && (
        <div className="rounded-lg border border-destructive/30 bg-destructive/5 p-4 text-destructive text-sm">
          ❌ {error}
        </div>
      )}

      {loading && localOrders.length === 0 ? (
        <p className="text-muted-foreground">⏳ Carregando pedidos...</p>
      ) : (
        <DndContext onDragEnd={handleDragEnd}>
          <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-5 gap-3">
            {COLUMNS.map((col) => (
              <KanbanColumn
                key={col.status}
                status={col.status}
                title={col.title}
                colorClass={col.colorClass}
                orders={filtered.filter((o) => o.status === col.status)}
              />
            ))}
          </div>
        </DndContext>
      )}
    </div>
  );
}
