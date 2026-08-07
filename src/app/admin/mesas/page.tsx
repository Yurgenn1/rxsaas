"use client";

import React, { useEffect, useState, useCallback, useMemo } from "react";
import {
  Plus,
  AlertCircle,
  Loader2,
  XCircle,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Modal, ModalContent, ModalHeader, ModalTitle, ModalDescription, ModalBody, ModalFooter, ModalClose } from "@/components/ui/modal";
import { Skeleton } from "@/components/ui/skeleton";

interface TableData {
  id: string;
  number: number;
  capacity: number;
  status: "Livre" | "Ocupada";
  totalAmount?: number;
  createdAt: string;
  updatedAt: string;
}

interface ApiResponse {
  data: TableData[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

function formatCurrency(value: number) {
  return new Intl.NumberFormat("pt-BR", {
    style: "currency",
    currency: "BRL",
  }).format(value);
}

function TableCardSkeleton() {
  return (
    <Card className="h-48">
      <CardContent className="p-4 space-y-4">
        <Skeleton className="h-12 w-16" />
        <Skeleton className="h-4 w-20" />
        <Skeleton className="h-6 w-24" />
        <Skeleton className="h-9 w-full" />
      </CardContent>
    </Card>
  );
}

function TableCard({
  table,
  onCloseClick,
}: {
  table: TableData;
  onCloseClick: (table: TableData) => void;
}) {
  const isOccupied = table.status === "Ocupada";
  const statusColor = isOccupied ? "warning" : "success";

  return (
    <Card className="hover:shadow-lg transition-shadow h-full">
      <CardContent className="p-6 flex flex-col h-full">
        <div className="flex-1">
          <div className="text-4xl font-bold text-foreground mb-2">
            Mesa {table.number}
          </div>
          <div className="text-sm text-muted-foreground mb-4">
            Capacidade: {table.capacity} pessoas
          </div>
          <div className="mb-4">
            <Badge variant={statusColor}>
              {table.status}
            </Badge>
          </div>
          {isOccupied && table.totalAmount && (
            <div className="mb-4 p-3 bg-muted rounded-lg">
              <p className="text-xs text-muted-foreground mb-1">Total</p>
              <p className="text-lg font-semibold text-foreground">
                {formatCurrency(table.totalAmount)}
              </p>
            </div>
          )}
        </div>
        {isOccupied && (
          <Button
            variant="danger"
            size="sm"
            onClick={() => onCloseClick(table)}
            className="w-full"
          >
            Fechar Conta
          </Button>
        )}
      </CardContent>
    </Card>
  );
}

export default function MesasPage() {
  const [tables, setTables] = useState<TableData[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isCloseModalOpen, setIsCloseModalOpen] = useState(false);
  const [selectedTable, setSelectedTable] = useState<TableData | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const [formData, setFormData] = useState({
    number: "",
    capacity: "",
  });

  const fetchTables = useCallback(async (pageNumber: number) => {
    try {
      setLoading(true);
      setError(null);
      const response = await fetch(
        `/api/mesas?page=${pageNumber}&limit=20`,
        {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
          },
        }
      );

      if (!response.ok) {
        throw new Error("Falha ao carregar mesas");
      }

      const data: ApiResponse = await response.json();
      setTables(data.data);
      setPage(data.page);
      setTotalPages(data.totalPages);
    } catch (err) {
      const message = err instanceof Error ? err.message : "Erro desconhecido";
      setError(message);
      setTables([]);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchTables(1);
  }, [fetchTables]);

  const handleCreateTable = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      const response = await fetch("/api/mesas", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          number: parseInt(formData.number),
          capacity: parseInt(formData.capacity),
        }),
      });

      if (!response.ok) {
        throw new Error("Falha ao criar mesa");
      }

      setIsModalOpen(false);
      setFormData({ number: "", capacity: "" });
      await fetchTables(page);
    } catch (err) {
      const message = err instanceof Error ? err.message : "Erro desconhecido";
      setError(message);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleCloseTable = async () => {
    if (!selectedTable) return;

    setIsSubmitting(true);
    try {
      const response = await fetch(`/api/mesas/${selectedTable.id}/close`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
      });

      if (!response.ok) {
        throw new Error("Falha ao fechar mesa");
      }

      setIsCloseModalOpen(false);
      setSelectedTable(null);
      await fetchTables(page);
    } catch (err) {
      const message = err instanceof Error ? err.message : "Erro desconhecido";
      setError(message);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handlePageChange = (newPage: number) => {
    if (newPage > 0 && newPage <= totalPages) {
      fetchTables(newPage);
    }
  };

  const handleFormChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const isFormValid = formData.number && formData.capacity;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-3xl font-bold text-foreground">Mesas</h1>
          <p className="text-muted-foreground mt-1">
            Gerenciar mesas do estabelecimento
          </p>
        </div>
        <Button
          variant="primary"
          onClick={() => setIsModalOpen(true)}
          className="gap-2"
        >
          <Plus className="h-4 w-4" />
          Abrir Nova Mesa
        </Button>
      </div>

      {/* Error Alert */}
      {error && (
        <Card className="border-error bg-error/5">
          <CardContent className="p-4 flex items-start gap-3">
            <AlertCircle className="h-5 w-5 text-error flex-shrink-0 mt-0.5" />
            <div className="flex-1">
              <p className="font-medium text-error">Erro</p>
              <p className="text-sm text-error/80">{error}</p>
            </div>
            <button
              onClick={() => setError(null)}
              className="text-error hover:text-error/80"
            >
              <XCircle className="h-4 w-4" />
            </button>
          </CardContent>
        </Card>
      )}

      {/* Loading State */}
      {loading ? (
        <div className="grid grid-cols-2 gap-4 md:grid-cols-3 lg:grid-cols-4">
          {Array.from({ length: 8 }).map((_, i) => (
            <TableCardSkeleton key={i} />
          ))}
        </div>
      ) : (
        <>
          {/* Tables Grid */}
          {tables.length > 0 ? (
            <div className="grid grid-cols-2 gap-4 md:grid-cols-3 lg:grid-cols-4">
              {tables.map((table) => (
                <TableCard
                  key={table.id}
                  table={table}
                  onCloseClick={(t) => {
                    setSelectedTable(t);
                    setIsCloseModalOpen(true);
                  }}
                />
              ))}
            </div>
          ) : (
            <Card className="border-dashed">
              <CardContent className="p-12 text-center">
                <div className="flex justify-center mb-4">
                  <AlertCircle className="h-12 w-12 text-muted-foreground" />
                </div>
                <p className="text-lg font-medium text-foreground mb-2">
                  Nenhuma mesa encontrada
                </p>
                <p className="text-sm text-muted-foreground mb-4">
                  Comece criando uma nova mesa
                </p>
                <Button
                  variant="primary"
                  onClick={() => setIsModalOpen(true)}
                  className="gap-2"
                >
                  <Plus className="h-4 w-4" />
                  Criar Primeira Mesa
                </Button>
              </CardContent>
            </Card>
          )}

          {/* Pagination */}
          {totalPages > 1 && (
            <div className="flex items-center justify-center gap-2">
              <Button
                variant="outline"
                size="sm"
                onClick={() => handlePageChange(page - 1)}
                disabled={page === 1}
              >
                <ChevronLeft className="h-4 w-4" />
              </Button>
              <div className="text-sm text-muted-foreground px-4">
                Página {page} de {totalPages}
              </div>
              <Button
                variant="outline"
                size="sm"
                onClick={() => handlePageChange(page + 1)}
                disabled={page === totalPages}
              >
                <ChevronRight className="h-4 w-4" />
              </Button>
            </div>
          )}
        </>
      )}

      {/* Create Table Modal */}
      <Modal open={isModalOpen} onOpenChange={setIsModalOpen}>
        <ModalContent>
          <ModalHeader>
            <ModalTitle>Abrir Nova Mesa</ModalTitle>
            <ModalDescription>
              Preencha os dados da nova mesa do estabelecimento
            </ModalDescription>
          </ModalHeader>
          <form onSubmit={handleCreateTable}>
            <ModalBody className="space-y-4">
              <div className="space-y-2">
                <label className="block text-sm font-medium text-foreground">
                  Número da Mesa *
                </label>
                <Input
                  type="number"
                  name="number"
                  placeholder="Ex: 1, 2, 3..."
                  value={formData.number}
                  onChange={handleFormChange}
                  required
                  min="1"
                  autoFocus
                />
              </div>
              <div className="space-y-2">
                <label className="block text-sm font-medium text-foreground">
                  Capacidade (pessoas) *
                </label>
                <Input
                  type="number"
                  name="capacity"
                  placeholder="Ex: 2, 4, 6..."
                  value={formData.capacity}
                  onChange={handleFormChange}
                  required
                  min="1"
                />
              </div>
            </ModalBody>
            <ModalFooter className="gap-2">
              <Button variant="outline" onClick={() => setIsModalOpen(false)}>Cancelar</Button>
              <Button
                type="submit"
                variant="primary"
                disabled={!isFormValid || isSubmitting}
              >
                {isSubmitting && (
                  <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                )}
                {isSubmitting ? "Criando..." : "Criar Mesa"}
              </Button>
            </ModalFooter>
          </form>
        </ModalContent>
      </Modal>

      {/* Close Table Modal */}
      <Modal
        open={isCloseModalOpen}
        onOpenChange={setIsCloseModalOpen}
      >
        <ModalContent>
          <ModalHeader>
            <ModalTitle>Fechar Mesa</ModalTitle>
            <ModalDescription>
              Tem certeza que deseja fechar a conta desta mesa?
            </ModalDescription>
          </ModalHeader>
          {selectedTable && (
            <ModalBody className="space-y-4">
              <div className="p-4 bg-muted rounded-lg">
                <p className="text-sm text-muted-foreground mb-1">Mesa</p>
                <p className="text-2xl font-bold text-foreground mb-4">
                  Mesa {selectedTable.number}
                </p>
                {selectedTable.totalAmount && (
                  <>
                    <p className="text-sm text-muted-foreground mb-1">
                      Total da Conta
                    </p>
                    <p className="text-2xl font-bold text-foreground">
                      {formatCurrency(selectedTable.totalAmount)}
                    </p>
                  </>
                )}
              </div>
            </ModalBody>
          )}
          <ModalFooter className="gap-2">
            <Button variant="outline" onClick={() => setIsCloseModalOpen(false)}>Cancelar</Button>
            <Button
              variant="danger"
              onClick={handleCloseTable}
              disabled={isSubmitting}
            >
              {isSubmitting && (
                <Loader2 className="h-4 w-4 mr-2 animate-spin" />
              )}
              {isSubmitting ? "Fechando..." : "Fechar Conta"}
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </div>
  );
}
