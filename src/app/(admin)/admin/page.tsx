import { getAdminStats } from "@/actions/admin";
import { StatsCard } from "@/components/admin/stats-card";
import { SalesChart } from "@/components/admin/charts/sales-chart";
import { ProductsChart } from "@/components/admin/charts/products-chart";
import { DollarSign, ShoppingCart, Users, TrendingUp } from "lucide-react";
import { formatCurrency } from "@/lib/utils";

export default async function AdminDashboardPage() {
  const stats = await getAdminStats();

  return (
    <div className="space-y-8">
      {/* Title */}
      <div>
        <span className="label-mono text-primary">[ Dashboard ]</span>
        <h1 className="display text-4xl text-foreground mt-2">Painel Geral</h1>
        <p className="font-mono text-xs text-muted-foreground mt-1">
          Visão consolidada do faturamento, compras e desempenho do e-commerce.
        </p>
      </div>

      {/* Stats Cards Row */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatsCard
          title="Faturamento Total"
          value={formatCurrency(stats.totalRevenue)}
          icon={DollarSign}
          description="Total acumulado em pedidos pagos"
        />
        <StatsCard
          title="Total de Pedidos"
          value={stats.totalOrders}
          icon={ShoppingCart}
          description="Pedidos pendentes, pagos ou cancelados"
        />
        <StatsCard
          title="Clientes Cadastrados"
          value={stats.totalUsers}
          icon={Users}
          description="Usuários cadastrados no site"
        />
        <StatsCard
          title="Ticket Médio"
          value={formatCurrency(stats.avgOrderValue)}
          icon={TrendingUp}
          description="Valor médio de compras faturadas"
        />
      </div>

      {/* Charts Row */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
          <SalesChart data={stats.salesChartData} />
        </div>
        <div>
          <ProductsChart data={stats.topProductsChartData} />
        </div>
      </div>
    </div>
  );
}
