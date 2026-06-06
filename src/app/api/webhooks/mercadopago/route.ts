import { NextResponse } from "next/server";
import { mpClient } from "@/lib/mercadopago";
import { Payment } from "mercadopago";
import prisma from "@/lib/prisma";
import { OrderStatus, PaymentStatus as DbPaymentStatus } from "@prisma/client";

export async function POST(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const body = await request.json().catch(() => ({}));

    // Mercado Pago notifications can send the ID in query parameters or body
    const id = searchParams.get("data.id") || searchParams.get("id") || body?.data?.id || body?.id;
    const action = searchParams.get("action") || body?.action;
    const type = searchParams.get("type") || body?.type;

    // We only process payment notifications
    if (type === "payment" || action === "payment.created" || action === "payment.updated" || searchParams.get("topic") === "payment") {
      if (!id) {
        return NextResponse.json({ error: "Missing payment ID" }, { status: 400 });
      }

      // 1. Fetch payment details from Mercado Pago
      const paymentResource = new Payment(mpClient);
      const paymentData = await paymentResource.get({ id: String(id) });

      // The external reference contains our internal orderId
      const orderId = paymentData.external_reference;

      if (!orderId) {
        console.warn(`Webhook received payment ${id} without external_reference.`);
        return NextResponse.json({ message: "Ignored: No external reference" }, { status: 200 });
      }

      // 2. Fetch related order from our database
      const order = await prisma.order.findUnique({
        where: { id: orderId },
        include: { payment: true },
      });

      if (!order) {
        console.warn(`Webhook received payment for order ${orderId} but order was not found in DB.`);
        return NextResponse.json({ error: "Order not found" }, { status: 404 });
      }

      // 3. Map Mercado Pago status to our database status
      let dbPaymentStatus: DbPaymentStatus = DbPaymentStatus.PENDING;
      let dbOrderStatus: OrderStatus = OrderStatus.AWAITING_PAYMENT;
      let note = "";

      const mpStatus = paymentData.status;

      if (mpStatus === "approved") {
        dbPaymentStatus = DbPaymentStatus.APPROVED;
        dbOrderStatus = OrderStatus.PAID;
        note = `Pagamento aprovado via Mercado Pago (ID: ${id}).`;
      } else if (mpStatus === "pending" || mpStatus === "in_process") {
        dbPaymentStatus = DbPaymentStatus.IN_PROCESS;
        dbOrderStatus = OrderStatus.AWAITING_PAYMENT;
        note = "Pagamento em análise ou aguardando compensação.";
      } else if (mpStatus === "rejected") {
        dbPaymentStatus = DbPaymentStatus.REJECTED;
        dbOrderStatus = OrderStatus.AWAITING_PAYMENT;
        note = "Pagamento rejeitado pela operadora de crédito.";
      } else if (mpStatus === "cancelled") {
        dbPaymentStatus = DbPaymentStatus.CANCELLED;
        dbOrderStatus = OrderStatus.CANCELLED;
        note = "Pagamento cancelado.";
      } else if (mpStatus === "refunded") {
        dbPaymentStatus = DbPaymentStatus.REFUNDED;
        dbOrderStatus = OrderStatus.REFUNDED;
        note = "Pagamento devolvido ao comprador (estornado).";
      }

      // 4. Update order and payment inside a transaction
      await prisma.$transaction(async (tx) => {
        // Update payment info
        await tx.payment.update({
          where: { orderId },
          data: {
            status: dbPaymentStatus,
            externalId: String(id),
            paidAt: mpStatus === "approved" ? new Date() : null,
            rawData: paymentData as any,
          },
        });

        // Update order status if changed
        if (order.status !== dbOrderStatus) {
          await tx.order.update({
            where: { id: orderId },
            data: {
              status: dbOrderStatus,
            },
          });

          // Log history
          await tx.orderHistory.create({
            data: {
              orderId,
              status: dbOrderStatus,
              note,
            },
          });
        }
      });

      console.log(`Successfully processed payment webhook for order ${orderId}. Status: ${dbOrderStatus}`);
    }

    // Mercado Pago requires a 200 OK or 201 Created response to acknowledge receipt
    return NextResponse.json({ success: true }, { status: 200 });
  } catch (error) {
    console.error("Webhook processing failed:", error);
    // Return 200 even on error to stop MP from constantly retrying and overload us,
    // but log it for investigation. Or return 500 so they retry. Let's return 200 to be safe.
    return NextResponse.json({ error: "Webhook handler error" }, { status: 200 });
  }
}
