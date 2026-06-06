"use client";

import { useFilters } from "@/hooks/use-filters";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Slider } from "@/components/ui/slider";
import { CATEGORIES } from "@/lib/constants";
import { useState, useEffect } from "react";
import { ChevronDown, SlidersHorizontal, RotateCcw } from "lucide-react";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";

// Visual color swatches map
const COLOR_SWATCHES: Record<string, string> = {
  "Off-White": "bg-[#FAF9F6]",
  "Bege Areia": "bg-[#e2d6c5]",
  "Cinza Mescla": "bg-[#adadad]",
  "Terracota/Creme": "bg-gradient-to-tr from-[#c57155] to-[#f9f5ed]",
  "Chumbo/Creme": "bg-gradient-to-tr from-[#3a3d40] to-[#f9f5ed]",
  "Creme": "bg-[#FAF0E6]",
  "Cinza Grafite": "bg-[#3a3d40]",
  "Rosé Soft": "bg-[#e8c6c6]",
  "Colorido": "bg-gradient-to-r from-red-400 via-yellow-400 to-blue-400",
  "Azul Estonado/Creme": "bg-gradient-to-tr from-[#586f8c] to-[#f9f5ed]",
};

const SIZES = ["1.00x1.50m", "1.50x2.00m", "2.00x2.50m", "2.50x3.00m", "3.00x4.00m", "1.00x2.00m"];
const MATERIALS = ["Algodão Orgânico", "Polipropileno Soft", "Poliéster Ultra Soft", "Nylon Antialérgico", "Lã de Carneiro"];

