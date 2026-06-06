"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { resetPasswordSchema, ResetPasswordFormData } from "@/schemas/auth";
import { createClient } from "@/lib/supabase/client";
import { useState } from "react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Loader2, ArrowLeft, Send } from "lucide-react";
import Link from "next/link";

export default function ResetPasswordPage() {
  const supabase = createClient();
  const [isLoading, setIsLoading] = useState(false);
  const [isSent, setIsSent] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<ResetPasswordFormData>({
    resolver: zodResolver(resetPasswordSchema),
    defaultValues: {
      email: "",
    },
  });

  const onSubmit = async (data: ResetPasswordFormData) => {
    setIsLoading(true);
    try {
      const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000";
      const { error } = await supabase.auth.resetPasswordForEmail(data.email, {
        redirectTo: `${siteUrl}/minha-conta/senha`,
      });

      if (error) {
        toast.error(error.message);
      } else {
        setIsSent(true);
        toast.success("E-mail de recuperação enviado!");
      }
    } catch (err) {
      toast.error("Erro ao enviar e-mail de recuperação.");
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
            Recuperar Senha
          </h2>
          <p className="text-sm text-muted-foreground">
            Insira seu e-mail cadastrado e enviaremos um link para redefinir sua senha.
          </p>
        </div>

        {isSent ? (
          <div className="text-center space-y-4 py-4">
            <div className="border-2 border-foreground bg-accent text-accent-foreground p-3 inline-block">
              <Send className="h-8 w-8" />
            </div>
            <p className="text-sm text-muted-foreground">
              Se o e-mail informado estiver cadastrado, você receberá um link em alguns instantes. Verifique também sua pasta de spam.
            </p>
            <Button asChild variant="outline" className="w-full">
              <Link href="/login" className="flex items-center justify-center gap-2">
                <ArrowLeft className="h-4 w-4" />
                Voltar para o Login
              </Link>
            </Button>
          </div>
        ) : (
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

            <Button type="submit" className="w-full h-11 text-sm group mt-2 cursor-pointer" disabled={isLoading}>
              {isLoading ? (
                <>
                  <Loader2 className="h-4 w-4 animate-spin" />
                  Enviando...
                </>
              ) : (
                <>
                  Enviar E-mail de Recuperação
                  <Send className="h-4 w-4 ml-1.5" />
                </>
              )}
            </Button>

            <Button asChild variant="ghost" className="w-full mt-2 cursor-pointer">
              <Link href="/login" className="flex items-center justify-center gap-1.5 text-xs font-semibold text-muted-foreground">
                <ArrowLeft className="h-4 w-4" />
                Voltar para o Login
              </Link>
            </Button>
          </form>
        )}
      </div>
    </div>
  );
}
