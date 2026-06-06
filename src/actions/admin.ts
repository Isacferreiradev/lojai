"use server";

import prisma from "@/lib/prisma";
import { cookies } from "next/headers";
import { revalidatePath } from "next/cache";

const ADMIN_COOKIE = "lojai_admin";
import { OrderStatus, Role } from "@prisma/client";
import {
  ProductFormData,
  CategoryFormData,
  CouponFormData,
  ReviewFormData,
  SettingsFormData,
} from "@/schemas/admin";

// ─── Auth Guard ───────────────────────────────────────────────────────────────

async function checkAdminAuth() {
  const cookieStore = await cookies();
  const expected = process.env.ADMIN_PASSWORD;

  if (!expected || cookieStore.get(ADMIN_COOKIE)?.value !== expected) {
    throw new Error("Não autorizado");
  }

  return { id: "admin", name: "Admin", role: "SUPER_ADMIN" as const };
}

type ActionResult = { success: boolean; error?: string };

// ═══════════════════════════════════════════════════════════════════════════════
// DASHBOARD STATS
// ═══════════════════════════════════════════════════════════════════════════════

export async function getAdminStats() {
  await checkAdminAuth();

  try {
    const activeStatuses: OrderStatus[] = [
      OrderStatus.PAID,
      OrderStatus.PROCESSING,
      OrderStatus.SHIPPED,
      OrderStatus.DELIVERED,
    ];

    const [totalOrders, totalUsers, paidOrders] = await Promise.all([
      prisma.order.count(),
      prisma.user.count({ where: { role: "CUSTOMER" } }),
      prisma.order.findMany({
        where: { status: { in: activeStatuses } },
        select: { total: true },
      }),
    ]);

    const totalRevenue = paidOrders.reduce(
      (acc, order) => acc + Number(order.total),
      0
    );
    const avgOrderValue =
      paidOrders.length > 0 ? totalRevenue / paidOrders.length : 0;

    // Last 7 days sales chart
    const sevenDaysAgo = new Date();
    sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);

    const salesHistoryRaw = await prisma.order.findMany({
      where: {
        status: { in: activeStatuses },
        createdAt: { gte: sevenDaysAgo },
      },
      select: { createdAt: true, total: true },
      orderBy: { createdAt: "asc" },
    });

    const dailySales: Record<string, number> = {};
    for (let i = 6; i >= 0; i--) {
      const d = new Date();
      d.setDate(d.getDate() - i);
      const dateStr = d.toLocaleDateString("pt-BR", {
        day: "2-digit",
        month: "2-digit",
      });
      dailySales[dateStr] = 0;
    }

    salesHistoryRaw.forEach((order) => {
      const dateStr = order.createdAt.toLocaleDateString("pt-BR", {
        day: "2-digit",
        month: "2-digit",
      });
      if (dailySales[dateStr] !== undefined) {
        dailySales[dateStr] += Number(order.total);
      }
    });

    const salesChartData = Object.entries(dailySales).map(([date, sales]) => ({
      date,
      vendas: Number(sales.toFixed(2)),
    }));

    // Top selling products
    const orderItems = await prisma.orderItem.findMany({
      where: { order: { status: { in: activeStatuses } } },
      select: { name: true, quantity: true },
    });

    const productsMap: Record<string, number> = {};
    orderItems.forEach((item) => {
      productsMap[item.name] = (productsMap[item.name] || 0) + item.quantity;
    });

    const topProductsChartData = Object.entries(productsMap)
      .map(([name, quantity]) => ({
        name: name.split(" ").slice(0, 3).join(" "),
        quantidade: quantity,
      }))
      .sort((a, b) => b.quantidade - a.quantidade)
      .slice(0, 5);

    return {
      totalRevenue,
      totalOrders,
      totalUsers,
      avgOrderValue,
      salesChartData,
      topProductsChartData,
    };
  } catch (error) {
    console.error("Failed to fetch admin stats:", error);
    return {
      totalRevenue: 0,
      totalOrders: 0,
      totalUsers: 0,
      avgOrderValue: 0,
      salesChartData: [],
      topProductsChartData: [],
    };
  }
}

