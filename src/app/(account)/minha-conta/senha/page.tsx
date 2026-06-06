"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { createClient } from "@/lib/supabase/client";
import { toast } from "sonner";
import { Loader2 } from "lucide-react";

export default function ChangePasswordPage() {
  const supabase = createClient();
  const [loading, setLoading] = useState(false);

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm({
    defaultValues: {
      password: "",
      confirmPassword: "",
    },
  });

  const onSubmit = async (data: any) => {
    if (data.password !== data.confirmPassword) {
      toast.error("As senhas não coincidem.");
      return;
    }

    setLoading(true);
    try {
      const { error } = await supabase.auth.updateUser({
        password: data.password,
      });

      if (error) {
        toast.error(error.message);
      } else {
        toast.success("Sua senha foi redefinida com sucesso!");
        reset();
      }
    } catch {
      toast.error("Erro ao atualizar senha.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      <div className="border-b-2 border-foreground pb-4">
        <span className="label-mono text-primary">[ Segurança ]</span>
        <h2 className="display text-3xl text-foreground mt-2">Alterar Senha</h2>
        <p className="font-mono text-xs text-muted-foreground mt-1">
          Insira uma senha segura de no mínimo 6 dígitos para proteger sua conta.
        </p>
      </div>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4 max-w-md">
        <div className="space-y-1.5">
          <Label htmlFor="password">Nova Senha</Label>
          <Input
            id="password"
            type="password"
            placeholder="No mínimo 6 dígitos"
            {...register("password", { required: true, minLength: 6 })}
            className="h-11"
          />
        </div>

        <div className="space-y-1.5">
          <Label htmlFor="confirmPassword">Confirmar Nova Senha</Label>
          <Input
            id="confirmPassword"
            type="password"
            placeholder="Repita a nova senha"
            {...register("confirmPassword", { required: true })}
            className="h-11"
          />
        </div>

        <Button type="submit" className="px-6 cursor-pointer mt-2" disabled={loading}>
          {loading ? (
            <>
              <Loader2 className="h-4 w-4 animate-spin" />
              Atualizando...
            </>
          ) : (
            "Atualizar Senha"
          )}
        </Button>
      </form>
    </div>
  );
}
