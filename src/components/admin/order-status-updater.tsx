"use client";

import { useState, useTransition } from "react";
import { OrderStatus } from "@prisma/client";
import { updateOrderStatus } from "@/actions/admin";
import { StatusBadge } from "@/components/admin/ui";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { Loader2, RefreshCw } from "lucide-react";

const STATUSES: { value: OrderStatus; label: string }[] = [
  { value: "PENDING", label: "Pendente" },
  { value: "AWAITING_PAYMENT", label: "Aguardando Pagamento" },
  { value: "PAID", label: "Pago" },
  { value: "PROCESSING", label: "Em Preparo" },
  { value: "SHIPPED", label: "Enviado" },
  { value: "DELIVERED", label: "Entregue" },
  { value: "CANCELLED", label: "Cancelado" },
  { value: "REFUNDED", label: "Reembolsado" },
];

interface OrderStatusUpdaterProps {
  orderId: string;
  currentStatus: OrderStatus;
}

export function OrderStatusUpdater({ orderId, currentStatus }: OrderStatusUpdaterProps) {
  const [selected, setSelected] = useState<OrderStatus>(currentStatus);
  const [note, setNote] = useState("");
  const [isPending, startTransition] = useTransition();

  const handleUpdate = () => {
    if (selected === currentStatus) {
      toast.info("Selecione um status diferente do atual.");
      return;
    }

    startTransition(async () => {
      const result = await updateOrderStatus(orderId, selected, note);
      if (result.success) {
        toast.success("Status do pedido atualizado com sucesso!");
        setNote("");
      } else {
        toast.error(result.error || "Erro ao atualizar status.");
      }
    });
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center gap-2 mb-2">
        <span className="text-sm font-semibold text-muted-foreground">Status atual:</span>
        <StatusBadge status={currentStatus} />
      </div>

      <div className="grid grid-cols-2 gap-2">
        {STATUSES.map((s) => (
          <button
            key={s.value}
            onClick={() => setSelected(s.value)}
            className={`px-3 py-2 text-xs font-semibold text-left transition-all border-2 ${
              selected === s.value
                ? "border-foreground bg-foreground text-background"
                : "border-foreground/40 text-muted-foreground hover:border-foreground hover:bg-muted/40"
            }`}
          >
            {s.label}
          </button>
        ))}
      </div>

      <textarea
        value={note}
        onChange={(e) => setNote(e.target.value)}
        placeholder="Observação (opcional)..."
        rows={2}
        className="w-full rounded-none border-2 border-foreground bg-card px-3 py-2 text-sm placeholder:text-muted-foreground focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary/30 resize-none"
      />

      <Button
        onClick={handleUpdate}
        disabled={isPending || selected === currentStatus}
        className="w-full"
      >
        {isPending ? (
          <><Loader2 className="h-4 w-4 mr-2 animate-spin" /> Atualizando...</>
        ) : (
          <><RefreshCw className="h-4 w-4 mr-2" /> Atualizar Status</>
        )}
      </Button>
    </div>
  );
}