// ═══════════════════════════════════════════════════════════════════════════════
// PRODUCTS
// ═══════════════════════════════════════════════════════════════════════════════

export async function getAdminProducts(params?: {
  search?: string;
  categoryId?: string;
  isActive?: boolean;
  page?: number;
  limit?: number;
}) {
  await checkAdminAuth();

  const { search, categoryId, isActive, page = 1, limit = 20 } = params || {};
  const skip = (page - 1) * limit;

  const where: any = {};
  if (search) {
    where.OR = [
      { name: { contains: search, mode: "insensitive" } },
      { sku: { contains: search, mode: "insensitive" } },
    ];
  }
  if (categoryId) where.categoryId = categoryId;
  if (isActive !== undefined) where.isActive = isActive;

  try {
    const [products, total] = await Promise.all([
      prisma.product.findMany({
        where,
        include: {
          category: { select: { name: true } },
          images: { orderBy: { sortOrder: "asc" }, take: 1 },
          _count: { select: { reviews: true } },
        },
        orderBy: { createdAt: "desc" },
        skip,
        take: limit,
      }),
      prisma.product.count({ where }),
    ]);

    return { products, total, pages: Math.ceil(total / limit) };
  } catch (error) {
    console.error("Failed to fetch admin products:", error);
    return { products: [], total: 0, pages: 0 };
  }
}

export async function getAdminProduct(id: string) {
  await checkAdminAuth();
  try {
    return await prisma.product.findUnique({
      where: { id },
      include: {
        images: { orderBy: { sortOrder: "asc" } },
        category: true,
      },
    });
  } catch (error) {
    console.error("Failed to fetch product:", error);
    return null;
  }
}

export async function createProduct(data: ProductFormData, imageUrls: string[]): Promise<ActionResult & { id?: string }> {
  const admin = await checkAdminAuth();

  try {
    const slug = data.slug
      .toLowerCase()
      .replace(/\s+/g, "-")
      .replace(/[^a-z0-9-]/g, "");

    const product = await prisma.$transaction(async (tx) => {
      const created = await tx.product.create({
        data: {
          name: data.name,
          slug,
          sku: data.sku,
          description: data.description,
          brand: data.brand,
          price: data.price,
          promoPrice: data.promoPrice || null,
          stock: data.stock,
          categoryId: data.categoryId,
          material: data.material,
          colors: data.colors,
          sizes: data.sizes,
          weight: data.weight || null,
          width: data.width || null,
          height: data.height || null,
          depth: data.depth || null,
          isWashable: data.isWashable,
          isActive: data.isActive,
          isFeatured: data.isFeatured,
          metaTitle: data.metaTitle,
          metaDescription: data.metaDescription,
          metaKeywords: data.metaKeywords,
        },
      });

      if (imageUrls.length > 0) {
        await tx.productImage.createMany({
          data: imageUrls.map((url, i) => ({
            productId: created.id,
            url,
            sortOrder: i,
          })),
        });
      }

      await tx.adminLog.create({
        data: {
          userId: admin.id,
          action: "CREATE",
          entity: "product",
          entityId: created.id,
          details: { name: created.name },
        },
      });

      return created;
    });

    revalidatePath("/admin/produtos");
    revalidatePath("/catalogo");
    return { success: true, id: product.id };
  } catch (error: any) {
    console.error("Failed to create product:", error);
    if (error.code === "P2002") {
      return { success: false, error: "Já existe um produto com este slug ou SKU." };
    }
    return { success: false, error: error.message || "Erro ao criar produto." };
  }
}

