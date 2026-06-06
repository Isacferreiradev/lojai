import { notFound } from "next/navigation";
import { getAdminOrder } from "@/actions/admin";
import { PageHeader, StatusBadge } from "@/components/admin/ui";
import { OrderStatusUpdater } from "@/components/admin/order-status-updater";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { formatCurrency, formatDate } from "@/lib/utils";
import { Package, User, MapPin, CreditCard, Clock, Tag } from "lucide-react";

interface PageProps {
  params: Promise<{ id: string }>;
}

export default async function AdminOrderDetailPage({ params }: PageProps) {
  const { id } = await params;
  const order = await getAdminOrder(id);

  if (!order) notFound();

  return (
    <div>
      <PageHeader
        title={`Pedido ${order.orderNumber}`}
        description={`Criado em ${formatDate(order.createdAt)}`}
        backHref="/admin/pedidos"
        actions={<StatusBadge status={order.status} className="text-sm px-3 py-1" />}
      />

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left column */}
        <div className="lg:col-span-2 space-y-6">
          {/* Items */}
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-bold flex items-center gap-2">
                <Package className="h-4 w-4 text-primary" /> Itens do Pedido
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              {order.items.map((item) => (
                <div
                  key={item.id}
                  className="flex items-center gap-4 p-3 bg-muted/30 border-2 border-foreground"
                >
                  {item.imageUrl && (
                    <img
                      src={item.imageUrl}
                      alt={item.name}
                      className="w-14 h-14 object-cover border-2 border-foreground flex-shrink-0"
                    />
                  )}
                  <div className="flex-1 min-w-0">
                    <p className="font-semibold text-sm text-foreground truncate">{item.name}</p>
                    <p className="text-xs text-muted-foreground">
                      SKU: {item.sku}
                      {item.color && ` • Cor: ${item.color}`}
                      {item.size && ` • Tam: ${item.size}`}
                    </p>
                  </div>
                  <div className="text-right flex-shrink-0">
                    <p className="text-xs text-muted-foreground">× {item.quantity}</p>
                    <p className="font-bold text-sm text-foreground">
                      {formatCurrency(Number(item.price) * item.quantity)}
                    </p>
                  </div>
                </div>
              ))}

              {/* Order totals */}
              <div className="border-t border-border/40 pt-3 space-y-1.5 text-sm">
                <div className="flex justify-between text-muted-foreground">
                  <span>Subtotal</span>
                  <span>{formatCurrency(Number(order.subtotal))}</span>
                </div>
                {Number(order.discount) > 0 && (
                  <div className="flex justify-between text-green-600">
                    <span>Desconto</span>
                    <span>- {formatCurrency(Number(order.discount))}</span>
                  </div>
                )}
                <div className="flex justify-between text-muted-foreground">
                  <span>Frete</span>
                  <span>
                    {Number(order.shipping) === 0 ? (
                      <span className="text-green-600 font-semibold">Grátis</span>
                    ) : (
                      formatCurrency(Number(order.shipping))
                    )}
                  </span>
                </div>
                <div className="flex justify-between font-bold text-foreground text-base border-t-2 border-foreground pt-2">
                  <span>Total</span>
                  <span>{formatCurrency(Number(order.total))}</span>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Order History */}
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-bold flex items-center gap-2">
                <Clock className="h-4 w-4 text-primary" /> Histórico do Pedido
              </CardTitle>
            </CardHeader>
            <CardContent>
              {order.history.length === 0 ? (
                <p className="text-sm text-muted-foreground">Nenhum histórico disponível.</p>
              ) : (
                <ol className="relative border-l-2 border-foreground ml-3 space-y-4">
                  {order.history.map((event) => (
                    <li key={event.id} className="ml-4">
                      <div className="absolute -left-[7px] mt-1.5 h-3 w-3 border-2 border-foreground bg-primary" />
                      <div className="flex flex-col gap-0.5">
                        <StatusBadge status={event.status} />
                        {event.note && (
                          <p className="text-xs text-muted-foreground mt-1">{event.note}</p>
                        )}
                        <p className="text-[11px] text-muted-foreground/70">
                          {formatDate(event.createdAt)}
                          {event.changedBy && ` · por ${event.changedBy}`}
                        </p>
                      </div>
                    </li>
                  ))}
                </ol>
              )}
            </CardContent>
          </Card>
        </div>

        {/* Right column */}
        <div className="space-y-6">
          {/* Status Updater */}
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-bold">Atualizar Status</CardTitle>
            </CardHeader>
            <CardContent>
              <OrderStatusUpdater orderId={order.id} currentStatus={order.status} />
            </CardContent>
          </Card>

          {/* Customer Info */}
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-bold flex items-center gap-2">
                <User className="h-4 w-4 text-primary" /> Cliente
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-1.5 text-sm">
              <p className="font-semibold">{order.shippingName} {order.shippingSurname}</p>
              <p className="text-muted-foreground">{order.shippingEmail}</p>
              {order.shippingPhone && <p className="text-muted-foreground">{order.shippingPhone}</p>}
              {order.shippingCpf && <p className="text-muted-foreground text-xs">CPF: {order.shippingCpf}</p>}
            </CardContent>
          </Card>

          {/* Shipping Address */}
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-bold flex items-center gap-2">
                <MapPin className="h-4 w-4 text-primary" /> Endereço de Entrega
              </CardTitle>
            </CardHeader>
            <CardContent className="text-sm text-muted-foreground space-y-0.5">
              <p>{order.shippingStreet}, {order.shippingNumber}</p>
              {order.shippingComplement && <p>{order.shippingComplement}</p>}
              <p>{order.shippingCity} — {order.shippingState}</p>
              <p>CEP: {order.shippingCep}</p>
            </CardContent>
          </Card>

          {/* Payment Info */}
          {order.payment && (
            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="text-sm font-bold flex items-center gap-2">
                  <CreditCard className="h-4 w-4 text-primary" /> Pagamento
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Status</span>
                  <StatusBadge status={order.payment.status} />
                </div>
                {order.payment.method && (
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Método</span>
                    <StatusBadge status={order.payment.method} />
                  </div>
                )}
                {order.payment.paidAt && (
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Pago em</span>
                    <span>{formatDate(order.payment.paidAt)}</span>
                  </div>
                )}
              </CardContent>
            </Card>
          )}

          {/* Coupon */}
          {order.coupon && (
            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="text-sm font-bold flex items-center gap-2">
                  <Tag className="h-4 w-4 text-primary" /> Cupom Utilizado
                </CardTitle>
              </CardHeader>
              <CardContent className="text-sm">
                <p className="font-mono font-bold text-primary">{order.coupon.code}</p>
                <p className="text-muted-foreground text-xs mt-1">
                  {order.coupon.type === "PERCENTAGE"
                    ? `${Number(order.coupon.value)}% de desconto`
                    : `${formatCurrency(Number(order.coupon.value))} de desconto`}
                </p>
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    </div>
  );
}
