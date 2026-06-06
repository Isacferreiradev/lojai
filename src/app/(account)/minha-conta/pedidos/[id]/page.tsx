import { createClient } from "@/lib/supabase/server";
import prisma from "@/lib/prisma";
import { formatCurrency, formatDate } from "@/lib/utils";
import { Badge } from "@/components/ui/badge";
import { notFound } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import { ChevronRight, ArrowLeft, Landmark, Truck, CreditCard, ShieldCheck } from "lucide-react";
import { Button } from "@/components/ui/button";

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

interface PageProps {
  params: Promise<{ id: string }>;
}

export default async function OrderDetailPage({ params }: PageProps) {
  const { id } = await params;

  const supabase = await createClient();
  const { data: { user: authUser } } = await supabase.auth.getUser();

  if (!authUser) return null;

  // Retrieve the order and verify ownership
  const order = await prisma.order.findUnique({
    where: { id },
    include: {
      items: true,
      history: {
        orderBy: { createdAt: "desc" },
      },
      payment: true,
      user: true,
      address: true,
    },
  });

  if (!order || order.user.supabaseId !== authUser.id) {
    notFound();
  }

  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000";

  return (
    <div className="space-y-8">
      {/* Navigation & Back Link */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 border-b-2 border-foreground pb-4">
        <div className="space-y-1">
          <Link
            href="/minha-conta/pedidos"
            className="font-mono text-xs font-semibold uppercase tracking-wide text-muted-foreground hover:text-foreground flex items-center gap-1"
          >
            <ArrowLeft className="h-4.5 w-4.5" /> Voltar para Meus Pedidos
          </Link>
          <h2 className="display text-3xl text-foreground">
            Pedido {order.orderNumber}
          </h2>
          <p className="font-mono text-xs text-muted-foreground">
            Realizado em {formatDate(order.createdAt)}
          </p>
        </div>

        <Badge className={statusColors[order.status]}>
          {statusLabels[order.status]}
        </Badge>
      </div>

      {/* Payment Link Resumption if Awaiting/Pending */}
      {(order.status === "PENDING" || order.status === "AWAITING_PAYMENT") && order.payment?.preferenceId && (
        <div className="bg-amber-500/10 border-2 border-foreground p-5 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div className="space-y-1">
            <h4 className="font-heading font-bold text-sm text-amber-800 dark:text-amber-300">
              Pagamento Pendente
            </h4>
            <p className="text-xs text-muted-foreground leading-normal max-w-lg">
              Ainda não identificamos a compensação do pagamento. Clique no botão ao lado para abrir o Mercado Pago e finalizar a transação.
            </p>
          </div>
          <Button asChild size="sm" className="flex items-center gap-2 cursor-pointer">
            <a
              href={
                process.env.NODE_ENV === "development"
                  ? `https://www.mercadopago.com.br/sandbox/payments/checkout/congrats?preference-id=${order.payment.preferenceId}`
                  : `https://www.mercadopago.com.br/checkout/v1/redirect?pref_id=${order.payment.preferenceId}`
              }
              target="_blank"
              rel="noopener noreferrer"
            >
              <CreditCard className="h-4 w-4" />
              Pagar Agora
            </a>
          </Button>
        </div>
      )}

      {/* Main Order grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8 items-start">
        {/* Left column: Order items & Summary */}
        <div className="md:col-span-2 space-y-6">
          <div className="border-2 border-foreground bg-card overflow-hidden shadow-sm">
            <div className="p-4 bg-muted/30 border-b-2 border-foreground label-mono text-primary">
              Itens do Pedido
            </div>
            <div className="divide-y-2 divide-foreground">
              {order.items.map((item) => (
                <div key={item.id} className="p-4 flex gap-4 items-center">
                  <div className="relative h-16 w-16 border-2 border-foreground overflow-hidden bg-muted flex-shrink-0">
                    <Image
                      src={item.imageUrl || "/images/placeholder.png"}
                      alt={item.name}
                      fill
                      className="object-cover"
                      sizes="64px"
                    />
                  </div>
                  <div className="flex-grow min-w-0 space-y-0.5">
                    <h4 className="text-sm font-semibold text-foreground truncate">{item.name}</h4>
                    <p className="text-[10px] text-muted-foreground">SKU: {item.sku}</p>
                    <p className="text-[10px] text-muted-foreground">
                      {item.color && `Cor: ${item.color}`}
                      {item.color && item.size && " | "}
                      {item.size && `Tamanho: ${item.size}`}
                    </p>
                  </div>
                  <div className="text-right flex-shrink-0 min-w-[70px]">
                    <span className="text-sm font-bold text-foreground block">
                      {formatCurrency(Number(item.price) * item.quantity)}
                    </span>
                    <span className="text-[10px] text-muted-foreground">
                      {item.quantity}x • {formatCurrency(Number(item.price))}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Timeline */}
          <div className="border-2 border-foreground bg-card p-6 shadow-sm space-y-4">
            <h3 className="label-mono text-primary border-b-2 border-foreground pb-2 flex items-center gap-2">
              <Landmark className="h-4.5 w-4.5 text-primary" /> Histórico do Pedido
            </h3>
            <div className="relative border-l-2 border-foreground pl-6 ml-2 space-y-6">
              {order.history.map((log) => (
                <div key={log.id} className="relative">
                  {/* Indicator Dot */}
                  <span className="absolute -left-[31px] top-1 h-3 w-3 border-2 border-foreground bg-primary" />
                  <p className="font-heading text-xs font-bold text-foreground">{statusLabels[log.status]}</p>
                  <p className="text-[10px] text-muted-foreground mt-0.5">{formatDate(log.createdAt)}</p>
                  {log.note && <p className="text-xs text-muted-foreground mt-1.5 leading-relaxed">{log.note}</p>}
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Right column: Delivery Address & Totals */}
        <div className="space-y-6">
          <div className="border-2 border-foreground bg-card p-5 shadow-sm space-y-4">
            <h3 className="label-mono text-primary border-b-2 border-foreground pb-2 flex items-center gap-2">
              <Truck className="h-4.5 w-4.5 text-primary" /> Endereço de Entrega
            </h3>
            <p className="text-xs text-muted-foreground leading-relaxed">
              <span className="font-semibold text-foreground">
                {order.shippingName} {order.shippingSurname}
              </span>
              <br />
              {order.shippingStreet}, {order.shippingNumber}
              {order.shippingComplement && ` - ${order.shippingComplement}`}
              <br />
              {order.address?.neighborhood}
              <br />
              {order.shippingCity} - {order.shippingState}
              <br />
              CEP: {order.shippingCep}
              <br />
              Telefone: {order.shippingPhone}
            </p>
          </div>

          <div className="border-2 border-foreground bg-card p-5 shadow-sm space-y-4">
            <h3 className="label-mono text-primary border-b-2 border-foreground pb-2">
              Resumo Financeiro
            </h3>
            <div className="space-y-2.5 text-xs">
              <div className="flex justify-between text-muted-foreground">
                <span>Subtotal</span>
                <span className="font-mono font-semibold text-foreground">{formatCurrency(Number(order.subtotal))}</span>
              </div>
              {Number(order.discount) > 0 && (
                <div className="flex justify-between text-primary font-semibold">
                  <span>Desconto de Cupom</span>
                  <span className="font-mono">-{formatCurrency(Number(order.discount))}</span>
                </div>
              )}
              <div className="flex justify-between text-muted-foreground">
                <span>Frete</span>
                <span className="font-mono">{Number(order.shipping) === 0 ? "Grátis" : formatCurrency(Number(order.shipping))}</span>
              </div>
              <div className="flex items-baseline justify-between border-t-2 border-foreground pt-3.5 text-foreground">
                <span className="label-mono">Total Pago</span>
                <span className="font-heading text-xl font-extrabold text-primary">{formatCurrency(Number(order.total))}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
