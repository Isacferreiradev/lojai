import { createClient } from "@/lib/supabase/server";
import prisma from "@/lib/prisma";
import { AddressesManager } from "@/components/store/addresses-manager";

export default async function AddressesPage() {
  const supabase = await createClient();
  const { data: { user: authUser } } = await supabase.auth.getUser();

  if (!authUser) return null;

  const dbUser = await prisma.user.findUnique({
    where: { supabaseId: authUser.id },
  });

  if (!dbUser) {
    return (
      <div className="space-y-4">
        <h2 className="text-2xl font-bold text-foreground">Meus Endereços</h2>
        <p className="text-sm text-muted-foreground">Você precisa finalizar um pedido para registrar seus endereços.</p>
      </div>
    );
  }

  const addresses = await prisma.address.findMany({
    where: { userId: dbUser.id },
    orderBy: { createdAt: "desc" },
  });

  return (
    <div className="space-y-6">
      <div className="border-b border-border/40 pb-4">
        <h2 className="text-2xl font-bold text-foreground">Meus Endereços</h2>
        <p className="text-xs text-muted-foreground mt-0.5">Gerencie os locais de entrega salvos em sua conta.</p>
      </div>
      
      <AddressesManager addresses={addresses} />
    </div>
  );
}
