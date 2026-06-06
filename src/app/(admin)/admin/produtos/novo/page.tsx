import { getAdminCategories } from "@/actions/admin";
import { ProductForm } from "@/components/admin/products/product-form";
import { PageHeader } from "@/components/admin/ui";

export default async function NewProductPage() {
  const categories = await getAdminCategories();

  return (
    <div>
      <PageHeader
        title="Novo Produto"
        description="Preencha os dados para cadastrar um novo produto na loja."
        backHref="/admin/produtos"
      />
      <ProductForm categories={categories.map((c) => ({ id: c.id, name: c.name }))} />
    </div>
  );
}
