import { getProducts } from "@/actions/products";
import { ProductFilters as Filters } from "@/types";
import { ProductGrid } from "@/components/store/product-grid";
import { ProductFilters } from "@/components/store/product-filters";
import { CatalogSorter } from "@/components/store/catalog-sorter";
import Link from "next/link";
import { ChevronRight } from "lucide-react";
import type { Metadata } from "next";
import prisma from "@/lib/prisma";

export const metadata: Metadata = {
  title: "Catálogo de Produtos",
  description:
    "Explore nossa coleção completa de decoração premium — quadros, espelhos, luminárias e objetos. Encontre a peça ideal para transformar sua casa.",
  openGraph: {
    title: "Catálogo de Produtos | Orna Casa",
    description: "Encontre a peça de decoração perfeita para sua casa. Envio para todo o Brasil.",
    type: "website",
  },
};

interface SearchParams {
  category?: string;
  colors?: string | string[];
  sizes?: string | string[];
  materials?: string | string[];
  minPrice?: string;
  maxPrice?: string;
  sort?: string;
  search?: string;
  page?: string;
}

interface PageProps {
  searchParams: Promise<SearchParams>;
}

export default async function CatalogPage({ searchParams }: PageProps) {
  const resolvedParams = await searchParams;

  // Normalizing query parameters into arrays if they exist
  const colors = Array.isArray(resolvedParams.colors)
    ? resolvedParams.colors
    : resolvedParams.colors
    ? [resolvedParams.colors]
    : [];

  const sizes = Array.isArray(resolvedParams.sizes)
    ? resolvedParams.sizes
    : resolvedParams.sizes
    ? [resolvedParams.sizes]
    : [];

  const materials = Array.isArray(resolvedParams.materials)
    ? resolvedParams.materials
    : resolvedParams.materials
    ? [resolvedParams.materials]
    : [];

  const page = Number(resolvedParams.page) || 1;
  const sort = (resolvedParams.sort as Filters["sort"]) || "best_selling";

  // Build filter object for the database action
  const filters: Filters = {
    category: resolvedParams.category,
    minPrice: resolvedParams.minPrice ? Number(resolvedParams.minPrice) : undefined,
    maxPrice: resolvedParams.maxPrice ? Number(resolvedParams.maxPrice) : undefined,
    colors,
    sizes,
    materials,
    sort,
    search: resolvedParams.search,
    page,
    limit: 100, // Load all products to show them grouped by category
  };

  // Fetch filtered products
  const { products, total } = await getProducts(filters);

  // Fetch active categories to group products dynamically
  const categories = await prisma.category.findMany({
    where: { isActive: true },
    orderBy: { sortOrder: "asc" },
  });

  return (
    <div className="container mx-auto px-4 md:px-6 py-8 flex-1 flex flex-col gap-6">
      {/* Breadcrumbs */}
      <nav className="flex items-center gap-2 font-mono text-[0.65rem] font-semibold uppercase tracking-wider text-muted-foreground">
        <Link href="/" className="transition-colors hover:text-primary">
          Início
        </Link>
        <ChevronRight className="h-3 w-3" />
        <span className="text-foreground">Todos os Produtos</span>
      </nav>

      {/* Title & Count */}
      <div className="flex flex-col justify-between gap-4 border-b-2 border-foreground pb-6 md:flex-row md:items-end">
        <div className="space-y-2">
          <span className="label-mono text-primary">[ Catálogo ]</span>
          <h1 className="display text-3xl text-foreground sm:text-4xl md:text-5xl">
            {resolvedParams.category
              ? `Produtos / ${resolvedParams.category.charAt(0).toUpperCase() + resolvedParams.category.slice(1)}`
              : "Coleção de Produtos"}
          </h1>
          <p className="font-mono text-xs text-muted-foreground">
            {resolvedParams.search
              ? `Resultados para "${resolvedParams.search}" — ${total} itens`
              : `${products.length} de ${total} produtos disponíveis`}
          </p>
        </div>

        {/* Catalog sorting selector */}
        <CatalogSorter activeSort={sort} />
      </div>

      {/* Main Catalog Body */}
      <div className="flex flex-col lg:flex-row gap-8 items-start">
        {/* Filters Sidebar/Drawer */}
        <ProductFilters />

        {/* Product Grid Grouped by Category */}
        <div className="flex-grow flex flex-col gap-10 w-full min-w-0">
          {products.length === 0 ? (
            <div className="border-2 border-dashed border-foreground bg-muted/20 py-16 text-center">
              <p className="label-mono text-muted-foreground">// Nenhum produto encontrado</p>
            </div>
          ) : (
            categories.map((category) => {
              const categoryProducts = products.filter((p) => p.categoryId === category.id);
              if (categoryProducts.length === 0) return null;

              return (
                <section key={category.id} className="space-y-4">
                  <div className="border-b-2 border-foreground pb-2 flex justify-between items-end">
                    <h2 className="font-heading text-lg font-bold text-foreground uppercase tracking-wide">
                      {category.name}
                    </h2>
                    <span className="font-mono text-xs text-muted-foreground">
                      {categoryProducts.length} {categoryProducts.length === 1 ? "produto" : "produtos"}
                    </span>
                  </div>
                  <ProductGrid products={categoryProducts} scrollOnMobile={true} />
                </section>
              );
            })
          )}
        </div>
      </div>
    </div>
  );
}
