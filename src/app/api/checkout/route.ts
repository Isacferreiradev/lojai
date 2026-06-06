import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { createTransaction, isIronpayConfigured } from "@/lib/ironpay";
import { PaymentMethod } from "@prisma/client";

const onlyDigits = (v?: string | null) => (v || "").replace(/\D/g, "");

export async function POST(request: Request) {
  try {
    if (!isIronpayConfigured()) {
      return NextResponse.json(
        { error: "Pagamento indisponível: IronPay não configurado (defina IRONPAY_API_TOKEN e IRONPAY_OFFER_HASH)." },
        { status: 503 }
      );
    }

    const { orderId } = await request.json();

    const order = await prisma.order.findUnique({
      where: { id: orderId },
      include: { items: true },
    });

    if (!order) {
      return NextResponse.json({ error: "Pedido não encontrado" }, { status: 404 });
    }

    const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000";
    const amountCents = Math.round(Number(order.total) * 100);

    const cart = order.items.map((item) => ({
      product_hash: item.productId,
      title: item.name,
      cover: item.imageUrl || null,
      price: Math.round(Number(item.price) * 100),
      quantity: item.quantity,
      operation_type: 1,
      tangible: true,
    }));

    // Create a PIX transaction on IronPay
    const tx = await createTransaction({
      amount: amountCents,
      payment_method: "pix",
      installments: 1,
      postback_url: `${siteUrl}/api/webhooks/ironpay`,
      customer: {
        name: `${order.shippingName ?? ""} ${order.shippingSurname ?? ""}`.trim() || "Cliente",
        email: order.shippingEmail || "",
        phone_number: onlyDigits(order.shippingPhone),
        document: onlyDigits(order.shippingCpf),
        street_name: order.shippingStreet || undefined,
        number: order.shippingNumber || undefined,
        complement: order.shippingComplement || undefined,
        neighborhood: undefined,
        city: order.shippingCity || undefined,
        state: order.shippingState || undefined,
        zip_code: onlyDigits(order.shippingCep),
      },
      cart,
    });

    const pixCode = tx.pix?.pix_qr_code || null;

    // Preserve any tracking already stored (fbp/fbc) and add the PIX data
    const existingPayment = await prisma.payment.findUnique({
      where: { orderId: order.id },
      select: { rawData: true },
    });
    const prevRaw = (existingPayment?.rawData ?? {}) as Record<string, unknown>;

    await prisma.payment.update({
      where: { orderId: order.id },
      data: {
        method: PaymentMethod.PIX,
        externalId: tx.hash,
        rawData: { ...prevRaw, pix_qr_code: pixCode, ironpay_id: tx.id, hash: tx.hash } as object,
      },
    });

    return NextResponse.json({
      orderId: order.id,
      hash: tx.hash,
      pixQrCode: pixCode,
    });
  } catch (error: any) {
    console.error("IronPay checkout failed:", error);
    return NextResponse.json(
      { error: error?.message || "Erro ao gerar pagamento PIX" },
      { status: 500 }
    );
  }
}
