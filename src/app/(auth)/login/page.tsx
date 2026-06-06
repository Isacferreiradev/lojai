"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { signInSchema, SignInFormData } from "@/schemas/auth";
import { signIn } from "@/actions/auth";
import { useState, use, useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Loader2, ArrowRight } from "lucide-react";
import Link from "next/link";
import { Suspense } from "react";

function LoginForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const redirectTo = searchParams.get("redirectTo") || "/";

  const [isLoading, setIsLoading] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<SignInFormData>({
    resolver: zodResolver(signInSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });

  const onSubmit = async (data: SignInFormData) => {
    setIsLoading(true);
    try {
      const result = await signIn(data);
      if (result.success) {
        toast.success("Login realizado com sucesso!");
        router.push(redirectTo);
        router.refresh();
      } else {
        toast.error(result.error || "Credenciais inválidas.");
      }
    } catch (err) {
      toast.error("Erro ao fazer login. Tente novamente.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex-1 flex items-center justify-center px-4 py-12 bg-background min-h-[calc(100vh-16rem)]">
      <div className="w-full max-w-md border-2 border-foreground bg-card p-8 shadow-[6px_6px_0_0_var(--color-foreground)] space-y-6">
        <div className="space-y-1 text-center">
          <Link href="/">
            <span className="font-heading text-3xl font-extrabold tracking-tight text-foreground">
              LOJAI<span className="text-primary">.</span>
            </span>
          </Link>
          <h2 className="display text-3xl text-foreground pt-3">
            Bem-vindo<br />de volta
          </h2>
          <p className="text-sm text-muted-foreground">
            Acesse sua conta para gerenciar pedidos e dados de entrega.
          </p>
        </div>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
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
            <div className="flex justify-between items-center">
              <Label htmlFor="password">Senha</Label>
              <Link
                href="/recuperar-senha"
                className="text-xs text-primary hover:underline font-semibold"
              >
                Esqueceu a senha?
              </Link>
            </div>
            <Input
              id="password"
              type="password"
              placeholder="••••••••"
              {...register("password")}
              className="h-11"
            />
            {errors.password && <p className="text-[10px] text-destructive font-medium px-2">{errors.password.message}</p>}
          </div>

          <Button type="submit" className="w-full h-11 text-sm group mt-2 cursor-pointer" disabled={isLoading}>
            {isLoading ? (
              <>
                <Loader2 className="h-4 w-4 animate-spin" />
                Entrando...
              </>
            ) : (
              <>
                Entrar
                <ArrowRight className="h-4 w-4 group-hover:translate-x-1 transition-transform" />
              </>
            )}
          </Button>
        </form>

        <div className="text-center text-xs text-muted-foreground pt-4 border-t-2 border-foreground">
          Ainda não tem uma conta?{" "}
          <Link
            href={`/cadastro?redirectTo=${encodeURIComponent(redirectTo)}`}
            className="text-primary hover:underline font-bold"
          >
            Cadastre-se grátis
          </Link>
        </div>
      </div>
    </div>
  );
}

export default function LoginPage() {
  return (
    <Suspense
      fallback={
        <div className="flex-1 flex flex-col items-center justify-center py-16 min-h-[calc(100vh-16rem)]">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
        </div>
      }
    >
      <LoginForm />
    </Suspense>
  );
}
