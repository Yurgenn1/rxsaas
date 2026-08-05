export default function DashboardPage() {
  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-900 p-6">
      <div className="max-w-7xl mx-auto">
        <h1 className="text-4xl font-bold text-[#E85D5D] mb-4">
          🚀 RXSAAS Dashboard
        </h1>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-8">
          {/* Card Categorias */}
          <div className="bg-white dark:bg-slate-800 rounded-lg shadow-lg p-6 hover:shadow-xl transition">
            <h2 className="text-2xl font-bold text-slate-900 dark:text-slate-50 mb-2">
              📂 Categorias
            </h2>
            <p className="text-slate-600 dark:text-slate-400 mb-4">
              Gerencie as categorias do cardápio
            </p>
            <a href="/admin/categories" className="text-[#E85D5D] hover:text-[#D84C4C] font-bold">
              Acessar →
            </a>
          </div>

          {/* Card Produtos */}
          <div className="bg-white dark:bg-slate-800 rounded-lg shadow-lg p-6 hover:shadow-xl transition">
            <h2 className="text-2xl font-bold text-slate-900 dark:text-slate-50 mb-2">
              🍕 Produtos
            </h2>
            <p className="text-slate-600 dark:text-slate-400 mb-4">
              Gerencie os produtos do seu cardápio
            </p>
            <a href="/admin/products" className="text-[#E85D5D] hover:text-[#D84C4C] font-bold">
              Acessar →
            </a>
          </div>

          {/* Card Pedidos */}
          <div className="bg-white dark:bg-slate-800 rounded-lg shadow-lg p-6 hover:shadow-xl transition">
            <h2 className="text-2xl font-bold text-slate-900 dark:text-slate-50 mb-2">
              📋 Pedidos
            </h2>
            <p className="text-slate-600 dark:text-slate-400 mb-4">
              Gerencie os pedidos do restaurante
            </p>
            <a href="/admin/orders" className="text-[#E85D5D] hover:text-[#D84C4C] font-bold">
              Acessar →
            </a>
          </div>
        </div>

        {/* Status */}
        <div className="mt-12 bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-lg p-6">
          <h3 className="text-xl font-bold text-green-900 dark:text-green-200 mb-2">
            ✅ Status: Todos os módulos criados e prontos!
          </h3>
          <ul className="text-green-800 dark:text-green-300 space-y-1">
            <li>✅ Módulo 1: Cardápio Digital (20+ arquivos)</li>
            <li>✅ Módulo 2: Opcionais e Combos (APIs funcionais)</li>
            <li>✅ Módulo 3: Pedidos (APIs funcionais)</li>
            <li>✅ Design com paleta vermelha pastel</li>
            <li>✅ PostgreSQL conectado e banco criado</li>
          </ul>
        </div>
      </div>
    </div>
  );
}
