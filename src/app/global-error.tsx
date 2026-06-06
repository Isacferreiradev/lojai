"use client";

import { useEffect } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { AlertTriangle, Home, RefreshCw } from "lucide-react";

export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error("Global error:", error);
  }, [error]);

  return (
    <html lang="pt-BR">
      <body>
        <div className="min-h-screen flex items-center justify-center bg-background px-4">
          <div className="text-center max-w-md space-y-6">
            <div className="w-20 h-20 border-2 border-foreground bg-destructive/10 flex items-center justify-center mx-auto">
              <AlertTriangle className="h-10 w-10 text-destructive" />
            </div>

            <div>
              <h1 className="display text-3xl text-foreground mb-3">
                Ops! Algo deu errado.
              </h1>
              <p className="text-muted-foreground leading-relaxed">
                Encontramos um erro inesperado. Nossa equipe foi notificada.
                Tente recarregar a página ou volte para o início.
              </p>
            </div>

            <div className="flex flex-col sm:flex-row gap-3 justify-center">
              <Button onClick={reset} className="gap-2">
                <RefreshCw className="h-4 w-4" />
                Recarregar
              </Button>
              <Button variant="outline" asChild className="gap-2">
                <Link href="/">
                  <Home className="h-4 w-4" />
                  Página Inicial
                </Link>
              </Button>
            </div>
          </div>
        </div>
      </body>
    </html>
  );
}
