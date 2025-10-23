const Dashboard = () => {
  return (
    <div>
      <h1 className="text-2xl font-bold text-gray-900 mb-6">Dashboard</h1>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {/* KPI Cards - Placeholder */}
        <div className="card">
          <h3 className="text-sm font-medium text-gray-600">Ventas del Mes</h3>
          <p className="text-3xl font-bold text-gray-900 mt-2">RD$ 125,450</p>
          <p className="text-sm text-success-600 mt-2">+27.77% vs mes anterior</p>
        </div>

        <div className="card">
          <h3 className="text-sm font-medium text-gray-600">Facturas Hoy</h3>
          <p className="text-3xl font-bold text-gray-900 mt-2">8</p>
          <p className="text-sm text-gray-500 mt-2">RD$ 12,500</p>
        </div>

        <div className="card">
          <h3 className="text-sm font-medium text-gray-600">Cartera Total</h3>
          <p className="text-3xl font-bold text-gray-900 mt-2">RD$ 128,000</p>
          <p className="text-sm text-warning-600 mt-2">RD$ 18,230 vencido</p>
        </div>

        <div className="card">
          <h3 className="text-sm font-medium text-gray-600">NCF Disponibles</h3>
          <p className="text-3xl font-bold text-gray-900 mt-2">142</p>
          <p className="text-sm text-danger-600 mt-2">Crédito Fiscal: 4</p>
        </div>
      </div>

      <div className="mt-8">
        <div className="card">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">
            Dashboard completo en construcción
          </h2>
          <p className="text-gray-600">
            Esta página mostrará KPIs, gráficos y análisis del negocio.
          </p>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
