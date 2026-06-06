"use client";

import { useFilters } from "@/hooks/use-filters";

export function CatalogSorter({ activeSort }: { activeSort: string }) {
  const { setFilter } = useFilters();

  return (
    <div className="flex items-center gap-2 text-sm">
      <span className="label-mono flex-shrink-0 text-muted-foreground">Ordenar:</span>
      <select
        value={activeSort}
        onChange={(e) => setFilter("sort", e.target.value)}
        className="cursor-pointer rounded-none border-2 border-foreground bg-card px-4 py-1.5 font-mono text-xs font-semibold uppercase tracking-wide text-foreground outline-none focus-visible:border-primary focus-visible:ring-2 focus-visible:ring-primary/30"
      >
        <option value="best_selling">Mais Vendidos</option>
        <option value="price_asc">Menor Preço</option>
        <option value="price_desc">Maior Preço</option>
        <option value="newest">Lançamentos</option>
      </select>
    </div>
  );
}
