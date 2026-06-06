"use client";

import { useTransition } from "react";
import { toggleCustomerStatus } from "@/actions/admin";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { Loader2, ShieldOff, ShieldCheck } from "lucide-react";

interface ToggleCustomerButtonProps {
  id: string;
  name: string;
  isActive: boolean;
}

export function ToggleCustomerButton({ id, name, isActive }: ToggleCustomerButtonProps) {
  const [isPending, startTransition] = useTransition();

  const handleToggle = () => {
    startTransition(async () => {
      const result = await toggleCustomerStatus(id, !isActive);
      if (result.success) {
        toast.success(
          isActive
            ? `"${name}" foi bloqueado.`
            : `"${name}" foi reativado.`
        );
      } else {
        toast.error(result.error || "Erro ao alterar status do cliente.");
      }
    });
  };

  return (
    <Button
      variant="ghost"
      size="sm"
      className={`h-8 w-8 p-0 ${isActive ? "text-destructive hover:bg-destructive/10" : "text-green-600 hover:bg-green-100"}`}
      onClick={handleToggle}
      disabled={isPending}
      title={isActive ? "Bloquear cliente" : "Reativar cliente"}
    >
      {isPending ? (
        <Loader2 className="h-3.5 w-3.5 animate-spin" />
      ) : isActive ? (
        <ShieldOff className="h-3.5 w-3.5" />
      ) : (
        <ShieldCheck className="h-3.5 w-3.5" />
      )}
    </Button>
  );
}
