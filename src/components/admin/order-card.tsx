"use client";

import { useDraggable } from "@dnd-kit/core";

import { Card, CardContent } from "@/components/ui/card";
import { cn } from "@/lib/utils";
import type { Order } from "@/hooks/useOrders";

function formatCurrency(value: number) {
  return new Intl.NumberFormat("pt-BR", { style: "currency", currency: "BRL" }).format(value);
}

function timeAgo(dateStr: string) {
  const diffMs = Date.now() - new Date(dateStr).getTime();
  const minutes = Math.floor(diffMs / 60000);
  if (minutes < 1) return "agora";
  if (minutes < 60) return `${minutes}min`;
  const hours = Math.floor(minutes / 60);
  if (hours < 24) return `${hours}h`;
  return `${Math.floor(hours / 24)}d`;
}

const orderTypeLabels: Record<string, string> = {
  PICKUP: "Retirada",
  DELIVERY: "Entrega",
  DINE_IN: "Local",
};

export function OrderCard({ order }: { order: Order }) {
  const { attributes, listeners, setNodeRef, transform, isDragging } = useDraggable({
    id: order.id,
  });

  const style = transform
    ? {
        transform: `translate3d(${transform.x}px, ${transform.y}px, 0)`,
        zIndex: 50,
      }
    : undefined;

  const itemCount = order.items?.reduce((sum, i) => sum + i.quantity, 0) ?? 0;

  return (
    <Card
      ref={setNodeRef}
      style={style}
      {...listeners}
      {...attributes}
      className={cn(
        "cursor-grab active:cursor-grabbing touch-none select-none",
        isDragging && "opacity-50 shadow-lg"
      )}
    >
      <CardContent className="p-3 space-y-1.5">
        <div className="flex items-center justify-between">
          <span className="font-medium text-sm">#{order.orderNumber.slice(-6)}</span>
          <span className="text-xs text-muted-foreground">{timeAgo(order.createdAt)}</span>
        </div>
        {order.customerName && (
          <p className="text-xs font-medium text-slate-700 dark:text-slate-300 truncate">
            👤 {order.customerName}
            {order.customerPhone ? ` · ${order.customerPhone}` : ""}
          </p>
        )}
        {order.orderType === "DINE_IN" && (order.table || order.comandaNumber) && (
          <p className="text-xs text-muted-foreground">
            🪑 {order.table ? `Mesa ${order.table.number}` : ""}
            {order.comandaNumber ? ` · Comanda ${order.comandaNumber}` : ""}
          </p>
        )}
        {order.orderType === "DELIVERY" && order.deliveryAddress && (
          <p className="text-xs text-muted-foreground truncate">📍 {order.deliveryAddress}</p>
        )}
        <div className="flex items-center justify-between text-sm">
          <span className="text-muted-foreground">
            {itemCount} {itemCount === 1 ? "item" : "itens"} · {orderTypeLabels[order.orderType] ?? order.orderType}
          </span>
          <span className="font-semibold text-primary">{formatCurrency(order.total)}</span>
        </div>
      </CardContent>
    </Card>
  );
}
