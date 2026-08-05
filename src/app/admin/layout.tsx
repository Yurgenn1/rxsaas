import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Admin - RXSAAS",
  description: "Painel administrativo do RXSAAS",
};

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-900 flex flex-col">
      {/* Header */}
      <header className="bg-white dark:bg-slate-800 border-b border-slate-200 dark:border-slate-700 sticky top-0 z-50 shadow-sm">
        <div className="flex items-center justify-between px-6 py-4 max-w-7xl mx-auto w-full">
          <Link href="/" className="flex items-center gap-2">
            <div className="w-8 h-8 bg-[#E85D5D] rounded-lg flex items-center justify-center">
              <span className="text-white font-bold text-lg">R</span>
            </div>
            <span className="font-bold text-lg text-slate-900 dark:text-slate-50">RXSAAS</span>
          </Link>
          <nav className="flex items-center gap-6">
            <Link
              href="/admin/categories"
              className="text-slate-600 dark:text-slate-400 hover:text-[#E85D5D] transition text-sm font-medium"
            >
              Categorias
            </Link>
            <Link
              href="/admin/products"
              className="text-slate-600 dark:text-slate-400 hover:text-[#E85D5D] transition text-sm font-medium"
            >
              Produtos
            </Link>
            <Link
              href="/admin/orders"
              className="text-slate-600 dark:text-slate-400 hover:text-[#E85D5D] transition text-sm font-medium"
            >
              Pedidos
            </Link>
          </nav>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1">
        <div className="max-w-7xl mx-auto px-6 py-8 w-full">
          {children}
        </div>
      </main>

      {/* Footer */}
      <footer className="bg-white dark:bg-slate-800 border-t border-slate-200 dark:border-slate-700">
        <div className="max-w-7xl mx-auto px-6 py-4 text-center text-slate-600 dark:text-slate-400 text-sm w-full">
          <p>© 2026 RXSAAS - Sistema de Gestão para Bares e Restaurantes</p>
        </div>
      </footer>
    </div>
  );
}
