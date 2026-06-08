"use client";

import { useState, useTransition } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { categorySchema, CategoryFormData } from "@/schemas/admin";
import { createCategory, updateCategory, deleteCategory } from "@/actions/admin";
import { Button } from "@/components/ui/button";
import { ConfirmDialog } from "@/components/admin/ui";
import { toast } from "sonner";
import { Pencil, Trash2, Loader2, X, Plus } from "lucide-react";

// ─── Create Button + Modal ────────────────────────────────────────────────────

export function CreateCategoryButton() {
  const [open, setOpen] = useState(false);

  return (
    <>
      <Button onClick={() => setOpen(true)} className="gap-2">
        <Plus className="h-4 w-4" /> Nova Categoria
      </Button>
      {open && <CategoryModal onClose={() => setOpen(false)} />}
    </>
  );
}

// ─── Category Actions (Edit + Delete) ────────────────────────────────────────

interface Category {
  id: string;
  name: string;
  slug: string;
  description: string | null;
  image: string | null;
  isActive: boolean;
  sortOrder: number;
}

export function CategoryActions({ category }: { category: Category }) {
  const [showEdit, setShowEdit] = useState(false);
  const [showDelete, setShowDelete] = useState(false);
  const [isPending, startTransition] = useTransition();

  const handleDelete = () => {
    startTransition(async () => {
      const result = await deleteCategory(category.id);
      if (result.success) {
        toast.success("Categoria excluída com sucesso!");
      } else {
        toast.error(result.error || "Erro ao excluir categoria.");
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

      {showEdit && (
        <CategoryModal
          category={category}
          onClose={() => setShowEdit(false)}
        />
      )}

      {showDelete && (
        <ConfirmDialog
          title={`Excluir "${category.name}"`}
          description="Esta ação não pode ser desfeita. Produtos associados não serão excluídos."
          onConfirm={handleDelete}
          onCancel={() => setShowDelete(false)}
        />
      )}
    </>
  );
}

// ─── Category Modal Form ──────────────────────────────────────────────────────

interface CategoryModalProps {
  category?: {
    id: string;
    name: string;
    slug: string;
    description: string | null;
    image: string | null;
    isActive: boolean;
    sortOrder: number;
  };
  onClose: () => void;
}

function CategoryModal({ category, onClose }: CategoryModalProps) {
  const [isPending, startTransition] = useTransition();

  const {
    register,
    handleSubmit,
    watch,
    setValue,
    formState: { errors },
  } = useForm<CategoryFormData>({
    resolver: zodResolver(categorySchema),
    defaultValues: category
      ? {
          name: category.name,
          slug: category.slug,
          description: category.description ?? "",
          image: category.image ?? "",
          isActive: category.isActive,
          sortOrder: category.sortOrder,
        }
      : {
          name: "",
          slug: "",
          description: "",
          image: "",
          isActive: true,
          sortOrder: 0,
        },
  });

  const watchedName = watch("name");

  const generateSlug = () => {
    if (!category && watchedName) {
      const slug = watchedName
        .toLowerCase()
        .normalize("NFD")
        .replace(/[\u0300-\u036f]/g, "")
        .replace(/\s+/g, "-")
        .replace(/[^a-z0-9-]/g, "");
      setValue("slug", slug);
    }
  };

  const onSubmit = (data: CategoryFormData) => {
    startTransition(async () => {
      const result = category
        ? await updateCategory(category.id, data)
        : await createCategory(data);

      if (result.success) {
        toast.success(category ? "Categoria atualizada!" : "Categoria criada com sucesso!");
        onClose();
      } else {
        toast.error(result.error || "Erro ao salvar categoria.");
      }
    });
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
      <div className="bg-card border-2 border-foreground shadow-[6px_6px_0_0_var(--color-foreground)] w-full max-w-lg max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between p-6 border-b-2 border-foreground">
          <h2 className="font-heading text-lg font-extrabold text-foreground">
            {category ? "Editar Categoria" : "Nova Categoria"}
          </h2>
          <button onClick={onClose} className="border-2 border-transparent p-1.5 hover:border-foreground transition-colors">
            <X className="h-4 w-4" />
          </button>
        </div>

        <form onSubmit={handleSubmit(onSubmit)} className="p-6 space-y-4">
          <div>
            <label className="text-sm font-medium mb-1.5 block">Nome *</label>
            <input
              {...register("name")}
              onBlur={generateSlug}
              placeholder="Ex: Objetos para Sala"
              className="w-full h-10 rounded-none border-2 border-foreground bg-card px-3 text-sm focus:outline-none focus:ring-2 focus:ring-primary/30"
            />
            {errors.name && <p className="text-xs text-destructive mt-1">{errors.name.message}</p>}
          </div>

          <div>
            <label className="text-sm font-medium mb-1.5 block">Slug *</label>
            <input
              {...register("slug")}
              placeholder="objetos-para-sala"
              className="w-full h-10 rounded-none border-2 border-foreground bg-card px-3 text-sm font-mono focus:outline-none focus:ring-2 focus:ring-primary/30"
            />
            {errors.slug && <p className="text-xs text-destructive mt-1">{errors.slug.message}</p>}
          </div>

          <div>
            <label className="text-sm font-medium mb-1.5 block">Descrição</label>
            <textarea
              {...register("description")}
              rows={2}
              placeholder="Descrição da categoria..."
              className="w-full rounded-none border-2 border-foreground bg-card px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary/30 resize-none"
            />
          </div>

          <div>
            <label className="text-sm font-medium mb-1.5 block">URL da Imagem</label>
            <input
              {...register("image")}
              placeholder="https://..."
              className="w-full h-10 rounded-none border-2 border-foreground bg-card px-3 text-sm focus:outline-none focus:ring-2 focus:ring-primary/30"
            />
            {errors.image && <p className="text-xs text-destructive mt-1">{errors.image.message}</p>}
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="text-sm font-medium mb-1.5 block">Ordem de exibição</label>
              <input
                {...register("sortOrder", { valueAsNumber: true })}
                type="number"
                min="0"
                className="w-full h-10 rounded-none border-2 border-foreground bg-card px-3 text-sm focus:outline-none focus:ring-2 focus:ring-primary/30"
              />
            </div>
            <div className="flex items-end pb-0">
              <label className="flex items-center gap-2 cursor-pointer h-10">
                <input
                  {...register("isActive")}
                  type="checkbox"
                  className="w-4 h-4 accent-primary"
                />
                <span className="text-sm font-medium">Categoria ativa</span>
              </label>
            </div>
          </div>

          <div className="flex gap-3 pt-2">
            <Button type="button" variant="outline" className="flex-1" onClick={onClose}>
              Cancelar
            </Button>
            <Button type="submit" disabled={isPending} className="flex-1">
              {isPending ? <Loader2 className="h-4 w-4 animate-spin" /> : category ? "Atualizar" : "Criar"}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}
