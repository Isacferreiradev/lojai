import { ProductGridSkeleton } from "@/components/shared/skeletons";
import { Skeleton } from "@/components/ui/skeleton";

export default function CatalogLoading() {
  return (
    <div className="container mx-auto px-4 md:px-6 py-8 flex-1 flex flex-col gap-6">
      {/* Breadcrumb */}
      <Skeleton className="h-4 w-48" />

      {/* Title row */}
      <div className="flex justify-between items-end border-b-2 border-foreground pb-6">
        <div className="space-y-2">
          <Skeleton className="h-10 w-72" />
          <Skeleton className="h-4 w-48" />
        </div>
        <Skeleton className="h-9 w-40" />
      </div>

      {/* Body */}
      <div className="flex flex-col lg:flex-row gap-8 items-start">
        {/* Filter sidebar */}
        <div className="hidden lg:block w-64 flex-shrink-0 space-y-4">
          {Array.from({ length: 4 }).map((_, i) => (
            <div key={i} className="space-y-3">
              <Skeleton className="h-5 w-24" />
              <div className="space-y-2 pl-1">
                {Array.from({ length: 4 }).map((_, j) => (
                  <Skeleton key={j} className="h-4 w-full" />
                ))}
              </div>
            </div>
          ))}
        </div>
        {/* Grid */}
        <div className="flex-1">
          <ProductGridSkeleton count={12} />
        </div>
      </div>
    </div>
  );
}
