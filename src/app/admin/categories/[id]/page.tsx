"use client";

import { useParams, useRouter } from "next/navigation";
import { useState, useEffect } from "react";
import { fetchWithValidation } from "@/lib/validators";

export default function EditCategoryPage() {
  const router = useRouter();
  const params = useParams<{ id: string }>();
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [notFound, setNotFound] = useState(false);
  const [formData, setFormData] = useState({ name: "", description: "" });

  useEffect(() => {
    const loadCategory = async () => {
      setLoading(true);
      setError(null);
      try {
        const result = await fetchWithValidation(`/api/categories/${params.id}`);
        setFormData({
          name: result.data.name || "",
          description: result.data.description || "",
        });
      } catch (err) {
        setNotFound(true);
        console.error("🚨 [EditCategoryPage]", err);
      } finally {
        setLoading(false);
      }
    };

    loadCategory();
  }, [params.id]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setError(null);

    try {
      if (!formData.name.trim()) {
        throw new Error("Nome da categoria é obrigatório");
      }

      const response = await fetch(`/api/categories/${params.id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      const result = await response.json();

      if (!result.success) {
        throw new Error(result.error || "Erro ao atualizar categoria");
      }

      router.push("/admin/categories");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Erro ao atualizar categoria");
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="bg-white dark:bg-slate-800 rounded-lg border border-slate-200 dark:border-slate-700 p-12 text-center">
        <p className="text-slate-600 dark:text-slate-400">⏳ Carregando categoria...</p>
      </div>
    );
  }

  if (notFound) {
    return (
      <div className="bg-white dark:bg-slate-800 rounded-lg border border-slate-200 dark:border-slate-700 p-12 text-center">
        <p className="text-red-600 dark:text-red-400">❌ Categoria não encontrada</p>
        <a
          href="/admin/categories"
          className="inline-block mt-4 px-6 py-2 bg-[#E85D5D] hover:bg-[#D84C4C] text-white rounded-lg font-medium transition"
        >
          Voltar para Categorias
        </a>
      </div>
    );
  }

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-4xl font-bold text-slate-900 dark:text-slate-50 mb-2">
          ✏️ Editar Categoria
        </h1>
        <p className="text-slate-600 dark:text-slate-400">
          Atualize os dados da categoria
        </p>
      </div>

      {error && (
        <div className="mb-6 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 text-red-800 dark:text-red-200 p-4 rounded-lg">
          ❌ {error}
        </div>
      )}

      <form onSubmit={handleSubmit} className="max-w-2xl">
        <div className="bg-white dark:bg-slate-800 rounded-lg border border-slate-200 dark:border-slate-700 p-8">
          <div className="mb-6">
            <label className="block text-sm font-medium text-slate-900 dark:text-slate-50 mb-2">
              Nome da Categoria *
            </label>
            <input
              type="text"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              className="w-full px-4 py-3 rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-slate-50 focus:outline-none focus:ring-2 focus:ring-[#E85D5D] focus:border-transparent"
              required
            />
          </div>

          <div className="mb-8">
            <label className="block text-sm font-medium text-slate-900 dark:text-slate-50 mb-2">
              Descrição (Opcional)
            </label>
            <textarea
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              rows={4}
              className="w-full px-4 py-3 rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-slate-50 focus:outline-none focus:ring-2 focus:ring-[#E85D5D] focus:border-transparent"
            />
          </div>

          <div className="flex gap-4">
            <button
              type="submit"
              disabled={saving}
              className="px-6 py-3 bg-[#E85D5D] hover:bg-[#D84C4C] text-white rounded-lg font-medium transition disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {saving ? "⏳ Salvando..." : "✅ Salvar Alterações"}
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
    </div>
  );
}
