import { notFound } from "next/navigation";
import { getAdminProduct, getAdminCategories } from "@/actions/admin";
import { ProductForm } from "@/components/admin/products/product-form";
import { PageHeader } from "@/components/admin/ui";

interface PageProps {
  params: Promise<{ id: string }>;
}

export default async function EditProductPage({ params }: PageProps) {
  const { id } = await params;

  const [product, categories] = await Promise.all([
    getAdminProduct(id),
    getAdminCategories(),
  ]);

  if (!product) notFound();

  return (
    <div>
      <PageHeader
        title="Editar Produto"
        description={product.name}
        backHref="/admin/produtos"
      />
      <ProductForm
        productId={product.id}
        categories={categories.map((c) => ({ id: c.id, name: c.name }))}
        existingImages={product.images.map((img) => img.url)}
        defaultValues={{
          name: product.name,
          slug: product.slug,
          sku: product.sku,
          description: product.description ?? "",
          brand: product.brand ?? "",
          price: Number(product.price),
          promoPrice: product.promoPrice ? Number(product.promoPrice) : undefined,
          stock: product.stock,
          categoryId: product.categoryId,
          material: product.material ?? "",
          colors: product.colors,
          sizes: product.sizes,
          weight: product.weight ? Number(product.weight) : undefined,
          width: product.width ? Number(product.width) : undefined,
          height: product.height ? Number(product.height) : undefined,
          depth: product.depth ? Number(product.depth) : undefined,
          isWashable: product.isWashable,
          isActive: product.isActive,
          isFeatured: product.isFeatured,
          metaTitle: product.metaTitle ?? "",
          metaDescription: product.metaDescription ?? "",
          metaKeywords: product.metaKeywords ?? "",
        }}
      />
    </div>
  );
}
