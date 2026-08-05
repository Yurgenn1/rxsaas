"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";

export default function CreateCategoryPage() {
  const router = useRouter();
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({ name: "", description: "" });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      if (!formData.name.trim()) {
        throw new Error("Nome da categoria é obrigatório");
      }

      const response = await fetch("/api/categories", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...formData, restaurantId: "default" }),
      });

      const result = await response.json();

      if (!result.success) {
        throw new Error(result.error || "Erro ao criar categoria");
      }

      router.push("/admin/categories");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Erro ao criar categoria");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      {/* Page Header */}
      <div className="mb-8">
        <div>
          <h1 className="text-4xl font-bold text-slate-900 dark:text-slate-50 mb-2">
            ➕ Nova Categoria
          </h1>
          <p className="text-slate-600 dark:text-slate-400">
            Adicione uma nova categoria ao seu cardápio digital
          </p>
        </div>
      </div>

      {/* Error Message */}
      {error && (
        <div className="mb-6 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 text-red-800 dark:text-red-200 p-4 rounded-lg">
          ❌ {error}
        </div>
      )}

      {/* Form */}
      <form onSubmit={handleSubmit} className="max-w-2xl">
        <div className="bg-white dark:bg-slate-800 rounded-lg border border-slate-200 dark:border-slate-700 p-8">

          {/* Name Field */}
          <div className="mb-6">
            <label className="block text-sm font-medium text-slate-900 dark:text-slate-50 mb-2">
              Nome da Categoria *
            </label>
            <input
              type="text"
              placeholder="Ex: Pizzas, Bebidas, Sobremesas..."
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              className="w-full px-4 py-3 rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-slate-50 placeholder-slate-500 dark:placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-[#E85D5D] focus:border-transparent"
              required
            />
            <p className="text-sm text-slate-600 dark:text-slate-400 mt-1">
              Mínimo 2 caracteres, máximo 50
            </p>
          </div>

          {/* Description Field */}
          <div className="mb-8">
            <label className="block text-sm font-medium text-slate-900 dark:text-slate-50 mb-2">
              Descrição (Opcional)
            </label>
            <textarea
              placeholder="Descreva o tipo de produtos nesta categoria..."
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              rows={4}
              className="w-full px-4 py-3 rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-slate-50 placeholder-slate-500 dark:placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-[#E85D5D] focus:border-transparent"
            />
          </div>

          {/* Actions */}
          <div className="flex gap-4">
            <button
              type="submit"
              disabled={loading}
              className="px-6 py-3 bg-[#E85D5D] hover:bg-[#D84C4C] text-white rounded-lg font-medium transition disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? "⏳ Criando..." : "✅ Criar Categoria"}
            </button>
            <button
              type="button"
              onClick={() => router.back()}
              className="px-6 py-3 bg-slate-200 hover:bg-slate-300 dark:bg-slate-700 dark:hover:bg-slate-600 text-slate-900 dark:text-slate-50 rounded-lg font-medium transition"
            >
              ← Cancelar
            </button>
          </div>
        </div>
      </form>

      {/* Tips */}
      <div className="mt-8 bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg p-4">
        <p className="text-sm text-blue-900 dark:text-blue-200">
          💡 <strong>Dica:</strong> Use nomes claros e descritivos para que seus clientes entendam facilmente o tipo de produto em cada categoria.
        </p>
      </div>
    </div>
  );
}
