"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Copy, Check, Loader2, CheckCircle2 } from "lucide-react";
import { toast } from "sonner";

interface PixPaymentProps {
  orderId: string;
  pixCode: string | null;
}

export function PixPayment({ orderId, pixCode }: PixPaymentProps) {
  const router = useRouter();
  const [copied, setCopied] = useState(false);
  const [paid, setPaid] = useState(false);

  // Poll order status until paid
  useEffect(() => {
    if (paid) return;
    const interval = setInterval(async () => {
      try {
        const res = await fetch(`/api/order-status/${orderId}`, { cache: "no-store" });
        if (!res.ok) return;
        const data = await res.json();
        if (data.paid) {
          setPaid(true);
          clearInterval(interval);
          toast.success("Pagamento confirmado! 🎉");
          setTimeout(() => router.refresh(), 1500);
        }
      } catch {
        /* ignore */
      }
    }, 5000);
    return () => clearInterval(interval);
  }, [orderId, paid, router]);

  const handleCopy = async () => {
    if (!pixCode) return;
    await navigator.clipboard.writeText(pixCode);
    setCopied(true);
    toast.success("Código PIX copiado!");
    setTimeout(() => setCopied(false), 2500);
  };

  if (paid) {
    return (
      <div className="flex flex-col items-center gap-4 border-2 border-foreground bg-accent/30 p-8 text-center">
        <CheckCircle2 className="h-14 w-14 text-primary" />
        <h2 className="display text-2xl text-foreground">Pagamento confirmado!</h2>
        <p className="text-sm text-muted-foreground">
          Recebemos seu pagamento. Em breve você receberá os detalhes por e-mail.
        </p>
      </div>
    );
  }

  if (!pixCode) {
    return (
      <div className="border-2 border-dashed border-foreground bg-muted/20 p-8 text-center">
        <p className="label-mono text-muted-foreground">// Código PIX indisponível. Tente refazer o checkout.</p>
      </div>
    );
  }

  const qrUrl = `https://api.qrserver.com/v1/create-qr-code/?size=320x320&margin=0&data=${encodeURIComponent(pixCode)}`;

  return (
    <div className="space-y-5 border-2 border-foreground bg-card p-6">
      <div className="flex flex-col items-center gap-4">
        {/* QR code */}
        <div className="border-2 border-foreground bg-white p-3">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src={qrUrl} alt="QR Code PIX" width={240} height={240} className="h-60 w-60" />
        </div>

        <div className="flex items-center gap-2 font-mono text-xs text-muted-foreground">
          <Loader2 className="h-3.5 w-3.5 animate-spin text-primary" />
          Aguardando pagamento...
        </div>
      </div>

      {/* Copy-paste code */}
      <div className="space-y-2">
        <span className="label-mono text-primary">[ PIX Copia e Cola ]</span>
        <div className="flex items-stretch gap-2">
          <code className="flex-1 truncate border-2 border-foreground bg-muted/30 px-3 py-2.5 font-mono text-xs text-foreground">
            {pixCode}
          </code>
          <Button onClick={handleCopy} variant="outline" className="shrink-0 gap-1.5">
            {copied ? <Check className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
            {copied ? "Copiado" : "Copiar"}
          </Button>
        </div>
      </div>

      <p className="border-t-2 border-foreground pt-4 text-center text-xs text-muted-foreground">
        Abra o app do seu banco, escolha pagar via PIX com QR Code ou Copia e Cola.
        A confirmação é automática nesta página.
      </p>
    </div>
  );
}
