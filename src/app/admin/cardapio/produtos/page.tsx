"use client";

import { useState, useRef } from "react";
import { Plus, Trash2, Edit2, ChevronLeft, ChevronRight } from "lucide-react";
import { useCardapio, type CardapioCreatePayload } from "@/hooks/useCardapio";
import { useCategories } from "@/hooks/useCategories";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Card, CardContent } from "@/components/ui/card";
import {
  Modal,
  ModalClose,
  ModalContent,
  ModalHeader,
  ModalTitle,
  ModalBody,
  ModalFooter,
} from "@/components/ui/modal";

function formatCurrency(value: number) {
  return new Intl.NumberFormat("pt-BR", {
    style: "currency",
    currency: "BRL",
  }).format(value);
}

interface ProductFormData {
  nome: string;
  descricao: string;
  precoCusto: string;
  precoVenda: string;
  categoriaId: string;
  imagem?: string;
  disponivel: boolean;
}

interface FormErrors {
  nome?: string;
  precoCusto?: string;
  precoVenda?: string;
  categoriaId?: string;
}

export default function CardapioProdutosPage() {
  const {
    produtos,
    total,
    page,
    setPage,
    limit,
    search,
    setSearch,
    categoriaFilter,
    setCategoriaFilter,
    loading,
    createProduto,
    updateProduto,
    deleteProduto,
  } = useCardapio();

  const { categories } = useCategories();
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Modal states
  const [openCreateModal, setOpenCreateModal] = useState(false);
  const [openEditModal, setOpenEditModal] = useState(false);
  const [openDeleteModal, setOpenDeleteModal] = useState(false);

  // Form state
  const [editingProduct, setEditingProduct] = useState<string | null>(null);
  const [productToDelete, setProductToDelete] = useState<string | null>(null);
  const [formData, setFormData] = useState<ProductFormData>({
    nome: "",
    descricao: "",
    precoCusto: "",
    precoVenda: "",
    categoriaId: categories?.[0]?.id || "",
    disponivel: true,
  });

  const [formErrors, setFormErrors] = useState<FormErrors>({});
  const [submitLoading, setSubmitLoading] = useState(false);

  // Form validation
  const validateForm = (): boolean => {
    const errors: FormErrors = {};

    if (!formData.nome.trim()) {
      errors.nome = "Nome é obrigatório";
    }

    const precoCusto = parseFloat(formData.precoCusto);
    if (!formData.precoCusto || isNaN(precoCusto) || precoCusto < 0) {
      errors.precoCusto = "Preço de custo válido é obrigatório";
    }

    const precoVenda = parseFloat(formData.precoVenda);
    if (!formData.precoVenda || isNaN(precoVenda) || precoVenda < 0) {
      errors.precoVenda = "Preço de venda válido é obrigatório";
    }

    if (!formData.categoriaId) {
      errors.categoriaId = "Categoria é obrigatória";
    }

    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  // Reset form
  const resetForm = () => {
    setFormData({
      nome: "",
      descricao: "",
      precoCusto: "",
      precoVenda: "",
      categoriaId: "",
      disponivel: true,
    });
    setFormErrors({});
    setEditingProduct(null);
  };

  // Handle create/edit submit
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    setSubmitLoading(true);

    try {
      const payload: CardapioCreatePayload = {
        nome: formData.nome,
        descricao: formData.descricao,
        precoCusto: parseFloat(formData.precoCusto),
        precoVenda: parseFloat(formData.precoVenda),
        categoriaId: formData.categoriaId,
        imagem: formData.imagem,
      };

      if (editingProduct) {
        await updateProduto(editingProduct, payload);
      } else {
        await createProduto(payload);
      }

      resetForm();
      setOpenCreateModal(false);
      setOpenEditModal(false);
    } catch (error) {
      console.error("Error saving product:", error);
    } finally {
      setSubmitLoading(false);
    }
  };

  // Handle delete
  const handleDelete = async () => {
    if (!productToDelete) return;

    setSubmitLoading(true);
    try {
      await deleteProduto(productToDelete);
      setProductToDelete(null);
      setOpenDeleteModal(false);
    } catch (error) {
      console.error("Error deleting product:", error);
    } finally {
      setSubmitLoading(false);
    }
  };

  // Handle edit click
  const handleEditClick = (product: any) => {
    setEditingProduct(product.id);
    setFormData({
      nome: product.nome,
      descricao: product.descricao || "",
      precoCusto: product.precoCusto.toString(),
      precoVenda: product.precoVenda.toString(),
      categoriaId: product.categoriaId,
      imagem: product.imagem,
      disponivel: product.disponivel,
    });
    setOpenEditModal(true);
  };

  // Handle delete click
  const handleDeleteClick = (id: string) => {
    setProductToDelete(id);
    setOpenDeleteModal(true);
  };

  // Handle image upload
  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setFormData((prev) => ({
          ...prev,
          imagem: reader.result as string,
        }));
      };
      reader.readAsDataURL(file);
    }
  };

  const totalPages = Math.ceil(total / limit);
  const startIndex = (page - 1) * limit + 1;
  const endIndex = Math.min(page * limit, total);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">Produtos do Cardápio</h1>
          <p className="text-muted-foreground text-sm">
            Gerencie os itens do seu cardápio ({total} no total)
          </p>
        </div>
        <Modal open={openCreateModal} onOpenChange={setOpenCreateModal}>
          <Button
            render={<div onClick={() => setOpenCreateModal(true)} />}
            nativeButton={false}
          >
            <Plus className="w-4 h-4" />
            Cadastrar Produto
          </Button>

          <ModalContent size="lg">
            <ModalHeader>
              <ModalTitle>Novo Produto</ModalTitle>
            </ModalHeader>

            <form onSubmit={handleSubmit} className="space-y-4">
              <ModalBody className="space-y-4">
                {/* Nome */}
                <div>
                  <label className="block text-sm font-medium mb-1">
                    Nome <span className="text-error">*</span>
                  </label>
                  <Input
                    placeholder="Ex: Hambúrguer Clássico"
                    value={formData.nome}
                    onChange={(e) =>
                      setFormData((prev) => ({ ...prev, nome: e.target.value }))
                    }
                    className={formErrors.nome ? "border-error" : ""}
                  />
                  {formErrors.nome && (
                    <p className="text-xs text-error mt-1">{formErrors.nome}</p>
                  )}
                </div>

                {/* Descrição */}
                <div>
                  <label className="block text-sm font-medium mb-1">
                    Descrição
                  </label>
                  <textarea
                    placeholder="Descrição do produto"
                    value={formData.descricao}
                    onChange={(e) =>
                      setFormData((prev) => ({
                        ...prev,
                        descricao: e.target.value,
                      }))
                    }
                    className="w-full px-3 py-2 border border-border rounded-md text-sm bg-background"
                    rows={3}
                  />
                </div>

                {/* Categoria */}
                <div>
                  <label className="block text-sm font-medium mb-1">
                    Categoria <span className="text-error">*</span>
                  </label>
                  <Select
                    value={formData.categoriaId}
                    onValueChange={(value) =>
                      setFormData((prev) => ({
                        ...prev,
                        categoriaId: value || "",
                      }))
                    }
                  >
                    <SelectTrigger
                      className={formErrors.categoriaId ? "border-error" : ""}
                    >
                      <SelectValue placeholder="Selecione uma categoria" />
                    </SelectTrigger>
                    <SelectContent>
                      {categories.map((cat) => (
                        <SelectItem key={cat.id} value={cat.id}>
                          {cat.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  {formErrors.categoriaId && (
                    <p className="text-xs text-error mt-1">
                      {formErrors.categoriaId}
                    </p>
                  )}
                </div>

                {/* Preço Custo */}
                <div>
                  <label className="block text-sm font-medium mb-1">
                    Preço Custo <span className="text-error">*</span>
                  </label>
                  <div className="relative">
                    <span className="absolute left-3 top-2 text-sm text-muted-foreground">
                      R$
                    </span>
                    <Input
                      type="number"
                      placeholder="0.00"
                      value={formData.precoCusto}
                      onChange={(e) =>
                        setFormData((prev) => ({
                          ...prev,
                          precoCusto: e.target.value,
                        }))
                      }
                      step="0.01"
                      min="0"
                      className={`pl-8 ${
                        formErrors.precoCusto ? "border-error" : ""
                      }`}
                    />
                  </div>
                  {formErrors.precoCusto && (
                    <p className="text-xs text-error mt-1">
                      {formErrors.precoCusto}
                    </p>
                  )}
                </div>

                {/* Preço Venda */}
                <div>
                  <label className="block text-sm font-medium mb-1">
                    Preço Venda <span className="text-error">*</span>
                  </label>
                  <div className="relative">
                    <span className="absolute left-3 top-2 text-sm text-muted-foreground">
                      R$
                    </span>
                    <Input
                      type="number"
                      placeholder="0.00"
                      value={formData.precoVenda}
                      onChange={(e) =>
                        setFormData((prev) => ({
                          ...prev,
                          precoVenda: e.target.value,
                        }))
                      }
                      step="0.01"
                      min="0"
                      className={`pl-8 ${
                        formErrors.precoVenda ? "border-error" : ""
                      }`}
                    />
                  </div>
                  {formErrors.precoVenda && (
                    <p className="text-xs text-error mt-1">
                      {formErrors.precoVenda}
                    </p>
                  )}
                </div>

                {/* Imagem */}
                <div>
                  <label className="block text-sm font-medium mb-1">
                    Upload Imagem
                  </label>
                  <div className="flex gap-2">
                    <Input
                      ref={fileInputRef}
                      type="file"
                      accept="image/*"
                      onChange={handleImageUpload}
                      className="hidden"
                    />
                    <Button
                      type="button"
                      variant="outline"
                      onClick={() => fileInputRef.current?.click()}
                      className="flex-1"
                    >
                      Escolher Arquivo
                    </Button>
                    {formData.imagem && (
                      <span className="text-sm text-muted-foreground py-2">
                        Arquivo selecionado
                      </span>
                    )}
                  </div>
                </div>
              </ModalBody>

              <ModalFooter>
                <ModalClose
                  render={
                    <Button
                      variant="outline"
                      onClick={() => {
                        resetForm();
                        setOpenCreateModal(false);
                      }}
                    />
                  }
                >
                  Cancelar
                </ModalClose>
                <Button
                  variant="primary"
                  type="submit"
                  disabled={submitLoading}
                >
                  {submitLoading ? "Salvando..." : "Cadastrar"}
                </Button>
              </ModalFooter>
            </form>
          </ModalContent>
        </Modal>
      </div>

      {/* Search and Filters */}
      <div className="flex gap-3 flex-wrap">
        <Input
          placeholder="Buscar produtos por nome..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="max-w-sm"
        />
        <Select
          value={categoriaFilter}
          onValueChange={(value) => setCategoriaFilter(value ?? "")}
        >
          <SelectTrigger className="w-48">
            <SelectValue placeholder="Filtrar por categoria" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="">Todas as categorias</SelectItem>
            {categories.map((cat) => (
              <SelectItem key={cat.id} value={cat.id}>
                {cat.name}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {/* Table */}
      <Card>
        <CardContent className="p-0">
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Nome</TableHead>
                  <TableHead className="text-xs text-muted-foreground">
                    Categoria
                  </TableHead>
                  <TableHead className="text-right">Preço Custo</TableHead>
                  <TableHead className="text-right font-bold">
                    Preço Venda
                  </TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead className="text-right">Ações</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {loading ? (
                  <TableRow>
                    <TableCell
                      colSpan={6}
                      className="text-center py-8 text-muted-foreground"
                    >
                      Carregando...
                    </TableCell>
                  </TableRow>
                ) : produtos.length === 0 ? (
                  <TableRow>
                    <TableCell
                      colSpan={6}
                      className="text-center py-8 text-muted-foreground"
                    >
                      Nenhum produto encontrado.
                    </TableCell>
                  </TableRow>
                ) : (
                  produtos.map((produto) => (
                    <TableRow key={produto.id}>
                      <TableCell className="font-bold">
                        {produto.nome}
                      </TableCell>
                      <TableCell className="text-xs text-muted-foreground">
                        {produto.categoria?.nome || "—"}
                      </TableCell>
                      <TableCell className="text-right">
                        {formatCurrency(produto.precoCusto)}
                      </TableCell>
                      <TableCell className="text-right font-bold">
                        {formatCurrency(produto.precoVenda)}
                      </TableCell>
                      <TableCell>
                        <Badge
                          variant={
                            produto.disponivel ? "default" : "secondary"
                          }
                        >
                          {produto.disponivel
                            ? "Disponível"
                            : "Indisponível"}
                        </Badge>
                      </TableCell>
                      <TableCell className="text-right">
                        <div className="flex gap-2 justify-end">
                          <Modal
                            open={openEditModal && editingProduct === produto.id}
                            onOpenChange={(open) => {
                              if (!open) {
                                setOpenEditModal(false);
                                resetForm();
                              }
                            }}
                          >
                            <button
                              onClick={() => handleEditClick(produto)}
                              className="text-primary hover:underline text-sm inline-flex items-center gap-1"
                            >
                              <Edit2 className="w-3 h-3" />
                              Editar
                            </button>

                            <ModalContent size="lg">
                              <ModalHeader>
                                <ModalTitle>Editar Produto</ModalTitle>
                              </ModalHeader>

                              <form onSubmit={handleSubmit} className="space-y-4">
                                <ModalBody className="space-y-4">
                                  {/* Nome */}
                                  <div>
                                    <label className="block text-sm font-medium mb-1">
                                      Nome{" "}
                                      <span className="text-error">*</span>
                                    </label>
                                    <Input
                                      placeholder="Ex: Hambúrguer Clássico"
                                      value={formData.nome}
                                      onChange={(e) =>
                                        setFormData((prev) => ({
                                          ...prev,
                                          nome: e.target.value,
                                        }))
                                      }
                                      className={
                                        formErrors.nome ? "border-error" : ""
                                      }
                                    />
                                    {formErrors.nome && (
                                      <p className="text-xs text-error mt-1">
                                        {formErrors.nome}
                                      </p>
                                    )}
                                  </div>

                                  {/* Descrição */}
                                  <div>
                                    <label className="block text-sm font-medium mb-1">
                                      Descrição
                                    </label>
                                    <textarea
                                      placeholder="Descrição do produto"
                                      value={formData.descricao}
                                      onChange={(e) =>
                                        setFormData((prev) => ({
                                          ...prev,
                                          descricao: e.target.value,
                                        }))
                                      }
                                      className="w-full px-3 py-2 border border-border rounded-md text-sm bg-background"
                                      rows={3}
                                    />
                                  </div>

                                  {/* Categoria */}
                                  <div>
                                    <label className="block text-sm font-medium mb-1">
                                      Categoria{" "}
                                      <span className="text-error">*</span>
                                    </label>
                                    <Select
                                      value={formData.categoriaId}
                                      onValueChange={(value) =>
                                        setFormData((prev) => ({
                                          ...prev,
                                          categoriaId: value || "",
                                        }))
                                      }
                                    >
                                      <SelectTrigger
                                        className={
                                          formErrors.categoriaId
                                            ? "border-error"
                                            : ""
                                        }
                                      >
                                        <SelectValue placeholder="Selecione uma categoria" />
                                      </SelectTrigger>
                                      <SelectContent>
                                        {categories.map((cat) => (
                                          <SelectItem
                                            key={cat.id}
                                            value={cat.id}
                                          >
                                            {cat.name}
                                          </SelectItem>
                                        ))}
                                      </SelectContent>
                                    </Select>
                                    {formErrors.categoriaId && (
                                      <p className="text-xs text-error mt-1">
                                        {formErrors.categoriaId}
                                      </p>
                                    )}
                                  </div>

                                  {/* Preço Custo */}
                                  <div>
                                    <label className="block text-sm font-medium mb-1">
                                      Preço Custo{" "}
                                      <span className="text-error">*</span>
                                    </label>
                                    <div className="relative">
                                      <span className="absolute left-3 top-2 text-sm text-muted-foreground">
                                        R$
                                      </span>
                                      <Input
                                        type="number"
                                        placeholder="0.00"
                                        value={formData.precoCusto}
                                        onChange={(e) =>
                                          setFormData((prev) => ({
                                            ...prev,
                                            precoCusto: e.target.value,
                                          }))
                                        }
                                        step="0.01"
                                        min="0"
                                        className={`pl-8 ${
                                          formErrors.precoCusto
                                            ? "border-error"
                                            : ""
                                        }`}
                                      />
                                    </div>
                                    {formErrors.precoCusto && (
                                      <p className="text-xs text-error mt-1">
                                        {formErrors.precoCusto}
                                      </p>
                                    )}
                                  </div>

                                  {/* Preço Venda */}
                                  <div>
                                    <label className="block text-sm font-medium mb-1">
                                      Preço Venda{" "}
                                      <span className="text-error">*</span>
                                    </label>
                                    <div className="relative">
                                      <span className="absolute left-3 top-2 text-sm text-muted-foreground">
                                        R$
                                      </span>
                                      <Input
                                        type="number"
                                        placeholder="0.00"
                                        value={formData.precoVenda}
                                        onChange={(e) =>
                                          setFormData((prev) => ({
                                            ...prev,
                                            precoVenda: e.target.value,
                                          }))
                                        }
                                        step="0.01"
                                        min="0"
                                        className={`pl-8 ${
                                          formErrors.precoVenda
                                            ? "border-error"
                                            : ""
                                        }`}
                                      />
                                    </div>
                                    {formErrors.precoVenda && (
                                      <p className="text-xs text-error mt-1">
                                        {formErrors.precoVenda}
                                      </p>
                                    )}
                                  </div>

                                  {/* Imagem */}
                                  <div>
                                    <label className="block text-sm font-medium mb-1">
                                      Upload Imagem
                                    </label>
                                    <div className="flex gap-2">
                                      <Input
                                        ref={fileInputRef}
                                        type="file"
                                        accept="image/*"
                                        onChange={handleImageUpload}
                                        className="hidden"
                                      />
                                      <Button
                                        type="button"
                                        variant="outline"
                                        onClick={() =>
                                          fileInputRef.current?.click()
                                        }
                                        className="flex-1"
                                      >
                                        Escolher Arquivo
                                      </Button>
                                      {formData.imagem && (
                                        <span className="text-sm text-muted-foreground py-2">
                                          Arquivo selecionado
                                        </span>
                                      )}
                                    </div>
                                  </div>
                                </ModalBody>

                                <ModalFooter>
                                  <ModalClose
                                    render={
                                      <Button
                                        variant="outline"
                                        onClick={() => {
                                          resetForm();
                                          setOpenEditModal(false);
                                        }}
                                      />
                                    }
                                  >
                                    Cancelar
                                  </ModalClose>
                                  <Button
                                    variant="primary"
                                    type="submit"
                                    disabled={submitLoading}
                                  >
                                    {submitLoading ? "Salvando..." : "Salvar"}
                                  </Button>
                                </ModalFooter>
                              </form>
                            </ModalContent>
                          </Modal>

                          <Modal
                            open={openDeleteModal && productToDelete === produto.id}
                            onOpenChange={(open) => {
                              if (!open) {
                                setOpenDeleteModal(false);
                                setProductToDelete(null);
                              }
                            }}
                          >
                            <button
                              onClick={() => handleDeleteClick(produto.id)}
                              className="text-error hover:underline text-sm inline-flex items-center gap-1"
                            >
                              <Trash2 className="w-3 h-3" />
                              Deletar
                            </button>

                            <ModalContent size="sm">
                              <ModalHeader>
                                <ModalTitle>Confirmar Exclusão</ModalTitle>
                              </ModalHeader>

                              <ModalBody>
                                <p className="text-sm">
                                  Tem certeza que deseja deletar o produto "
                                  <strong>{produto.nome}</strong>"? Esta ação
                                  não pode ser desfeita.
                                </p>
                              </ModalBody>

                              <ModalFooter>
                                <ModalClose
                                  render={
                                    <Button
                                      variant="outline"
                                      onClick={() => {
                                        setOpenDeleteModal(false);
                                        setProductToDelete(null);
                                      }}
                                    />
                                  }
                                >
                                  Cancelar
                                </ModalClose>
                                <Button
                                  variant="destructive"
                                  onClick={handleDelete}
                                  disabled={submitLoading}
                                >
                                  {submitLoading ? "Deletando..." : "Deletar"}
                                </Button>
                              </ModalFooter>
                            </ModalContent>
                          </Modal>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="flex items-center justify-between">
          <p className="text-sm text-muted-foreground">
            Mostrando {startIndex} a {endIndex} de {total} produtos
          </p>

          <div className="flex gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => setPage(Math.max(1, page - 1))}
              disabled={page === 1}
            >
              <ChevronLeft className="w-4 h-4" />
              Anterior
            </Button>

            <div className="flex items-center gap-2">
              {Array.from({ length: totalPages }, (_, i) => i + 1).map(
                (p) => (
                  <Button
                    key={p}
                    variant={p === page ? "primary" : "outline"}
                    size="sm"
                    onClick={() => setPage(p)}
                  >
                    {p}
                  </Button>
                )
              )}
            </div>

            <Button
              variant="outline"
              size="sm"
              onClick={() => setPage(Math.min(totalPages, page + 1))}
              disabled={page === totalPages}
            >
              Próximo
              <ChevronRight className="w-4 h-4" />
            </Button>
          </div>
        </div>
      )}
    </div>
  );
}
