"use client";

import { useDroppable } from "@dnd-kit/core";

import { cn } from "@/lib/utils";
import { OrderCard } from "@/components/admin/order-card";
import type { Order, OrderStatus } from "@/hooks/useOrders";

interface KanbanColumnProps {
  status: OrderStatus;
  title: string;
  colorClass: string;
  orders: Order[];
}

export function KanbanColumn({ status, title, colorClass, orders }: KanbanColumnProps) {
  const { setNodeRef, isOver } = useDroppable({ id: status });

  return (
    <div
      ref={setNodeRef}
      className={cn(
        "flex flex-col gap-2 rounded-lg border border-border bg-muted/30 p-3 min-h-[200px] transition-colors",
        isOver && "bg-primary/5 border-primary/40"
      )}
    >
      <div className="flex items-center gap-2 px-1">
        <span className={cn("size-2 rounded-full", colorClass)} />
        <h3 className="text-sm font-semibold">{title}</h3>
        <span className="text-xs text-muted-foreground ml-auto">{orders.length}</span>
      </div>
      <div className="flex flex-col gap-2">
        {orders.length === 0 ? (
          <p className="text-xs text-muted-foreground text-center py-6">Vazio</p>
        ) : (
          orders.map((order) => <OrderCard key={order.id} order={order} />)
        )}
      </div>
    </div>
  );
}
