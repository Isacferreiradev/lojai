import Link from "next/link";
import { Button } from "@/components/ui/button";

export default function NotFound() {
  return (
    <div className="flex-1 flex flex-col items-center justify-center px-4 py-16 text-center bg-background">
      <h1 className="font-heading text-9xl font-extrabold text-foreground tracking-tighter">
        404
      </h1>
      <div className="bg-accent px-2 py-0.5 font-mono text-xs uppercase tracking-wide border-2 border-foreground rotate-3 -translate-y-6 inline-block text-accent-foreground font-semibold">
        Página não encontrada
      </div>
      <h2 className="display text-3xl mt-4 text-foreground">
        Esse caminho não existe.
      </h2>
      <p className="text-muted-foreground mt-2 max-w-md">
        O produto que você está procurando pode ter sido movido para outra coleção ou
        nunca existiu. Que tal voltar para a página inicial?
      </p>
      <div className="mt-8">
        <Button asChild size="lg">
          <Link href="/">Voltar para o Início</Link>
        </Button>
      </div>
    </div>
  );
}
