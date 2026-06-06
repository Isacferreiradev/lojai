import { HeroBanner } from "@/components/store/hero-banner";
import { CategoryGrid } from "@/components/store/category-grid";
import { ProductGrid } from "@/components/store/product-grid";
import { ReviewCarousel } from "@/components/store/review-carousel";
import { BenefitsSection } from "@/components/store/benefits-section";
import { Header } from "@/components/store/header";
import { Footer } from "@/components/store/footer";
import { getFeaturedProducts, getPromoProducts } from "@/actions/products";
import Link from "next/link";
import { ArrowRight } from "lucide-react";

export default async function HomePage() {
  const [featuredProducts, promoProducts] = await Promise.all([
    getFeaturedProducts(4),
    getPromoProducts(4),
  ]);

  return (
    <div className="flex flex-col min-h-screen">
      <Header />
      <main className="flex-1 flex flex-col">
        <div className="flex flex-col gap-0 pb-16">
          {/* Hero */}
          <HeroBanner />

          <div className="container mx-auto px-4 md:px-6 space-y-20 mt-14">
            {/* Categorias */}
            <CategoryGrid />

            {/* Produtos em destaque */}
            <section className="space-y-8">
              <div className="flex flex-col sm:flex-row justify-between items-start sm:items-end gap-4 border-b-2 border-foreground pb-5">
                <div className="space-y-2">
                  <span className="label-mono text-primary">[ Os queridinhos ]</span>
                  <h2 className="display text-4xl text-foreground sm:text-5xl">
                    Mais Desejados
                  </h2>
                  <p className="text-sm text-muted-foreground">
                    Nossos tapetes mais amados e elogiados pelos clientes.
                  </p>
                </div>
                <Link
                  href="/produtos"
                  className="flex shrink-0 items-center gap-1.5 font-mono text-xs font-semibold uppercase tracking-wider text-foreground underline decoration-2 underline-offset-4 transition-colors hover:text-primary"
                >
                  Ver todos <ArrowRight className="h-4 w-4" />
                </Link>
              </div>
              <ProductGrid products={featuredProducts} skeletonCount={4} />
            </section>

            {/* Benefícios */}
            <BenefitsSection />

            {/* Ofertas / Lançamentos */}
            {promoProducts.length > 0 ? (
              <section className="space-y-8">
                <div className="flex flex-col sm:flex-row justify-between items-start sm:items-end gap-4 border-b-2 border-foreground pb-5">
                  <div className="space-y-2">
                    <span className="label-mono text-primary">[ Preços especiais ]</span>
                    <h2 className="display text-4xl text-foreground sm:text-5xl">
                      Ofertas Imperdíveis
                    </h2>
                    <p className="text-sm text-muted-foreground">
                      Descontos exclusivos por tempo limitado.
                    </p>
                  </div>
                  <Link
                    href="/produtos?sort=price_asc"
                    className="flex shrink-0 items-center gap-1.5 font-mono text-xs font-semibold uppercase tracking-wider text-foreground underline decoration-2 underline-offset-4 transition-colors hover:text-primary"
                  >
                    Ver ofertas <ArrowRight className="h-4 w-4" />
                  </Link>
                </div>
                <ProductGrid products={promoProducts} skeletonCount={4} />
              </section>
            ) : (
              <section className="space-y-8">
                <div className="flex flex-col sm:flex-row justify-between items-start sm:items-end gap-4 border-b-2 border-foreground pb-5">
                  <div className="space-y-2">
                    <span className="label-mono text-primary">[ Novidades ]</span>
                    <h2 className="display text-4xl text-foreground sm:text-5xl">
                      Lançamentos Recentes
                    </h2>
                    <p className="text-sm text-muted-foreground">
                      Peças recém-chegadas para trazer originalidade ao seu lar.
                    </p>
                  </div>
                  <Link
                    href="/produtos?sort=newest"
                    className="flex shrink-0 items-center gap-1.5 font-mono text-xs font-semibold uppercase tracking-wider text-foreground underline decoration-2 underline-offset-4 transition-colors hover:text-primary"
                  >
                    Ver lançamentos <ArrowRight className="h-4 w-4" />
                  </Link>
                </div>
                <ProductGrid products={[]} skeletonCount={4} />
              </section>
            )}

            {/* Depoimentos */}
            <ReviewCarousel />
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
}
