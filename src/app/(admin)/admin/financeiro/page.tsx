import Link from "next/link";
import { getFinancialReport, type FinancePeriod } from "@/actions/finance";
import { PageHeader } from "@/components/admin/ui";
import { StatsCard } from "@/components/admin/stats-card";
import { SalesChart } from "@/components/admin/charts/sales-chart";
import { ExportButton } from "@/components/admin/finance/export-button";
import { formatCurrency } from "@/lib/utils";
import { DollarSign, ShoppingCart, TrendingUp, Clock } from "lucide-react";

const PERIODS: { value: FinancePeriod; label: string }[] = [
  { value: "7d", label: "7 dias" },
  { value: "30d", label: "30 dias" },
  { value: "90d", label: "90 dias" },
  { value: "all", label: "Tudo" },
];

interface PageProps {
  searchParams: Promise<{ periodo?: string }>;
}

export default async function AdminFinancePage({ searchParams }: PageProps) {
  const sp = await searchParams;
  const period = (PERIODS.find((p) => p.value === sp.periodo)?.value ?? "30d") as FinancePeriod;

  const report = await getFinancialReport(period);
  const maxMethod = Math.max(1, ...report.byMethod.map((m) => m.total));

  return (
    <div className="space-y-8">
      <PageHeader
        title="Financeiro"
        description="Faturamento, ticket médio e desempenho de vendas."
        actions={<ExportButton rows={report.rows} period={period} />}
      />

      {/* Period selector */}
      <div className="flex flex-wrap gap-1">
        {PERIODS.map((p) => {
          const active = p.value === period;
          return (
            <Link
              key={p.value}
              href={`/admin/financeiro?periodo=${p.value}`}
              className={`border-2 border-foreground px-4 py-1.5 font-mono text-xs font-semibold uppercase tracking-wide transition-colors ${
                active ? "bg-foreground text-background" : "bg-card text-muted-foreground hover:bg-muted"
              }`}
            >
              {p.label}
            </Link>
          );
        })}
      </div>

      {/* KPI cards */}
      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
        <StatsCard
          title="Faturamento"
          value={formatCurrency(report.totalRevenue)}
          icon={DollarSign}
          description={`${report.paidCount} pedidos pagos no período`}
        />
        <StatsCard
          title="Ticket Médio"
          value={formatCurrency(report.avgOrderValue)}
          icon={TrendingUp}
          description="Valor médio por pedido pago"
        />
        <StatsCard
          title="A Receber"
          value={formatCurrency(report.pendingRevenue)}
          icon={Clock}
          description={`${report.pendingCount} pedidos pendentes`}
        />
        <StatsCard
          title="Pedidos (total)"
          value={report.totalOrders}
          icon={ShoppingCart}
          description={`${report.refundedCount} cancelados / reembolsados`}
        />
      </div>

      {/* Chart */}
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
        <SalesChart data={report.chart} />

        {/* Revenue by payment method */}
        <div className="border-2 border-foreground bg-card p-6">
          <h3 className="label-mono mb-4 text-primary">[ Por método de pagamento ]</h3>
          {report.byMethod.length === 0 ? (
            <p className="font-mono text-xs text-muted-foreground">Sem pagamentos no período.</p>
          ) : (
            <div className="space-y-3">
              {report.byMethod.map((m) => (
                <div key={m.method} className="space-y-1">
                  <div className="flex items-center justify-between text-xs">
                    <span className="font-semibold text-foreground">{m.method}</span>
                    <span className="font-mono text-muted-foreground">
                      {formatCurrency(m.total)} · {m.count}x
                    </span>
                  </div>
                  <div className="h-3 w-full border-2 border-foreground bg-card">
                    <div
                      className="h-full bg-primary"
                      style={{ width: `${(m.total / maxMethod) * 100}%` }}
                    />
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Top products by revenue */}
      <div className="border-2 border-foreground bg-card">
        <div className="border-b-2 border-foreground bg-muted/30 px-6 py-4">
          <h3 className="label-mono text-primary">[ Produtos que mais faturam ]</h3>
        </div>
        {report.topProducts.length === 0 ? (
          <p className="px-6 py-8 text-center font-mono text-xs text-muted-foreground">
            Nenhuma venda registrada no período.
          </p>
        ) : (
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b-2 border-foreground">
                <th className="px-6 py-3 text-left font-mono text-xs font-semibold uppercase tracking-wider text-foreground">Produto</th>
                <th className="px-6 py-3 text-right font-mono text-xs font-semibold uppercase tracking-wider text-foreground">Unid.</th>
                <th className="px-6 py-3 text-right font-mono text-xs font-semibold uppercase tracking-wider text-foreground">Receita</th>
              </tr>
            </thead>
            <tbody className="divide-y-2 divide-foreground/15">
              {report.topProducts.map((p) => (
                <tr key={p.name} className="hover:bg-muted/30">
                  <td className="px-6 py-3 font-medium text-foreground">{p.name}</td>
                  <td className="px-6 py-3 text-right font-mono text-muted-foreground">{p.qty}</td>
                  <td className="px-6 py-3 text-right font-heading font-bold text-foreground">
                    {formatCurrency(p.revenue)}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
}
