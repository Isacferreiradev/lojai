import { getProducts } from "@/actions/products";
import { ProductFilters as Filters } from "@/types";
import { ProductGrid } from "@/components/store/product-grid";
import { ProductFilters } from "@/components/store/product-filters";
import { Pagination } from "@/components/shared/pagination";
import { CatalogSorter } from "@/components/store/catalog-sorter";
import Link from "next/link";
import { ChevronRight } from "lucide-react";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Catálogo de Tapetes",
  description:
    "Explore nossa coleção completa de tapetes premium — sala, quarto, infantil, felpudos e muito mais. Filtros por tamanho, cor e material.",
  openGraph: {
    title: "Catálogo de Tapetes | Lojai",
    description: "Encontre o tapete perfeito para sua casa. Envio para todo o Brasil.",
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
    limit: 12,
  };

  // Fetch filtered products
  const { products, total, pages } = await getProducts(filters);

  return (
    <div className="container mx-auto px-4 md:px-6 py-8 flex-1 flex flex-col gap-6">
      {/* Breadcrumbs */}
      <nav className="flex items-center gap-2 font-mono text-[0.65rem] font-semibold uppercase tracking-wider text-muted-foreground">
        <Link href="/" className="transition-colors hover:text-primary">
          Início
        </Link>
        <ChevronRight className="h-3 w-3" />
        <span className="text-foreground">Todos os Tapetes</span>
      </nav>

      {/* Title & Count */}
      <div className="flex flex-col justify-between gap-4 border-b-2 border-foreground pb-6 md:flex-row md:items-end">
        <div className="space-y-2">
          <span className="label-mono text-primary">[ Catálogo ]</span>
          <h1 className="display text-4xl text-foreground md:text-5xl">
            {resolvedParams.category
              ? `Tapetes / ${resolvedParams.category.charAt(0).toUpperCase() + resolvedParams.category.slice(1)}`
              : "Coleção de Tapetes"}
          </h1>
          <p className="font-mono text-xs text-muted-foreground">
            {resolvedParams.search
              ? `Resultados para "${resolvedParams.search}" — ${total} itens`
              : `${products.length} de ${total} tapetes disponíveis`}
          </p>
        </div>

        {/* Catalog sorting selector */}
        <CatalogSorter activeSort={sort} />
      </div>

      {/* Main Catalog Body */}
      <div className="flex flex-col lg:flex-row gap-8 items-start">
        {/* Filters Sidebar/Drawer */}
        <ProductFilters />

        {/* Product Grid & Pagination */}
        <div className="flex-grow flex flex-col gap-6 w-full">
          <ProductGrid products={products} skeletonCount={8} />
          
          <Pagination currentPage={page} totalPages={pages} />
        </div>
      </div>
    </div>
  );
}


