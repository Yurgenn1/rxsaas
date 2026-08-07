"use client";

import { useEffect, useState } from "react";
import { useOrders, type Order, type OrderStatus } from "@/hooks/useOrders";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Modal,
  ModalContent,
  ModalHeader,
  ModalTitle,
  ModalBody,
  ModalFooter,
  ModalClose,
} from "@/components/ui/modal";
import { Eye, Trash2 } from "lucide-react";

const STATUS_LABELS: Record<OrderStatus, string> = {
  PENDING: "Pendente",
  CONFIRMED: "Confirmado",
  PREPARING: "Preparando",
  READY: "Pronto",
  COMPLETED: "Completo",
  CANCELLED: "Cancelado",
};

const STATUS_COLORS: Record<OrderStatus, string> = {
  PENDING: "bg-amber-500",
  CONFIRMED: "bg-blue-500",
  PREPARING: "bg-orange-500",
  READY: "bg-primary",
  COMPLETED: "bg-emerald-500",
  CANCELLED: "bg-destructive",
};

function formatCurrency(value: number) {
  return new Intl.NumberFormat("pt-BR", {
    style: "currency",
    currency: "BRL",
  }).format(value);
}

export default function DeliveryPage() {
  const [statusFilter, setStatusFilter] = useState<string | undefined>();
  const { orders, setLimit, loading, error, refetch } = useOrders(
    "default",
    statusFilter
  );
  const [localOrders, setLocalOrders] = useState<Order[]>([]);
  const [search, setSearch] = useState("");
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);
  const [isDetailModalOpen, setIsDetailModalOpen] = useState(false);

  useEffect(() => {
    setLimit(100);
  }, [setLimit]);

  useEffect(() => {
    setLocalOrders(
      orders.filter((o) => o.orderType === "DELIVERY" && o.status !== "CANCELLED")
    );
  }, [orders]);

  const filtered = localOrders.filter(
    (o) =>
      (search === "" ||
        o.orderNumber.toLowerCase().includes(search.toLowerCase()) ||
        (o.customerName &&
          o.customerName.toLowerCase().includes(search.toLowerCase()))) &&
      (statusFilter ? o.status === statusFilter : true)
  );

  async function handleStatusChange(
    orderId: string,
    newStatus: OrderStatus
  ) {
    const order = localOrders.find((o) => o.id === orderId);
    if (!order) return;

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
      console.error("🚨 [DeliveryPage] Failed to update status:", err);
      refetch();
    }
  }

  async function handleCancel(orderId: string) {
    if (!confirm("Deseja cancelar este pedido?")) return;

    try {
      const response = await fetch(`/api/orders/${orderId}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ action: "cancel" }),
      });
      const result = await response.json();
      if (!result.success) throw new Error(result.error);
      refetch();
    } catch (err) {
      console.error("🚨 [DeliveryPage] Failed to cancel order:", err);
      refetch();
    }
  }

  const availableStatuses: OrderStatus[] = [
    "PENDING",
    "CONFIRMED",
    "PREPARING",
    "READY",
    "COMPLETED",
  ];

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold">Pedidos - Entrega</h1>
          <p className="text-muted-foreground text-sm">
            Pedidos para entrega domiciliar
          </p>
        </div>
      </div>

      <div className="flex items-center gap-3 flex-wrap">
        <Input
          placeholder="Buscar por número ou cliente..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="max-w-xs"
        />
        <Select
          value={statusFilter || ""}
          onValueChange={(val) => setStatusFilter(val || undefined)}
        >
          <SelectTrigger className="w-40">
            <SelectValue placeholder="Filtrar por status" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="">Todos os status</SelectItem>
            {availableStatuses.map((status) => (
              <SelectItem key={status} value={status}>
                {STATUS_LABELS[status]}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {error && (
        <div className="rounded-lg border border-destructive/30 bg-destructive/5 p-4 text-destructive text-sm">
          ❌ {error}
        </div>
      )}

      {loading && localOrders.length === 0 ? (
        <p className="text-muted-foreground">⏳ Carregando pedidos...</p>
      ) : filtered.length === 0 ? (
        <p className="text-muted-foreground text-center py-8">
          Nenhum pedido encontrado
        </p>
      ) : (
        <div className="border rounded-lg overflow-hidden">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Código</TableHead>
                <TableHead>Cliente</TableHead>
                <TableHead>Endereço</TableHead>
                <TableHead>Total</TableHead>
                <TableHead>Status</TableHead>
                <TableHead className="text-right">Ações</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filtered.map((order) => (
                <TableRow key={order.id}>
                  <TableCell className="font-medium">
                    #{order.orderNumber.slice(-6)}
                  </TableCell>
                  <TableCell>
                    {order.customerName || "Cliente"}
                    {order.customerPhone && (
                      <div className="text-xs text-muted-foreground">
                        {order.customerPhone}
                      </div>
                    )}
                  </TableCell>
                  <TableCell className="max-w-xs">
                    <div className="text-sm truncate">
                      {order.deliveryAddress || "-"}
                    </div>
                  </TableCell>
                  <TableCell className="font-semibold">
                    {formatCurrency(order.total)}
                  </TableCell>
                  <TableCell>
                    <Select
                      value={order.status}
                      onValueChange={(newStatus) =>
                        handleStatusChange(order.id, newStatus as OrderStatus)
                      }
                    >
                      <SelectTrigger className="w-32">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        {availableStatuses.map((status) => (
                          <SelectItem key={status} value={status}>
                            {STATUS_LABELS[status]}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </TableCell>
                  <TableCell className="text-right">
                    <div className="flex items-center justify-end gap-2">
                      <Button
                        variant="ghost"
                        size="icon-sm"
                        onClick={() => {
                          setSelectedOrder(order);
                          setIsDetailModalOpen(true);
                        }}
                      >
                        <Eye className="size-4" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="icon-sm"
                        className="text-destructive hover:text-destructive"
                        onClick={() => handleCancel(order.id)}
                      >
                        <Trash2 className="size-4" />
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      )}

      {selectedOrder && (
        <Modal open={isDetailModalOpen} onOpenChange={setIsDetailModalOpen}>
          <ModalContent size="lg">
            <ModalHeader>
              <ModalTitle>Detalhes do Pedido #{selectedOrder.orderNumber.slice(-6)}</ModalTitle>
            </ModalHeader>
            <ModalBody className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-xs text-muted-foreground">Cliente</p>
                  <p className="font-medium">{selectedOrder.customerName || "-"}</p>
                </div>
                <div>
                  <p className="text-xs text-muted-foreground">Telefone</p>
                  <p className="font-medium">
                    {selectedOrder.customerPhone || "-"}
                  </p>
                </div>
                <div>
                  <p className="text-xs text-muted-foreground">Endereço de Entrega</p>
                  <p className="font-medium">
                    {selectedOrder.deliveryAddress || "-"}
                  </p>
                </div>
                <div>
                  <p className="text-xs text-muted-foreground">Status</p>
                  <Badge variant="secondary" className="mt-1">
                    {STATUS_LABELS[selectedOrder.status]}
                  </Badge>
                </div>
              </div>

              <div className="border-t pt-4">
                <p className="text-xs text-muted-foreground font-semibold mb-2">
                  Itens
                </p>
                <div className="space-y-2">
                  {selectedOrder.items && selectedOrder.items.length > 0 ? (
                    selectedOrder.items.map((item) => (
                      <div
                        key={item.id}
                        className="flex items-center justify-between text-sm"
                      >
                        <span>
                          {item.product?.name || "Item"} x{item.quantity}
                        </span>
                        <span>
                          {formatCurrency(
                            item.unitPrice * item.quantity
                          )}
                        </span>
                      </div>
                    ))
                  ) : (
                    <p className="text-muted-foreground text-sm">
                      Sem itens
                    </p>
                  )}
                </div>
              </div>

              <div className="border-t pt-4 space-y-2">
                <div className="flex items-center justify-between text-sm">
                  <span>Subtotal</span>
                  <span>{formatCurrency(selectedOrder.subtotal)}</span>
                </div>
                {selectedOrder.tax > 0 && (
                  <div className="flex items-center justify-between text-sm">
                    <span>Taxa</span>
                    <span>{formatCurrency(selectedOrder.tax)}</span>
                  </div>
                )}
                {selectedOrder.discount > 0 && (
                  <div className="flex items-center justify-between text-sm text-emerald-600">
                    <span>Desconto</span>
                    <span>-{formatCurrency(selectedOrder.discount)}</span>
                  </div>
                )}
                {selectedOrder.tip > 0 && (
                  <div className="flex items-center justify-between text-sm">
                    <span>Gorjeta</span>
                    <span>{formatCurrency(selectedOrder.tip)}</span>
                  </div>
                )}
                <div className="flex items-center justify-between text-sm font-semibold border-t pt-2">
                  <span>Total</span>
                  <span>{formatCurrency(selectedOrder.total)}</span>
                </div>
              </div>

              {selectedOrder.notes && (
                <div className="border-t pt-4">
                  <p className="text-xs text-muted-foreground font-semibold mb-1">
                    Observações
                  </p>
                  <p className="text-sm">{selectedOrder.notes}</p>
                </div>
              )}
            </ModalBody>
            <ModalFooter>
              <ModalClose render={<Button variant="outline">Fechar</Button>} />
            </ModalFooter>
          </ModalContent>
        </Modal>
      )}
    </div>
  );
}
