"use client";

import { useState } from "react";
import Image from "next/image";

interface ProductImage {
  url: string;
  alt?: string | null;
}

interface ProductGalleryProps {
  images: ProductImage[];
}

export function ProductGallery({ images }: ProductGalleryProps) {
  const [activeIndex, setActiveIndex] = useState(0);
  const [zoomStyle, setZoomStyle] = useState<{ transformOrigin: string } | null>(null);

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    const { left, top, width, height } = e.currentTarget.getBoundingClientRect();
    const x = ((e.clientX - left) / width) * 100;
    const y = ((e.clientY - top) / height) * 100;
    setZoomStyle({
      transformOrigin: `${x}% ${y}%`,
    });
  };

  const handleMouseLeave = () => {
    setZoomStyle(null);
  };

  const activeImage = images[activeIndex] || { url: "/images/placeholder.png", alt: "Tapete" };

  return (
    <div className="flex flex-col gap-3">
      {/* Active Image — large, with hover zoom lens */}
      <div
        className="relative aspect-square w-full overflow-hidden border-2 border-foreground bg-muted cursor-zoom-in group"
        onMouseMove={handleMouseMove}
        onMouseLeave={handleMouseLeave}
      >
        <Image
          src={activeImage.url}
          alt={activeImage.alt || "Imagem do Produto"}
          fill
          style={
            zoomStyle
              ? {
                  transformOrigin: zoomStyle.transformOrigin,
                  transform: "scale(1.6)",
                }
              : undefined
          }
          className="object-cover transition-transform duration-75"
          sizes="(max-width: 768px) 100vw, 50vw"
          priority
        />
        {/* image counter */}
        <span className="absolute right-0 top-0 z-10 border-b-2 border-l-2 border-foreground bg-background px-2 py-1 font-mono text-[0.65rem] font-bold text-foreground">
          {String(activeIndex + 1).padStart(2, "0")} / {String(images.length).padStart(2, "0")}
        </span>
      </div>

      {/* Thumbnails — standard grid below the main image */}
      {images.length > 1 && (
        <div className="grid grid-cols-4 gap-3">
          {images.map((img, idx) => (
            <button
              key={idx}
              onClick={() => setActiveIndex(idx)}
              aria-label={`Ver imagem ${idx + 1}`}
              className={`relative aspect-square overflow-hidden border-2 bg-card cursor-pointer transition-all ${
                idx === activeIndex
                  ? "border-primary ring-2 ring-primary/30"
                  : "border-foreground/40 hover:border-foreground hover:-translate-y-0.5"
              }`}
            >
              <Image
                src={img.url}
                alt={img.alt || `Miniatura ${idx + 1}`}
                fill
                className="object-cover"
                sizes="120px"
              />
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
