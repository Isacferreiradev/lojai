"use client";

import { useState, useTransition } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { couponSchema, CouponFormData } from "@/schemas/admin";
import { createCoupon, updateCoupon, deleteCoupon } from "@/actions/admin";
import { Button } from "@/components/ui/button";
import { ConfirmDialog } from "@/components/admin/ui";
import { toast } from "sonner";
import { Pencil, Trash2, Loader2, X, Plus } from "lucide-react";

// ─── Create Button ────────────────────────────────────────────────────────────

export function CreateCouponButton() {
  const [open, setOpen] = useState(false);
  return (
    <>
      <Button onClick={() => setOpen(true)} className="gap-2">
        <Plus className="h-4 w-4" /> Novo Cupom
      </Button>
      {open && <CouponModal onClose={() => setOpen(false)} />}
    </>
  );
}

// ─── Coupon Actions ───────────────────────────────────────────────────────────

interface Coupon {
  id: string;
  code: string;
  type: "PERCENTAGE" | "FIXED";
  value: any;
  minOrderValue: any;
  maxUses: number | null;
  usedCount: number;
  expiresAt: Date | null;
  isActive: boolean;
}

export function CouponActions({ coupon }: { coupon: Coupon }) {
  const [showEdit, setShowEdit] = useState(false);
  const [showDelete, setShowDelete] = useState(false);
  const [isPending, startTransition] = useTransition();

  const handleDelete = () => {
    startTransition(async () => {
      const result = await deleteCoupon(coupon.id);
      if (result.success) {
        toast.success("Cupom excluído com sucesso!");
      } else {
        toast.error(result.error || "Erro ao excluir cupom.");
      }
      setShowDelete(false);
    });
  };

  return (
    <>
      <div className="flex items-center gap-1 justify-end">
        <Button
          variant="ghost"
          size="sm"
          className="h-8 w-8 p-0"
          onClick={() => setShowEdit(true)}
          title="Editar"
        >
          <Pencil className="h-3.5 w-3.5" />
        </Button>
        <Button
          variant="ghost"
          size="sm"
          className="h-8 w-8 p-0 text-destructive hover:bg-destructive/10"
          onClick={() => setShowDelete(true)}
          disabled={isPending}
          title="Excluir"
        >
          {isPending ? <Loader2 className="h-3.5 w-3.5 animate-spin" /> : <Trash2 className="h-3.5 w-3.5" />}
        </Button>
      </div>

      {showEdit && <CouponModal coupon={coupon} onClose={() => setShowEdit(false)} />}

      {showDelete && (
        <ConfirmDialog
          title={`Excluir cupom "${coupon.code}"`}
          description="Esta ação não pode ser desfeita."
          onConfirm={handleDelete}
          onCancel={() => setShowDelete(false)}
        />
      )}
    </>
  );
}

// ─── Coupon Modal Form ────────────────────────────────────────────────────────

interface CouponModalProps {
  coupon?: Coupon;
  onClose: () => void;
}

