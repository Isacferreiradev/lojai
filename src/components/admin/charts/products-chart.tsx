"use client";

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { ResponsiveContainer, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip } from "recharts";

interface ProductsChartProps {
  data: { name: string; quantidade: number }[];
}

export function ProductsChart({ data }: ProductsChartProps) {
  return (
    <Card className="bg-card">
      <CardHeader>
        <CardTitle className="font-heading text-base font-extrabold text-foreground">Tapetes Mais Vendidos</CardTitle>
        <CardDescription className="font-mono text-xs text-muted-foreground">Top 5 modelos com maior saída de estoque.</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="h-[280px] w-full">
          {data.length === 0 ? (
            <div className="h-full flex items-center justify-center text-xs text-muted-foreground">
              Nenhuma venda registrada no período.
            </div>
          ) : (
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={data} margin={{ top: 10, right: 10, left: -25, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" className="stroke-muted/40" horizontal={true} vertical={false} />
                <XAxis dataKey="name" tickLine={false} axisLine={false} className="text-[10px] fill-muted-foreground" />
                <YAxis tickLine={false} axisLine={false} className="text-[10px] fill-muted-foreground" />
                <Tooltip
                  formatter={(value) => [value, "Unidades"]}
                  contentStyle={{
                    fontSize: 11,
                    borderRadius: 0,
                    backgroundColor: "var(--color-card)",
                    border: "2px solid var(--color-foreground)",
                    color: "var(--color-foreground)",
                  }}
                  labelStyle={{ fontWeight: "bold", marginBottom: 4 }}
                />
                <Bar dataKey="quantidade" fill="var(--color-primary)" radius={[0, 0, 0, 0]} barSize={28} />
              </BarChart>
            </ResponsiveContainer>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
