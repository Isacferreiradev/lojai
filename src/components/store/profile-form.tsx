"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { updateProfile } from "@/actions/auth";
import { toast } from "sonner";
import { Loader2 } from "lucide-react";

interface ProfileFormProps {
  initialData: {
    name: string;
    surname: string | null;
    phone: string | null;
    cpf: string | null;
    email: string;
  };
}

export function ProfileForm({ initialData }: ProfileFormProps) {
  const [loading, setLoading] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    defaultValues: {
      name: initialData.name,
      surname: initialData.surname || "",
      phone: initialData.phone || "",
      cpf: initialData.cpf || "",
    },
  });

  const onSubmit = async (data: any) => {
    setLoading(true);
    try {
      const result = await updateProfile(data);
      if (result.success) {
        toast.success("Dados cadastrais atualizados com sucesso!");
      } else {
        toast.error(result.error || "Erro ao atualizar dados.");
      }
    } catch (err) {
      toast.error("Erro ao atualizar dados.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4 max-w-md">
      <div className="space-y-1.5">
        <Label>E-mail (Não editável)</Label>
        <Input value={initialData.email} disabled />
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-1.5">
          <Label htmlFor="name">Nome</Label>
          <Input
            id="name"
            {...register("name", { required: "Nome é obrigatório" })}
          />
          {errors.name && (
            <p className="text-[10px] text-destructive font-medium px-2">{errors.name.message as string}</p>
          )}
        </div>

        <div className="space-y-1.5">
          <Label htmlFor="surname">Sobrenome</Label>
          <Input id="surname" {...register("surname")} />
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-1.5">
          <Label htmlFor="cpf">CPF</Label>
          <Input
            id="cpf"
            placeholder="000.000.000-00"
            {...register("cpf")}
          />
        </div>

        <div className="space-y-1.5">
          <Label htmlFor="phone">Telefone</Label>
          <Input
            id="phone"
            placeholder="(11) 99999-9999"
            {...register("phone")}
          />
        </div>
      </div>

      <Button type="submit" className="px-6 cursor-pointer mt-2" disabled={loading}>
        {loading ? (
          <>
            <Loader2 className="h-4 w-4 animate-spin animate-duration-1000" />
            Salvando...
          </>
        ) : (
          "Salvar Alterações"
        )}
      </Button>
    </form>
  );
}
