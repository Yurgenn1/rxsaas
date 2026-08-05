import Link from "next/link";

export default function Home() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 dark:from-slate-900 dark:to-slate-800">
      {/* Header */}
      <header className="bg-white dark:bg-slate-800 border-b border-slate-200 dark:border-slate-700">
        <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-10 h-10 bg-[#E85D5D] rounded-lg flex items-center justify-center">
              <span className="text-white font-bold text-xl">R</span>
            </div>
            <span className="font-bold text-2xl text-slate-900 dark:text-slate-50">RXSAAS</span>
          </div>
          <nav className="flex items-center gap-6">
            <Link href="/admin/categories" className="text-slate-600 dark:text-slate-400 hover:text-[#E85D5D] transition font-medium">
              Admin
            </Link>
            <Link href="/dashboard" className="text-slate-600 dark:text-slate-400 hover:text-[#E85D5D] transition font-medium">
              Dashboard
            </Link>
          </nav>
        </div>
      </header>

      {/* Hero Section */}
      <main className="max-w-7xl mx-auto px-6 py-20">
        <div className="text-center mb-16">
          <h1 className="text-5xl md:text-6xl font-bold text-slate-900 dark:text-slate-50 mb-6">
            🚀 RXSAAS
          </h1>
          <h2 className="text-2xl md:text-3xl font-semibold text-slate-700 dark:text-slate-300 mb-4">
            Sistema de Gestão para Bares e Restaurantes
          </h2>
          <p className="text-lg text-slate-600 dark:text-slate-400 mb-8 max-w-2xl mx-auto">
            Gerencie seu cardápio, pedidos e operações com uma plataforma profissional e intuitiva.
          </p>
          <div className="flex gap-4 justify-center">
            <Link
              href="/dashboard"
              className="px-8 py-3 bg-[#E85D5D] hover:bg-[#D84C4C] text-white rounded-lg font-medium transition shadow-md hover:shadow-lg"
            >
              Acessar Dashboard
            </Link>
            <Link
              href="/admin/categories"
              className="px-8 py-3 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-slate-50 rounded-lg font-medium hover:bg-slate-50 dark:hover:bg-slate-700 transition"
            >
              Painel Administrativo
            </Link>
          </div>
        </div>

        {/* Features Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="bg-white dark:bg-slate-800 rounded-lg border border-slate-200 dark:border-slate-700 p-8 hover:shadow-lg transition">
            <div className="text-4xl mb-4">📂</div>
            <h3 className="text-xl font-bold text-slate-900 dark:text-slate-50 mb-2">
              Cardápio Digital
            </h3>
            <p className="text-slate-600 dark:text-slate-400">
              Gerencie categorias e produtos com facilidade. Organize seu cardápio para melhor experiência do cliente.
            </p>
          </div>

          <div className="bg-white dark:bg-slate-800 rounded-lg border border-slate-200 dark:border-slate-700 p-8 hover:shadow-lg transition">
            <div className="text-4xl mb-4">📋</div>
            <h3 className="text-xl font-bold text-slate-900 dark:text-slate-50 mb-2">
              Gerenciamento de Pedidos
            </h3>
            <p className="text-slate-600 dark:text-slate-400">
              Acompanhe todos os pedidos em tempo real. Gerencie status e otimize o fluxo de trabalho.
            </p>
          </div>

          <div className="bg-white dark:bg-slate-800 rounded-lg border border-slate-200 dark:border-slate-700 p-8 hover:shadow-lg transition">
            <div className="text-4xl mb-4">⚙️</div>
            <h3 className="text-xl font-bold text-slate-900 dark:text-slate-50 mb-2">
              Opcionais e Combos
            </h3>
            <p className="text-slate-600 dark:text-slate-400">
              Configure opcionais de produtos e crie combos especiais para aumentar suas vendas.
            </p>
          </div>
        </div>

        {/* CTA Section */}
        <div className="mt-16 bg-white dark:bg-slate-800 rounded-lg border border-slate-200 dark:border-slate-700 p-12 text-center">
          <h3 className="text-2xl font-bold text-slate-900 dark:text-slate-50 mb-4">
            Pronto para começar?
          </h3>
          <p className="text-slate-600 dark:text-slate-400 mb-6">
            Acesse o dashboard agora e comece a gerenciar seu negócio!
          </p>
          <Link
            href="/dashboard"
            className="inline-block px-8 py-3 bg-[#E85D5D] hover:bg-[#D84C4C] text-white rounded-lg font-medium transition shadow-md hover:shadow-lg"
          >
            Acessar Dashboard Agora
          </Link>
        </div>
      </main>

      {/* Footer */}
      <footer className="bg-white dark:bg-slate-800 border-t border-slate-200 dark:border-slate-700 mt-20">
        <div className="max-w-7xl mx-auto px-6 py-8 text-center text-slate-600 dark:text-slate-400">
          <p>© 2026 RXSAAS - Sistema de Gestão para Bares e Restaurantes</p>
        </div>
      </footer>
    </div>
  );
}
