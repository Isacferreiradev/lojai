"use client";

import { useCart } from "@/hooks/use-cart";
import { formatCurrency } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { checkoutSchema, CheckoutFormData } from "@/schemas/checkout";
import { createOrder } from "@/actions/orders";
import { useState, useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { Loader2, CreditCard, ShieldCheck } from "lucide-react";
import Image from "next/image";
import { fbpTrack, getCookie } from "@/lib/fbpixel";

export default function CheckoutPage() {
  const router = useRouter();
  const { items, total, subtotal, discount, couponCode, clearCart } = useCart();

  const [isSubmitting, setIsSubmitting] = useState(false);

  // Determine flat shipping fee
  const shipping = subtotal >= 350 ? 0 : 45.0;
  const finalTotal = total + shipping;

  // React Hook Form initialization
  const {
    register,
    handleSubmit,
    setValue,
    watch,
    formState: { errors },
  } = useForm<CheckoutFormData>({
    resolver: zodResolver(checkoutSchema),
    defaultValues: {
      email: "",
      name: "",
      surname: "",
      phone: "",
      cpf: "",
      cep: "",
      street: "",
      number: "",
      complement: "",
      neighborhood: "",
      city: "",
      state: "",
      notes: "",
    },
  });

  // Watch fields
  const watchCep = watch("cep");

  // Autocomplete address when CEP matches 8 digits
  useEffect(() => {
    const cleanCep = watchCep?.replace(/\D/g, "") || "";
    if (cleanCep.length === 8) {
      const fetchAddress = async () => {
        try {
          const response = await fetch(`/api/cep?cep=${cleanCep}`);
          if (!response.ok) throw new Error();
          const data = await response.json();
          
          setValue("street", data.street || "");
          setValue("neighborhood", data.neighborhood || "");
          setValue("city", data.city || "");
          setValue("state", data.state || "");
          
          toast.success("Endereço preenchido automaticamente!");
        } catch (err) {
          toast.error("CEP não encontrado. Preencha o endereço manualmente.");
        }
      };
      fetchAddress();
    }
  }, [watchCep, setValue]);

  // Meta Pixel — InitiateCheckout (dispara 1x quando o carrinho hidrata)
  const firedInitiateCheckout = useRef(false);
  useEffect(() => {
    if (!firedInitiateCheckout.current && items.length > 0) {
      firedInitiateCheckout.current = true;
      fbpTrack("InitiateCheckout", {
        value: finalTotal,
        currency: "BRL",
        num_items: items.reduce((acc, i) => acc + i.quantity, 0),
      });
    }
  }, [items, finalTotal]);

  const onSubmit = async (data: CheckoutFormData) => {
    if (items.length === 0) {
      toast.error("Seu carrinho está vazio.");
      return;
    }

    setIsSubmitting(true);
    try {
      // 1. Create order in our database
      const orderResult = await createOrder(data, items, couponCode, {
        fbp: getCookie("_fbp"),
        fbc: getCookie("_fbc"),
      });
      
      if (!orderResult.success || !orderResult.orderId) {
        throw new Error(orderResult.error || "Falha ao criar o pedido.");
      }

      toast.loading("Gerando pagamento via PIX...", { id: "checkout" });

      // 2. Generate the PIX charge (IronPay)
      const payResponse = await fetch("/api/checkout", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ orderId: orderResult.orderId }),
      });

      const payData = await payResponse.json();

      if (!payResponse.ok) {
        throw new Error(payData?.error || "Erro ao gerar o pagamento PIX.");
      }

      // Clear local cart state
      clearCart();

      // 3. Go to the PIX payment page (QR + copy-paste + auto-confirmation)
      toast.dismiss("checkout");
      router.push(`/checkout/pix/${orderResult.orderId}`);
    } catch (err: any) {
      toast.dismiss("checkout");
      toast.error(err.message || "Erro ao processar a compra.");
      setIsSubmitting(false);
    }
  };

  if (items.length === 0) {
    return (
      <div className="container mx-auto px-4 py-16 flex-grow flex flex-col items-center justify-center text-center">
        <ShieldCheck className="h-16 w-16 text-primary mb-4" />
        <h1 className="display text-3xl text-foreground">Carrinho vazio</h1>
        <p className="text-muted-foreground mt-2 max-w-sm">
          Adicione tapetes ao carrinho para finalizar a compra.
        </p>
        <Button asChild size="lg" className="mt-8">
          <a href="/produtos">Explorar Catálogo</a>
        </Button>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 md:px-6 py-8 flex-1 flex flex-col gap-6">
      {/* Title */}
      <div className="border-b-2 border-foreground pb-6">
        <span className="label-mono text-primary">[ Checkout ]</span>
        <h1 className="display mt-2 text-4xl text-foreground md:text-5xl">Finalizar Compra</h1>
        <p className="mt-2 font-mono text-xs text-muted-foreground">Preencha seus dados de entrega e faturamento.</p>
      </div>

      <form onSubmit={handleSubmit(onSubmit)} className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">
        {/* Left column: Address & Contact Forms */}
        <div className="lg:col-span-2 space-y-6">
          <div className="border-2 border-foreground bg-card p-6 space-y-6">
            <h2 className="label-mono text-primary border-b-2 border-foreground pb-3">
              Dados Pessoais
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-1.5 sm:col-span-2">
                <Label htmlFor="email">E-mail (para acompanhar o pedido)</Label>
                <Input id="email" type="email" placeholder="voce@email.com" {...register("email")} />
                {errors.email && <p className="text-[10px] text-destructive font-medium px-2">{errors.email.message}</p>}
              </div>

              <div className="space-y-1.5">
                <Label htmlFor="name">Nome</Label>
                <Input id="name" {...register("name")} />
                {errors.name && <p className="text-[10px] text-destructive font-medium px-2">{errors.name.message}</p>}
              </div>

              <div className="space-y-1.5">
                <Label htmlFor="surname">Sobrenome</Label>
                <Input id="surname" {...register("surname")} />
                {errors.surname && <p className="text-[10px] text-destructive font-medium px-2">{errors.surname.message}</p>}
              </div>

              <div className="space-y-1.5">
                <Label htmlFor="cpf">CPF</Label>
                <Input id="cpf" placeholder="000.000.000-00" {...register("cpf")} />
                {errors.cpf && <p className="text-[10px] text-destructive font-medium px-2">{errors.cpf.message}</p>}
              </div>

              <div className="space-y-1.5">
                <Label htmlFor="phone">Telefone</Label>
                <Input id="phone" placeholder="(11) 99999-9999" {...register("phone")} />
                {errors.phone && <p className="text-[10px] text-destructive font-medium px-2">{errors.phone.message}</p>}
              </div>
            </div>

            <h2 className="label-mono text-primary border-b-2 border-foreground pb-3 pt-4">
              Endereço de Entrega
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div className="space-y-1.5 sm:col-span-1">
                <Label htmlFor="cep">CEP (Auto-completar)</Label>
                <Input id="cep" placeholder="01310-100" {...register("cep")} />
                {errors.cep && <p className="text-[10px] text-destructive font-medium px-2">{errors.cep.message}</p>}
              </div>

              <div className="space-y-1.5 sm:col-span-2">
                <Label htmlFor="street">Rua/Avenida</Label>
                <Input id="street" {...register("street")} />
                {errors.street && <p className="text-[10px] text-destructive font-medium px-2">{errors.street.message}</p>}
              </div>

              <div className="space-y-1.5">
                <Label htmlFor="number">Número</Label>
                <Input id="number" {...register("number")} />
                {errors.number && <p className="text-[10px] text-destructive font-medium px-2">{errors.number.message}</p>}
              </div>

              <div className="space-y-1.5">
                <Label htmlFor="complement">Complemento (Opcional)</Label>
                <Input id="complement" placeholder="Apto, Bloco..." {...register("complement")} />
              </div>

              <div className="space-y-1.5">
                <Label htmlFor="neighborhood">Bairro</Label>
                <Input id="neighborhood" {...register("neighborhood")} />
                {errors.neighborhood && <p className="text-[10px] text-destructive font-medium px-2">{errors.neighborhood.message}</p>}
              </div>

              <div className="space-y-1.5 sm:col-span-2">
                <Label htmlFor="city">Cidade</Label>
                <Input id="city" {...register("city")} />
                {errors.city && <p className="text-[10px] text-destructive font-medium px-2">{errors.city.message}</p>}
              </div>

              <div className="space-y-1.5">
                <Label htmlFor="state">Estado (UF)</Label>
                <Input id="state" placeholder="SP" maxLength={2} {...register("state")} className="uppercase" />
                {errors.state && <p className="text-[10px] text-destructive font-medium px-2">{errors.state.message}</p>}
              </div>
            </div>

            <h2 className="label-mono text-primary border-b-2 border-foreground pb-3 pt-4">
              Instruções de Entrega (Opcional)
            </h2>
            <div className="space-y-1.5">
              <Label htmlFor="notes">Mensagem para a transportadora</Label>
              <Textarea id="notes" placeholder="Ex: Deixar na portaria..." {...register("notes")} className="min-h-[80px]" />
            </div>
          </div>
        </div>

        {/* Right column: Cart Preview & Payment Options */}
        <div className="space-y-6">
          {/* Order items preview */}
          <div className="border-2 border-foreground bg-card p-6 space-y-4">
            <h2 className="font-heading text-lg font-extrabold text-foreground">Seu Pedido</h2>
            <div className="divide-y-2 divide-foreground/15 max-h-[220px] overflow-y-auto pr-2 space-y-3">
              {items.map((item) => (
                <div key={item.id} className="flex gap-3 pt-3 first:pt-0 items-center justify-between">
                  <div className="flex gap-2.5 items-center min-w-0">
                    <div className="relative h-11 w-11 overflow-hidden border-2 border-foreground bg-muted flex-shrink-0">
                      <Image src={item.imageUrl || "/images/placeholder.png"} alt={item.name} fill className="object-cover" sizes="44px" />
                    </div>
                    <div className="min-w-0">
                      <h4 className="text-xs font-semibold text-foreground truncate">{item.name}</h4>
                      <p className="font-mono text-[10px] text-muted-foreground mt-0.5">
                        {item.quantity}x • {item.color} | {item.size}
                      </p>
                    </div>
                  </div>
                  <span className="font-mono text-xs font-bold text-foreground">
                    {formatCurrency((item.promoPrice ?? item.price) * item.quantity)}
                  </span>
                </div>
              ))}
            </div>

            <div className="border-t-2 border-foreground pt-4 space-y-2.5 text-xs">
              <div className="flex justify-between text-muted-foreground">
                <span>Subtotal</span>
                <span className="font-mono font-semibold text-foreground">{formatCurrency(subtotal)}</span>
              </div>
              {discount > 0 && (
                <div className="flex justify-between text-primary font-semibold">
                  <span>Desconto de Cupom</span>
                  <span className="font-mono">-{formatCurrency(discount)}</span>
                </div>
              )}
              <div className="flex justify-between text-muted-foreground">
                <span>Frete</span>
                <span className="font-mono">{shipping === 0 ? "Grátis" : formatCurrency(shipping)}</span>
              </div>
              <div className="flex items-baseline justify-between border-t-2 border-foreground pt-3.5 text-foreground">
                <span className="label-mono">Total Geral</span>
                <span className="font-heading text-xl font-extrabold text-primary">{formatCurrency(finalTotal)}</span>
              </div>
            </div>
          </div>

          {/* Payment gateway seal */}
          <div className="border-2 border-foreground bg-card p-6 space-y-4 text-center">
            <div className="flex justify-center text-primary mb-2">
              <ShieldCheck className="h-12 w-12 stroke-[1.2]" />
            </div>
            <h3 className="font-heading text-sm font-bold text-foreground">Pagamento 100% Seguro</h3>
            <p className="text-xs text-muted-foreground leading-relaxed">
              Pagamento instantâneo via <span className="font-semibold text-foreground">PIX</span>, processado com segurança pela <span className="font-semibold text-foreground">IronPay</span>. A confirmação é automática.
            </p>

            <Button type="submit" className="w-full h-12 text-sm mt-2 cursor-pointer" disabled={isSubmitting}>
              {isSubmitting ? (
                <>
                  <Loader2 className="h-4 w-4 animate-spin" />
                  Processando...
                </>
              ) : (
                <>
                  <CreditCard className="h-4 w-4" />
                  Pagar com PIX
                </>
              )}
            </Button>
          </div>
        </div>
      </form>
    </div>
  );
}
