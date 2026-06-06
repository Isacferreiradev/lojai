"use server";

import prisma from "@/lib/prisma";
import { ProductWithImages, ProductWithAll, ProductFilters } from "@/types";
import { Prisma } from "@prisma/client";

// Prisma Decimal não é serializável para Client Components.
// Converte os campos Decimal de um produto para number.
function serializeProduct<T>(p: T): T {
  if (!p) return p;
  const num = (v: unknown) => (v != null ? Number(v) : v);
  const o = p as Record<string, unknown>;
  return {
    ...o,
    price: num(o.price),
    promoPrice: num(o.promoPrice),
    weight: num(o.weight),
    width: num(o.width),
    height: num(o.height),
    depth: num(o.depth),
  } as T;
}

export async function getFeaturedProducts(limit = 4): Promise<ProductWithImages[]> {
  try {
    const rows = await prisma.product.findMany({
      where: {
        isActive: true,
        isFeatured: true,
      },
      include: {
        images: {
          orderBy: {
            sortOrder: "asc",
          },
        },
      },
      take: limit,
      orderBy: {
        totalSold: "desc",
      },
    });
    return rows.map(serializeProduct);
  } catch (error) {
    console.error("Failed to fetch featured products:", error);
    return [];
  }
}

export async function getPromoProducts(limit = 4): Promise<ProductWithImages[]> {
  try {
    const rows = await prisma.product.findMany({
      where: {
        isActive: true,
        promoPrice: {
          not: null,
        },
      },
      include: {
        images: {
          orderBy: {
            sortOrder: "asc",
          },
        },
      },
      take: limit,
    });
    return rows.map(serializeProduct);
  } catch (error) {
    console.error("Failed to fetch promotional products:", error);
    return [];
  }
}

export async function getProducts(filters: ProductFilters = {}): Promise<{
  products: ProductWithImages[];
  total: number;
  pages: number;
}> {
  const {
    category,
    minPrice,
    maxPrice,
    colors = [],
    sizes = [],
    materials = [],
    washable,
    sort = "best_selling",
    search,
    page = 1,
    limit = 12,
  } = filters;

  const skip = (page - 1) * limit;

  // Build Prisma query condition
  const where: Prisma.ProductWhereInput = {
    isActive: true,
  };

  if (category) {
    where.category = {
      slug: category,
    };
  }

  // Price filters
  if (minPrice !== undefined || maxPrice !== undefined) {
    where.price = {};
    if (minPrice !== undefined) {
      where.price.gte = new Prisma.Decimal(minPrice);
    }
    if (maxPrice !== undefined) {
      where.price.lte = new Prisma.Decimal(maxPrice);
    }
  }

  // Array / multi-select filters
  if (colors.length > 0) {
    where.colors = {
      hasSome: colors,
    };
  }

  if (sizes.length > 0) {
    where.sizes = {
      hasSome: sizes,
    };
  }

  if (materials.length > 0) {
    where.material = {
      in: materials,
    };
  }

  if (washable !== undefined) {
    where.isWashable = washable;
  }

  // Text search
  if (search) {
    where.OR = [
      { name: { contains: search, mode: "insensitive" } },
      { description: { contains: search, mode: "insensitive" } },
      { sku: { contains: search, mode: "insensitive" } },
    ];
  }

  // Sort order mapping
  let orderBy: Prisma.ProductOrderByWithRelationInput = { totalSold: "desc" };
  if (sort === "price_asc") {
    orderBy = { price: "asc" };
  } else if (sort === "price_desc") {
    orderBy = { price: "desc" };
  } else if (sort === "newest") {
    orderBy = { createdAt: "desc" };
  }

  try {
    const [products, total] = await Promise.all([
      prisma.product.findMany({
        where,
        include: {
          images: {
            orderBy: {
              sortOrder: "asc",
            },
          },
        },
        orderBy,
        skip,
        take: limit,
      }),
      prisma.product.count({ where }),
    ]);

    const pages = Math.ceil(total / limit);

    return { products: products.map(serializeProduct), total, pages };
  } catch (error) {
    console.error("Failed to query products:", error);
    return { products: [], total: 0, pages: 0 };
  }
}

export async function getProductBySlug(slug: string): Promise<ProductWithAll | null> {
  try {
    const product = await prisma.product.findUnique({
      where: {
        slug,
      },
      include: {
        images: {
          orderBy: {
            sortOrder: "asc",
          },
        },
        category: true,
        reviews: {
          where: {
            isActive: true,
          },
          orderBy: {
            createdAt: "desc",
          },
        },
      },
    });
    return product ? (serializeProduct(product) as ProductWithAll) : null;
  } catch (error) {
    console.error(`Failed to fetch product by slug ${slug}:`, error);
    return null;
  }
}

export async function getRelatedProducts(
  productId: string,
  categoryId: string,
  limit = 4
): Promise<ProductWithImages[]> {
  try {
    const rows = await prisma.product.findMany({
      where: {
        isActive: true,
        categoryId,
        id: {
          not: productId,
        },
      },
      include: {
        images: {
          orderBy: {
            sortOrder: "asc",
          },
        },
      },
      take: limit,
      orderBy: {
        totalSold: "desc",
      },
    });
    return rows.map(serializeProduct);
  } catch (error) {
    console.error("Failed to fetch related products:", error);
    return [];
  }
}
