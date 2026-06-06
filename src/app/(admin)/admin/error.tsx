"use client";

import { useEffect } from "react";
import { Button } from "@/components/ui/button";
import { AlertTriangle, RefreshCw } from "lucide-react";

export default function AdminError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error("Admin error:", error);
  }, [error]);

  return (
    <div className="flex items-center justify-center min-h-[60vh]">
      <div className="text-center max-w-md space-y-6 p-8 bg-card border-2 border-foreground shadow-[6px_6px_0_0_var(--color-foreground)]">
        <div className="w-16 h-16 border-2 border-foreground bg-destructive/10 flex items-center justify-center mx-auto">
          <AlertTriangle className="h-8 w-8 text-destructive" />
        </div>

        <div>
          <h2 className="display text-2xl text-foreground mb-2">
            Ocorreu um erro
          </h2>
          <p className="text-sm text-muted-foreground leading-relaxed">
            Algo deu errado ao carregar esta página do painel administrativo.
            {error.digest && (
              <span className="block mt-2 font-mono text-xs opacity-60">
                ID: {error.digest}
              </span>
            )}
          </p>
        </div>

        <Button onClick={reset} className="gap-2">
          <RefreshCw className="h-4 w-4" />
          Tentar novamente
        </Button>
      </div>
    </div>
  );
}
