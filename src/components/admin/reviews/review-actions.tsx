"use client";

import { useState, useTransition } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { reviewSchema, ReviewFormData } from "@/schemas/admin";
import { createReview, updateReviewStatus, deleteReview } from "@/actions/admin";
import { getAdminProducts } from "@/actions/admin";
import { Button } from "@/components/ui/button";
import { ConfirmDialog } from "@/components/admin/ui";
import { toast } from "sonner";
import { Eye, EyeOff, Trash2, Loader2, X, Plus } from "lucide-react";

// ─── Create Review Button ─────────────────────────────────────────────────────

export function CreateReviewButton() {
  const [open, setOpen] = useState(false);
  return (
    <>
      <Button onClick={() => setOpen(true)} className="gap-2">
        <Plus className="h-4 w-4" /> Nova Avaliação
      </Button>
      {open && <ReviewModal onClose={() => setOpen(false)} />}
    </>
  );
}

// ─── Review Actions ───────────────────────────────────────────────────────────

interface Review {
  id: string;
  isActive: boolean;
  name: string;
}

export function ReviewActions({ review }: { review: Review }) {
  const [showDelete, setShowDelete] = useState(false);
  const [isPending, startTransition] = useTransition();

  const handleToggle = () => {
    startTransition(async () => {
      const result = await updateReviewStatus(review.id, !review.isActive);
      if (result.success) {
        toast.success(review.isActive ? "Avaliação ocultada." : "Avaliação publicada!");
      } else {
        toast.error(result.error || "Erro ao atualizar avaliação.");
      }
    });
  };

  const handleDelete = () => {
    startTransition(async () => {
      const result = await deleteReview(review.id);
      if (result.success) {
        toast.success("Avaliação excluída.");
      } else {
        toast.error(result.error || "Erro ao excluir.");
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
          onClick={handleToggle}
          disabled={isPending}
          title={review.isActive ? "Ocultar" : "Publicar"}
        >
          {isPending ? (
            <Loader2 className="h-3.5 w-3.5 animate-spin" />
          ) : review.isActive ? (
            <EyeOff className="h-3.5 w-3.5" />
          ) : (
            <Eye className="h-3.5 w-3.5 text-green-600" />
          )}
        </Button>
        <Button
          variant="ghost"
          size="sm"
          className="h-8 w-8 p-0 text-destructive hover:bg-destructive/10"
          onClick={() => setShowDelete(true)}
          disabled={isPending}
          title="Excluir"
        >
          <Trash2 className="h-3.5 w-3.5" />
        </Button>
      </div>

      {showDelete && (
        <ConfirmDialog
          title="Excluir avaliação"
          description={`Tem certeza que deseja excluir a avaliação de "${review.name}"?`}
          onConfirm={handleDelete}
          onCancel={() => setShowDelete(false)}
        />
      )}
    </>
  );
}

// ─── Review Modal (Create) ────────────────────────────────────────────────────

interface ReviewModalProps {
  onClose: () => void;
}

function ReviewModal({ onClose }: ReviewModalProps) {
  const [isPending, startTransition] = useTransition();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<ReviewFormData>({
    resolver: zodResolver(reviewSchema),
    defaultValues: {
      name: "",
      city: "",
      comment: "",
      productId: "",
      rating: 5,
      isActive: true,
    },
  });

  const onSubmit = (data: ReviewFormData) => {
    startTransition(async () => {
      const result = await createReview(data);
      if (result.success) {
        toast.success("Avaliação criada com sucesso!");
        onClose();
      } else {
        toast.error(result.error || "Erro ao criar avaliação.");
      }
    });
  };

  const fieldClass =
    "w-full h-10 rounded-none border-2 border-foreground bg-card px-3 text-sm focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary/30";

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
      <div className="bg-card border-2 border-foreground shadow-[6px_6px_0_0_var(--color-foreground)] w-full max-w-lg max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between p-6 border-b-2 border-foreground">
          <h2 className="font-heading text-lg font-extrabold">Nova Avaliação</h2>
          <button onClick={onClose} className="border-2 border-transparent p-1.5 hover:border-foreground transition-colors">
            <X className="h-4 w-4" />
          </button>
        </div>

        <form onSubmit={handleSubmit(onSubmit)} className="p-6 space-y-4">
          <div>
            <label className="text-sm font-medium mb-1.5 block">ID do Produto *</label>
            <input
              {...register("productId")}
              placeholder="UUID do produto"
              className={`${fieldClass} font-mono`}
            />
            {errors.productId && (
              <p className="text-xs text-destructive mt-1">{errors.productId.message}</p>
            )}
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="text-sm font-medium mb-1.5 block">Nome do Cliente *</label>
              <input {...register("name")} placeholder="Maria Silva" className={fieldClass} />
              {errors.name && <p className="text-xs text-destructive mt-1">{errors.name.message}</p>}
            </div>
            <div>
              <label className="text-sm font-medium mb-1.5 block">Cidade</label>
              <input {...register("city")} placeholder="São Paulo" className={fieldClass} />
            </div>
          </div>

          <div>
            <label className="text-sm font-medium mb-1.5 block">Nota (1-5) *</label>
            <select {...register("rating", { valueAsNumber: true })} className={fieldClass}>
              {[5, 4, 3, 2, 1].map((n) => (
                <option key={n} value={n}>
                  {"★".repeat(n)} {n === 5 ? "— Excelente" : n === 4 ? "— Bom" : n === 3 ? "— Regular" : n === 2 ? "— Ruim" : "— Péssimo"}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="text-sm font-medium mb-1.5 block">Comentário *</label>
            <textarea
              {...register("comment")}
              rows={3}
              placeholder="Escreva o depoimento do cliente..."
              className="w-full rounded-none border-2 border-foreground bg-card px-3 py-2 text-sm focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary/30 resize-none"
            />
            {errors.comment && (
              <p className="text-xs text-destructive mt-1">{errors.comment.message}</p>
            )}
          </div>

          <label className="flex items-center gap-2 cursor-pointer">
            <input
              {...register("isActive")}
              type="checkbox"
              className="w-4 h-4 accent-primary"
            />
            <span className="text-sm font-medium">Publicar avaliação imediatamente</span>
          </label>

          <div className="flex gap-3 pt-2">
            <Button type="button" variant="outline" className="flex-1" onClick={onClose}>
              Cancelar
            </Button>
            <Button type="submit" disabled={isPending} className="flex-1">
              {isPending ? <Loader2 className="h-4 w-4 animate-spin" /> : "Criar Avaliação"}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}
