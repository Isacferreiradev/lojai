"use server";

import prisma from "@/lib/prisma";
import { CheckoutFormData } from "@/schemas/checkout";
import { CartItem } from "@/types";
import { generateOrderNumber } from "@/lib/utils";
import { OrderStatus, PaymentStatus } from "@prisma/client";

// Validate a coupon code and calculate discount
export async function validateCoupon(code: string, orderValue: number) {
  try {
    const coupon = await prisma.coupon.findUnique({
      where: { code: code.toUpperCase() },
    });

    if (!coupon || !coupon.isActive) {
      return { isValid: false, message: "Cupom inválido ou inativo." };
    }

    if (coupon.expiresAt && new Date(coupon.expiresAt) < new Date()) {
      return { isValid: false, message: "Cupom expirado." };
    }

    if (coupon.maxUses && coupon.usedCount >= coupon.maxUses) {
      return { isValid: false, message: "Cupom esgotado." };
    }

    const minOrderVal = coupon.minOrderValue ? Number(coupon.minOrderValue) : 0;
    if (orderValue < minOrderVal) {
      return {
        isValid: false,
        message: `Este cupom é válido apenas para compras acima de R$ ${minOrderVal.toFixed(2)}.`,
      };
    }

    const discountAmount =
      coupon.type === "PERCENTAGE"
        ? orderValue * (Number(coupon.value) / 100)
        : Number(coupon.value);

    return {
      isValid: true,
      couponId: coupon.id,
      code: coupon.code,
      type: coupon.type,
      value: Number(coupon.value),
      discount: Math.min(discountAmount, orderValue),
    };
  } catch (error) {
    console.error("Failed to validate coupon:", error);
    return { isValid: false, message: "Erro ao validar cupom." };
  }
}

// Create an order inside a transaction
export async function createOrder(
  formData: CheckoutFormData,
  cartItems: CartItem[],
  couponCode?: string | null,
  tracking?: { fbp?: string; fbc?: string }
) {
  try {
    // 1. Guest checkout — resolve or create a lead by e-mail (no login required)
    let dbUser = await prisma.user.findUnique({
      where: { email: formData.email },
    });

    if (!dbUser) {
      dbUser = await prisma.user.create({
        data: {
          // synthetic id since there is no auth provider for guests
          supabaseId: `guest_${crypto.randomUUID()}`,
          email: formData.email,
          name: formData.name,
          surname: formData.surname,
          phone: formData.phone,
          cpf: formData.cpf || null,
        },
      });
    }

    // 2. Perform Stock & Price Calculations
    const subtotal = cartItems.reduce(
      (acc, item) => acc + (item.promoPrice ?? item.price) * item.quantity,
      0
    );

    let discount = 0;
    let couponId: string | undefined = undefined;

    if (couponCode) {
      const couponResult = await validateCoupon(couponCode, subtotal);
      if (couponResult.isValid && couponResult.discount !== undefined) {
        discount = couponResult.discount;
        couponId = couponResult.couponId;
      } else {
        return { success: false, error: couponResult.message };
      }
    }

    // Simple shipping logic: flat rate or free shipping above threshold
    const shipping = subtotal > 350 ? 0 : 45.0;
    const total = Math.max(0, subtotal - discount + shipping);

    const orderNumber = generateOrderNumber();

    // 3. Database Transaction to guarantee atomic operations
    const order = await prisma.$transaction(async (tx) => {
      // a. Verify and update stock for each product
      for (const item of cartItems) {
        const product = await tx.product.findUnique({
          where: { id: item.productId },
          select: { stock: true, name: true },
        });

        if (!product) {
          throw new Error(`Produto ${item.name} não encontrado.`);
        }

        if (product.stock < item.quantity) {
          throw new Error(`Quantidade solicitada de "${product.name}" não está disponível em estoque.`);
        }

        // Decrement stock
        await tx.product.update({
          where: { id: item.productId },
          data: {
            stock: { decrement: item.quantity },
            totalSold: { increment: item.quantity },
          },
        });
      }

      // b. Create shipping address if it doesn't exist under user's profile
      const address = await tx.address.create({
        data: {
          userId: dbUser!.id,
          cep: formData.cep,
          street: formData.street,
          number: formData.number,
          complement: formData.complement,
          neighborhood: formData.neighborhood,
          city: formData.city,
          state: formData.state,
          label: "Endereço de Entrega",
        },
      });

      // c. Create Order
      const newOrder = await tx.order.create({
        data: {
          orderNumber,
          userId: dbUser!.id,
          addressId: address.id,
          status: OrderStatus.PENDING,
          subtotal,
          shipping,
          discount,
          total,
          couponId,
          shippingName: formData.name,
          shippingSurname: formData.surname,
          shippingCpf: formData.cpf,
          shippingPhone: formData.phone,
          shippingEmail: formData.email,
          shippingCep: formData.cep,
          shippingStreet: formData.street,
          shippingNumber: formData.number,
          shippingComplement: formData.complement,
          shippingCity: formData.city,
          shippingState: formData.state,
          notes: formData.notes,
        },
      });

      // d. Create Order Items
      await tx.orderItem.createMany({
        data: cartItems.map((item) => ({
          orderId: newOrder.id,
          productId: item.productId,
          name: item.name,
          sku: item.sku,
          price: item.promoPrice ?? item.price,
          quantity: item.quantity,
          color: item.color,
          size: item.size,
          imageUrl: item.imageUrl,
        })),
      });

      // e. Create Payment record (guarda fbp/fbc p/ a Conversions API)
      await tx.payment.create({
        data: {
          orderId: newOrder.id,
          status: PaymentStatus.PENDING,
          amount: total,
          rawData:
            tracking && (tracking.fbp || tracking.fbc)
              ? ({ fbp: tracking.fbp ?? null, fbc: tracking.fbc ?? null } as object)
              : undefined,
        },
      });

      // f. Create Order History Log
      await tx.orderHistory.create({
        data: {
          orderId: newOrder.id,
          status: OrderStatus.PENDING,
          note: "Pedido realizado com sucesso. Aguardando geração do link de pagamento.",
        },
      });

      // g. If coupon used, increment coupon use count
      if (couponId) {
        await tx.coupon.update({
          where: { id: couponId },
          data: { usedCount: { increment: 1 } },
        });

        await tx.couponUsage.create({
          data: {
            couponId,
            userId: dbUser!.id,
          },
        });
      }

      return newOrder;
    });

    return { success: true, orderId: order.id, orderNumber: order.orderNumber };
  } catch (error: any) {
    console.error("Order creation failed:", error);
    return { success: false, error: error.message || "Falha ao finalizar o pedido. Tente novamente." };
  }
}
