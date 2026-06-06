import { z } from "zod";

// ─── Product ──────────────────────────────────────────────────────────────────

export const productSchema = z.object({
  name: z.string().min(2, "Nome deve ter no mínimo 2 caracteres"),
  slug: z
    .string()
    .min(2, "Slug obrigatório")
    .regex(/^[a-z0-9-]+$/, "Slug deve conter apenas letras minúsculas, números e hífens"),
  sku: z.string().min(2, "SKU obrigatório"),
  description: z.string().optional(),
  brand: z.string().optional(),
  price: z.number().min(0.01, "Preço inválido"),
  promoPrice: z.number().min(0).optional().nullable(),
  stock: z.number().int().min(0, "Estoque não pode ser negativo"),
  categoryId: z.string().min(1, "Selecione uma categoria"),
  material: z.string().optional(),
  colors: z.array(z.string()),
  sizes: z.array(z.string()),
  weight: z.number().min(0).optional().nullable(),
  width: z.number().min(0).optional().nullable(),
  height: z.number().min(0).optional().nullable(),
  depth: z.number().min(0).optional().nullable(),
  isWashable: z.boolean(),
  isActive: z.boolean(),
  isFeatured: z.boolean(),
  metaTitle: z.string().optional(),
  metaDescription: z.string().optional(),
  metaKeywords: z.string().optional(),
});

export type ProductFormData = z.infer<typeof productSchema>;

// ─── Category ─────────────────────────────────────────────────────────────────

export const categorySchema = z.object({
  name: z.string().min(2, "Nome deve ter no mínimo 2 caracteres"),
  slug: z
    .string()
    .min(2, "Slug obrigatório")
    .regex(/^[a-z0-9-]+$/, "Slug deve conter apenas letras minúsculas, números e hífens"),
  description: z.string().optional(),
  image: z.string().url("URL da imagem inválida").optional().or(z.literal("")),
  isActive: z.boolean(),
  sortOrder: z.number().int().min(0),
});

export type CategoryFormData = z.infer<typeof categorySchema>;

// ─── Coupon ───────────────────────────────────────────────────────────────────

export const couponSchema = z.object({
  code: z
    .string()
    .min(3, "Código deve ter no mínimo 3 caracteres")
    .max(20, "Código deve ter no máximo 20 caracteres")
    .toUpperCase(),
  type: z.enum(["PERCENTAGE", "FIXED"]),
  value: z.number().min(0.01, "Valor do desconto inválido"),
  minOrderValue: z.number().min(0).optional().nullable(),
  maxUses: z.number().int().min(1).optional().nullable(),
  expiresAt: z.string().optional().nullable(),
  isActive: z.boolean(),
});

export type CouponFormData = z.infer<typeof couponSchema>;

// ─── Review ───────────────────────────────────────────────────────────────────

export const reviewSchema = z.object({
  name: z.string().min(2, "Nome obrigatório"),
  city: z.string().optional(),
  rating: z.number().int().min(1).max(5),
  comment: z.string().min(10, "Comentário deve ter no mínimo 10 caracteres"),
  productId: z.string().min(1, "Produto obrigatório"),
  isActive: z.boolean(),
});

export type ReviewFormData = z.infer<typeof reviewSchema>;

// ─── Settings ─────────────────────────────────────────────────────────────────

export const settingsSchema = z.object({
  storeName: z.string().min(1, "Nome da loja obrigatório"),
  storeEmail: z.string().email("E-mail inválido"),
  storePhone: z.string().optional(),
  storeAddress: z.string().optional(),
  freeShippingThreshold: z.number().min(0),
  flatShippingRate: z.number().min(0),
  instagramUrl: z.string().url("URL inválida").optional().or(z.literal("")),
  facebookUrl: z.string().url("URL inválida").optional().or(z.literal("")),
  whatsappNumber: z.string().optional(),
  metaTitle: z.string().optional(),
  metaDescription: z.string().optional(),
});

export type SettingsFormData = z.infer<typeof settingsSchema>;
