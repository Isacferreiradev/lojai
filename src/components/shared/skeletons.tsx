import { Skeleton } from "@/components/ui/skeleton";

// ─── Generic Table Skeleton ───────────────────────────────────────────────────

export function TableSkeleton({ rows = 8, cols = 5 }: { rows?: number; cols?: number }) {
  return (
    <div className="border-2 border-foreground overflow-hidden bg-card">
      {/* Header */}
      <div className="flex gap-4 px-4 py-3 bg-muted/40 border-b border-border/60">
        {Array.from({ length: cols }).map((_, i) => (
          <Skeleton key={i} className="h-3 w-20" />
        ))}
      </div>
      {/* Rows */}
      {Array.from({ length: rows }).map((_, rowIdx) => (
        <div
          key={rowIdx}
          className="flex gap-4 px-4 py-3.5 border-b border-border/40 last:border-0"
        >
          {Array.from({ length: cols }).map((_, colIdx) => (
            <Skeleton
              key={colIdx}
              className={`h-4 ${colIdx === 0 ? "w-32" : colIdx === cols - 1 ? "w-16" : "w-24"}`}
            />
          ))}
        </div>
      ))}
    </div>
  );
}

// ─── Product Card Skeleton ────────────────────────────────────────────────────

export function ProductCardSkeleton() {
  return (
    <div className="border-2 border-foreground bg-card overflow-hidden">
      <Skeleton className="aspect-[4/3] w-full rounded-none" />
      <div className="p-4 space-y-3">
        <Skeleton className="h-3 w-24" />
        <Skeleton className="h-5 w-full" />
        <Skeleton className="h-4 w-3/4" />
        <div className="flex justify-between items-center pt-1">
          <Skeleton className="h-6 w-20" />
          <Skeleton className="h-9 w-24" />
        </div>
      </div>
    </div>
  );
}

// ─── Product Grid Skeleton ────────────────────────────────────────────────────

export function ProductGridSkeleton({ count = 8 }: { count?: number }) {
  return (
    <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-5">
      {Array.from({ length: count }).map((_, i) => (
        <ProductCardSkeleton key={i} />
      ))}
    </div>
  );
}

// ─── Stats Cards Skeleton ─────────────────────────────────────────────────────

export function StatsCardsSkeleton() {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
      {Array.from({ length: 4 }).map((_, i) => (
        <div key={i} className="border-2 border-foreground bg-card p-6">
          <div className="flex justify-between items-center mb-3">
            <Skeleton className="h-3 w-24" />
            <Skeleton className="h-5 w-5 rounded" />
          </div>
          <Skeleton className="h-8 w-32 mb-2" />
          <Skeleton className="h-2.5 w-40" />
        </div>
      ))}
    </div>
  );
}

// ─── Page Header Skeleton ─────────────────────────────────────────────────────

export function PageHeaderSkeleton() {
  return (
    <div className="flex justify-between items-center mb-8">
      <div className="space-y-2">
        <Skeleton className="h-8 w-48" />
        <Skeleton className="h-4 w-64" />
      </div>
      <Skeleton className="h-10 w-32" />
    </div>
  );
}

// ─── Order Detail Skeleton ────────────────────────────────────────────────────

export function OrderDetailSkeleton() {
  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
      <div className="lg:col-span-2 space-y-6">
        <div className="border-2 border-foreground bg-card p-6 space-y-4">
          <Skeleton className="h-5 w-32" />
          {Array.from({ length: 3 }).map((_, i) => (
            <div key={i} className="flex gap-4">
              <Skeleton className="w-14 h-14 rounded-lg flex-shrink-0" />
              <div className="flex-1 space-y-2">
                <Skeleton className="h-4 w-3/4" />
                <Skeleton className="h-3 w-1/2" />
              </div>
              <Skeleton className="h-6 w-16" />
            </div>
          ))}
        </div>
      </div>
      <div className="space-y-6">
        {Array.from({ length: 3 }).map((_, i) => (
          <div key={i} className="border-2 border-foreground bg-card p-6 space-y-3">
            <Skeleton className="h-5 w-24" />
            <Skeleton className="h-4 w-full" />
            <Skeleton className="h-4 w-3/4" />
          </div>
        ))}
      </div>
    </div>
  );
}

// ─── Product Form Skeleton ────────────────────────────────────────────────────

export function ProductFormSkeleton() {
  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
      <div className="lg:col-span-2">
        <div className="border-2 border-foreground bg-card p-6 space-y-5">
          <Skeleton className="h-6 w-40" />
          <div className="grid grid-cols-2 gap-4">
            {Array.from({ length: 6 }).map((_, i) => (
              <div key={i} className={i === 0 || i === 5 ? "col-span-2" : ""}>
                <Skeleton className="h-3 w-20 mb-2" />
                <Skeleton className="h-10 w-full" />
              </div>
            ))}
          </div>
        </div>
      </div>
      <div className="space-y-6">
        <div className="border-2 border-foreground bg-card p-6 space-y-4">
          <Skeleton className="h-5 w-28" />
          <Skeleton className="h-10 w-full" />
          <Skeleton className="h-10 w-full" />
          <Skeleton className="h-10 w-full" />
        </div>
        <div className="border-2 border-foreground bg-card p-6 space-y-4">
          <Skeleton className="h-5 w-20" />
          <div className="grid grid-cols-2 gap-2">
            {Array.from({ length: 2 }).map((_, i) => (
              <Skeleton key={i} className="aspect-square" />
            ))}
          </div>
          <Skeleton className="h-9 w-full" />
        </div>
      </div>
    </div>
  );
}