export async function updateProduct(id: string, data: ProductFormData, imageUrls: string[]): Promise<ActionResult> {
  const admin = await checkAdminAuth();

  try {
    await prisma.$transaction(async (tx) => {
      await tx.product.update({
        where: { id },
        data: {
          name: data.name,
          slug: data.slug,
          sku: data.sku,
          description: data.description,
          brand: data.brand,
          price: data.price,
          promoPrice: data.promoPrice || null,
          stock: data.stock,
          categoryId: data.categoryId,
          material: data.material,
          colors: data.colors,
          sizes: data.sizes,
          weight: data.weight || null,
          width: data.width || null,
          height: data.height || null,
          depth: data.depth || null,
          isWashable: data.isWashable,
          isActive: data.isActive,
          isFeatured: data.isFeatured,
          metaTitle: data.metaTitle,
          metaDescription: data.metaDescription,
          metaKeywords: data.metaKeywords,
        },
      });

      // Replace images if new ones provided
      if (imageUrls.length > 0) {
        await tx.productImage.deleteMany({ where: { productId: id } });
        await tx.productImage.createMany({
          data: imageUrls.map((url, i) => ({
            productId: id,
            url,
            sortOrder: i,
          })),
        });
      }

      await tx.adminLog.create({
        data: {
          userId: admin.id,
          action: "UPDATE",
          entity: "product",
          entityId: id,
          details: { name: data.name },
        },
      });
    });

    revalidatePath("/admin/produtos");
    revalidatePath(`/produto/${data.slug}`);
    revalidatePath("/catalogo");
    return { success: true };
  } catch (error: any) {
    console.error("Failed to update product:", error);
    return { success: false, error: error.message || "Erro ao atualizar produto." };
  }
}

export async function deleteProduct(id: string): Promise<ActionResult> {
  const admin = await checkAdminAuth();

  try {
    const product = await prisma.product.findUnique({
      where: { id },
      select: { name: true, orderItems: { take: 1 } },
    });

    if (!product) return { success: false, error: "Produto não encontrado." };
    if (product.orderItems.length > 0) {
      // Soft delete if has orders
      await prisma.product.update({ where: { id }, data: { isActive: false } });
    } else {
      await prisma.product.delete({ where: { id } });
    }

    await prisma.adminLog.create({
      data: {
        userId: admin.id,
        action: "DELETE",
        entity: "product",
        entityId: id,
        details: { name: product.name },
      },
    });

    revalidatePath("/admin/produtos");
    revalidatePath("/catalogo");
    return { success: true };
  } catch (error: any) {
    console.error("Failed to delete product:", error);
    return { success: false, error: error.message || "Erro ao excluir produto." };
  }
}

// ═══════════════════════════════════════════════════════════════════════════════
// CATEGORIES
// ═══════════════════════════════════════════════════════════════════════════════

export async function getAdminCategories() {
  await checkAdminAuth();
  try {
    return await prisma.category.findMany({
      include: { _count: { select: { products: true } } },
      orderBy: { sortOrder: "asc" },
    });
  } catch (error) {
    console.error("Failed to fetch categories:", error);
    return [];
  }
}

export async function createCategory(data: CategoryFormData): Promise<ActionResult> {
  const admin = await checkAdminAuth();
  try {
    const category = await prisma.category.create({
      data: {
        name: data.name,
        slug: data.slug,
        description: data.description,
        image: data.image || null,
        isActive: data.isActive,
        sortOrder: data.sortOrder,
      },
    });

    await prisma.adminLog.create({
      data: {
        userId: admin.id,
        action: "CREATE",
        entity: "category",
        entityId: category.id,
        details: { name: category.name },
      },
    });

    revalidatePath("/admin/categorias");
    revalidatePath("/");
    return { success: true };
  } catch (error: any) {
    if (error.code === "P2002") return { success: false, error: "Já existe uma categoria com este slug." };
    return { success: false, error: error.message || "Erro ao criar categoria." };
  }
}

export async function updateCategory(id: string, data: CategoryFormData): Promise<ActionResult> {
  const admin = await checkAdminAuth();
  try {
    await prisma.category.update({
      where: { id },
      data: {
        name: data.name,
        slug: data.slug,
        description: data.description,
        image: data.image || null,
        isActive: data.isActive,
        sortOrder: data.sortOrder,
      },
    });

    await prisma.adminLog.create({
      data: {
        userId: admin.id,
        action: "UPDATE",
        entity: "category",
        entityId: id,
        details: { name: data.name },
      },
    });

    revalidatePath("/admin/categorias");
    revalidatePath("/");
    return { success: true };
  } catch (error: any) {
    return { success: false, error: error.message || "Erro ao atualizar categoria." };
  }
}

