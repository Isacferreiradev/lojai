"use server";

import prisma from "@/lib/prisma";
import { cookies } from "next/headers";
import { OrderStatus } from "@prisma/client";

const ADMIN_COOKIE = "lojai_admin";

async function assertAdmin() {
  const store = await cookies();
  const expected = process.env.ADMIN_PASSWORD;
  if (!expected || store.get(ADMIN_COOKIE)?.value !== expected) {
    throw new Error("Não autorizado");
  }
}

export type FinancePeriod = "7d" | "30d" | "90d" | "all";

const PAID_STATUSES: OrderStatus[] = [
  OrderStatus.PAID,
  OrderStatus.PROCESSING,
  OrderStatus.SHIPPED,
  OrderStatus.DELIVERED,
];

const METHOD_LABELS: Record<string, string> = {
  PIX: "Pix",
  CREDIT_CARD: "Cartão de Crédito",
  DEBIT_CARD: "Cartão de Débito",
  BOLETO: "Boleto",
  UNKNOWN: "Não informado",
};

function startDateFor(period: FinancePeriod): Date | null {
  if (period === "all") return null;
  const days = period === "7d" ? 7 : period === "30d" ? 30 : 90;
  const d = new Date();
  d.setHours(0, 0, 0, 0);
  d.setDate(d.getDate() - days + 1);
  return d;
}

export async function getFinancialReport(period: FinancePeriod = "30d") {
  await assertAdmin();

  const start = startDateFor(period);
  const dateFilter = start ? { createdAt: { gte: start } } : {};

  const orders = await prisma.order.findMany({
    where: dateFilter,
    include: { payment: true, items: true },
    orderBy: { createdAt: "desc" },
  });

  const paid = orders.filter((o) => PAID_STATUSES.includes(o.status));
  const totalRevenue = paid.reduce((acc, o) => acc + Number(o.total), 0);
  const paidCount = paid.length;
  const avgOrderValue = paidCount > 0 ? totalRevenue / paidCount : 0;

  const pending = orders.filter(
    (o) => o.status === OrderStatus.PENDING || o.status === OrderStatus.AWAITING_PAYMENT
  );
  const pendingRevenue = pending.reduce((acc, o) => acc + Number(o.total), 0);

  const refunded = orders.filter(
    (o) => o.status === OrderStatus.CANCELLED || o.status === OrderStatus.REFUNDED
  );
  const refundedRevenue = refunded.reduce((acc, o) => acc + Number(o.total), 0);

  // Revenue by payment method (paid orders)
  const methodMap: Record<string, { total: number; count: number }> = {};
  for (const o of paid) {
    const key = o.payment?.method ?? "UNKNOWN";
    methodMap[key] = methodMap[key] || { total: 0, count: 0 };
    methodMap[key].total += Number(o.total);
    methodMap[key].count += 1;
  }
  const byMethod = Object.entries(methodMap)
    .map(([method, v]) => ({ method: METHOD_LABELS[method] ?? method, total: v.total, count: v.count }))
    .sort((a, b) => b.total - a.total);

  // Top products by revenue
  const productMap: Record<string, { name: string; revenue: number; qty: number }> = {};
  for (const o of paid) {
    for (const it of o.items) {
      productMap[it.name] = productMap[it.name] || { name: it.name, revenue: 0, qty: 0 };
      productMap[it.name].revenue += Number(it.price) * it.quantity;
      productMap[it.name].qty += it.quantity;
    }
  }
  const topProducts = Object.values(productMap)
    .sort((a, b) => b.revenue - a.revenue)
    .slice(0, 8);

  // Daily revenue series
  const days = period === "7d" ? 7 : period === "30d" ? 30 : period === "90d" ? 90 : 30;
  const dailyMap: Record<string, number> = {};
  const labels: string[] = [];
  for (let i = days - 1; i >= 0; i--) {
    const d = new Date();
    d.setDate(d.getDate() - i);
    const key = d.toLocaleDateString("pt-BR", { day: "2-digit", month: "2-digit" });
    dailyMap[key] = 0;
    labels.push(key);
  }
  for (const o of paid) {
    const key = new Date(o.createdAt).toLocaleDateString("pt-BR", { day: "2-digit", month: "2-digit" });
    if (key in dailyMap) dailyMap[key] += Number(o.total);
  }
  const chart = labels.map((date) => ({ date, vendas: Math.round(dailyMap[date]) }));

  // Lightweight rows for CSV export
  const rows = orders.map((o) => ({
    pedido: o.orderNumber,
    data: new Date(o.createdAt).toLocaleDateString("pt-BR"),
    cliente: `${o.shippingName ?? ""} ${o.shippingSurname ?? ""}`.trim(),
    email: o.shippingEmail ?? "",
    status: o.status,
    metodo: o.payment?.method ?? "",
    total: Number(o.total).toFixed(2),
  }));

  return {
    totalRevenue,
    paidCount,
    avgOrderValue,
    pendingRevenue,
    pendingCount: pending.length,
    refundedRevenue,
    refundedCount: refunded.length,
    totalOrders: orders.length,
    byMethod,
    topProducts,
    chart,
    rows,
  };
}
