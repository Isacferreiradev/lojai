import { notFound } from "next/navigation";
import prisma from "@/lib/prisma";
import { formatCurrency } from "@/lib/utils";
import { PixPayment } from "@/components/store/pix-payment";

interface PageProps {
  params: Promise<{ id: string }>;
}

export const metadata = { title: "Pagamento PIX" };

export default async function PixCheckoutPage({ params }: PageProps) {
  const { id } = await params;

  const order = await prisma.order.findUnique({
    where: { id },
    include: { payment: true, items: true },
  });

  if (!order) notFound();

  const raw = (order.payment?.rawData ?? {}) as { pix_qr_code?: string | null };
  const pixCode = raw.pix_qr_code ?? null;

  return (
    <div className="container mx-auto flex-1 px-4 py-8 md:px-6">
      <div className="border-b-2 border-foreground pb-6">
        <span className="label-mono text-primary">[ Pagamento ]</span>
        <h1 className="display mt-2 text-4xl text-foreground md:text-5xl">Pague com PIX</h1>
        <p className="mt-2 font-mono text-xs text-muted-foreground">
          Pedido {order.orderNumber} · {formatCurrency(Number(order.total))}
        </p>
      </div>

      <div className="mt-8 grid grid-cols-1 items-start gap-8 lg:grid-cols-3">
        {/* PIX */}
        <div className="lg:col-span-2">
          <PixPayment orderId={order.id} pixCode={pixCode} />
        </div>

        {/* Order summary */}
        <div className="border-2 border-foreground bg-card p-6">
          <h2 className="label-mono mb-4 text-primary">[ Resumo do Pedido ]</h2>
          <div className="divide-y-2 divide-foreground/15">
            {order.items.map((item) => (
              <div key={item.id} className="flex items-center justify-between gap-3 py-2 text-sm">
                <span className="min-w-0 flex-1 truncate text-foreground">
                  {item.quantity}× {item.name}
                </span>
                <span className="font-mono text-muted-foreground">
                  {formatCurrency(Number(item.price) * item.quantity)}
                </span>
              </div>
            ))}
          </div>
          <div className="mt-4 flex items-baseline justify-between border-t-2 border-foreground pt-4">
            <span className="label-mono">Total</span>
            <span className="font-heading text-2xl font-extrabold text-primary">
              {formatCurrency(Number(order.total))}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}
