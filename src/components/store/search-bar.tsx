"use client";

import { useState, useEffect, useRef } from "react";
import { Search, Loader2 } from "lucide-react";
import { Input } from "@/components/ui/input";
import { getProducts } from "@/actions/products";
import { ProductWithImages } from "@/types";
import { formatCurrency } from "@/lib/utils";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";

export function SearchBar() {
  const [query, setQuery] = useState("");
  const [results, setResults] = useState<ProductWithImages[]>([]);
  const [loading, setLoading] = useState(false);
  const [isOpen, setIsOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);
  const router = useRouter();

  // Debounced search logic
  useEffect(() => {
    if (query.trim().length < 2) {
      setResults([]);
      return;
    }

    const delayDebounceFn = setTimeout(async () => {
      setLoading(true);
      try {
        const { products } = await getProducts({ search: query, limit: 5 });
        setResults(products);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    }, 300);

    return () => clearTimeout(delayDebounceFn);
  }, [query]);

  // Close search suggestions when clicking outside
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (query.trim()) {
      setIsOpen(false);
      router.push(`/produtos?search=${encodeURIComponent(query.trim())}`);
    }
  };

  return (
    <div ref={containerRef} className="relative w-full max-w-sm md:max-w-md">
      <form onSubmit={handleSearchSubmit}>
        <div className="relative">
          <Input
            type="search"
            placeholder="Buscar tapete ideal..."
            value={query}
            onChange={(e) => {
              setQuery(e.target.value);
              setIsOpen(true);
            }}
            onFocus={() => setIsOpen(true)}
            className="h-10 w-full rounded-none border-2 border-foreground bg-card py-2 pl-10 pr-4 text-sm focus-visible:border-primary focus-visible:ring-primary/30"
          />
          <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3.5 text-muted-foreground">
            {loading ? (
              <Loader2 className="h-4 w-4 animate-spin" />
            ) : (
              <Search className="h-4 w-4 stroke-[1.5]" />
            )}
          </div>
        </div>
      </form>

      {isOpen && query.trim().length >= 2 && (
        <div className="absolute top-full left-0 right-0 mt-2 bg-card border-2 border-foreground rounded-none shadow-[5px_5px_0_0_var(--color-foreground)] z-50 overflow-hidden max-h-[380px] overflow-y-auto animate-in fade-in duration-200">
          {loading && results.length === 0 ? (
            <div className="p-4 text-center text-sm text-muted-foreground flex items-center justify-center gap-2">
              <Loader2 className="h-4 w-4 animate-spin text-primary" />
              Buscando tapetes...
            </div>
          ) : results.length > 0 ? (
            <div className="divide-y divide-border">
              <div className="label-mono border-b-2 border-foreground bg-muted/30 px-4 py-2.5 text-muted-foreground">
                Sugestões de Produtos
              </div>
              {results.map((product) => {
                const finalPrice = product.promoPrice ? Number(product.promoPrice) : Number(product.price);
                const originalPrice = product.promoPrice ? Number(product.price) : null;
                return (
                  <Link
                    key={product.id}
                    href={`/produtos/${product.slug}`}
                    onClick={() => setIsOpen(false)}
                    className="flex items-center gap-3 p-3 hover:bg-muted/40 transition-colors"
                  >
                    <div className="relative h-12 w-12 rounded-none border-2 border-foreground overflow-hidden bg-muted flex-shrink-0">
                      <Image
                        src={product.images[0]?.url || "/images/placeholder.webp"}
                        alt={product.name}
                        fill
                        className="object-cover"
                        sizes="48px"
                      />
                    </div>
                    <div className="flex-1 min-w-0">
                      <h4 className="text-sm font-medium text-foreground truncate">
                        {product.name}
                      </h4>
                      <p className="text-xs text-muted-foreground truncate mt-0.5">
                        {product.material || "Tapete Premium"}
                      </p>
                    </div>
                    <div className="text-right flex-shrink-0">
                      <span className="text-sm font-bold text-foreground">
                        {formatCurrency(finalPrice)}
                      </span>
                      {originalPrice && (
                        <p className="text-[10px] text-muted-foreground line-through">
                          {formatCurrency(originalPrice)}
                        </p>
                      )}
                    </div>
                  </Link>
                );
              })}
              <div className="p-3 text-center bg-muted/10">
                <button
                  onClick={handleSearchSubmit}
                  className="text-xs font-semibold text-primary hover:underline"
                >
                  Ver todos os resultados para "{query}"
                </button>
              </div>
            </div>
          ) : (
            <div className="p-6 text-center text-sm text-muted-foreground">
              Nenhum tapete encontrado para "{query}"
            </div>
          )}
        </div>
      )}
    </div>
  );
}
