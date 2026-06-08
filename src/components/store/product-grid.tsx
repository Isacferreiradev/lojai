import { ProductWithImages } from "@/types";
import { ProductCard } from "@/components/store/product-card";
import { Skeleton } from "@/components/ui/skeleton";

interface ProductGridProps {
  products: ProductWithImages[];
  isLoading?: boolean;
  skeletonCount?: number;
  scrollOnMobile?: boolean;
}

export function ProductGrid({
  products,
  isLoading = false,
  skeletonCount = 4,
  scrollOnMobile = false,
}: ProductGridProps) {
  if (isLoading) {
    return (
      <div className={scrollOnMobile ? "scrollbar-minimal -mx-4 flex gap-3 overflow-x-auto px-4 pb-4 md:mx-0 md:px-0 md:grid md:grid-cols-3 md:gap-6 lg:grid-cols-4" : "grid grid-cols-2 gap-3 sm:gap-4 md:grid-cols-3 md:gap-6 lg:grid-cols-4"}>
        {Array.from({ length: skeletonCount }).map((_, index) => (
          <div key={index} className={scrollOnMobile ? "flex flex-col border-2 border-foreground bg-card w-[62vw] shrink-0 sm:w-[260px] md:w-auto md:shrink-0" : "flex flex-col border-2 border-foreground bg-card"}>
            <Skeleton className="aspect-square w-full border-b-2 border-foreground" />
            <div className="space-y-3 p-3 sm:p-4">
              <Skeleton className="h-3 w-1/3" />
              <Skeleton className="h-5 w-2/3" />
              <div className="flex items-center justify-between border-t-2 border-foreground pt-3">
                <Skeleton className="h-6 w-1/3" />
                <Skeleton className="size-9" />
              </div>
            </div>
          </div>
        ))}
      </div>
    );
  }

  if (products.length === 0) {
    return (
      <div className="border-2 border-dashed border-foreground bg-muted/20 py-16 text-center">
        <p className="label-mono text-muted-foreground">// Nenhum produto encontrado</p>
      </div>
    );
  }

  if (scrollOnMobile) {
    return (
      <div className="scrollbar-minimal flex snap-x snap-mandatory gap-3 overflow-x-auto pb-4 md:grid md:grid-cols-3 md:gap-6 lg:grid-cols-4">
        {products.map((product) => (
          <div
            key={product.id}
            className="w-[62vw] shrink-0 snap-start sm:w-[260px] md:w-auto md:shrink"
          >
            <ProductCard product={product} />
          </div>
        ))}
      </div>
    );
  }

  return (
    <div className="grid grid-cols-2 gap-3 sm:gap-4 md:grid-cols-3 md:gap-6 lg:grid-cols-4">
      {products.map((product) => (
        <div key={product.id}>
          <ProductCard product={product} />
        </div>
      ))}
    </div>
  );
}
