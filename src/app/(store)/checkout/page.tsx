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
import { useState, useEffect, useRef, useCallback } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import {
  Loader2,
  ShieldCheck,
  User,
  MapPin,
  ClipboardCheck,
  ChevronRight,
  ChevronLeft,
  QrCode,
  Lock,
  Truck,
  CheckCircle2,
  Package,
} from "lucide-react";
import Image from "next/image";
import { fbpTrack, getCookie } from "@/lib/fbpixel";

// ─── Step definitions ────────────────────────────────────────────────────────
const STEPS = [
  { id: 1, label: "Identificação", icon: User },
  { id: 2, label: "Entrega", icon: MapPin },
  { id: 3, label: "Revisão", icon: ClipboardCheck },
] as const;

// ─── Helpers ─────────────────────────────────────────────────────────────────
function formatCpf(value: string) {
  const d = value.replace(/\D/g, "").slice(0, 11);
  return d
    .replace(/(\d{3})(\d)/, "$1.$2")
    .replace(/(\d{3})(\d)/, "$1.$2")
    .replace(/(\d{3})(\d{1,2})$/, "$1-$2");
}

function formatPhone(value: string) {
  const d = value.replace(/\D/g, "").slice(0, 11);
  if (d.length <= 10)
    return d.replace(/(\d{2})(\d{4})(\d{0,4})/, "($1) $2-$3");
  return d.replace(/(\d{2})(\d{5})(\d{0,4})/, "($1) $2-$3");
}

function formatCep(value: string) {
  const d = value.replace(/\D/g, "").slice(0, 8);
  return d.replace(/(\d{5})(\d{0,3})/, "$1-$2");
}

// ─── Step Progress Bar ────────────────────────────────────────────────────────
function StepProgress({ current }: { current: number }) {
  return (
    <div className="w-full mb-8">
      <div className="flex items-center justify-between relative">
        {/* connector line */}
        <div className="absolute top-5 left-0 right-0 h-0.5 bg-foreground/10 z-0" />
        <div
          className="absolute top-5 left-0 h-0.5 bg-primary z-0 transition-all duration-500 ease-out"
          style={{ width: `${((current - 1) / (STEPS.length - 1)) * 100}%` }}
        />

        {STEPS.map((step) => {
          const Icon = step.icon;
          const done = current > step.id;
          const active = current === step.id;
          return (
            <div key={step.id} className="flex flex-col items-center gap-2 z-10">
              <div
                className={`h-10 w-10 rounded-full border-2 flex items-center justify-center transition-all duration-300 ${
                  done
                    ? "bg-primary border-primary text-primary-foreground"
                    : active
                    ? "bg-background border-primary text-primary shadow-[0_0_0_4px_hsl(var(--primary)/0.15)]"
                    : "bg-background border-foreground/20 text-muted-foreground"
                }`}
              >
                {done ? (
                  <CheckCircle2 className="h-5 w-5" />
                ) : (
                  <Icon className="h-4 w-4" />
                )}
              </div>
              <span
                className={`text-[11px] font-mono font-semibold tracking-wider uppercase hidden sm:block ${
                  active ? "text-primary" : done ? "text-foreground" : "text-muted-foreground"
                }`}
              >
                {step.label}
              </span>
            </div>
          );
        })}
      </div>
    </div>
  );
}

