"use client";

import { useState, useTransition } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { saveHeroSlides, type HeroSlide } from "@/actions/banners";
import { ImageUploader } from "@/components/admin/image-uploader";
import { toast } from "sonner";
import { Plus, Trash2, Loader2, Save, GripVertical } from "lucide-react";

const EMPTY: HeroSlide = {
  eyebrow: "",
  title: "",
  subtitle: "",
  ctaText: "Ver Coleção",
  ctaHref: "/produtos",
  imageUrl: "",
};

export function BannerEditor({ initialSlides }: { initialSlides: HeroSlide[] }) {
  const [slides, setSlides] = useState<HeroSlide[]>(initialSlides.length ? initialSlides : [EMPTY]);
  const [isPending, startTransition] = useTransition();

  const update = (i: number, field: keyof HeroSlide, value: string) =>
    setSlides((prev) => prev.map((s, idx) => (idx === i ? { ...s, [field]: value } : s)));

  const addSlide = () => setSlides((prev) => [...prev, { ...EMPTY }]);
  const removeSlide = (i: number) => setSlides((prev) => prev.filter((_, idx) => idx !== i));
  const move = (i: number, dir: -1 | 1) =>
    setSlides((prev) => {
      const next = [...prev];
      const j = i + dir;
      if (j < 0 || j >= next.length) return prev;
      [next[i], next[j]] = [next[j], next[i]];
      return next;
    });

  const handleSave = () => {
    startTransition(async () => {
      const result = await saveHeroSlides(slides);
      if (result.success) toast.success("Banners salvos! A home já foi atualizada.");
      else toast.error(result.error || "Erro ao salvar banners.");
    });
  };

  return (
    <div className="space-y-6">
      <div className="space-y-6">
        {slides.map((slide, i) => (
          <div key={i} className="border-2 border-foreground bg-card">
            <div className="flex items-center justify-between border-b-2 border-foreground bg-muted/30 px-4 py-3">
              <div className="flex items-center gap-2">
                <GripVertical className="h-4 w-4 text-muted-foreground" />
                <span className="label-mono text-primary">Banner {String(i + 1).padStart(2, "0")}</span>
              </div>
              <div className="flex items-center gap-1">
                <Button type="button" variant="ghost" size="sm" className="h-8 w-8 p-0" onClick={() => move(i, -1)} disabled={i === 0}>
                  ↑
                </Button>
                <Button type="button" variant="ghost" size="sm" className="h-8 w-8 p-0" onClick={() => move(i, 1)} disabled={i === slides.length - 1}>
                  ↓
                </Button>
                <Button type="button" variant="ghost" size="sm" className="h-8 w-8 p-0 text-destructive hover:bg-destructive/10" onClick={() => removeSlide(i)} disabled={slides.length === 1}>
                  <Trash2 className="h-3.5 w-3.5" />
                </Button>
              </div>
            </div>

            <div className="grid grid-cols-1 gap-4 p-5 md:grid-cols-[200px_1fr]">
              {/* Preview */}
              <div className="space-y-2">
                <div className="relative aspect-[3/4] w-full overflow-hidden border-2 border-foreground bg-muted">
                  {slide.imageUrl ? (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img src={slide.imageUrl} alt="" className="h-full w-full object-cover" />
                  ) : (
                    <div className="flex h-full items-center justify-center p-2 text-center font-mono text-[0.65rem] text-muted-foreground">
                      sem imagem
                    </div>
                  )}
                </div>
              </div>

              {/* Fields */}
              <div className="space-y-3">
                <div className="space-y-1.5">
                  <Label>Imagem do banner *</Label>
                  <Input value={slide.imageUrl} onChange={(e) => update(i, "imageUrl", e.target.value)} placeholder="/images/hero-1.png ou https://..." />
                  <ImageUploader folder="banners" onUploaded={(url) => update(i, "imageUrl", url)} />
                </div>
                <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
                  <div className="space-y-1.5">
                    <Label>Eyebrow (rótulo)</Label>
                    <Input value={slide.eyebrow} onChange={(e) => update(i, "eyebrow", e.target.value)} placeholder="Nova Coleção" />
                  </div>
                  <div className="space-y-1.5">
                    <Label>Texto do botão</Label>
                    <Input value={slide.ctaText} onChange={(e) => update(i, "ctaText", e.target.value)} placeholder="Ver Coleção" />
                  </div>
                </div>
                <div className="space-y-1.5">
                  <Label>Título (use Enter para quebrar linha)</Label>
                  <Textarea value={slide.title} onChange={(e) => update(i, "title", e.target.value)} rows={2} placeholder={"Tapetes\nque são\narte."} />
                </div>
                <div className="space-y-1.5">
                  <Label>Subtítulo</Label>
                  <Textarea value={slide.subtitle} onChange={(e) => update(i, "subtitle", e.target.value)} rows={2} placeholder="Descrição curta e persuasiva..." />
                </div>
                <div className="space-y-1.5">
                  <Label>Link do botão</Label>
                  <Input value={slide.ctaHref} onChange={(e) => update(i, "ctaHref", e.target.value)} placeholder="/produtos?category=sala" />
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      <div className="flex flex-wrap items-center justify-between gap-3">
        <Button type="button" variant="outline" onClick={addSlide} className="gap-2">
          <Plus className="h-4 w-4" /> Adicionar Banner
        </Button>
        <Button type="button" onClick={handleSave} disabled={isPending} className="gap-2">
          {isPending ? <Loader2 className="h-4 w-4 animate-spin" /> : <Save className="h-4 w-4" />}
          Salvar Banners
        </Button>
      </div>
    </div>
  );
}
