"use client";

import { useEffect, useState } from "react";
import { fetchWithValidation } from "@/lib/validators";

interface Product {
  id: string;
  name: string;
  description: string | null;
  price: number;
  isActive: boolean;
  category?: { id: string; name: string } | null;
}

export default function ProductsPage() {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");

  useEffect(() => {
    const loadProducts = async () => {
      try {
        const result = await fetchWithValidation("/api/products");
        setProducts(result.data?.products || []);
      } catch (error) {
        console.error("🚨 [ProductsPage]", error);
      } finally {
        setLoading(false);
      }
    };

    loadProducts();
  }, []);

  const filtered = products.filter(
    (p) =>
      p.name.toLowerCase().includes(search.toLowerCase()) ||
      (p.description && p.description.toLowerCase().includes(search.toLowerCase()))
  );

  return (
    <div>
      {/* Page Header */}
      <div className="mb-8 flex justify-between items-start">
        <div>
          <h1 className="text-4xl font-bold text-slate-900 dark:text-slate-50 mb-2">
            🍕 Produtos
          </h1>
          <p className="text-slate-600 dark:text-slate-400">
            Gerencie todos os itens do seu cardápio digital
          </p>
        </div>
        <a
          href="/admin/products/create"
          className="px-6 py-3 bg-[#E85D5D] hover:bg-[#D84C4C] text-white rounded-lg font-medium transition shadow-md hover:shadow-lg"
        >
          + Novo Produto
        </a>
      </div>

      {/* Search and Filters */}
      <div className="mb-6">
        <input
          type="text"
          placeholder="🔍 Buscar produtos por nome ou descrição..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="w-full px-4 py-3 rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-slate-50 placeholder-slate-500 dark:placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-[#E85D5D] focus:border-transparent"
        />
      </div>

      {loading ? (
        <div className="bg-white dark:bg-slate-800 rounded-lg border border-slate-200 dark:border-slate-700 p-12 text-center">
          <p className="text-slate-600 dark:text-slate-400">⏳ Carregando produtos...</p>
        </div>
      ) : filtered.length === 0 ? (
        /* Empty State */
        <div className="bg-white dark:bg-slate-800 rounded-lg border border-slate-200 dark:border-slate-700 p-12 text-center">
          <div className="text-6xl mb-4">🎯</div>
          <h3 className="text-xl font-semibold text-slate-900 dark:text-slate-50 mb-2">
            {products.length === 0 ? "Nenhum produto criado" : "Nenhum produto encontrado"}
          </h3>
          <p className="text-slate-600 dark:text-slate-400 mb-6">
            {products.length === 0
              ? "Crie seus primeiros produtos para começar a vender online."
              : "Tente ajustar sua busca."}
          </p>
          <a
            href="/admin/products/create"
            className="inline-block px-6 py-2 bg-[#E85D5D] hover:bg-[#D84C4C] text-white rounded-lg font-medium transition"
          >
            {products.length === 0 ? "Criar Primeiro Produto" : "Criar Produto"}
          </a>
        </div>
      ) : (
        /* Products List */
        <div className="space-y-4">
          {filtered.map((product) => (
            <a
              key={product.id}
              href={`/admin/products/${product.id}`}
              className="block bg-white dark:bg-slate-800 rounded-lg border border-slate-200 dark:border-slate-700 p-6 hover:shadow-md transition"
            >
              <div className="flex justify-between items-center">
                <div className="flex-1">
                  <div className="flex items-center gap-2">
                    <h3 className="text-lg font-semibold text-slate-900 dark:text-slate-50">
                      {product.name}
                    </h3>
                    {product.category && (
                      <span className="text-xs px-2 py-1 rounded-full bg-slate-100 dark:bg-slate-700 text-slate-600 dark:text-slate-300">
                        {product.category.name}
                      </span>
                    )}
                  </div>
                  {product.description && (
                    <p className="text-slate-600 dark:text-slate-400 text-sm mt-1">
                      {product.description}
                    </p>
                  )}
                </div>
                <div className="flex items-center gap-4">
                  <span className="text-lg font-bold text-[#E85D5D]">
                    R$ {product.price.toFixed(2)}
                  </span>
                  <span
                    className={`px-3 py-1 rounded-full text-sm ${
                      product.isActive
                        ? "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200"
                        : "bg-slate-100 text-slate-800 dark:bg-slate-700 dark:text-slate-200"
                    }`}
                  >
                    {product.isActive ? "✅ Ativo" : "⏸️ Inativo"}
                  </span>
                </div>
              </div>
            </a>
          ))}
        </div>
      )}

      {/* Tips */}
      <div className="mt-8 bg-amber-50 dark:bg-amber-900/20 border border-amber-200 dark:border-amber-800 rounded-lg p-4">
        <p className="text-sm text-amber-900 dark:text-amber-200">
          💡 <strong>Dica:</strong> Sempre use descrições claras, imagens de qualidade e preços competitivos para aumentar suas vendas.
        </p>
      </div>
    </div>
  );
}