// ─── Mini order summary (sidebar) ────────────────────────────────────────────
function OrderSummary({
  items,
  subtotal,
  discount,
  shipping,
  finalTotal,
  couponCode,
}: {
  items: ReturnType<typeof useCart>["items"];
  subtotal: number;
  discount: number;
  shipping: number;
  finalTotal: number;
  couponCode: string | null;
}) {
  return (
    <div className="border-2 border-foreground bg-card space-y-4 p-5 sticky top-4">
      <h2 className="font-heading text-base font-extrabold text-foreground flex items-center gap-2">
        <Package className="h-4 w-4 text-primary" />
        Seu Pedido
      </h2>

      <div className="divide-y divide-foreground/10 max-h-60 overflow-y-auto space-y-3 pr-1">
        {items.map((item) => (
          <div key={item.id} className="flex gap-3 pt-3 first:pt-0 items-center">
            <div className="relative h-12 w-12 overflow-hidden border-2 border-foreground bg-muted flex-shrink-0">
              <Image
                src={item.imageUrl || "/images/placeholder.png"}
                alt={item.name}
                fill
                className="object-cover"
                sizes="48px"
              />
              <span className="absolute -top-1 -right-1 bg-primary text-primary-foreground text-[9px] font-bold w-4 h-4 rounded-full flex items-center justify-center">
                {item.quantity}
              </span>
            </div>
            <div className="min-w-0 flex-1">
              <p className="text-xs font-semibold text-foreground truncate leading-tight">
                {item.name}
              </p>
              <p className="font-mono text-[10px] text-muted-foreground mt-0.5">
                {item.color} · {item.size}
              </p>
            </div>
            <span className="font-mono text-xs font-bold text-foreground ml-2 flex-shrink-0">
              {formatCurrency((item.promoPrice ?? item.price) * item.quantity)}
            </span>
          </div>
        ))}
      </div>

      <div className="border-t-2 border-foreground pt-3 space-y-2 text-xs">
        <div className="flex justify-between text-muted-foreground">
          <span>Subtotal</span>
          <span className="font-mono font-semibold text-foreground">
            {formatCurrency(subtotal)}
          </span>
        </div>
        {discount > 0 && (
          <div className="flex justify-between text-primary font-semibold">
            <span>Cupom {couponCode && `(${couponCode})`}</span>
            <span className="font-mono">-{formatCurrency(discount)}</span>
          </div>
        )}
        <div className="flex justify-between text-muted-foreground">
          <span className="flex items-center gap-1">
            <Truck className="h-3 w-3" /> Frete
          </span>
          <span className="font-mono">
            {shipping === 0 ? (
              <span className="text-primary font-bold">Grátis</span>
            ) : (
              formatCurrency(shipping)
            )}
          </span>
        </div>
        <div className="flex items-baseline justify-between border-t-2 border-foreground pt-3 text-foreground">
          <span className="label-mono">Total</span>
          <span className="font-heading text-xl font-extrabold text-primary">
            {formatCurrency(finalTotal)}
          </span>
        </div>
      </div>

      {/* Trust badges */}
      <div className="border-t-2 border-foreground/10 pt-3 flex flex-col gap-1.5">
        {[
          { icon: Lock, text: "Compra 100% segura" },
          { icon: ShieldCheck, text: "Dados protegidos" },
          { icon: QrCode, text: "PIX confirmado na hora" },
        ].map(({ icon: Icon, text }) => (
          <div key={text} className="flex items-center gap-2 text-[11px] text-muted-foreground">
            <Icon className="h-3.5 w-3.5 text-primary flex-shrink-0" />
            {text}
          </div>
        ))}
      </div>
    </div>
  );
}

// ─── Field component ──────────────────────────────────────────────────────────
function Field({
  label,
  error,
  children,
  className = "",
}: {
  label: string;
  error?: string;
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <div className={`space-y-1.5 ${className}`}>
      <Label className="text-xs font-semibold text-foreground/80 uppercase tracking-wide">
        {label}
      </Label>
      {children}
      {error && (
        <p className="text-[10px] text-destructive font-medium px-1">{error}</p>
      )}
    </div>
  );
}

