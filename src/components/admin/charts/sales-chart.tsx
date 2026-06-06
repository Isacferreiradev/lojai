"use client";

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { ResponsiveContainer, AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip } from "recharts";
import { formatCurrency } from "@/lib/utils";

interface SalesChartProps {
  data: { date: string; vendas: number }[];
}

export function SalesChart({ data }: SalesChartProps) {
  return (
    <Card className="bg-card lg:col-span-2">
      <CardHeader>
        <CardTitle className="font-heading text-base font-extrabold text-foreground">Faturamento (Últimos 7 dias)</CardTitle>
        <CardDescription className="font-mono text-xs text-muted-foreground">Volume de faturamento bruto diário acumulado.</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="h-[280px] w-full">
          {data.length === 0 ? (
            <div className="h-full flex items-center justify-center text-xs text-muted-foreground">
              Nenhuma venda registrada no período.
            </div>
          ) : (
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={data} margin={{ top: 10, right: 10, left: -15, bottom: 0 }}>
                <defs>
                  {/* Vermilion primary gradient */}
                  <linearGradient id="colorSales" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="var(--color-primary)" stopOpacity={0.3} />
                    <stop offset="95%" stopColor="var(--color-primary)" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" className="stroke-muted/40" horizontal={true} vertical={false} />
                <XAxis
                  dataKey="date"
                  tickLine={false}
                  axisLine={false}
                  className="text-[10px] fill-muted-foreground"
                />
                <YAxis
                  tickLine={false}
                  axisLine={false}
                  className="text-[10px] fill-muted-foreground"
                  tickFormatter={(val) => `R$${val}`}
                />
                <Tooltip
                  formatter={(value) => [formatCurrency(Number(value)), "Vendas"]}
                  contentStyle={{
                    fontSize: 11,
                    borderRadius: 0,
                    backgroundColor: "var(--color-card)",
                    border: "2px solid var(--color-foreground)",
                    color: "var(--color-foreground)",
                  }}
                  labelStyle={{ fontWeight: "bold", marginBottom: 4 }}
                />
                <Area
                  type="monotone"
                  dataKey="vendas"
                  stroke="var(--color-primary)"
                  strokeWidth={2.5}
                  fillOpacity={1}
                  fill="url(#colorSales)"
                />
              </AreaChart>
            </ResponsiveContainer>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
