"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { ArrowRight, ArrowUpRight } from "lucide-react";
import Image from "next/image";

interface Slide {
  eyebrow: string;
  title: string;
  subtitle: string;
  ctaText: string;
  ctaHref: string;
  imageUrl: string;
}

export function HeroBanner({ slides }: { slides: Slide[] }) {
  const [current, setCurrent] = useState(0);

  useEffect(() => {
    if (slides.length <= 1) return;
    const timer = setInterval(
      () => setCurrent((c) => (c + 1) % slides.length),
      7000
    );
    return () => clearInterval(timer);
  }, [slides.length]);

  if (slides.length === 0) return null;
  const slide = slides[Math.min(current, slides.length - 1)];

  return (
    <section className="border-b-2 border-foreground bg-background">
      <div className="container mx-auto px-4 md:px-6">
        <div className="grid grid-cols-1 items-stretch lg:grid-cols-2">
          {/* Text column */}
          <div className="flex flex-col justify-center gap-7 border-foreground py-12 lg:border-r-2 lg:py-20 lg:pr-12">
            <div key={`eyebrow-${current}`} className="animate-fade-in flex items-center gap-3">
              <span className="label-mono text-primary">
                {String(Math.min(current, slides.length - 1) + 1).padStart(2, "0")} / {String(slides.length).padStart(2, "0")}
              </span>
              <span className="h-px w-10 bg-foreground" />
              <span className="label-mono text-foreground">{slide.eyebrow}</span>
            </div>

            <h1
              key={`title-${current}`}
              className="display animate-rise text-6xl text-foreground sm:text-7xl md:text-8xl whitespace-pre-line"
            >
              {slide.title}
            </h1>

            <p
              key={`sub-${current}`}
              className="animate-fade-in max-w-md text-base leading-relaxed text-muted-foreground"
            >
              {slide.subtitle}
            </p>

            <div className="flex flex-wrap items-center gap-4 pt-1">
              <Button asChild size="lg" className="cursor-pointer">
                <Link href={slide.ctaHref}>
                  {slide.ctaText}
                  <ArrowRight className="h-4 w-4" />
                </Link>
              </Button>
              <Link
                href="/produtos"
                className="inline-flex items-center gap-1 font-mono text-xs font-semibold uppercase tracking-wider text-foreground underline decoration-2 underline-offset-4 transition-colors hover:text-primary"
              >
                Ver tudo <ArrowUpRight className="h-3.5 w-3.5" />
              </Link>
            </div>
          </div>

          {/* Image column */}
          <div className="relative min-h-[340px] overflow-hidden bg-muted lg:min-h-[600px]">
            {slides.map((s, index) => (
              <Image
                key={index}
                src={s.imageUrl}
                alt={s.title.replace(/\n/g, " ")}
                fill
                className={`object-cover object-center transition-opacity duration-700 ${
                  index === current ? "opacity-100" : "opacity-0"
                }`}
                sizes="(max-width: 1024px) 100vw, 50vw"
                priority={index === 0}
              />
            ))}

            {/* Slide indicator chips */}
            <div className="absolute bottom-5 left-5 z-20 flex gap-2">
              {slides.map((_, i) => (
                <button
                  key={i}
                  onClick={() => setCurrent(i)}
                  aria-label={`Ir para slide ${i + 1}`}
                  className={`h-8 border-2 border-foreground font-mono text-[0.65rem] font-bold transition-all ${
                    i === current
                      ? "w-12 bg-primary text-primary-foreground"
                      : "w-8 bg-background/80 text-foreground hover:bg-background"
                  }`}
                >
                  {String(i + 1).padStart(2, "0")}
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