// ─── Main Page ────────────────────────────────────────────────────────────────
export default function CheckoutPage() {
  const router = useRouter();
  const { items, total, subtotal, discount, couponCode, clearCart } = useCart();

  const [currentStep, setCurrentStep] = useState(1);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [direction, setDirection] = useState<"forward" | "back">("forward");
  const [visible, setVisible] = useState(true);

  const shipping = 0; // Free shipping for all orders
  const finalTotal = total + shipping;

  const {
    register,
    handleSubmit,
    trigger,
    watch,
    setValue,
    getValues,
    formState: { errors },
  } = useForm<CheckoutFormData>({
    resolver: zodResolver(checkoutSchema),
    mode: "onTouched",
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

  const watchCep = watch("cep");

  // CEP auto-complete
  const [cepLoading, setCepLoading] = useState(false);
  useEffect(() => {
    const clean = watchCep?.replace(/\D/g, "") || "";
    if (clean.length !== 8) return;
    const timer = setTimeout(async () => {
      setCepLoading(true);
      try {
        const res = await fetch(`/api/cep?cep=${clean}`);
        if (!res.ok) throw new Error();
        const d = await res.json();
        setValue("street", d.street || "");
        setValue("neighborhood", d.neighborhood || "");
        setValue("city", d.city || "");
        setValue("state", d.state || "");
        toast.success("Endereço preenchido automaticamente!");
      } catch {
        toast.error("CEP não encontrado. Preencha manualmente.");
      } finally {
        setCepLoading(false);
      }
    }, 400);
    return () => clearTimeout(timer);
  }, [watchCep, setValue]);

  // Meta Pixel: InitiateCheckout (once)
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

  // Animated step transition
  const navigateStep = useCallback(
    (next: number) => {
      setDirection(next > currentStep ? "forward" : "back");
      setVisible(false);
      setTimeout(() => {
        setCurrentStep(next);
        setVisible(true);
        window.scrollTo({ top: 0, behavior: "smooth" });
      }, 200);
    },
    [currentStep]
  );

  // Validate current step fields then advance
  const handleNext = async () => {
    const step1Fields = ["email", "name", "surname", "cpf", "phone"] as const;
    const step2Fields = [
      "cep",
      "street",
      "number",
      "neighborhood",
      "city",
      "state",
    ] as const;

    const fields = currentStep === 1 ? step1Fields : step2Fields;
    const valid = await trigger(fields);
    if (valid) navigateStep(currentStep + 1);
  };

  const onSubmit = async (data: CheckoutFormData) => {
    if (items.length === 0) {
      toast.error("Seu carrinho está vazio.");
      return;
    }

    setIsSubmitting(true);
    try {
      const orderResult = await createOrder(data, items, couponCode, {
        fbp: getCookie("_fbp"),
        fbc: getCookie("_fbc"),
      });

      if (!orderResult.success || !orderResult.orderId) {
        throw new Error(orderResult.error || "Falha ao criar o pedido.");
      }

      toast.loading("Gerando pagamento via PIX...", { id: "checkout" });

      const payResponse = await fetch("/api/checkout", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ orderId: orderResult.orderId }),
      });

      const payData = await payResponse.json();

      if (!payResponse.ok) {
        throw new Error(payData?.error || "Erro ao gerar o pagamento PIX.");
      }

      clearCart();
      toast.dismiss("checkout");
      router.push(`/checkout/pix/${orderResult.orderId}`);
    } catch (err: unknown) {
      const message =
        err instanceof Error ? err.message : "Erro ao processar a compra.";
      toast.dismiss("checkout");
      toast.error(message);
      setIsSubmitting(false);
    }
  };

  // Empty cart
  if (items.length === 0) {
    return (
      <div className="container mx-auto px-4 py-20 flex-grow flex flex-col items-center justify-center text-center gap-6">
        <div className="h-20 w-20 rounded-full border-2 border-foreground flex items-center justify-center">
          <ShieldCheck className="h-10 w-10 text-primary" />
        </div>
        <div>
          <h1 className="display text-3xl text-foreground">Carrinho vazio</h1>
          <p className="text-muted-foreground mt-2 max-w-xs mx-auto">
            Adicione produtos ao carrinho para finalizar a compra.
          </p>
        </div>
        <Button asChild size="lg">
          <a href="/produtos">Explorar Catálogo</a>
        </Button>
      </div>
    );
  }

  const formValues = getValues();

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 md:px-6 py-8 flex-1">
        {/* Header */}
        <div className="border-b-2 border-foreground pb-6 mb-8">
          <span className="label-mono text-primary">[ Checkout ]</span>
          <h1 className="display mt-1 text-3xl sm:text-4xl text-foreground">
            Finalizar Compra
          </h1>
          <p className="mt-1 font-mono text-xs text-muted-foreground">
            Seus dados são criptografados e protegidos.
          </p>
        </div>

        {/* Progress */}
        <StepProgress current={currentStep} />

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">
          {/* ── Main content ── */}
          <div className="lg:col-span-2">
            <div
              className="transition-all duration-200"
              style={{
                opacity: visible ? 1 : 0,
                transform: visible
                  ? "translateX(0)"
                  : direction === "forward"
                  ? "translateX(24px)"
                  : "translateX(-24px)",
              }}
            >
              {/* ── STEP 1: Identificação ── */}
              {currentStep === 1 && (
                <div className="border-2 border-foreground bg-card p-6 space-y-5">
                  <div className="flex items-center gap-3 border-b-2 border-foreground pb-4">
                    <div className="h-8 w-8 rounded-full bg-primary flex items-center justify-center flex-shrink-0">
                      <User className="h-4 w-4 text-primary-foreground" />
                    </div>
                    <div>
                      <h2 className="font-heading text-lg font-extrabold text-foreground">
                        Dados Pessoais
                      </h2>
                      <p className="text-xs text-muted-foreground">
                        Para enviar a confirmação do pedido
                      </p>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <Field
                      label="E-mail"
                      error={errors.email?.message}
                      className="sm:col-span-2"
                    >
                      <Input
                        id="email"
                        type="email"
                        placeholder="voce@email.com"
                        {...register("email")}
                        className="h-11"
                      />
                    </Field>

                    <Field label="Nome" error={errors.name?.message}>
                      <Input
                        id="name"
                        placeholder="João"
                        {...register("name")}
                        className="h-11"
                      />
                    </Field>

                    <Field label="Sobrenome" error={errors.surname?.message}>
                      <Input
                        id="surname"
                        placeholder="Silva"
                        {...register("surname")}
                        className="h-11"
                      />
                    </Field>

                    <Field label="CPF" error={errors.cpf?.message}>
                      <Input
                        id="cpf"
                        placeholder="000.000.000-00"
                        {...register("cpf")}
                        onChange={(e) =>
                          setValue("cpf", formatCpf(e.target.value))
                        }
                        className="h-11 font-mono"
                      />
                    </Field>

                    <Field label="Telefone / WhatsApp" error={errors.phone?.message}>
                      <Input
                        id="phone"
                        placeholder="(11) 99999-9999"
                        {...register("phone")}
                        onChange={(e) =>
                          setValue("phone", formatPhone(e.target.value))
                        }
                        className="h-11 font-mono"
                      />
                    </Field>
                  </div>

                  <div className="flex justify-end pt-2">
                    <Button
                      type="button"
                      onClick={handleNext}
                      className="h-11 px-8 gap-2"
                    >
                      Continuar para Entrega
                      <ChevronRight className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              )}

              {/* ── STEP 2: Entrega ── */}
              {currentStep === 2 && (
                <div className="border-2 border-foreground bg-card p-6 space-y-5">
                  <div className="flex items-center gap-3 border-b-2 border-foreground pb-4">
                    <div className="h-8 w-8 rounded-full bg-primary flex items-center justify-center flex-shrink-0">
                      <MapPin className="h-4 w-4 text-primary-foreground" />
                    </div>
                    <div>
                      <h2 className="font-heading text-lg font-extrabold text-foreground">
                        Endereço de Entrega
                      </h2>
                      <p className="text-xs text-muted-foreground">
                        Digite seu CEP para preenchimento automático
                      </p>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                    <Field label="CEP" error={errors.cep?.message}>
                      <div className="relative">
                        <Input
                          id="cep"
                          placeholder="00000-000"
                          {...register("cep")}
                          onChange={(e) =>
                            setValue("cep", formatCep(e.target.value))
                          }
                          className="h-11 font-mono pr-8"
                        />
                        {cepLoading && (
                          <Loader2 className="h-4 w-4 animate-spin absolute right-3 top-3.5 text-primary" />
                        )}
                      </div>
                    </Field>

                    <Field
                      label="Rua / Avenida"
                      error={errors.street?.message}
                      className="sm:col-span-2"
                    >
                      <Input
                        id="street"
                        {...register("street")}
                        className="h-11"
                      />
                    </Field>

                    <Field label="Número" error={errors.number?.message}>
                      <Input
                        id="number"
                        {...register("number")}
                        className="h-11"
                      />
                    </Field>

                    <Field
                      label="Complemento (opcional)"
                      className="sm:col-span-2"
                    >
                      <Input
                        id="complement"
                        placeholder="Apto, Bloco..."
                        {...register("complement")}
                        className="h-11"
                      />
                    </Field>

                    <Field label="Bairro" error={errors.neighborhood?.message}>
                      <Input
                        id="neighborhood"
                        {...register("neighborhood")}
                        className="h-11"
                      />
                    </Field>

                    <Field
                      label="Cidade"
                      error={errors.city?.message}
                      className="sm:col-span-2"
                    >
                      <Input
                        id="city"
                        {...register("city")}
                        className="h-11"
                      />
                    </Field>

                    <Field label="Estado (UF)" error={errors.state?.message}>
                      <Input
                        id="state"
                        placeholder="SP"
                        maxLength={2}
                        {...register("state")}
                        className="h-11 uppercase"
                      />
                    </Field>
                  </div>

                  <Field label="Instruções de Entrega (opcional)">
                    <Textarea
                      id="notes"
                      placeholder="Ex: Deixar na portaria, campainha não funciona..."
                      {...register("notes")}
                      className="min-h-[72px] resize-none"
                    />
                  </Field>

                  <div className="flex justify-between pt-2">
                    <Button
                      type="button"
                      variant="outline"
                      onClick={() => navigateStep(1)}
                      className="h-11 px-6 gap-2"
                    >
                      <ChevronLeft className="h-4 w-4" />
                      Voltar
                    </Button>
                    <Button
                      type="button"
                      onClick={handleNext}
                      className="h-11 px-8 gap-2"
                    >
                      Revisar Pedido
                      <ChevronRight className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              )}

              {/* ── STEP 3: Revisão + Pagar ── */}
              {currentStep === 3 && (
                <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
                  {/* Contact summary */}
                  <div className="border-2 border-foreground bg-card p-5">
                    <div className="flex items-center justify-between mb-3">
                      <h3 className="font-mono text-xs font-bold text-foreground uppercase tracking-wider flex items-center gap-2">
                        <User className="h-3.5 w-3.5 text-primary" />
                        Dados Pessoais
                      </h3>
                      <button
                        type="button"
                        onClick={() => navigateStep(1)}
                        className="text-[11px] text-primary underline underline-offset-2 font-mono"
                      >
                        Editar
                      </button>
                    </div>
                    <div className="grid grid-cols-2 gap-1.5 text-xs text-muted-foreground">
                      <span>
                        <strong className="text-foreground">Nome:</strong>{" "}
                        {formValues.name} {formValues.surname}
                      </span>
                      <span>
                        <strong className="text-foreground">E-mail:</strong>{" "}
                        {formValues.email}
                      </span>
                      <span>
                        <strong className="text-foreground">CPF:</strong>{" "}
                        {formValues.cpf}
                      </span>
                      <span>
                        <strong className="text-foreground">Telefone:</strong>{" "}
                        {formValues.phone}
                      </span>
                    </div>
                  </div>

                  {/* Address summary */}
                  <div className="border-2 border-foreground bg-card p-5">
                    <div className="flex items-center justify-between mb-3">
                      <h3 className="font-mono text-xs font-bold text-foreground uppercase tracking-wider flex items-center gap-2">
                        <MapPin className="h-3.5 w-3.5 text-primary" />
                        Endereço de Entrega
                      </h3>
                      <button
                        type="button"
                        onClick={() => navigateStep(2)}
                        className="text-[11px] text-primary underline underline-offset-2 font-mono"
                      >
                        Editar
                      </button>
                    </div>
                    <p className="text-xs text-muted-foreground leading-relaxed">
                      {formValues.street}, {formValues.number}
                      {formValues.complement ? ` — ${formValues.complement}` : ""},{" "}
                      {formValues.neighborhood} · {formValues.city}/{formValues.state}{" "}
                      · CEP {formValues.cep}
                    </p>
                    {formValues.notes && (
                      <p className="text-xs text-muted-foreground mt-1 italic">
                        Obs: {formValues.notes}
                      </p>
                    )}
                  </div>

                  {/* Payment section */}
                  <div className="border-2 border-primary bg-primary/5 p-6 space-y-5">
                    <div className="flex items-center gap-3 border-b-2 border-primary/20 pb-4">
                      <div className="h-8 w-8 rounded-full bg-primary flex items-center justify-center flex-shrink-0">
                        <QrCode className="h-4 w-4 text-primary-foreground" />
                      </div>
                      <div>
                        <h2 className="font-heading text-lg font-extrabold text-foreground">
                          Pagar com PIX
                        </h2>
                        <p className="text-xs text-muted-foreground">
                          Confirmação automática em segundos
                        </p>
                      </div>
                    </div>

                    <div className="flex items-baseline justify-between">
                      <span className="label-mono text-muted-foreground">
                        Total a pagar
                      </span>
                      <span className="font-heading text-3xl font-extrabold text-primary">
                        {formatCurrency(finalTotal)}
                      </span>
                    </div>

                    <Button
                      type="submit"
                      className="w-full h-13 text-base gap-3 font-bold"
                      disabled={isSubmitting}
                    >
                      {isSubmitting ? (
                        <>
                          <Loader2 className="h-5 w-5 animate-spin" />
                          Gerando PIX...
                        </>
                      ) : (
                        <>
                          <QrCode className="h-5 w-5" />
                          Gerar QR Code PIX
                        </>
                      )}
                    </Button>

                    <div className="flex flex-wrap justify-center gap-4 pt-1">
                      {[
                        { icon: Lock, text: "Compra segura" },
                        { icon: ShieldCheck, text: "Dados protegidos" },
                        { icon: Truck, text: "Entrega garantida" },
                      ].map(({ icon: Icon, text }) => (
                        <div
                          key={text}
                          className="flex items-center gap-1.5 text-[11px] text-muted-foreground"
                        >
                          <Icon className="h-3 w-3 text-primary" />
                          {text}
                        </div>
                      ))}
                    </div>
                  </div>

                  <div className="flex justify-start">
                    <Button
                      type="button"
                      variant="outline"
                      onClick={() => navigateStep(2)}
                      className="h-10 px-5 gap-2 text-sm"
                    >
                      <ChevronLeft className="h-4 w-4" />
                      Voltar
                    </Button>
                  </div>
                </form>
              )}
            </div>
          </div>

          {/* ── Sidebar: Order summary ── */}
          <div className="hidden lg:block">
            <OrderSummary
              items={items}
              subtotal={subtotal}
              discount={discount}
              shipping={shipping}
              finalTotal={finalTotal}
              couponCode={couponCode}
            />
          </div>
        </div>

        {/* Mobile: mini total bar */}
        <div className="lg:hidden fixed bottom-0 left-0 right-0 bg-background border-t-2 border-foreground px-4 py-3 flex items-center justify-between z-40">
          <div>
            <p className="text-[10px] font-mono text-muted-foreground uppercase tracking-wider">
              Total
            </p>
            <p className="font-heading text-lg font-extrabold text-primary">
              {formatCurrency(finalTotal)}
            </p>
          </div>
          {shipping === 0 && (
            <span className="text-[10px] font-mono text-primary border border-primary px-2 py-0.5">
              FRETE GRÁTIS
            </span>
          )}
        </div>
        {/* Bottom padding for mobile bar */}
        <div className="lg:hidden h-20" />
      </div>
    </div>
  );
}
