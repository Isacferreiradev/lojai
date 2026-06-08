"use server";

import prisma from "@/lib/prisma";
import { cookies } from "next/headers";
import { revalidatePath } from "next/cache";

const ADMIN_COOKIE = "lojai_admin";
const SETTING_KEY = "hero_slides";

export interface HeroSlide {
  eyebrow: string;
  title: string;
  subtitle: string;
  ctaText: string;
  ctaHref: string;
  imageUrl: string;
}

const DEFAULT_SLIDES: HeroSlide[] = [
  {
    eyebrow: "Nova Coleção",
    title: "Decoração\nque é\narte.",
    subtitle: "Tecidos à mão com fibras 100% naturais. Sofisticação e conforto para a sua sala de estar.",
    ctaText: "Ver Coleção",
    ctaHref: "/produtos?category=sala",
    imageUrl: "/images/hero-1.png",
  },
  {
    eyebrow: "Design Contemporâneo",
    title: "Linha,\nforma &\ngeometria.",
    subtitle: "Linhas limpas e paleta neutra. O toque de arte moderna que o seu ambiente pedia.",
    ctaText: "Explorar Modelos",
    ctaHref: "/produtos?category=boho",
    imageUrl: "/images/hero-2.png",
  },
];

async function assertAdmin() {
  const store = await cookies();
  const expected = process.env.ADMIN_PASSWORD;
  if (!expected || store.get(ADMIN_COOKIE)?.value !== expected) {
    throw new Error("Não autorizado");
  }
}

export async function getHeroSlides(): Promise<HeroSlide[]> {
  try {
    const setting = await prisma.setting.findUnique({ where: { key: SETTING_KEY } });
    if (!setting?.value) return DEFAULT_SLIDES;
    const parsed = JSON.parse(setting.value) as HeroSlide[];
    return Array.isArray(parsed) && parsed.length > 0 ? parsed : DEFAULT_SLIDES;
  } catch {
    return DEFAULT_SLIDES;
  }
}

export async function saveHeroSlides(slides: HeroSlide[]) {
  try {
    await assertAdmin();
    const clean = slides
      .filter((s) => s.imageUrl?.trim())
      .map((s) => ({
        eyebrow: s.eyebrow?.trim() || "",
        title: s.title?.trim() || "",
        subtitle: s.subtitle?.trim() || "",
        ctaText: s.ctaText?.trim() || "Ver mais",
        ctaHref: s.ctaHref?.trim() || "/produtos",
        imageUrl: s.imageUrl.trim(),
      }));

    await prisma.setting.upsert({
      where: { key: SETTING_KEY },
      update: { value: JSON.stringify(clean), group: "appearance" },
      create: { key: SETTING_KEY, value: JSON.stringify(clean), group: "appearance" },
    });

    revalidatePath("/");
    return { success: true };
  } catch (error: any) {
    console.error("saveHeroSlides failed:", error);
    return { success: false, error: error?.message || "Erro ao salvar banners" };
  }
}