export async function deleteCategory(id: string): Promise<ActionResult> {
  const admin = await checkAdminAuth();
  try {
    const category = await prisma.category.findUnique({
      where: { id },
      include: { _count: { select: { products: true } } },
    });

    if (!category) return { success: false, error: "Categoria não encontrada." };
    if (category._count.products > 0) {
      return { success: false, error: `Esta categoria possui ${category._count.products} produtos associados.` };
    }

    await prisma.category.delete({ where: { id } });

    await prisma.adminLog.create({
      data: {
        userId: admin.id,
        action: "DELETE",
        entity: "category",
        entityId: id,
        details: { name: category.name },
      },
    });

    revalidatePath("/admin/categorias");
    return { success: true };
  } catch (error: any) {
    return { success: false, error: error.message || "Erro ao excluir categoria." };
  }
}

// ═══════════════════════════════════════════════════════════════════════════════
// ORDERS (ADMIN)
// ═══════════════════════════════════════════════════════════════════════════════

export async function getAdminOrders(params?: {
  status?: OrderStatus;
  search?: string;
  page?: number;
  limit?: number;
}) {
  await checkAdminAuth();

  const { status, search, page = 1, limit = 20 } = params || {};
  const skip = (page - 1) * limit;

  const where: any = {};
  if (status) where.status = status;
  if (search) {
    where.OR = [
      { orderNumber: { contains: search, mode: "insensitive" } },
      { shippingEmail: { contains: search, mode: "insensitive" } },
      { shippingName: { contains: search, mode: "insensitive" } },
    ];
  }

  try {
    const [orders, total] = await Promise.all([
      prisma.order.findMany({
        where,
        include: {
          user: { select: { name: true, email: true } },
          items: { select: { name: true, quantity: true } },
          payment: { select: { status: true, method: true } },
        },
        orderBy: { createdAt: "desc" },
        skip,
        take: limit,
      }),
      prisma.order.count({ where }),
    ]);

    return { orders, total, pages: Math.ceil(total / limit) };
  } catch (error) {
    console.error("Failed to fetch admin orders:", error);
    return { orders: [], total: 0, pages: 0 };
  }
}

export async function getAdminOrder(id: string) {
  await checkAdminAuth();
  try {
    return await prisma.order.findUnique({
      where: { id },
      include: {
        user: { select: { name: true, email: true, phone: true } },
        items: true,
        payment: true,
        history: { orderBy: { createdAt: "desc" } },
        coupon: { select: { code: true, type: true, value: true } },
      },
    });
  } catch (error) {
    console.error("Failed to fetch order:", error);
    return null;
  }
}

export async function updateOrderStatus(
  orderId: string,
  status: OrderStatus,
  note?: string
): Promise<ActionResult> {
  const admin = await checkAdminAuth();

  try {
    const order = await prisma.order.findUnique({
      where: { id: orderId },
      include: { items: true },
    });

    if (!order) return { success: false, error: "Pedido não encontrado." };

    await prisma.$transaction(async (tx) => {
      await tx.order.update({ where: { id: orderId }, data: { status } });

      await tx.orderHistory.create({
        data: {
          orderId,
          status,
          note: note || `Status alterado pelo administrador.`,
          changedBy: admin.name,
        },
      });

      if (
        (status === OrderStatus.CANCELLED || status === OrderStatus.REFUNDED) &&
        order.status !== OrderStatus.CANCELLED &&
        order.status !== OrderStatus.REFUNDED
      ) {
        for (const item of order.items) {
          await tx.product.update({
            where: { id: item.productId },
            data: {
              stock: { increment: item.quantity },
              totalSold: { decrement: item.quantity },
            },
          });
        }
      }
    });

    revalidatePath("/admin/pedidos");
    revalidatePath(`/admin/pedidos/${orderId}`);
    return { success: true };
  } catch (error: any) {
    return { success: false, error: error.message || "Erro ao atualizar pedido." };
  }
}

// ═══════════════════════════════════════════════════════════════════════════════
// REVIEWS
// ═══════════════════════════════════════════════════════════════════════════════

