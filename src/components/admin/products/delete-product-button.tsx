"use client";

import { useState, useTransition } from "react";
import { deleteProduct } from "@/actions/admin";
import { Button } from "@/components/ui/button";
import { ConfirmDialog } from "@/components/admin/ui";
import { toast } from "sonner";
import { Trash2, Loader2 } from "lucide-react";

interface DeleteProductButtonProps {
  id: string;
  name: string;
}

export function DeleteProductButton({ id, name }: DeleteProductButtonProps) {
  const [showConfirm, setShowConfirm] = useState(false);
  const [isPending, startTransition] = useTransition();

  const handleDelete = () => {
    startTransition(async () => {
      const result = await deleteProduct(id);
      if (result.success) {
        toast.success(`Produto "${name}" removido com sucesso!`);
      } else {
        toast.error(result.error || "Erro ao remover produto.");
      }
      setShowConfirm(false);
    });
  };

  return (
    <>
      <Button
        variant="ghost"
        size="sm"
        className="h-8 w-8 p-0 text-destructive hover:bg-destructive/10"
        onClick={() => setShowConfirm(true)}
        disabled={isPending}
        title="Excluir"
      >
        {isPending ? <Loader2 className="h-3.5 w-3.5 animate-spin" /> : <Trash2 className="h-3.5 w-3.5" />}
      </Button>

      {showConfirm && (
        <ConfirmDialog
          title="Excluir produto"
          description={`Tem certeza que deseja excluir "${name}"? Esta ação não pode ser desfeita.`}
          onConfirm={handleDelete}
          onCancel={() => setShowConfirm(false)}
        />
      )}
    </>
  );
}
