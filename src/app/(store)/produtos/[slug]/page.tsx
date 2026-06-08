import { getProductBySlug, getRelatedProducts } from "@/actions/products";
import { ProductGallery } from "@/components/store/product-gallery";
import { ProductDetailForm } from "@/components/store/product-detail-form";
import { TrackViewContent } from "@/components/store/track-view-content";
import { ProductGrid } from "@/components/store/product-grid";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Star, ShieldCheck, ClipboardList, Eye } from "lucide-react";
import Link from "next/link";
import { ChevronRight } from "lucide-react";
import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { formatCurrency } from "@/lib/utils";

interface PageProps {
  params: Promise<{ slug: string }>;
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params;
  const product = await getProductBySlug(slug);

  if (!product) {
    return { title: "Produto não encontrado" };
  }

  const price = product.promoPrice ? Number(product.promoPrice) : Number(product.price);
  const imageUrl = product.images[0]?.url;

  return {
    title: product.metaTitle || product.name,
    description:
      product.metaDescription ||
      `${product.name} — ${product.material ? `Material: ${product.material}. ` : ""}Disponível em ${product.sizes.join(", ")}. A partir de ${formatCurrency(price)}.`,
    keywords: product.metaKeywords
      ? product.metaKeywords.split(",").map((k) => k.trim())
      : [product.name, product.category.name, product.material || "decoração", "design"],
    openGraph: {
      title: product.name,
      description: product.metaDescription || product.description || "",
      images: imageUrl ? [{ url: imageUrl, alt: product.name }] : [],
      type: "website",
    },
  };
}

