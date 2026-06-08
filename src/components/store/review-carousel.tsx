"use client";

import { useState, useEffect } from "react";
import { Star, ChevronLeft, ChevronRight } from "lucide-react";

interface ReviewItem {
  id: number;
  name: string;
  city: string;
  rating: number;
  comment: string;
  productName: string;
  initials: string;
}

const reviews: ReviewItem[] = [
  {
    id: 1,
    name: "Mariana Souza",
    city: "São Paulo, SP",
    rating: 5,
    comment: "Estou simplesmente apaixonada pela minha nova luminária! O design é lindo, a cor é exatamente como no site e a entrega foi super rápida. Recomendo muito!",
    productName: "Luminária de mesa cogumelo",
    initials: "MS",
  },
  {
    id: 2,
    name: "Rodrigo Alencar",
    city: "Rio de Janeiro, RJ",
    rating: 5,
    comment: "Excelente qualidade. Comprei o modelo geométrico para a minha sala e ele transformou o ambiente. O acabamento das bordas é perfeito e o material é bem resistente.",
    productName: "Espelho Orgânico Premium",
    initials: "RA",
  },
  {
    id: 3,
    name: "Beatriz M.",
    city: "Belo Horizonte, MG",
    rating: 5,
    comment: "Atendimento incrível pós-venda! Tive uma dúvida sobre a instalação, me responderam super rápido no WhatsApp. O quadro é lindo e de altíssima qualidade.",
    productName: "Kit de quadros abstratos",
    initials: "BM",
  },
];

export function ReviewCarousel() {
  const [current, setCurrent] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrent((prev) => (prev === reviews.length - 1 ? 0 : prev + 1));
    }, 5500);
    return () => clearInterval(timer);
  }, []);

  const go = (index: number) => setCurrent((index + reviews.length) % reviews.length);

  return (
    <section className="py-2">
      {/* Header */}
      <div className="mb-8 flex flex-col items-start gap-2 border-b-2 border-foreground pb-5">
        <span className="label-mono text-primary">[ Depoimentos ]</span>
        <h2 className="display text-3xl text-foreground sm:text-4xl md:text-5xl">
          O que dizem<br />sobre nós
        </h2>
      </div>

      {/* Mobile horizontal scroller */}
      <div className="scrollbar-minimal -mx-4 flex snap-x snap-mandatory gap-4 overflow-x-auto px-4 pb-4 md:hidden">
        {reviews.map((r, index) => {
          const active = index === current;
          return (
            <button
              key={r.id}
              onClick={() => go(index)}
              className={`flex w-[80vw] shrink-0 snap-start cursor-pointer flex-col border-2 border-foreground p-5 text-left transition-all duration-200 ${
                active
                  ? "-translate-y-1 bg-primary text-primary-foreground shadow-[5px_5px_0_0_var(--color-foreground)]"
                  : "bg-card text-foreground"
              }`}
            >
              {/* Stars */}
              <div className="mb-3 flex gap-0.5">
                {Array.from({ length: r.rating }).map((_, i) => (
                  <Star
                    key={i}
                    className={`h-3.5 w-3.5 fill-current ${active ? "text-primary-foreground" : "text-primary"}`}
                  />
                ))}
              </div>

              {/* Comment */}
              <p className={`mb-4 flex-1 text-sm leading-relaxed ${active ? "text-primary-foreground/90" : "text-foreground/75"}`}>
                &ldquo;{r.comment}&rdquo;
              </p>

              {/* User */}
              <div className="flex items-center gap-3 border-t-2 border-current/20 pt-3">
                <div
                  className={`flex size-9 shrink-0 items-center justify-center border-2 font-mono text-xs font-bold ${
                    active
                      ? "border-primary-foreground bg-primary-foreground/15 text-primary-foreground"
                      : "border-foreground bg-primary text-primary-foreground"
                  }`}
                >
                  {r.initials}
                </div>
                <div>
                  <p className={`font-heading text-sm font-bold leading-tight ${active ? "text-primary-foreground" : "text-foreground"}`}>
                    {r.name}
                  </p>
                  <p className={`mt-0.5 font-mono text-[0.6rem] ${active ? "text-primary-foreground/70" : "text-muted-foreground"}`}>
                    {r.city} · {r.productName}
                  </p>
                </div>
              </div>
            </button>
          );
        })}
      </div>

      {/* Desktop grid */}
      <div className="hidden gap-4 md:grid md:grid-cols-3">
        {reviews.map((r, index) => {
          const active = index === current;
          return (
            <button
              key={r.id}
              onClick={() => go(index)}
              className={`flex cursor-pointer flex-col border-2 border-foreground p-6 text-left transition-all duration-200 ${
                active
                  ? "-translate-y-1 bg-primary text-primary-foreground shadow-[5px_5px_0_0_var(--color-foreground)]"
                  : "bg-card text-foreground hover:-translate-y-0.5"
              }`}
            >
              {/* Stars */}
              <div className="mb-4 flex gap-0.5">
                {Array.from({ length: r.rating }).map((_, i) => (
                  <Star
                    key={i}
                    className={`h-3.5 w-3.5 fill-current ${active ? "text-primary-foreground" : "text-primary"}`}
                  />
                ))}
              </div>

              {/* Comment */}
              <p className={`mb-5 flex-1 text-sm leading-relaxed ${active ? "text-primary-foreground/90" : "text-foreground/75"}`}>
                &ldquo;{r.comment}&rdquo;
              </p>

              {/* User */}
              <div className="flex items-center gap-3 border-t-2 border-current/20 pt-4">
                <div
                  className={`flex size-10 shrink-0 items-center justify-center border-2 font-mono text-xs font-bold ${
                    active
                      ? "border-primary-foreground bg-primary-foreground/15 text-primary-foreground"
                      : "border-foreground bg-primary text-primary-foreground"
                  }`}
                >
                  {r.initials}
                </div>
                <div>
                  <p className={`font-heading text-sm font-bold leading-tight ${active ? "text-primary-foreground" : "text-foreground"}`}>
                    {r.name}
                  </p>
                  <p className={`mt-0.5 font-mono text-[0.65rem] ${active ? "text-primary-foreground/70" : "text-muted-foreground"}`}>
                    {r.city} · {r.productName}
                  </p>
                </div>
              </div>
            </button>
          );
        })}
      </div>

      {/* Mobile dots navigation */}
      <div className="mt-4 flex justify-center gap-2 md:hidden">
        <button
          onClick={() => go(current - 1)}
          className="border-2 border-foreground bg-card p-2 text-foreground transition-colors hover:bg-muted"
        >
          <ChevronLeft className="h-4 w-4" />
        </button>
        <div className="flex items-center gap-1.5">
          {reviews.map((_, i) => (
            <button
              key={i}
              onClick={() => go(i)}
              className={`h-2 border-2 border-foreground transition-all ${
                i === current ? "w-6 bg-primary" : "w-2 bg-card"
              }`}
            />
          ))}
        </div>
        <button
          onClick={() => go(current + 1)}
          className="border-2 border-foreground bg-card p-2 text-foreground transition-colors hover:bg-muted"
        >
          <ChevronRight className="h-4 w-4" />
        </button>
      </div>
    </section>
  );
}
