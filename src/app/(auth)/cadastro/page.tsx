"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { signUpSchema, SignUpFormData } from "@/schemas/auth";
import { signUp } from "@/actions/auth";
import { useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Loader2, ArrowRight } from "lucide-react";
import Link from "next/link";
import { Suspense } from "react";

function RegisterForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const redirectTo = searchParams.get("redirectTo") || "/";

  const [isLoading, setIsLoading] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<SignUpFormData>({
    resolver: zodResolver(signUpSchema),
    defaultValues: {
      name: "",
      surname: "",
      email: "",
      phone: "",
      password: "",
      confirmPassword: "",
    },
  });

  const onSubmit = async (data: SignUpFormData) => {
    setIsLoading(true);
    try {
      const result = await signUp(data);
      if (result.success) {
        toast.success("Cadastro realizado com sucesso!", {
          description: "Faça login com seu e-mail e senha para continuar.",
        });
        router.push(`/login?redirectTo=${encodeURIComponent(redirectTo)}`);
      } else {
        toast.error(result.error || "Erro ao fazer cadastro. Verifique os dados.");
      }
    } catch (err) {
      toast.error("Erro ao realizar cadastro. Tente novamente.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex-1 flex items-center justify-center px-4 py-12 bg-background min-h-[calc(100vh-16rem)]">
      <div className="w-full max-w-lg border-2 border-foreground bg-card p-8 shadow-[6px_6px_0_0_var(--color-foreground)] space-y-6">
        <div className="space-y-1 text-center">
          <Link href="/">
            <span className="font-heading text-3xl font-extrabold tracking-tight text-foreground">
              LOJAI<span className="text-primary">.</span>
            </span>
          </Link>
          <h2 className="display text-3xl text-foreground pt-3">
            Crie sua Conta
          </h2>
          <p className="text-sm text-muted-foreground">
            Inscreva-se em menos de 1 minuto para salvar endereços e rastrear pedidos.
          </p>
        </div>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <Label htmlFor="name">Nome</Label>
              <Input
                id="name"
                placeholder="Ex: João"
                {...register("name")}
                className="h-11"
              />
              {errors.name && <p className="text-[10px] text-destructive font-medium px-2">{errors.name.message}</p>}
            </div>

            <div className="space-y-1.5">
              <Label htmlFor="surname">Sobrenome</Label>
              <Input
                id="surname"
                placeholder="Ex: Silva"
                {...register("surname")}
                className="h-11"
              />
              {errors.surname && <p className="text-[10px] text-destructive font-medium px-2">{errors.surname.message}</p>}
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <Label htmlFor="email">E-mail</Label>
              <Input
                id="email"
                type="email"
                placeholder="exemplo@lojai.com.br"
                {...register("email")}
                className="h-11"
              />
              {errors.email && <p className="text-[10px] text-destructive font-medium px-2">{errors.email.message}</p>}
            </div>

            <div className="space-y-1.5">
              <Label htmlFor="phone">Telefone / WhatsApp</Label>
              <Input
                id="phone"
                placeholder="Ex: (11) 99999-9999"
                {...register("phone")}
                className="h-11"
              />
              {errors.phone && <p className="text-[10px] text-destructive font-medium px-2">{errors.phone.message}</p>}
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <Label htmlFor="password">Senha</Label>
              <Input
                id="password"
                type="password"
                placeholder="No mínimo 6 dígitos"
                {...register("password")}
                className="h-11"
              />
              {errors.password && <p className="text-[10px] text-destructive font-medium px-2">{errors.password.message}</p>}
            </div>

            <div className="space-y-1.5">
              <Label htmlFor="confirmPassword">Confirmar Senha</Label>
              <Input
                id="confirmPassword"
                type="password"
                placeholder="Repita a senha"
                {...register("confirmPassword")}
                className="h-11"
              />
              {errors.confirmPassword && (
                <p className="text-[10px] text-destructive font-medium px-2">{errors.confirmPassword.message}</p>
              )}
            </div>
          </div>

          <Button type="submit" className="w-full h-11 text-sm group mt-4 cursor-pointer" disabled={isLoading}>
            {isLoading ? (
              <>
                <Loader2 className="h-4 w-4 animate-spin" />
                Cadastrando...
              </>
            ) : (
              <>
                Criar Conta
                <ArrowRight className="h-4 w-4 group-hover:translate-x-1 transition-transform" />
              </>
            )}
          </Button>
        </form>

        <div className="text-center text-xs text-muted-foreground pt-4 border-t-2 border-foreground">
          Já tem uma conta?{" "}
          <Link
            href={`/login?redirectTo=${encodeURIComponent(redirectTo)}`}
            className="text-primary hover:underline font-bold"
          >
            Fazer login
          </Link>
        </div>
      </div>
    </div>
  );
}

export default function RegisterPage() {
  return (
    <Suspense
      fallback={
        <div className="flex-1 flex flex-col items-center justify-center py-16 min-h-[calc(100vh-16rem)]">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
        </div>
      }
    >
      <RegisterForm />
    </Suspense>
  );
}
