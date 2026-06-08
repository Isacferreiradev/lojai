import Link from "next/link";
import Image from "next/image";
import { ArrowUpRight } from "lucide-react";
import { CATEGORIES } from "@/lib/constants";

export function CategoryGrid() {
  return (
    <section className="py-2">
      {/* Section Header */}
      <div className="mb-8 flex flex-col justify-between gap-3 border-b-2 border-foreground pb-5 sm:flex-row sm:items-end">
        <div className="space-y-2">
          <span className="label-mono text-primary">[ Coleções ]</span>
          <h2 className="display text-4xl text-foreground sm:text-5xl">
            Ambientes<br />& Estilos
          </h2>
        </div>
        <p className="max-w-xs text-sm leading-relaxed text-muted-foreground">
          Coleções selecionadas para cada cômodo da sua casa. Arraste para o lado para ver todas.
        </p>
      </div>

      <div className="scrollbar-minimal flex snap-x snap-mandatory gap-3 overflow-x-auto pb-4 md:gap-4">
        {CATEGORIES.map((cat, index) => (
          <Link
            key={cat.slug}
            href={`/produtos?category=${cat.slug}`}
            style={{ aspectRatio: "4/5" }}
            className="group relative w-[62vw] shrink-0 snap-start overflow-hidden border-2 border-foreground bg-muted transition-all duration-200 hover:-translate-y-1 hover:shadow-[6px_6px_0_0_var(--color-foreground)] sm:w-[260px] lg:w-[calc((100%-4*1rem)/5)]"
          >
            <Image
              src={cat.image}
              alt={cat.name}
              fill
              className="object-cover transition-transform duration-500 group-hover:scale-105"
              sizes="(max-width: 640px) 68vw, 260px"
            />

            {/* Index marker */}
            <span className="absolute left-0 top-0 z-10 border-b-2 border-r-2 border-foreground bg-background px-2 py-1 font-mono text-[0.65rem] font-bold text-foreground hidden sm:block">
              {String(index + 1).padStart(2, "0")}
            </span>

            {/* Overlay */}
            <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/15 to-transparent" />

            {/* Text */}
            <div className="absolute inset-0 flex flex-col justify-end p-4">
              <div className="flex items-center justify-between gap-1">
                <h3 className="font-heading text-sm font-bold leading-tight text-white sm:text-base">
                  {cat.name}
                </h3>
                <span className="flex size-7 shrink-0 translate-y-1 items-center justify-center border-2 border-white text-white opacity-0 transition-all duration-300 group-hover:translate-y-0 group-hover:opacity-100">
                  <ArrowUpRight className="h-4 w-4" />
                </span>
              </div>
            </div>
          </Link>
        ))}
      </div>
    </section>
  );
}
