import { createClient } from "@/lib/supabase/server";
import prisma from "@/lib/prisma";
import { ProfileForm } from "@/components/store/profile-form";

export default async function ProfilePage() {
  const supabase = await createClient();
  const { data: { user: authUser } } = await supabase.auth.getUser();

  if (!authUser) return null;

  const dbUser = await prisma.user.findUnique({
    where: { supabaseId: authUser.id },
  });

  if (!dbUser) {
    return (
      <div className="space-y-4">
        <h2 className="text-2xl font-bold text-foreground">Dados Pessoais</h2>
        <p className="text-sm text-muted-foreground">Você precisa finalizar um pedido para registrar seus dados.</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="border-b-2 border-foreground pb-4">
        <span className="label-mono text-primary">[ Dados Pessoais ]</span>
        <h2 className="display text-3xl text-foreground mt-2">Dados Pessoais</h2>
        <p className="font-mono text-xs text-muted-foreground mt-1">Mantenha seus dados atualizados para facilitar contatos e entregas.</p>
      </div>
      
      <ProfileForm
        initialData={{
          name: dbUser.name,
          surname: dbUser.surname,
          phone: dbUser.phone,
          cpf: dbUser.cpf,
          email: dbUser.email,
        }}
      />
    </div>
  );
}
