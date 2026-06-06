import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { getTransaction, mapIronpayStatus } from "@/lib/ironpay";
import { OrderStatus, PaymentStatus } from "@prisma/client";

// Healthcheck — visiting in a browser (GET) confirms the endpoint is live.
// IronPay delivers events via POST below.
export async function GET() {
  return NextResponse.json({
    ok: true,
    service: "ironpay-webhook",
    message: "Endpoint ativo. Os eventos do IronPay são recebidos via POST.",
  });
}

export async function POST(request: Request) {
  try {
    const body = await request.json().catch(() => ({} as any));

    const hash: string | undefined = body?.hash || body?.transaction_hash || body?.data?.hash;
    if (!hash) {
      return NextResponse.json({ message: "Ignored: no transaction hash" }, { status: 200 });
    }

    // Verify the real status directly with IronPay (don't trust the raw postback)
    const verified = await getTransaction(hash);
    const statusRaw = verified?.payment_status || body?.payment_status || "pending";
    const mapped = mapIronpayStatus(statusRaw);

    // Locate the order by the gateway reference stored at checkout
    const payment = await prisma.payment.findUnique({
      where: { externalId: hash },
      include: { order: true },
    });

    if (!payment) {
      console.warn(`IronPay webhook: no payment found for hash ${hash}`);
      return NextResponse.json({ message: "Order not found" }, { status: 200 });
    }

    const orderId = payment.orderId;
    const isPaid = mapped.order === "PAID";

    await prisma.$transaction(async (tx) => {
      await tx.payment.update({
        where: { orderId },
        data: {
          status: PaymentStatus[mapped.payment],
          paidAt: isPaid ? new Date() : null,
          rawData: (verified ?? body) as object,
        },
      });

      if (payment.order.status !== mapped.order) {
        await tx.order.update({
          where: { id: orderId },
          data: { status: OrderStatus[mapped.order] },
        });
        await tx.orderHistory.create({
          data: {
            orderId,
            status: OrderStatus[mapped.order],
            note: `Atualização IronPay: pagamento "${statusRaw}".`,
          },
        });
      }
    });

    return NextResponse.json({ success: true }, { status: 200 });
  } catch (error) {
    console.error("IronPay webhook failed:", error);
    return NextResponse.json({ error: "Webhook handler error" }, { status: 200 });
  }
}