export async function getAdminReviews(params?: {
  productId?: string;
  isActive?: boolean;
  page?: number;
  limit?: number;
}) {
  await checkAdminAuth();

  const { productId, isActive, page = 1, limit = 20 } = params || {};
  const where: any = {};
  if (productId) where.productId = productId;
  if (isActive !== undefined) where.isActive = isActive;

  try {
    const [reviews, total] = await Promise.all([
      prisma.review.findMany({
        where,
        include: { product: { select: { name: true, slug: true } } },
        orderBy: { createdAt: "desc" },
        skip: (page - 1) * limit,
        take: limit,
      }),
      prisma.review.count({ where }),
    ]);

    return { reviews, total, pages: Math.ceil(total / limit) };
  } catch (error) {
    console.error("Failed to fetch reviews:", error);
    return { reviews: [], total: 0, pages: 0 };
  }
}

export async function createReview(data: ReviewFormData): Promise<ActionResult> {
  await checkAdminAuth();
  try {
    await prisma.review.create({
      data: {
        productId: data.productId,
        name: data.name,
        city: data.city,
        rating: data.rating,
        comment: data.comment,
        isActive: data.isActive,
      },
    });

    revalidatePath("/admin/avaliacoes");
    return { success: true };
  } catch (error: any) {
    return { success: false, error: error.message || "Erro ao criar avaliação." };
  }
}

export async function updateReviewStatus(id: string, isActive: boolean): Promise<ActionResult> {
  await checkAdminAuth();
  try {
    const review = await prisma.review.update({
      where: { id },
      data: { isActive },
      include: { product: { select: { slug: true } } },
    });

    revalidatePath("/admin/avaliacoes");
    revalidatePath(`/produto/${review.product.slug}`);
    return { success: true };
  } catch (error: any) {
    return { success: false, error: error.message || "Erro ao atualizar avaliação." };
  }
}

export async function deleteReview(id: string): Promise<ActionResult> {
  const admin = await checkAdminAuth();
  try {
    const review = await prisma.review.delete({ where: { id } });

    await prisma.adminLog.create({
      data: {
        userId: admin.id,
        action: "DELETE",
        entity: "review",
        entityId: id,
        details: { name: review.name },
      },
    });

    revalidatePath("/admin/avaliacoes");
    return { success: true };
  } catch (error: any) {
    return { success: false, error: error.message || "Erro ao excluir avaliação." };
  }
}

// ═══════════════════════════════════════════════════════════════════════════════
// COUPONS
// ═══════════════════════════════════════════════════════════════════════════════

export async function getAdminCoupons() {
  await checkAdminAuth();
  try {
    return await prisma.coupon.findMany({
      include: { _count: { select: { usages: true } } },
      orderBy: { createdAt: "desc" },
    });
  } catch (error) {
    console.error("Failed to fetch coupons:", error);
    return [];
  }
}

export async function createCoupon(data: CouponFormData): Promise<ActionResult> {
  const admin = await checkAdminAuth();
  try {
    const coupon = await prisma.coupon.create({
      data: {
        code: data.code.toUpperCase(),
        type: data.type,
        value: data.value,
        minOrderValue: data.minOrderValue || null,
        maxUses: data.maxUses || null,
        expiresAt: data.expiresAt ? new Date(data.expiresAt) : null,
        isActive: data.isActive,
      },
    });

    await prisma.adminLog.create({
      data: {
        userId: admin.id,
        action: "CREATE",
        entity: "coupon",
        entityId: coupon.id,
        details: { code: coupon.code },
      },
    });

    revalidatePath("/admin/cupons");
    return { success: true };
  } catch (error: any) {
    if (error.code === "P2002") return { success: false, error: "Já existe um cupom com este código." };
    return { success: false, error: error.message || "Erro ao criar cupom." };
  }
}

