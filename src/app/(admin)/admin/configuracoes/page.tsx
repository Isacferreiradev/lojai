import { getAdminSettings } from "@/actions/admin";
import { PageHeader } from "@/components/admin/ui";
import { SettingsForm } from "@/components/admin/settings/settings-form";

export default async function AdminSettingsPage() {
  const settings = await getAdminSettings();

  return (
    <div>
      <PageHeader
        title="Configurações da Loja"
        description="Gerencie as informações gerais, frete e redes sociais da loja."
      />
      <SettingsForm defaultValues={settings} />
    </div>
  );
}
