import { loginAdmin } from "@/actions/admin-auth";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Lock } from "lucide-react";

export const metadata = { title: "Acesso Restrito | Orna Casa" };

export default async function AdminLoginPage({
  searchParams,
}: {
  searchParams: Promise<{ error?: string; next?: string }>;
}) {
  const { error, next } = await searchParams;

  return (
    <div className="flex min-h-screen items-center justify-center bg-background px-4">
      <div className="w-full max-w-sm space-y-6 border-2 border-foreground bg-card p-8 shadow-[6px_6px_0_0_var(--color-foreground)]">
        <div className="space-y-1 text-center">
          <div className="mx-auto mb-3 flex size-12 items-center justify-center border-2 border-foreground bg-foreground text-background">
            <Lock className="h-5 w-5" />
          </div>
          <span className="font-heading text-2xl font-extrabold tracking-tight text-foreground">
            ORNA CASA<span className="text-primary">.</span>
          </span>
          <p className="label-mono text-muted-foreground">Painel Administrativo</p>
        </div>

        <form action={loginAdmin} className="space-y-4">
          <input type="hidden" name="next" value={next || "/admin"} />
          <div className="space-y-1.5">
            <Label htmlFor="password">Senha de acesso</Label>
            <Input id="password" name="password" type="password" placeholder="••••••••" autoFocus />
          </div>

          {error && (
            <p className="border-2 border-destructive bg-destructive/10 px-3 py-2 text-xs font-medium text-destructive">
              Senha incorreta. Tente novamente.
            </p>
          )}

          <Button type="submit" className="w-full">
            Entrar no Painel
          </Button>
        </form>
      </div>
    </div>
  );
}
