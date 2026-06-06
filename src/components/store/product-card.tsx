"use client";

import Image from "next/image";
import Link from "next/link";
import { ProductWithImages } from "@/types";
import { formatCurrency } from "@/lib/utils";
import { useCartStore } from "@/stores/cart-store";
import { Star, ShoppingBag } from "lucide-react";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { fbpTrack } from "@/lib/fbpixel";

interface ProductCardProps {
  product: ProductWithImages;
}

export function ProductCard({ product }: ProductCardProps) {
  const addItem = useCartStore((state) => state.addItem);

  const originalPrice = Number(product.price);
  const promoPrice = product.promoPrice ? Number(product.promoPrice) : null;
  const activePrice = promoPrice ?? originalPrice;

  const discountPercent = promoPrice
    ? Math.round(((originalPrice - promoPrice) / originalPrice) * 100)
    : null;

  const handleAddToCart = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();

    addItem({
      productId: product.id,
      name: product.name,
      sku: product.sku,
      price: originalPrice,
      promoPrice: promoPrice,
      quantity: 1,
      color: product.colors[0],
      size: product.sizes[0],
      imageUrl: product.images[0]?.url,
      stock: product.stock,
    });

    fbpTrack("AddToCart", {
      content_ids: [product.id],
      content_name: product.name,
      content_type: "product",
      value: activePrice,
      currency: "BRL",
    });

    toast.success("Adicionado ao carrinho", { duration: 1800 });
  };

  return (
    <Link
      href={`/produtos/${product.slug}`}
      className="group relative flex h-full flex-col border-2 border-foreground bg-card transition-all duration-200 hover:-translate-x-1 hover:-translate-y-1 hover:shadow-[6px_6px_0_0_var(--color-foreground)]"
    >
      {/* Discount tag */}
      {discountPercent && (
        <span className="absolute left-0 top-3 z-10 border-2 border-foreground bg-primary px-2.5 py-1 font-mono text-[0.7rem] font-bold text-primary-foreground">
          -{discountPercent}%
        </span>
      )}

      {/* Image */}
      <div className="relative aspect-square w-full overflow-hidden border-b-2 border-foreground bg-muted">
        <Image
          src={product.images[0]?.url || "/images/placeholder.webp"}
          alt={product.images[0]?.alt || product.name}
          fill
          className="object-cover transition-transform duration-500 group-hover:scale-105"
          sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 25vw"
          priority={product.isFeatured}
        />
        {/* Quick Add — desktop hover */}
        <div className="absolute inset-x-0 bottom-0 translate-y-full p-3 transition-transform duration-300 group-hover:translate-y-0">
          <Button
            onClick={handleAddToCart}
            className="h-9 w-full cursor-pointer gap-2 text-xs"
            disabled={product.stock <= 0}
          >
            <ShoppingBag className="h-3.5 w-3.5" />
            {product.stock > 0 ? "Adicionar ao Carrinho" : "Esgotado"}
          </Button>
        </div>
      </div>

      {/* Info */}
      <div className="flex flex-1 flex-col justify-between p-4">
        <div className="space-y-2">
          <div className="flex items-center justify-between gap-2">
            <span className="label-mono text-muted-foreground">
              {product.material || "Algodão"}
            </span>
            <div className="flex items-center gap-1">
              <Star className="h-3 w-3 fill-primary text-primary" />
              <span className="font-mono text-[0.65rem] font-semibold text-foreground">5.0</span>
            </div>
          </div>
          <h3 className="line-clamp-2 font-heading text-sm font-bold leading-snug text-foreground transition-colors group-hover:text-primary">
            {product.name}
          </h3>
        </div>

        {/* Price + Mobile Cart */}
        <div className="mt-4 flex items-end justify-between border-t-2 border-foreground pt-3">
          <div className="flex flex-col">
            {promoPrice && (
              <span className="font-mono text-xs text-muted-foreground line-through">
                {formatCurrency(originalPrice)}
              </span>
            )}
            <span className="font-heading text-lg font-extrabold text-foreground">
              {formatCurrency(activePrice)}
            </span>
          </div>

          <Button
            size="icon"
            variant="outline"
            onClick={handleAddToCart}
            className="size-9 cursor-pointer md:hidden"
            disabled={product.stock <= 0}
          >
            <ShoppingBag className="h-4 w-4" />
          </Button>
        </div>
      </div>
    </Link>
  );
}
