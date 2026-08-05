"use client";

import { useEffect, useState } from "react";
import { fetchWithValidation } from "@/lib/validators";

export default function CategoriesPage() {
  const [categories, setCategories] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");

  useEffect(() => {
    const loadCategories = async () => {
      try {
        const result = await fetchWithValidation("/api/categories");
        setCategories(result.data?.categories || []);
      } catch (error) {
        console.error("🚨 [CategoriesPage]", error);
      } finally {
        setLoading(false);
      }
    };

    loadCategories();
  }, []);

  const filtered = categories.filter(
    (c) =>
      c.name.toLowerCase().includes(search.toLowerCase()) ||
      (c.description && c.description.toLowerCase().includes(search.toLowerCase()))
  );

  return (
    <div>
      {/* Page Header */}
      <div className="mb-8 flex justify-between items-start">
        <div>
          <h1 className="text-4xl font-bold text-slate-900 dark:text-slate-50 mb-2">
            📂 Categorias
          </h1>
          <p className="text-slate-600 dark:text-slate-400">
            Organize o cardápio em categorias para facilitar a navegação
          </p>
        </div>
        <a
          href="/admin/categories/create"
          className="px-6 py-3 bg-[#E85D5D] hover:bg-[#D84C4C] text-white rounded-lg font-medium transition shadow-md hover:shadow-lg"
        >
          + Adicionar Categoria
        </a>
      </div>

      {/* Search and Filters */}
      <div className="mb-6">
        <input
          type="text"
          placeholder="🔍 Buscar categorias por nome..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="w-full px-4 py-3 rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-slate-50 placeholder-slate-500 dark:placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-[#E85D5D] focus:border-transparent"
        />
      </div>

      {/* Loading State */}
      {loading ? (
        <div className="bg-white dark:bg-slate-800 rounded-lg border border-slate-200 dark:border-slate-700 p-12 text-center">
          <p className="text-slate-600 dark:text-slate-400">⏳ Carregando categorias...</p>
        </div>
      ) : filtered.length === 0 ? (
        /* Empty State */
        <div className="bg-white dark:bg-slate-800 rounded-lg border border-slate-200 dark:border-slate-700 p-12 text-center">
          <div className="text-6xl mb-4">📋</div>
          <h3 className="text-xl font-semibold text-slate-900 dark:text-slate-50 mb-2">
            {categories.length === 0 ? "Nenhuma categoria criada" : "Nenhuma categoria encontrada"}
          </h3>
          <p className="text-slate-600 dark:text-slate-400 mb-6">
            {categories.length === 0
              ? "Comece criando sua primeira categoria para organizar seus produtos."
              : "Tente ajustar sua busca."}
          </p>
          <a
            href="/admin/categories/create"
            className="inline-block px-6 py-2 bg-[#E85D5D] hover:bg-[#D84C4C] text-white rounded-lg font-medium transition"
          >
            {categories.length === 0 ? "Criar Primeira Categoria" : "Criar Categoria"}
          </a>
        </div>
      ) : (
        /* Categories List */
        <div className="space-y-4">
          {filtered.map((category) => (
            <a
              key={category.id}
              href={`/admin/categories/${category.id}`}
              className="block bg-white dark:bg-slate-800 rounded-lg border border-slate-200 dark:border-slate-700 p-6 hover:shadow-md transition flex justify-between items-center"
            >
              <div className="flex-1">
                <h3 className="text-lg font-semibold text-slate-900 dark:text-slate-50">
                  {category.name}
                </h3>
                {category.description && (
                  <p className="text-slate-600 dark:text-slate-400 text-sm mt-1">
                    {category.description}
                  </p>
                )}
              </div>
              <div className="flex items-center gap-4">
                <span
                  className={`px-3 py-1 rounded-full text-sm ${
                    category.isActive
                      ? "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200"
                      : "bg-slate-100 text-slate-800 dark:bg-slate-700 dark:text-slate-200"
                  }`}
                >
                  {category.isActive ? "✅ Ativo" : "⏸️ Inativo"}
                </span>
              </div>
            </a>
          ))}
        </div>
      )}

      {/* Tips */}
      <div className="mt-8 bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg p-4">
        <p className="text-sm text-blue-900 dark:text-blue-200">
          💡 <strong>Dica:</strong> Organize suas categorias por tipo de produto (Pizzas, Bebidas, Sobremesas, etc.)
        </p>
      </div>
    </div>
  );
}
