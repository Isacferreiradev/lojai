"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Product } from "@prisma/client";
import { Button } from "@/components/ui/button";
import { useCartStore } from "@/stores/cart-store";
import { formatCurrency } from "@/lib/utils";
import { ShoppingCart, CreditCard, Minus, Plus } from "lucide-react";
import { toast } from "sonner";
import { fbpTrack } from "@/lib/fbpixel";

interface ProductDetailFormProps {
  product: Product & {
    images?: { url: string }[];
  };
}

export function ProductDetailForm({ product }: ProductDetailFormProps) {
  const router = useRouter();
  const addItem = useCartStore((state) => state.addItem);

  const [color, setColor] = useState(product.colors[0] || "");
  const [size, setSize] = useState(product.sizes[0] || "");
  const [quantity, setQuantity] = useState(1);

  const originalPrice = Number(product.price);
  const promoPrice = product.promoPrice ? Number(product.promoPrice) : null;
  const activePrice = promoPrice ?? originalPrice;

  const handleAddToCart = () => {
    addItem({
      productId: product.id,
      name: product.name,
      sku: product.sku,
      price: originalPrice,
      promoPrice,
      quantity,
      color,
      size,
      imageUrl: product.images?.[0]?.url,
      stock: product.stock,
    });
    
    fbpTrack("AddToCart", {
      content_ids: [product.id],
      content_name: product.name,
      content_type: "product",
      value: activePrice * quantity,
      currency: "BRL",
    });

    toast.success("Adicionado ao carrinho", { duration: 1800 });
  };

  const handleBuyNow = () => {
    addItem({
      productId: product.id,
      name: product.name,
      sku: product.sku,
      price: originalPrice,
      promoPrice,
      quantity,
      color,
      size,
      imageUrl: product.images?.[0]?.url,
      stock: product.stock,
    });
    
    router.push("/checkout");
  };

  return (
    <div className="space-y-6">
      {/* Price block */}
      <div className="flex flex-wrap items-baseline gap-3">
        {promoPrice && (
          <span className="font-mono text-base font-semibold text-muted-foreground line-through">
            {formatCurrency(originalPrice)}
          </span>
        )}
        <span className="font-heading text-4xl font-extrabold text-foreground">
          {formatCurrency(activePrice)}
        </span>
        {promoPrice && (
          <span className="border-2 border-foreground bg-primary px-2 py-0.5 font-mono text-[0.65rem] font-bold uppercase tracking-wide text-primary-foreground">
            Economize {formatCurrency(originalPrice - promoPrice)}
          </span>
        )}
      </div>

      {/* Colors Swatches */}
      {product.colors.length > 0 && (
        <div className="space-y-3">
          <label className="label-mono text-muted-foreground">
            Cor: <span className="font-semibold text-foreground">{color}</span>
          </label>
          <div className="flex flex-wrap gap-2">
            {product.colors.map((c) => (
              <button
                key={c}
                onClick={() => setColor(c)}
                className={`cursor-pointer border-2 px-4 py-2 text-xs font-semibold transition-all ${
                  color === c
                    ? "border-foreground bg-foreground text-background"
                    : "border-foreground/40 text-muted-foreground hover:border-foreground hover:text-foreground"
                }`}
              >
                {c}
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Sizes Swatches */}
      {product.sizes.length > 0 && (
        <div className="space-y-3">
          <label className="label-mono text-muted-foreground">
            Tamanho: <span className="font-semibold text-foreground">{size}</span>
          </label>
          <div className="flex flex-wrap gap-2">
            {product.sizes.map((s) => (
              <button
                key={s}
                onClick={() => setSize(s)}
                className={`cursor-pointer border-2 px-4 py-2 font-mono text-xs font-semibold transition-all ${
                  size === s
                    ? "border-foreground bg-foreground text-background"
                    : "border-foreground/40 text-muted-foreground hover:border-foreground hover:text-foreground"
                }`}
              >
                {s}
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Quantity & Action CTA Buttons */}
      <div className="space-y-5 border-t-2 border-foreground pt-5">
        <div className="flex flex-wrap items-center gap-4">
          <span className="label-mono text-muted-foreground">
            Quantidade
          </span>
          <div className="flex items-center border-2 border-foreground bg-card">
            <button
              onClick={() => setQuantity((q) => Math.max(1, q - 1))}
              disabled={quantity <= 1}
              className="cursor-pointer p-2 text-muted-foreground transition-colors hover:bg-foreground hover:text-background disabled:opacity-30"
            >
              <Minus className="h-4 w-4" />
            </button>
            <span className="w-12 text-center font-mono text-sm font-bold text-foreground">{quantity}</span>
            <button
              onClick={() => setQuantity((q) => Math.min(product.stock, q + 1))}
              disabled={quantity >= product.stock}
              className="cursor-pointer p-2 text-muted-foreground transition-colors hover:bg-foreground hover:text-background disabled:opacity-30"
            >
              <Plus className="h-4 w-4" />
            </button>
          </div>
          <span className="font-mono text-xs font-medium text-muted-foreground">
            {product.stock > 0 ? `${product.stock} em estoque` : "Indisponível"}
          </span>
        </div>

        <div className="grid grid-cols-1 gap-3 pt-1 sm:grid-cols-2">
          <Button
            size="lg"
            variant="outline"
            className="h-12 cursor-pointer gap-2 text-xs"
            onClick={handleAddToCart}
            disabled={product.stock <= 0}
          >
            <ShoppingCart className="h-4 w-4" />
            Adicionar ao Carrinho
          </Button>
          <Button
            size="lg"
            className="h-12 cursor-pointer gap-2 text-xs"
            onClick={handleBuyNow}
            disabled={product.stock <= 0}
          >
            <CreditCard className="h-4 w-4" />
            Comprar Agora
          </Button>
        </div>
      </div>
    </div>
  );
}