export async function updateCoupon(id: string, data: CouponFormData): Promise<ActionResult> {
  const admin = await checkAdminAuth();
  try {
    await prisma.coupon.update({
      where: { id },
      data: {
        code: data.code.toUpperCase(),
        type: data.type,
        value: data.value,
        minOrderValue: data.minOrderValue || null,
        maxUses: data.maxUses || null,
        expiresAt: data.expiresAt ? new Date(data.expiresAt) : null,
        isActive: data.isActive,
      },
    });

    await prisma.adminLog.create({
      data: {
        userId: admin.id,
        action: "UPDATE",
        entity: "coupon",
        entityId: id,
        details: { code: data.code },
      },
    });

    revalidatePath("/admin/cupons");
    return { success: true };
  } catch (error: any) {
    return { success: false, error: error.message || "Erro ao atualizar cupom." };
  }
}

export async function deleteCoupon(id: string): Promise<ActionResult> {
  const admin = await checkAdminAuth();
  try {
    const coupon = await prisma.coupon.delete({ where: { id } });

    await prisma.adminLog.create({
      data: {
        userId: admin.id,
        action: "DELETE",
        entity: "coupon",
        entityId: id,
        details: { code: coupon.code },
      },
    });

    revalidatePath("/admin/cupons");
    return { success: true };
  } catch (error: any) {
    return { success: false, error: error.message || "Erro ao excluir cupom." };
  }
}

// ═══════════════════════════════════════════════════════════════════════════════
// CUSTOMERS
// ═══════════════════════════════════════════════════════════════════════════════

export async function getAdminCustomers(params?: {
  search?: string;
  role?: Role;
  page?: number;
  limit?: number;
}) {
  await checkAdminAuth();

  const { search, role, page = 1, limit = 20 } = params || {};
  const where: any = {};
  if (role) where.role = role;
  if (search) {
    where.OR = [
      { name: { contains: search, mode: "insensitive" } },
      { email: { contains: search, mode: "insensitive" } },
    ];
  }

  try {
    const [customers, total] = await Promise.all([
      prisma.user.findMany({
        where,
        include: {
          _count: { select: { orders: true } },
        },
        orderBy: { createdAt: "desc" },
        skip: (page - 1) * limit,
        take: limit,
      }),
      prisma.user.count({ where }),
    ]);

    return { customers, total, pages: Math.ceil(total / limit) };
  } catch (error) {
    console.error("Failed to fetch customers:", error);
    return { customers: [], total: 0, pages: 0 };
  }
}

export async function toggleCustomerStatus(id: string, isActive: boolean): Promise<ActionResult> {
  const admin = await checkAdminAuth();
  try {
    await prisma.user.update({ where: { id }, data: { isActive } });

    await prisma.adminLog.create({
      data: {
        userId: admin.id,
        action: "UPDATE",
        entity: "user",
        entityId: id,
        details: { isActive },
      },
    });

    revalidatePath("/admin/clientes");
    return { success: true };
  } catch (error: any) {
    return { success: false, error: error.message || "Erro ao atualizar cliente." };
  }
}

// ═══════════════════════════════════════════════════════════════════════════════
// SETTINGS
// ═══════════════════════════════════════════════════════════════════════════════

export async function getAdminSettings(): Promise<Record<string, string>> {
  await checkAdminAuth();
  try {
    const settings = await prisma.setting.findMany();
    return settings.reduce(
      (acc, s) => ({ ...acc, [s.key]: s.value }),
      {} as Record<string, string>
    );
  } catch (error) {
    console.error("Failed to fetch settings:", error);
    return {};
  }
}

export async function saveAdminSettings(data: SettingsFormData): Promise<ActionResult> {
  const admin = await checkAdminAuth();
  try {
    const entries = Object.entries(data) as [string, string][];

    await prisma.$transaction(
      entries.map(([key, value]) =>
        prisma.setting.upsert({
          where: { key },
          update: { value: String(value) },
          create: { key, value: String(value), group: "general" },
        })
      )
    );

    await prisma.adminLog.create({
      data: {
        userId: admin.id,
        action: "UPDATE",
        entity: "settings",
        details: { keys: Object.keys(data) },
      },
    });

    revalidatePath("/admin/configuracoes");
    return { success: true };
  } catch (error: any) {
    return { success: false, error: error.message || "Erro ao salvar configurações." };
  }
}
