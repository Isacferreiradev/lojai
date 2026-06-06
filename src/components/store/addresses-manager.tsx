"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { addAddress, deleteAddress } from "@/actions/auth";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogFooter,
} from "@/components/ui/dialog";
import { useForm } from "react-hook-form";
import { MapPin, Trash2, Plus, Loader2 } from "lucide-react";
import { toast } from "sonner";

interface Address {
  id: string;
  label: string | null;
  cep: string;
  street: string;
  number: string;
  complement: string | null;
  neighborhood: string;
  city: string;
  state: string;
}

interface AddressesManagerProps {
  addresses: Address[];
}

export function AddressesManager({ addresses }: AddressesManagerProps) {
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [deletingId, setDeletingId] = useState<string | null>(null);

  const { register, handleSubmit, setValue, watch, reset, formState: { errors } } = useForm({
    defaultValues: {
      label: "",
      cep: "",
      street: "",
      number: "",
      complement: "",
      neighborhood: "",
      city: "",
      state: "",
    },
  });

  const watchCep = watch("cep");

  // Autocomplete address on 8 digit CEP input
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
        } catch {
          toast.error("CEP não encontrado. Digite o endereço manualmente.");
        }
      };
      fetchAddress();
    }
  }, [watchCep, setValue]);

  const onSubmit = async (data: any) => {
    setSubmitting(true);
    try {
      const result = await addAddress(data);
      if (result.success) {
        toast.success("Endereço cadastrado com sucesso!");
        reset();
        setOpen(false);
        router.refresh();
      } else {
        toast.error(result.error || "Erro ao adicionar endereço.");
      }
    } catch {
      toast.error("Erro ao adicionar endereço.");
    } finally {
      setSubmitting(false);
    }
  };

  const handleDelete = async (id: string) => {
    setDeletingId(id);
    try {
      const result = await deleteAddress(id);
      if (result.success) {
        toast.success("Endereço excluído com sucesso!");
        router.refresh();
      } else {
        toast.error(result.error || "Erro ao excluir endereço.");
      }
    } catch {
      toast.error("Erro ao excluir endereço.");
    } finally {
      setDeletingId(null);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h3 className="display text-2xl text-foreground">Meus Endereços</h3>

        {/* Add Address Dialog Modal */}
        <Dialog open={open} onOpenChange={setOpen}>
          <DialogTrigger asChild>
            <Button className="gap-1.5 text-xs cursor-pointer">
              <Plus className="h-4 w-4" />
              Adicionar
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-lg">
            <DialogHeader>
              <DialogTitle className="flex items-center gap-2">
                <MapPin className="h-5 w-5 text-primary" />
                Novo Endereço de Entrega
              </DialogTitle>
            </DialogHeader>

            <form onSubmit={handleSubmit(onSubmit)} className="space-y-4 py-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1.5 col-span-2">
                  <Label htmlFor="label">Identificação (Ex: Casa, Trabalho)</Label>
                  <Input id="label" placeholder="Ex: Casa" {...register("label")} />
                </div>

                <div className="space-y-1.5">
                  <Label htmlFor="cep">CEP (Auto-completar)</Label>
                  <Input id="cep" placeholder="01310-100" {...register("cep", { required: true })} />
                </div>

                <div className="space-y-1.5">
                  <Label htmlFor="street">Rua/Avenida</Label>
                  <Input id="street" {...register("street", { required: true })} />
                </div>

                <div className="space-y-1.5">
                  <Label htmlFor="number">Número</Label>
                  <Input id="number" {...register("number", { required: true })} />
                </div>

                <div className="space-y-1.5">
                  <Label htmlFor="complement">Complemento (Opcional)</Label>
                  <Input id="complement" placeholder="Apto, Bloco..." {...register("complement")} />
                </div>

                <div className="space-y-1.5">
                  <Label htmlFor="neighborhood">Bairro</Label>
                  <Input id="neighborhood" {...register("neighborhood", { required: true })} />
                </div>

                <div className="space-y-1.5">
                  <Label htmlFor="city">Cidade</Label>
                  <Input id="city" {...register("city", { required: true })} />
                </div>

                <div className="space-y-1.5">
                  <Label htmlFor="state">Estado (UF)</Label>
                  <Input id="state" placeholder="SP" maxLength={2} {...register("state", { required: true })} className="uppercase" />
                </div>
              </div>

              <DialogFooter className="pt-4 gap-2">
                <Button type="button" variant="ghost" onClick={() => setOpen(false)} className="text-xs cursor-pointer">
                  Cancelar
                </Button>
                <Button type="submit" className="text-xs cursor-pointer px-6" disabled={submitting}>
                  {submitting ? <Loader2 className="h-4 w-4 animate-spin" /> : "Salvar Endereço"}
                </Button>
              </DialogFooter>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      {addresses.length === 0 ? (
        <div className="text-center py-10 border-2 border-dashed border-foreground bg-muted/20">
          <p className="text-sm text-muted-foreground">Você ainda não tem nenhum endereço cadastrado.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {addresses.map((address) => (
            <div
              key={address.id}
              className="border-2 border-foreground bg-card p-5 transition-all hover:-translate-y-1 hover:shadow-[5px_5px_0_0_var(--color-foreground)] relative flex flex-col justify-between"
            >
              <div className="space-y-2">
                <div className="flex items-center gap-2">
                  <span className="flex size-7 items-center justify-center border-2 border-foreground bg-primary text-primary-foreground">
                    <MapPin className="h-4 w-4" />
                  </span>
                  <span className="font-heading font-bold text-sm text-foreground">
                    {address.label || "Endereço"}
                  </span>
                </div>
                <p className="text-xs text-muted-foreground leading-relaxed">
                  {address.street}, {address.number}
                  {address.complement && ` - ${address.complement}`}
                  <br />
                  {address.neighborhood} - {address.city} - {address.state}
                  <br />
                  CEP: {address.cep}
                </p>
              </div>

              <div className="flex justify-end pt-4 border-t-2 border-foreground mt-4">
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => handleDelete(address.id)}
                  disabled={deletingId === address.id}
                  className="text-xs font-semibold text-muted-foreground hover:text-destructive cursor-pointer"
                >
                  {deletingId === address.id ? (
                    <Loader2 className="h-4 w-4 animate-spin" />
                  ) : (
                    <>
                      <Trash2 className="h-4 w-4 mr-1.5" />
                      Excluir
                    </>
                  )}
                </Button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
