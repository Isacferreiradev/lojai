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
        <div className="grid grid-cols-1 items-stretch lg:grid-cols-2 lg:aspect-[8/3]">
          {/* Text column — hidden on mobile/tablet, shown on desktop (lg and above) */}
          <div className="hidden lg:flex flex-col justify-center gap-5 border-foreground py-8 lg:border-r-2 lg:py-12 lg:pr-12">
            <div key={`eyebrow-${current}`} className="animate-fade-in flex items-center gap-3">
              <span className="label-mono text-primary">
                {String(Math.min(current, slides.length - 1) + 1).padStart(2, "0")} / {String(slides.length).padStart(2, "0")}
              </span>
              <span className="h-px w-10 bg-foreground" />
              <span className="label-mono text-foreground">{slide.eyebrow}</span>
            </div>

            <h1
              key={`title-${current}`}
              className="display animate-rise text-4xl text-foreground sm:text-5xl md:text-6xl lg:text-5xl xl:text-6xl 2xl:text-7xl whitespace-pre-line"
            >
              {slide.title}
            </h1>

            <p
              key={`sub-${current}`}
              className="animate-fade-in max-w-md text-sm leading-relaxed text-muted-foreground sm:text-base"
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

          {/* Image column — clickable, full width with exact aspect ratio on mobile, fills height on desktop */}
          <Link
            href={slide.ctaHref}
            className="relative w-full aspect-[4/3] overflow-hidden lg:aspect-auto lg:h-full lg:w-full block"
          >
            {slides.map((s, index) => (
              <div
                key={index}
                className={`absolute inset-0 transition-opacity duration-700 ${
                  index === current ? "opacity-100" : "opacity-0"
                }`}
              >
                <Image
                  src={s.imageUrl}
                  alt={s.title.replace(/\n/g, " ")}
                  fill
                  className="object-cover"
                  sizes="(max-width: 1024px) 100vw, 50vw"
                  priority={index === 0}
                />
              </div>
            ))}
          </Link>
        </div>
      </div>
    </section>
  );
}
