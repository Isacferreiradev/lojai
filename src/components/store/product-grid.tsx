import { ProductWithImages } from "@/types";
import { ProductCard } from "@/components/store/product-card";
import { Skeleton } from "@/components/ui/skeleton";

interface ProductGridProps {
  products: ProductWithImages[];
  isLoading?: boolean;
  skeletonCount?: number;
}

export function ProductGrid({
  products,
  isLoading = false,
  skeletonCount = 4,
}: ProductGridProps) {
  if (isLoading) {
    return (
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-6">
        {Array.from({ length: skeletonCount }).map((_, index) => (
          <div key={index} className="flex flex-col border-2 border-foreground bg-card">
            <Skeleton className="aspect-square w-full border-b-2 border-foreground" />
            <div className="space-y-3 p-4">
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
        <p className="label-mono text-muted-foreground">// Nenhum tapete encontrado</p>
      </div>
    );
  }

  return (
    <div className="scrollbar-minimal -mx-4 flex snap-x snap-mandatory gap-4 overflow-x-auto px-4 pb-4 sm:mx-0 sm:grid sm:grid-cols-3 sm:overflow-visible sm:px-0 sm:pb-0 md:gap-6 lg:grid-cols-4">
      {products.map((product) => (
        <div key={product.id} className="w-[60%] shrink-0 snap-start sm:w-auto">
          <ProductCard product={product} />
        </div>
      ))}
    </div>
  );
}
