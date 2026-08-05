export default function OrdersPage() {
  return (
    <div>
      {/* Page Header */}
      <div className="mb-8">
        <div>
          <h1 className="text-4xl font-bold text-slate-900 dark:text-slate-50 mb-2">
            📋 Pedidos
          </h1>
          <p className="text-slate-600 dark:text-slate-400">
            Acompanhe e gerencie todos os pedidos dos seus clientes
          </p>
        </div>
      </div>

      {/* Filters */}
      <div className="mb-6 flex gap-4 items-end">
        <div className="flex-1">
          <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
            Buscar
          </label>
          <input
            type="text"
            placeholder="🔍 Buscar por número do pedido ou cliente..."
            className="w-full px-4 py-3 rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-slate-50 placeholder-slate-500 dark:placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-[#E85D5D] focus:border-transparent"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
            Status
          </label>
          <select className="px-4 py-3 rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-slate-50 focus:outline-none focus:ring-2 focus:ring-[#E85D5D] focus:border-transparent">
            <option value="">Todos os status</option>
            <option value="pending">⏳ Pendente</option>
            <option value="confirmed">✅ Confirmado</option>
            <option value="preparing">👨‍🍳 Preparando</option>
            <option value="ready">🎯 Pronto</option>
            <option value="completed">✨ Completo</option>
            <option value="cancelled">❌ Cancelado</option>
          </select>
        </div>
      </div>

      {/* Empty State */}
      <div className="bg-white dark:bg-slate-800 rounded-lg border border-slate-200 dark:border-slate-700 p-12 text-center">
        <div className="text-6xl mb-4">🚀</div>
        <h3 className="text-xl font-semibold text-slate-900 dark:text-slate-50 mb-2">
          Nenhum pedido ainda
        </h3>
        <p className="text-slate-600 dark:text-slate-400 mb-6">
          Os pedidos dos seus clientes aparecerão aqui quando começarem a chegar.
        </p>
        <a
          href="/"
          className="inline-block px-6 py-2 bg-slate-200 hover:bg-slate-300 dark:bg-slate-700 dark:hover:bg-slate-600 text-slate-900 dark:text-slate-50 rounded-lg font-medium transition"
        >
          Ir para Dashboard
        </a>
      </div>

      {/* Stats */}
      <div className="mt-8 grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="bg-white dark:bg-slate-800 rounded-lg border border-slate-200 dark:border-slate-700 p-4">
          <p className="text-slate-600 dark:text-slate-400 text-sm">Pedidos Hoje</p>
          <p className="text-2xl font-bold text-slate-900 dark:text-slate-50">0</p>
        </div>
        <div className="bg-white dark:bg-slate-800 rounded-lg border border-slate-200 dark:border-slate-700 p-4">
          <p className="text-slate-600 dark:text-slate-400 text-sm">Pendentes</p>
          <p className="text-2xl font-bold text-[#E85D5D]">0</p>
        </div>
        <div className="bg-white dark:bg-slate-800 rounded-lg border border-slate-200 dark:border-slate-700 p-4">
          <p className="text-slate-600 dark:text-slate-400 text-sm">Preparando</p>
          <p className="text-2xl font-bold text-amber-600">0</p>
        </div>
        <div className="bg-white dark:bg-slate-800 rounded-lg border border-slate-200 dark:border-slate-700 p-4">
          <p className="text-slate-600 dark:text-slate-400 text-sm">Completos</p>
          <p className="text-2xl font-bold text-green-600">0</p>
        </div>
      </div>
    </div>
  );
}