export function ProductFilters() {
  const { searchParams, setFilter, clearFilters } = useFilters();

  // Local state for price range (to prevent excessive URL updates during sliding)
  const [priceRange, setPriceRange] = useState<number[]>([0, 2000]);

  // Read current filters from URL search params
  const activeCategory = searchParams.get("category") || "";
  const activeColors = searchParams.getAll("colors");
  const activeSizes = searchParams.getAll("sizes");
  const activeMaterials = searchParams.getAll("materials");
  const minPriceParam = Number(searchParams.get("minPrice")) || 0;
  const maxPriceParam = Number(searchParams.get("maxPrice")) || 2000;

  useEffect(() => {
    setPriceRange([minPriceParam, maxPriceParam]);
  }, [minPriceParam, maxPriceParam]);

  const handlePriceChange = (val: number | readonly number[]) => {
    if (Array.isArray(val)) {
      setPriceRange(val as number[]);
    }
  };

  const handlePriceCommit = () => {
    setFilter("minPrice", priceRange[0] === 0 ? null : priceRange[0]);
    setFilter("maxPrice", priceRange[1] === 2000 ? null : priceRange[1]);
  };

  const handleToggleColor = (color: string) => {
    const nextColors = activeColors.includes(color)
      ? activeColors.filter((c) => c !== color)
      : [...activeColors, color];
    setFilter("colors", nextColors);
  };

  const handleToggleSize = (size: string) => {
    const nextSizes = activeSizes.includes(size)
      ? activeSizes.filter((s) => s !== size)
      : [...activeSizes, size];
    setFilter("sizes", nextSizes);
  };

  const handleToggleMaterial = (mat: string) => {
    const nextMats = activeMaterials.includes(mat)
      ? activeMaterials.filter((m) => m !== mat)
      : [...activeMaterials, mat];
    setFilter("materials", nextMats);
  };

  const hasActiveFilters =
    activeCategory ||
    activeColors.length > 0 ||
    activeSizes.length > 0 ||
    activeMaterials.length > 0 ||
    minPriceParam > 0 ||
    maxPriceParam < 2000;

  const FiltersContent = () => (
    <div className="space-y-8">
      {/* Category Filter */}
      <div className="space-y-4">
        <h4 className="label-mono text-primary">[ Categorias ]</h4>
        <div className="flex flex-col gap-2.5">
          <button
            onClick={() => setFilter("category", null)}
            className={`text-left text-sm transition-colors hover:text-primary ${
              activeCategory === "" ? "font-bold text-primary" : "font-medium text-muted-foreground"
            }`}
          >
            Todos os Modelos
          </button>
          {CATEGORIES.map((cat) => (
            <button
              key={cat.slug}
              onClick={() => setFilter("category", cat.slug)}
              className={`text-left text-sm transition-colors hover:text-primary ${
                activeCategory === cat.slug ? "font-bold text-primary" : "font-medium text-muted-foreground"
              }`}
            >
              {cat.name}
            </button>
          ))}
        </div>
      </div>

      {/* Price Filter */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h4 className="label-mono text-primary">[ Preço ]</h4>
          <span className="font-mono text-xs font-semibold text-foreground">
            Até R$ {priceRange[1]}
          </span>
        </div>
        <div className="space-y-4">
          <Slider
            min={0}
            max={2000}
            step={50}
            value={[priceRange[0], priceRange[1]]}
            onValueChange={handlePriceChange}
            onValueCommitted={handlePriceCommit}
            className="py-1 cursor-pointer"
          />
          <div className="flex items-center justify-between text-xs font-semibold text-muted-foreground">
            <span>R$ {priceRange[0]}</span>
            <span>R$ {priceRange[1]}+</span>
          </div>
        </div>
      </div>

      {/* Colors Filter */}
      <div className="space-y-4">
        <h4 className="label-mono text-primary">[ Cores ]</h4>
        <div className="flex flex-wrap gap-2.5">
          {Object.entries(COLOR_SWATCHES).map(([colorName, swatchClass]) => {
            const isSelected = activeColors.includes(colorName);
            return (
              <button
                key={colorName}
                onClick={() => handleToggleColor(colorName)}
                title={colorName}
                className={`h-7 w-7 cursor-pointer rounded-none border-2 transition-transform hover:scale-110 active:scale-95 ${swatchClass} ${
                  isSelected ? "border-primary ring-2 ring-primary ring-offset-2 ring-offset-background" : "border-foreground"
                }`}
              />
            );
          })}
        </div>
      </div>

      {/* Sizes Filter */}
      <div className="space-y-4">
        <h4 className="label-mono text-primary">[ Tamanhos ]</h4>
        <div className="grid grid-cols-2 gap-2">
          {SIZES.map((size) => {
            const isChecked = activeSizes.includes(size);
            return (
              <div
                key={size}
                className={`flex cursor-pointer items-center gap-2 border-2 p-2 text-xs font-medium transition-colors ${
                  isChecked ? "border-foreground bg-muted" : "border-foreground/40 hover:bg-muted/40"
                }`}
                onClick={() => handleToggleSize(size)}
              >
                <Checkbox checked={isChecked} onCheckedChange={() => {}} className="cursor-pointer" />
                <Label className="cursor-pointer text-muted-foreground">{size}</Label>
              </div>
            );
          })}
        </div>
      </div>

      {/* Materials Filter */}
      <div className="space-y-4">
        <h4 className="label-mono text-primary">[ Fibras / Materiais ]</h4>
        <div className="flex flex-col gap-2.5">
          {MATERIALS.map((mat) => {
            const isChecked = activeMaterials.includes(mat);
            return (
              <div
                key={mat}
                className="flex items-center gap-3 cursor-pointer text-sm"
                onClick={() => handleToggleMaterial(mat)}
              >
                <Checkbox checked={isChecked} onCheckedChange={() => {}} className="cursor-pointer" />
                <Label className="cursor-pointer text-muted-foreground">{mat}</Label>
              </div>
            );
          })}
        </div>
      </div>

      {/* Clear Filters Button */}
      {hasActiveFilters && (
        <Button
          variant="outline"
          onClick={clearFilters}
          className="w-full cursor-pointer gap-2 text-xs font-semibold"
        >
          <RotateCcw className="h-3.5 w-3.5" />
          Limpar Filtros
        </Button>
      )}
    </div>
  );

  return (
    <div>
      {/* Desktop Filters Sidebar */}
      <div className="hidden w-64 border-2 border-foreground bg-card p-6 lg:block">
        <FiltersContent />
      </div>

      {/* Mobile Drawer trigger */}
      <div className="flex items-center gap-2 lg:hidden">
        <Sheet>
          <SheetTrigger asChild>
            <Button variant="outline" className="cursor-pointer gap-2 text-sm font-semibold">
              <SlidersHorizontal className="h-4 w-4" />
              Filtrar Tapetes
              {hasActiveFilters && (
                <span className="h-2 w-2 bg-primary" />
              )}
            </Button>
          </SheetTrigger>
          <SheetContent side="bottom" className="h-[80vh] overflow-y-auto bg-card">
            <SheetHeader className="mb-6 border-b-2 border-foreground pb-4">
              <SheetTitle className="flex items-center gap-2 text-xl font-bold">
                <SlidersHorizontal className="h-5 w-5 text-primary" />
                Filtrar Tapetes
              </SheetTitle>
            </SheetHeader>
            <div className="pb-8">
              <FiltersContent />
            </div>
          </SheetContent>
        </Sheet>
      </div>
    </div>
  );
}