function CouponModal({ coupon, onClose }: CouponModalProps) {
  const [isPending, startTransition] = useTransition();

  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm<CouponFormData>({
    resolver: zodResolver(couponSchema),
    defaultValues: coupon
      ? {
          code: coupon.code,
          type: coupon.type,
          value: Number(coupon.value),
          minOrderValue: coupon.minOrderValue ? Number(coupon.minOrderValue) : null,
          maxUses: coupon.maxUses ?? null,
          expiresAt: coupon.expiresAt
            ? new Date(coupon.expiresAt).toISOString().split("T")[0]
            : "",
          isActive: coupon.isActive,
        }
      : {
          code: "",
          type: "PERCENTAGE",
          value: 0,
          minOrderValue: null,
          maxUses: null,
          expiresAt: "",
          isActive: true,
        },
  });

  const couponType = watch("type");

  const onSubmit = (data: CouponFormData) => {
    startTransition(async () => {
      const result = coupon
        ? await updateCoupon(coupon.id, data)
        : await createCoupon(data);

      if (result.success) {
        toast.success(coupon ? "Cupom atualizado!" : "Cupom criado com sucesso!");
        onClose();
      } else {
        toast.error(result.error || "Erro ao salvar cupom.");
      }
    });
  };

  const fieldClass =
    "w-full h-10 rounded-none border-2 border-foreground bg-card px-3 text-sm focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary/30";

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
      <div className="bg-card border-2 border-foreground shadow-[6px_6px_0_0_var(--color-foreground)] w-full max-w-lg max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between p-6 border-b-2 border-foreground">
          <h2 className="font-heading text-lg font-extrabold text-foreground">
            {coupon ? "Editar Cupom" : "Novo Cupom"}
          </h2>
          <button onClick={onClose} className="border-2 border-transparent p-1.5 hover:border-foreground transition-colors">
            <X className="h-4 w-4" />
          </button>
        </div>

        <form onSubmit={handleSubmit(onSubmit)} className="p-6 space-y-4">
          {/* Code */}
          <div>
            <label className="text-sm font-medium mb-1.5 block">Código do Cupom *</label>
            <input
              {...register("code")}
              placeholder="PROMO20"
              className={`${fieldClass} uppercase font-mono`}
            />
            {errors.code && <p className="text-xs text-destructive mt-1">{errors.code.message}</p>}
          </div>

          {/* Type + Value */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="text-sm font-medium mb-1.5 block">Tipo *</label>
              <select {...register("type")} className={fieldClass}>
                <option value="PERCENTAGE">Porcentagem (%)</option>
                <option value="FIXED">Valor Fixo (R$)</option>
              </select>
            </div>
            <div>
              <label className="text-sm font-medium mb-1.5 block">
                {couponType === "PERCENTAGE" ? "Desconto (%) *" : "Valor (R$) *"}
              </label>
              <input
                {...register("value", { valueAsNumber: true })}
                type="number"
                step={couponType === "PERCENTAGE" ? "1" : "0.01"}
                min="0"
                max={couponType === "PERCENTAGE" ? "100" : undefined}
                placeholder={couponType === "PERCENTAGE" ? "20" : "50.00"}
                className={fieldClass}
              />
              {errors.value && <p className="text-xs text-destructive mt-1">{errors.value.message}</p>}
            </div>
          </div>

          {/* Min Order + Max Uses */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="text-sm font-medium mb-1.5 block">Pedido mínimo (R$)</label>
              <input
                {...register("minOrderValue", { setValueAs: (v) => (v === "" ? null : Number(v)) })}
                type="number"
                step="0.01"
                min="0"
                placeholder="100.00"
                className={fieldClass}
              />
            </div>
            <div>
              <label className="text-sm font-medium mb-1.5 block">Limite de usos</label>
              <input
                {...register("maxUses", { setValueAs: (v) => (v === "" ? null : Number(v)) })}
                type="number"
                min="1"
                placeholder="Ilimitado"
                className={fieldClass}
              />
            </div>
          </div>

          {/* Expiry */}
          <div>
            <label className="text-sm font-medium mb-1.5 block">Validade</label>
            <input
              {...register("expiresAt")}
              type="date"
              className={fieldClass}
            />
          </div>

          {/* Active */}
          <label className="flex items-center gap-2 cursor-pointer">
            <input
              {...register("isActive")}
              type="checkbox"
              className="w-4 h-4 accent-primary"
            />
            <span className="text-sm font-medium">Cupom ativo</span>
          </label>

          <div className="flex gap-3 pt-2">
            <Button type="button" variant="outline" className="flex-1" onClick={onClose}>
              Cancelar
            </Button>
            <Button type="submit" disabled={isPending} className="flex-1">
              {isPending ? <Loader2 className="h-4 w-4 animate-spin" /> : coupon ? "Atualizar" : "Criar Cupom"}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}
