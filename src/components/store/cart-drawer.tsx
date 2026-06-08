"use client";

import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
  SheetFooter,
} from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import { useCart } from "@/hooks/use-cart";
import { formatCurrency } from "@/lib/utils";
import { ShoppingBag, Plus, Minus, Trash2 } from "lucide-react";
import Link from "next/link";
import Image from "next/image";
import { useState } from "react";

export function CartDrawer() {
  const [open, setOpen] = useState(false);
  const { items, updateQuantity, removeItem, total, count, subtotal, discount } = useCart();

  return (
    <Sheet open={open} onOpenChange={setOpen}>
      <SheetTrigger asChild>
        <button className="relative cursor-pointer border-2 border-transparent p-2 text-foreground transition-colors hover:border-foreground hover:text-primary">
          <ShoppingBag className="h-6 w-6 stroke-[2]" />
          {count > 0 && (
            <span className="absolute -right-1 -top-1 flex h-5 w-5 items-center justify-center border-2 border-foreground bg-primary font-mono text-[10px] font-bold text-primary-foreground animate-in zoom-in duration-200">
              {count}
            </span>
          )}
        </button>
      </SheetTrigger>
      <SheetContent className="flex h-full w-full flex-col bg-card p-0 sm:max-w-md">
        <SheetHeader className="border-b-2 border-foreground p-6">
          <SheetTitle className="flex items-center gap-2 text-2xl">
            <ShoppingBag className="h-6 w-6 text-primary" />
            Seu Carrinho
          </SheetTitle>
        </SheetHeader>

        {items.length === 0 ? (
          <div className="flex flex-1 flex-col items-center justify-center p-6 text-center">
            <div className="mb-4 flex h-16 w-16 items-center justify-center border-2 border-foreground bg-muted">
              <ShoppingBag className="h-8 w-8 text-muted-foreground" />
            </div>
            <h3 className="font-heading text-lg font-bold">O carrinho está vazio</h3>
            <p className="mt-2 max-w-[280px] text-sm text-muted-foreground">
              Explore nossos produtos premium e encontre o ideal para sua casa.
            </p>
            <Button className="mt-6" onClick={() => setOpen(false)}>
              Continuar Comprando
            </Button>
          </div>
        ) : (
          <>
            <div className="flex-1 overflow-y-auto p-6 space-y-6">
              {items.map((item) => (
                <div key={item.id} className="flex gap-4 border-b-2 border-foreground pb-4 last:border-0 last:pb-0">
                  <div className="relative h-20 w-20 flex-shrink-0 overflow-hidden border-2 border-foreground bg-muted">
                    <Image
                      src={item.imageUrl || "/images/placeholder.webp"}
                      alt={item.name}
                      fill
                      className="object-cover"
                      sizes="80px"
                    />
                  </div>
                  <div className="flex-1 flex flex-col min-w-0">
                    <h4 className="truncate font-heading text-sm font-bold text-foreground">
                      {item.name}
                    </h4>
                    <p className="mt-1 font-mono text-[0.65rem] uppercase tracking-wide text-muted-foreground">
                      {item.color && `Cor: ${item.color}`}
                      {item.color && item.size && " · "}
                      {item.size && `Tam: ${item.size}`}
                    </p>
                    <div className="mt-auto flex items-center justify-between">
                      <div className="flex items-center border-2 border-foreground bg-background">
                        <button
                          onClick={() => updateQuantity(item.id, item.quantity - 1)}
                          className="p-1.5 text-muted-foreground transition-colors hover:bg-foreground hover:text-background disabled:opacity-40"
                          disabled={item.quantity <= 1}
                        >
                          <Minus className="h-3 w-3" />
                        </button>
                        <span className="w-8 text-center font-mono text-xs font-bold">
                          {item.quantity}
                        </span>
                        <button
                          onClick={() => updateQuantity(item.id, item.quantity + 1)}
                          className="p-1.5 text-muted-foreground transition-colors hover:bg-foreground hover:text-background disabled:opacity-40"
                          disabled={item.quantity >= item.stock}
                        >
                          <Plus className="h-3 w-3" />
                        </button>
                      </div>
                      <div className="flex items-center gap-3">
                        <span className="font-heading text-sm font-bold">
                          {formatCurrency((item.promoPrice ?? item.price) * item.quantity)}
                        </span>
                        <button
                          onClick={() => removeItem(item.id)}
                          className="text-muted-foreground hover:text-destructive transition-colors p-1"
                        >
                          <Trash2 className="h-4 w-4" />
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            <SheetFooter className="flex-col gap-4 border-t-2 border-foreground bg-muted/30 p-6 sm:flex-col">
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Subtotal</span>
                  <span className="font-mono font-medium">{formatCurrency(subtotal)}</span>
                </div>
                {discount > 0 && (
                  <div className="flex justify-between font-medium text-primary">
                    <span>Desconto</span>
                    <span className="font-mono">-{formatCurrency(discount)}</span>
                  </div>
                )}
                <div className="flex items-baseline justify-between border-t-2 border-foreground pt-2 text-foreground">
                  <span className="label-mono">Total</span>
                  <span className="font-heading text-xl font-extrabold">{formatCurrency(total)}</span>
                </div>
              </div>

              <div className="mt-2 grid grid-cols-1 gap-2">
                <Button asChild className="w-full" size="lg" onClick={() => setOpen(false)}>
                  <Link href="/checkout">Finalizar Compra</Link>
                </Button>
                <Button
                  asChild
                  variant="outline"
                  className="w-full"
                  onClick={() => setOpen(false)}
                >
                  <Link href="/carrinho">Ver Carrinho</Link>
                </Button>
              </div>
            </SheetFooter>
          </>
        )}
      </SheetContent>
    </Sheet>
  );
}
