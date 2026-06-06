import { createClient } from "@/lib/supabase/server";
import prisma from "@/lib/prisma";
import { formatCurrency, formatDate } from "@/lib/utils";
import Link from "next/link";
import { Badge } from "@/components/ui/badge";
import { ShoppingBag } from "lucide-react";

// Order status styling helpers
const statusColors: Record<string, string> = {
  PENDING: "bg-amber-100 text-amber-800 dark:bg-amber-900/20 dark:text-amber-300",
  AWAITING_PAYMENT: "bg-blue-100 text-blue-800 dark:bg-blue-900/20 dark:text-blue-300",
  PAID: "bg-emerald-100 text-emerald-800 dark:bg-emerald-900/20 dark:text-emerald-300",
  PROCESSING: "bg-indigo-100 text-indigo-800 dark:bg-indigo-900/20 dark:text-indigo-300",
  SHIPPED: "bg-purple-100 text-purple-800 dark:bg-purple-900/20 dark:text-purple-300",
  DELIVERED: "bg-teal-100 text-teal-800 dark:bg-teal-900/20 dark:text-teal-300",
  CANCELLED: "bg-rose-100 text-rose-800 dark:bg-rose-900/20 dark:text-rose-300",
  REFUNDED: "bg-gray-100 text-gray-800 dark:bg-gray-900/20 dark:text-gray-300",
};

const statusLabels: Record<string, string> = {
  PENDING: "Pendente",
  AWAITING_PAYMENT: "Aguardando Pagamento",
  PAID: "Pago",
  PROCESSING: "Em Processamento",
  SHIPPED: "Enviado",
  DELIVERED: "Entregue",
  CANCELLED: "Cancelado",
  REFUNDED: "Reembolsado",
};

export default async function OrdersPage() {
  const supabase = await createClient();
  const { data: { user: authUser } } = await supabase.auth.getUser();

  if (!authUser) return null;

  const dbUser = await prisma.user.findUnique({
    where: { supabaseId: authUser.id },
  });

  if (!dbUser) {
    return (
      <div className="space-y-4">
        <h2 className="display text-3xl text-foreground">Meus Pedidos</h2>
        <div className="text-center py-10 border-2 border-dashed border-foreground bg-muted/20">
          <p className="text-sm text-muted-foreground">Você ainda não possui pedidos registrados.</p>
        </div>
      </div>
    );
  }

  const orders = await prisma.order.findMany({
    where: { userId: dbUser.id },
    orderBy: { createdAt: "desc" },
  });

  return (
    <div className="space-y-6">
      <div className="border-b-2 border-foreground pb-4">
        <span className="label-mono text-primary">[ Histórico ]</span>
        <h2 className="display text-3xl text-foreground mt-2">Meus Pedidos</h2>
        <p className="font-mono text-xs text-muted-foreground mt-1">Acompanhe o status e histórico de todas as suas compras.</p>
      </div>

      {orders.length === 0 ? (
        <div className="text-center py-12 border-2 border-dashed border-foreground bg-muted/20 space-y-3">
          <ShoppingBag className="h-8 w-8 text-muted-foreground mx-auto" />
          <p className="text-sm text-muted-foreground">Nenhum pedido realizado ainda.</p>
          <Link
            href="/produtos"
            className="text-xs text-primary font-bold hover:underline block"
          >
            Navegar pelo catálogo de tapetes
          </Link>
        </div>
      ) : (
        <div className="border-2 border-foreground overflow-hidden bg-card">
          <div className="divide-y-2 divide-foreground">
            {orders.map((order) => (
              <div
                key={order.id}
                className="p-5 flex flex-col sm:flex-row gap-4 sm:items-center justify-between hover:bg-muted/30 transition-colors"
              >
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <p className="font-heading text-sm font-bold text-foreground">
                      Pedido: {order.orderNumber}
                    </p>
                    <Badge className={statusColors[order.status]}>
                      {statusLabels[order.status]}
                    </Badge>
                  </div>
                  <p className="font-mono text-xs text-muted-foreground">
                    Realizado em {formatDate(order.createdAt)}
                  </p>
                </div>

                <div className="flex items-center justify-between sm:justify-end gap-6 border-t-2 border-foreground pt-3 sm:border-t-0 sm:pt-0">
                  <div className="text-left sm:text-right">
                    <span className="font-heading text-sm font-bold text-foreground block">
                      {formatCurrency(Number(order.total))}
                    </span>
                    <span className="font-mono text-[10px] text-muted-foreground">
                      Subtotal: {formatCurrency(Number(order.subtotal))}
                    </span>
                  </div>

                  <Link
                    href={`/minha-conta/pedidos/${order.id}`}
                    className="inline-flex items-center justify-center border-2 border-foreground bg-card px-4 py-1.5 font-mono text-xs font-bold uppercase tracking-wide text-foreground hover:bg-foreground hover:text-background transition-all cursor-pointer"
                  >
                    Detalhes
                  </Link>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
