"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useTransition } from "react";
import { settingsSchema, SettingsFormData } from "@/schemas/admin";
import { saveAdminSettings } from "@/actions/admin";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { Loader2, Save, Store, Truck, Share2, Search } from "lucide-react";

interface SettingsFormProps {
  defaultValues: Record<string, string>;
}

const fieldClass =
  "w-full h-10 rounded-none border-2 border-foreground bg-card px-3 text-sm focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary/30";

export function SettingsForm({ defaultValues }: SettingsFormProps) {
  const [isPending, startTransition] = useTransition();

  const {
    register,
    handleSubmit,
    formState: { errors, isDirty },
  } = useForm<SettingsFormData>({
    resolver: zodResolver(settingsSchema),
    defaultValues: {
      storeName: defaultValues.storeName || "Orna Casa",
      storeEmail: defaultValues.storeEmail || "",
      storePhone: defaultValues.storePhone || "",
      storeAddress: defaultValues.storeAddress || "",
      freeShippingThreshold: Number(defaultValues.freeShippingThreshold) || 350,
      flatShippingRate: Number(defaultValues.flatShippingRate) || 45,
      instagramUrl: defaultValues.instagramUrl || "",
      facebookUrl: defaultValues.facebookUrl || "",
      whatsappNumber: defaultValues.whatsappNumber || "",
      metaTitle: defaultValues.metaTitle || "",
      metaDescription: defaultValues.metaDescription || "",
    },
  });

  const onSubmit = (data: SettingsFormData) => {
    startTransition(async () => {
      const result = await saveAdminSettings(data);
      if (result.success) {
        toast.success("Configurações salvas com sucesso!");
      } else {
        toast.error(result.error || "Erro ao salvar configurações.");
      }
    });
  };

  const sections = [
    {
      icon: Store,
      title: "Informações da Loja",
      description: "Dados de contato e endereço exibidos na loja.",
      fields: (
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="sm:col-span-2">
            <label className="text-sm font-medium mb-1.5 block">Nome da Loja *</label>
            <input {...register("storeName")} className={fieldClass} placeholder="Orna Casa" />
            {errors.storeName && <p className="text-xs text-destructive mt-1">{errors.storeName.message}</p>}
          </div>
          <div>
            <label className="text-sm font-medium mb-1.5 block">E-mail *</label>
            <input {...register("storeEmail")} type="email" className={fieldClass} placeholder="contato@lojai.com.br" />
            {errors.storeEmail && <p className="text-xs text-destructive mt-1">{errors.storeEmail.message}</p>}
          </div>
          <div>
            <label className="text-sm font-medium mb-1.5 block">Telefone</label>
            <input {...register("storePhone")} className={fieldClass} placeholder="(11) 99999-9999" />
          </div>
          <div className="sm:col-span-2">
            <label className="text-sm font-medium mb-1.5 block">Endereço</label>
            <input {...register("storeAddress")} className={fieldClass} placeholder="Rua das Flores, 123 — São Paulo, SP" />
          </div>
        </div>
      ),
    },
    {
      icon: Truck,
      title: "Configurações de Frete",
      description: "Defina o valor do frete fixo e a partir de qual valor o frete é grátis.",
      fields: (
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="text-sm font-medium mb-1.5 block">Frete grátis acima de (R$)</label>
            <input
              {...register("freeShippingThreshold", { valueAsNumber: true })}
              type="number"
              step="0.01"
              min="0"
              className={fieldClass}
              placeholder="350.00"
            />
            {errors.freeShippingThreshold && (
              <p className="text-xs text-destructive mt-1">{errors.freeShippingThreshold.message}</p>
            )}
          </div>
          <div>
            <label className="text-sm font-medium mb-1.5 block">Valor do frete fixo (R$)</label>
            <input
              {...register("flatShippingRate", { valueAsNumber: true })}
              type="number"
              step="0.01"
              min="0"
              className={fieldClass}
              placeholder="45.00"
            />
            {errors.flatShippingRate && (
              <p className="text-xs text-destructive mt-1">{errors.flatShippingRate.message}</p>
            )}
          </div>
        </div>
      ),
    },
    {
      icon: Share2,
      title: "Redes Sociais",
      description: "Links e informações de contato para exibição no rodapé.",
      fields: (
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="text-sm font-medium mb-1.5 block">Instagram</label>
            <input {...register("instagramUrl")} type="url" className={fieldClass} placeholder="https://instagram.com/lojai" />
            {errors.instagramUrl && <p className="text-xs text-destructive mt-1">{errors.instagramUrl.message}</p>}
          </div>
          <div>
            <label className="text-sm font-medium mb-1.5 block">Facebook</label>
            <input {...register("facebookUrl")} type="url" className={fieldClass} placeholder="https://facebook.com/lojai" />
            {errors.facebookUrl && <p className="text-xs text-destructive mt-1">{errors.facebookUrl.message}</p>}
          </div>
          <div>
            <label className="text-sm font-medium mb-1.5 block">WhatsApp (número com DDD)</label>
            <input {...register("whatsappNumber")} className={fieldClass} placeholder="5511999999999" />
          </div>
        </div>
      ),
    },
    {
      icon: Search,
      title: "SEO Global",
      description: "Título e descrição padrão para mecanismos de busca.",
      fields: (
        <div className="space-y-4">
          <div>
            <label className="text-sm font-medium mb-1.5 block">Meta Título</label>
            <input
              {...register("metaTitle")}
              className={fieldClass}
              placeholder="Orna Casa — Peças de decoração premium para sua casa"
            />
          </div>
          <div>
            <label className="text-sm font-medium mb-1.5 block">Meta Descrição</label>
            <textarea
              {...register("metaDescription")}
              rows={3}
              className="w-full rounded-none border-2 border-foreground bg-card px-3 py-2 text-sm focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary/30 resize-none"
              placeholder="Encontre as melhores peças para transformar sua casa. Qualidade premium com entrega rápida."
            />
          </div>
        </div>
      ),
    },
  ];

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
      {sections.map((section) => {
        const Icon = section.icon;
        return (
          <div
            key={section.title}
            className="bg-card border-2 border-foreground overflow-hidden"
          >
            {/* Section header */}
            <div className="flex items-center gap-3 px-6 py-4 border-b-2 border-foreground bg-muted/30">
              <div className="w-9 h-9 border-2 border-foreground bg-primary text-primary-foreground flex items-center justify-center">
                <Icon className="h-4 w-4" />
              </div>
              <div>
                <h2 className="font-heading font-bold text-sm text-foreground">{section.title}</h2>
                <p className="text-xs text-muted-foreground">{section.description}</p>
              </div>
            </div>

            {/* Section fields */}
            <div className="p-6">{section.fields}</div>
          </div>
        );
      })}

      {/* Save button */}
      <div className="flex justify-end sticky bottom-4">
        <Button
          type="submit"
          disabled={isPending || !isDirty}
          className="px-8 gap-2"
          size="lg"
        >
          {isPending ? (
            <><Loader2 className="h-4 w-4 animate-spin" /> Salvando...</>
          ) : (
            <><Save className="h-4 w-4" /> Salvar Configurações</>
          )}
        </Button>
      </div>
    </form>
  );
}
