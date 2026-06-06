import { createClient } from "@/lib/supabase/server";
import prisma from "@/lib/prisma";
import { formatCurrency, formatDate } from "@/lib/utils";
import Link from "next/link";
import { ArrowRight, ClipboardList, ShieldAlert, ShoppingBag, Landmark } from "lucide-react";
import { Badge } from "@/components/ui/badge";

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

export default async function AccountPage() {
  const supabase = await createClient();
  const { data: { user: authUser } } = await supabase.auth.getUser();

  if (!authUser) return null;

  const dbUser = await prisma.user.findUnique({
    where: { supabaseId: authUser.id },
    include: {
      orders: {
        orderBy: { createdAt: "desc" },
        take: 3,
      },
    },
  });

  if (!dbUser) {
    return (
      <div className="space-y-4">
        <h2 className="display text-3xl text-foreground">Painel Geral</h2>
        <div className="p-4 bg-amber-500/10 text-amber-700 flex gap-3 text-sm font-semibold border-2 border-foreground">
          <ShieldAlert className="h-5 w-5 flex-shrink-0" />
          Seu perfil no banco de dados ainda não foi sincronizado. Ele será criado na sua primeira finalização de compra.
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {/* Greetings */}
      <div>
        <span className="label-mono text-primary">[ Painel Geral ]</span>
        <h2 className="display text-4xl text-foreground mt-2">
          Olá, {dbUser.name}!
        </h2>
        <p className="text-sm text-muted-foreground mt-2">
          No seu painel geral, você pode visualizar suas compras recentes, gerenciar endereços e editar seus dados de perfil.
        </p>
      </div>

      {/* Orders Summary */}
      <div className="space-y-4">
        <div className="flex justify-between items-end border-b-2 border-foreground pb-3">
          <h3 className="font-heading text-lg font-extrabold text-foreground">Pedidos Recentes</h3>
          {dbUser.orders.length > 0 && (
            <Link
              href="/minha-conta/pedidos"
              className="font-mono text-xs font-semibold uppercase tracking-wide text-primary hover:underline flex items-center gap-1"
            >
              Ver todos <ArrowRight className="h-3.5 w-3.5" />
            </Link>
          )}
        </div>

        {dbUser.orders.length === 0 ? (
          <div className="text-center py-10 border-2 border-dashed border-foreground bg-muted/20 space-y-3">
            <ShoppingBag className="h-8 w-8 text-muted-foreground mx-auto" />
            <p className="text-sm text-muted-foreground">Você ainda não realizou nenhuma compra.</p>
            <Link
              href="/produtos"
              className="text-xs text-primary font-bold hover:underline block"
            >
              Começar a comprar tapetes
            </Link>
          </div>
        ) : (
          <div className="border-2 border-foreground overflow-hidden bg-card">
            <div className="divide-y-2 divide-foreground">
              {dbUser.orders.map((order) => (
                <div
                  key={order.id}
                  className="p-4 flex flex-col sm:flex-row gap-4 sm:items-center justify-between hover:bg-muted/30 transition-colors"
                >
                  <div className="space-y-1">
                    <p className="font-heading text-xs font-bold text-foreground">
                      Pedido: {order.orderNumber}
                    </p>
                    <p className="font-mono text-[10px] text-muted-foreground">
                      Realizado em {formatDate(order.createdAt)}
                    </p>
                  </div>

                  <div className="flex items-center justify-between sm:justify-end gap-6">
                    <span className="font-heading text-sm font-bold text-foreground">
                      {formatCurrency(Number(order.total))}
                    </span>
                    <Badge className={statusColors[order.status]}>
                      {statusLabels[order.status]}
                    </Badge>
                    <Link
                      href={`/minha-conta/pedidos/${order.id}`}
                      className="text-xs font-semibold text-primary hover:underline"
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

      {/* Profile/Address Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="border-2 border-foreground bg-card p-5 space-y-2">
          <h4 className="label-mono text-primary">[ Dados Cadastrais ]</h4>
          <p className="text-xs text-muted-foreground leading-relaxed">
            Nome: {dbUser.name} {dbUser.surname || ""}<br />
            E-mail: {dbUser.email}<br />
            Telefone: {dbUser.phone || "Não informado"}<br />
            CPF: {dbUser.cpf || "Não informado"}
          </p>
          <Link
            href="/minha-conta/dados"
            className="text-xs font-bold text-primary hover:underline inline-block pt-2"
          >
            Editar dados cadastrais
          </Link>
        </div>

        <div className="border-2 border-foreground bg-card p-5 space-y-2">
          <h4 className="label-mono text-primary">[ Endereços Salvos ]</h4>
          <p className="text-xs text-muted-foreground leading-relaxed">
            Configure seus endereços padrão de entrega para economizar tempo no checkout das próximas compras de tapetes.
          </p>
          <Link
            href="/minha-conta/enderecos"
            className="text-xs font-bold text-primary hover:underline inline-block pt-2"
          >
            Gerenciar endereços
          </Link>
        </div>
      </div>
    </div>
  );
}
