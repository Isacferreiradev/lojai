"use server";

import prisma from "@/lib/prisma";
import { Category } from "@prisma/client";

export async function getCategories(): Promise<Category[]> {
  try {
    return await prisma.category.findMany({
      where: {
        isActive: true,
      },
      orderBy: {
        sortOrder: "asc",
      },
    });
  } catch (error) {
    console.error("Failed to fetch categories:", error);
    return [];
  }
}
