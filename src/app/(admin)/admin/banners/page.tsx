import { getHeroSlides } from "@/actions/banners";
import { PageHeader } from "@/components/admin/ui";
import { BannerEditor } from "@/components/admin/banners/banner-editor";

export default async function AdminBannersPage() {
  const slides = await getHeroSlides();

  return (
    <div className="space-y-6">
      <PageHeader
        title="Banners da Home"
        description="Edite os banners rotativos do topo da página inicial."
      />
      <BannerEditor initialSlides={slides} />
    </div>
  );
}