export default async function ProductDetailPage({ params }: PageProps) {
  const { slug } = await params;
  const product = await getProductBySlug(slug);

  if (!product) {
    notFound();
  }

  // Get related products in the same category
  const relatedProducts = await getRelatedProducts(product.id, product.categoryId, 4);

  return (
    <div className="container mx-auto px-4 md:px-6 py-8 pb-28 md:pb-8 flex-1 flex flex-col gap-8">
      <TrackViewContent
        id={product.id}
        name={product.name}
        value={Number(product.promoPrice ?? product.price)}
      />

      {/* Breadcrumbs — horizontal scroll on mobile */}
      <nav className="scrollbar-minimal -mx-4 flex items-center gap-2 overflow-x-auto whitespace-nowrap px-4 font-mono text-[0.65rem] font-semibold uppercase tracking-wider text-muted-foreground">
        <Link href="/" className="hover:text-primary transition-colors shrink-0">
          Início
        </Link>
        <ChevronRight className="h-3 w-3 shrink-0" />
        <Link href="/produtos" className="hover:text-primary transition-colors shrink-0">
          Produtos
        </Link>
        <ChevronRight className="h-3 w-3 shrink-0" />
        <Link href={`/produtos?category=${product.category.slug}`} className="hover:text-primary transition-colors shrink-0">
          {product.category.name}
        </Link>
        <ChevronRight className="h-3 w-3 shrink-0" />
        <span className="text-foreground truncate max-w-[180px]">{product.name}</span>
      </nav>

      {/* Main product presentation grid */}
      <div className="grid grid-cols-1 gap-6 md:grid-cols-2 md:gap-8 lg:gap-12 items-start">
        {/* Left Side: Photo Gallery */}
        <ProductGallery images={product.images} />

        {/* Right Side: Information Content */}
        <div className="space-y-6">
          <div className="space-y-2">
            <span className="inline-block border-2 border-foreground bg-primary px-2.5 py-1 font-mono text-[0.65rem] font-bold uppercase tracking-wider text-primary-foreground">
              {product.brand || "Marca Própria"}
            </span>
            <h1 className="font-heading text-3xl md:text-4xl font-extrabold tracking-tight text-foreground leading-tight">
              {product.name}
            </h1>
            <p className="font-mono text-xs text-muted-foreground">SKU: {product.sku}</p>
          </div>

          {/* Ratings & reviews count */}
          {(() => {
            const avgRating = product.reviews.length > 0 
              ? (product.reviews.reduce((acc, rev) => acc + rev.rating, 0) / product.reviews.length).toFixed(1)
              : "5.0";
            return (
              <div className="flex items-center gap-4 border-b-2 border-foreground pb-4">
                <div className="flex items-center gap-1">
                  <div className="flex text-primary">
                    <Star className="h-4.5 w-4.5 fill-current" />
                    <Star className="h-4.5 w-4.5 fill-current" />
                    <Star className="h-4.5 w-4.5 fill-current" />
                    <Star className="h-4.5 w-4.5 fill-current" />
                    <Star className="h-4.5 w-4.5 fill-current" />
                  </div>
                  <span className="text-xs font-bold text-foreground mt-0.5">{avgRating}</span>
                </div>
                <span className="text-xs text-muted-foreground">•</span>
                <span className="text-xs text-muted-foreground font-semibold">
                  {product.reviews.length} {product.reviews.length === 1 ? "avaliação" : "avaliações"} de clientes
                </span>
              </div>
            );
          })()}

          {/* Interactive options & CTA form */}
          <ProductDetailForm product={product} />

          {/* Simple highlights badges */}
          <div className="grid grid-cols-3 gap-2 sm:gap-3 text-center">
            <div className="flex flex-col items-center gap-1.5 border-2 border-foreground bg-card p-3">
              <ShieldCheck className="h-5 w-5 text-primary" />
              <span className="font-mono text-[10px] font-bold uppercase tracking-wide text-foreground">Garantia</span>
              <span className="text-[9px] text-muted-foreground">30 dias de fábrica</span>
            </div>
            <div className="flex flex-col items-center gap-1.5 border-2 border-foreground bg-card p-3">
              <ClipboardList className="h-5 w-5 text-primary" />
              <span className="font-mono text-[10px] font-bold uppercase tracking-wide text-foreground">Material</span>
              <span className="text-[9px] text-muted-foreground">{product.material || "Fibras Premium"}</span>
            </div>
            <div className="flex flex-col items-center gap-1.5 border-2 border-foreground bg-card p-3">
              <Eye className="h-5 w-5 text-primary" />
              <span className="font-mono text-[10px] font-bold uppercase tracking-wide text-foreground">Cuidados</span>
              <span className="text-[9px] text-muted-foreground">
                {product.isWashable ? "Fácil manutenção" : "Limpeza delicada"}
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Tabs Section: Detailed info, Specs, Reviews */}
      <div className="mt-8">
        <Tabs defaultValue="detalhes" className="w-full">
          <TabsList variant="line" className="w-full justify-start">
            <TabsTrigger value="detalhes" className="cursor-pointer">
              Descrição
            </TabsTrigger>
            <TabsTrigger value="especificacoes" className="cursor-pointer">
              Ficha Técnica
            </TabsTrigger>
            <TabsTrigger value="avaliacoes" className="cursor-pointer">
              Avaliações ({product.reviews.length})
            </TabsTrigger>
          </TabsList>

          <TabsContent value="detalhes" className="py-6 focus-visible:ring-0">
            <p className="text-sm sm:text-base text-muted-foreground leading-relaxed max-w-4xl whitespace-pre-line">
              {product.description || "Este produto não possui uma descrição cadastrada."}
            </p>
          </TabsContent>
          
          <TabsContent value="especificacoes" className="py-6 focus-visible:ring-0">
            <div className="max-w-xl border-2 border-foreground bg-card overflow-hidden">
              <table className="w-full text-sm">
                <tbody className="divide-y-2 divide-foreground">
                  <tr className="flex flex-col gap-1 p-3 sm:grid sm:grid-cols-2">
                    <td className="font-semibold text-foreground">Marca</td>
                    <td className="text-muted-foreground">{product.brand || "Lojai"}</td>
                  </tr>
                  <tr className="flex flex-col gap-1 p-3 sm:grid sm:grid-cols-2">
                    <td className="font-semibold text-foreground">Material Principal</td>
                    <td className="text-muted-foreground">{product.material || "Não especificado"}</td>
                  </tr>
                  <tr className="flex flex-col gap-1 p-3 sm:grid sm:grid-cols-2">
                    <td className="font-semibold text-foreground">Cores Disponíveis</td>
                    <td className="text-muted-foreground">{product.colors.join(", ")}</td>
                  </tr>
                  <tr className="flex flex-col gap-1 p-3 sm:grid sm:grid-cols-2">
                    <td className="font-semibold text-foreground">Tamanhos Disponíveis</td>
                    <td className="text-muted-foreground">{product.sizes.join(", ")}</td>
                  </tr>
                  {product.weight && (
                    <tr className="flex flex-col gap-1 p-3 sm:grid sm:grid-cols-2">
                      <td className="font-semibold text-foreground">Peso Médio</td>
                      <td className="text-muted-foreground">{Number(product.weight)} kg</td>
                    </tr>
                  )}
                  <tr className="flex flex-col gap-1 p-3 sm:grid sm:grid-cols-2">
                    <td className="font-semibold text-foreground">Cuidados de Limpeza</td>
                    <td className="text-muted-foreground">{product.isWashable ? "Pode ser limpo com pano úmido" : "Limpeza com pano seco ou espanador"}</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </TabsContent>
          
          <TabsContent value="avaliacoes" className="py-6 focus-visible:ring-0">
            {product.reviews.length === 0 ? (
              <div className="text-center py-10 border-2 border-dashed border-foreground bg-muted/20">
                <p className="text-sm text-muted-foreground">Nenhuma avaliação deste produto ainda. Seja o primeiro a opinar após sua compra!</p>
              </div>
            ) : (
              <div className="space-y-6 max-w-3xl">
                {product.reviews.map((rev) => (
                  <div key={rev.id} className="border-b-2 border-foreground pb-5 last:border-0 last:pb-0">
                    <div className="flex justify-between items-start">
                      <div className="space-y-1">
                        <h4 className="font-heading font-bold text-sm text-foreground">{rev.name}</h4>
                        {rev.city && <p className="font-mono text-[10px] text-muted-foreground">{rev.city}</p>}
                      </div>
                      <div className="flex text-primary gap-0.5">
                        {Array.from({ length: rev.rating }).map((_, i) => (
                          <Star key={i} className="h-3.5 w-3.5 fill-current" />
                        ))}
                      </div>
                    </div>
                    <p className="text-sm text-muted-foreground leading-relaxed mt-2.5">
                      {rev.comment}
                    </p>
                  </div>
                ))}
              </div>
            )}
          </TabsContent>
        </Tabs>
      </div>

      {/* Related Products Section */}
      {relatedProducts.length > 0 && (
        <section className="space-y-6 border-t-2 border-foreground pt-12 mt-4">
          <h2 className="display text-3xl text-foreground">
            Você Também Pode Gostar
          </h2>
          <ProductGrid products={relatedProducts} skeletonCount={4} scrollOnMobile={true} />
        </section>
      )}
    </div>
  );
}
