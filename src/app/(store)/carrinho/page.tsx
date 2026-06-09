"use client";

import { useCart } from "@/hooks/use-cart";
import { formatCurrency } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Trash2, Minus, Plus, ShoppingBag, ArrowRight, Loader2, Percent, Check } from "lucide-react";
import Link from "next/link";
import Image from "next/image";
import { useState } from "react";
import { validateCoupon } from "@/actions/orders";
import { toast } from "sonner";

export default function CartPage() {
  const {
    items,
    updateQuantity,
    removeItem,
    clearCart,
    subtotal,
    discount,
    total,
    applyCoupon,
    removeCoupon,
    couponCode,
  } = useCart();

  // Local state for shipping simulation
  const [cep, setCep] = useState("");
  const [shippingCost, setShippingCost] = useState<number | null>(null);
  const [shippingError, setShippingError] = useState("");
  const [loadingCep, setLoadingCep] = useState(false);
  const [cepSuccess, setCepSuccess] = useState(false);

  // Local state for coupon input
  const [couponInput, setCouponInput] = useState("");
  const [loadingCoupon, setLoadingCoupon] = useState(false);

  const handleSimulateShipping = async (e: React.FormEvent) => {
    e.preventDefault();
    setShippingError("");
    setCepSuccess(false);
    
    const cleanCep = cep.replace(/\D/g, "");
    if (cleanCep.length !== 8) {
      setShippingError("Digite um CEP válido com 8 dígitos.");
      return;
    }

    setLoadingCep(true);
    try {
      const response = await fetch(`/api/cep?cep=${cleanCep}`);
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || "Erro ao consultar CEP.");
      }
      
      const address = await response.json();
      setCepSuccess(true);
      // Free shipping for all orders
      setShippingCost(0);
      toast.success(`CEP encontrado: ${address.city} - ${address.state}`);
    } catch (err: any) {
      setShippingError(err.message || "CEP não encontrado.");
      setShippingCost(null);
    } finally {
      setLoadingCep(false);
    }
  };

  const handleApplyCoupon = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!couponInput.trim()) return;

    setLoadingCoupon(true);
    try {
      const result = await validateCoupon(couponInput.trim(), subtotal);
      if (result.isValid && result.type && result.value !== undefined) {
        applyCoupon(result.code!, result.type, result.value);
        toast.success(`Cupom ${result.code} aplicado com sucesso!`, {
          description: `Desconto de ${
            result.type === "PERCENTAGE" ? `${result.value}%` : formatCurrency(result.value)
          } adicionado.`,
        });
        setCouponInput("");
      } else {
        toast.error(result.message || "Erro ao aplicar cupom.");
      }
    } catch (err) {
      toast.error("Erro ao aplicar cupom.");
    } finally {
      setLoadingCoupon(false);
    }
  };

  const calculatedTotal = total; // Shipping is always free

  if (items.length === 0) {
    return (
      <div className="container mx-auto px-4 md:px-6 py-16 flex-1 flex flex-col items-center justify-center text-center">
        <div className="mb-6 flex h-20 w-20 items-center justify-center border-2 border-foreground bg-muted">
          <ShoppingBag className="h-10 w-10 text-muted-foreground" />
        </div>
        <h1 className="display text-4xl text-foreground">
          Carrinho vazio
        </h1>
        <p className="mt-3 max-w-sm text-muted-foreground">
          Você ainda não escolheu nenhum produto para o seu lar. Explore nosso catálogo completo!
        </p>
        <Button asChild size="lg" className="mt-8">
          <Link href="/produtos">Explorar Catálogo</Link>
        </Button>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 md:px-6 py-8 flex-1 flex flex-col gap-6">
      {/* Title */}
      <div className="border-b-2 border-foreground pb-6">
        <span className="label-mono text-primary">[ Carrinho ]</span>
        <h1 className="display mt-2 text-4xl text-foreground md:text-5xl">
          Carrinho de Compras
        </h1>
        <p className="mt-2 font-mono text-xs text-muted-foreground">
          {items.length} {items.length === 1 ? "modelo" : "modelos"} no carrinho
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">
        {/* Left Side: Items List */}
        <div className="lg:col-span-2 space-y-6">
          <div className="border-2 border-foreground bg-card overflow-hidden">
            <div className="divide-y-2 divide-foreground">
              {items.map((item) => {
                const finalPrice = item.promoPrice ?? item.price;
                return (
                  <div key={item.id} className="p-4 sm:p-6 flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between">
                    <div className="flex gap-4 items-center">
                      {/* Photo */}
                      <div className="relative h-20 w-20 sm:h-24 sm:w-24 overflow-hidden border-2 border-foreground bg-muted flex-shrink-0">
                        <Image
                          src={item.imageUrl || "/images/placeholder.png"}
                          alt={item.name}
                          fill
                          className="object-cover"
                          sizes="96px"
                        />
                      </div>

                      {/* Details */}
                      <div className="space-y-1">
                        <h3 className="font-heading text-sm sm:text-base font-bold text-foreground leading-tight">
                          {item.name}
                        </h3>
                        <p className="font-mono text-[0.65rem] uppercase tracking-wide text-muted-foreground">SKU: {item.sku}</p>
                        <p className="font-mono text-[0.65rem] uppercase tracking-wide text-muted-foreground">
                          {item.color && `Cor: ${item.color}`}
                          {item.color && item.size && " · "}
                          {item.size && `Tam: ${item.size}`}
                        </p>
                      </div>
                    </div>

                    <div className="flex items-center justify-between sm:justify-end gap-6 w-full sm:w-auto border-t-2 border-foreground pt-3 sm:border-t-0 sm:pt-0">
                      {/* Quantity Controls */}
                      <div className="flex items-center border-2 border-foreground bg-background">
                        <button
                          onClick={() => updateQuantity(item.id, item.quantity - 1)}
                          className="p-1.5 text-muted-foreground hover:bg-foreground hover:text-background transition-colors cursor-pointer disabled:opacity-40"
                          disabled={item.quantity <= 1}
                        >
                          <Minus className="h-3.5 w-3.5" />
                        </button>
                        <span className="w-8 text-center font-mono text-xs font-bold text-foreground">
                          {item.quantity}
                        </span>
                        <button
                          onClick={() => updateQuantity(item.id, item.quantity + 1)}
                          className="p-1.5 text-muted-foreground hover:bg-foreground hover:text-background transition-colors cursor-pointer disabled:opacity-40"
                          disabled={item.quantity >= item.stock}
                        >
                          <Plus className="h-3.5 w-3.5" />
                        </button>
                      </div>

                      {/* Prices */}
                      <div className="text-right">
                        <span className="font-heading text-sm font-bold text-foreground block">
                          {formatCurrency(finalPrice * item.quantity)}
                        </span>
                        {item.quantity > 1 && (
                          <span className="font-mono text-[10px] text-muted-foreground">
                            {formatCurrency(finalPrice)} cada
                          </span>
                        )}
                      </div>

                      {/* Delete */}
                      <button
                        onClick={() => removeItem(item.id)}
                        className="text-muted-foreground hover:text-destructive transition-colors p-1"
                      >
                        <Trash2 className="h-5 w-5" />
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          <div className="flex justify-between items-center px-2">
            <Button asChild variant="outline" className="cursor-pointer text-xs font-semibold">
              <Link href="/produtos">Continuar Comprando</Link>
            </Button>
            <Button
              variant="ghost"
              onClick={clearCart}
              className="text-muted-foreground hover:text-destructive cursor-pointer text-xs font-semibold"
            >
              Esvaziar Carrinho
            </Button>
          </div>
        </div>

        {/* Right Side: Order Summary Card */}
        <div className="space-y-6">
          {/* Summary Box */}
          <div className="border-2 border-foreground bg-card p-6 shadow-[5px_5px_0_0_var(--color-foreground)] space-y-6">
            <h2 className="font-heading text-lg font-extrabold text-foreground">Resumo do Pedido</h2>

            <div className="space-y-3.5 text-sm">
              <div className="flex justify-between text-muted-foreground">
                <span>Subtotal ({items.length} itens)</span>
                <span className="font-mono font-semibold text-foreground">{formatCurrency(subtotal)}</span>
              </div>

              {discount > 0 && (
                <div className="flex justify-between border-2 border-foreground bg-accent px-3 py-2 font-semibold text-accent-foreground">
                  <span className="flex items-center gap-1.5">
                    <Percent className="h-4 w-4" /> Cupom ({couponCode})
                  </span>
                  <span className="font-mono">-{formatCurrency(discount)}</span>
                </div>
              )}

              <div className="flex justify-between text-muted-foreground">
                <span>Frete</span>
                <span className="font-mono font-semibold text-foreground">
                  {shippingCost === null
                    ? "A calcular"
                    : shippingCost === 0
                    ? "Grátis"
                    : formatCurrency(shippingCost)}
                </span>
              </div>

              <div className="flex items-baseline justify-between border-t-2 border-foreground pt-4 text-foreground">
                <span className="label-mono">Total Estimado</span>
                <span className="font-heading text-2xl font-extrabold text-primary">{formatCurrency(calculatedTotal)}</span>
              </div>
            </div>

            {/* Checkout CTA */}
            <Button asChild className="w-full h-12 text-sm group cursor-pointer" size="lg">
              <Link href="/checkout" className="flex items-center justify-center gap-2">
                Prosseguir para o Pagamento
                <ArrowRight className="h-4 w-4 group-hover:translate-x-1 transition-transform" />
              </Link>
            </Button>
          </div>

          {/* Shipping Simulation Box */}
          <div className="border-2 border-foreground bg-card p-6 space-y-4">
            <h3 className="label-mono text-primary">[ Calcular Frete ]</h3>
            <form onSubmit={handleSimulateShipping} className="flex gap-2">
              <Input
                type="text"
                placeholder="Ex: 01310-100"
                value={cep}
                onChange={(e) => setCep(e.target.value)}
              />
              <Button type="submit" variant="secondary" className="px-5 font-semibold text-xs cursor-pointer" disabled={loadingCep}>
                {loadingCep ? <Loader2 className="h-4 w-4 animate-spin" /> : "Calcular"}
              </Button>
            </form>
            {shippingError && <p className="text-xs text-destructive font-medium px-2">{shippingError}</p>}
            {cepSuccess && shippingCost !== null && (
              <p className="text-xs text-primary font-semibold flex items-center gap-1 px-2">
                <Check className="h-4 w-4" />
                {shippingCost === 0
                  ? "Seu pedido tem frete GRÁTIS!"
                  : `Frete estimado: ${formatCurrency(shippingCost)}`}
              </p>
            )}
          </div>

          {/* Coupon Simulation Box */}
          <div className="border-2 border-foreground bg-card p-6 space-y-4">
            <h3 className="label-mono text-primary">[ Cupom de Desconto ]</h3>

            {couponCode ? (
              <div className="flex justify-between items-center border-2 border-foreground bg-accent/40 p-3">
                <div className="text-xs">
                  <span className="font-heading font-bold text-foreground">{couponCode}</span>
                  <p className="text-muted-foreground mt-0.5">Cupom ativo e aplicado.</p>
                </div>
                <button
                  onClick={removeCoupon}
                  className="text-xs text-destructive hover:underline font-semibold cursor-pointer"
                >
                  Remover
                </button>
              </div>
            ) : (
              <form onSubmit={handleApplyCoupon} className="flex gap-2">
                <Input
                  type="text"
                  placeholder="Ex: BEMVINDO10"
                  value={couponInput}
                  onChange={(e) => setCouponInput(e.target.value)}
                  className="uppercase"
                />
                <Button type="submit" variant="secondary" className="px-5 font-semibold text-xs cursor-pointer" disabled={loadingCoupon}>
                  {loadingCoupon ? <Loader2 className="h-4 w-4 animate-spin" /> : "Aplicar"}
                </Button>
              </form>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
