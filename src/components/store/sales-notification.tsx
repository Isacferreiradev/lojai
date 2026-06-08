"use client";

import { useEffect, useState } from "react";
import { toast } from "sonner";
import { getAllActiveProductNames } from "@/actions/products";

// Simulated fallback product data to show if DB fetch fails or is loading
const fallbackProducts = [
  "Luminária Touch Sem Fio Recarregável em Aço",
  "Luminária de Mesa Mushroom Glass Premium",
  "Arandela de Parede Sem Fio Magnetic Light",
  "Kit 3 Quadros Abstratos Formas Orgânicas",
  "Espelho Orgânico Assoberbado Premium",
  "Kit Lavabo Spa Premium 4 Peças",
];

const names = ["Ana", "Carlos", "Juliana", "Roberto", "Marina", "Lucas", "Fernanda", "Diego", "Patrícia", "Rafael", "Camila", "Bruno"];
const locations = ["São Paulo, SP", "Rio de Janeiro, RJ", "Belo Horizonte, MG", "Curitiba, PR", "Porto Alegre, RS", "Brasília, DF", "Salvador, BA", "Fortaleza, CE"];

export function SalesNotification() {
  const [dbProducts, setDbProducts] = useState<string[]>([]);

  useEffect(() => {
    // Fetch real product names from the database
    getAllActiveProductNames().then((names) => {
      if (names && names.length > 0) {
        setDbProducts(names);
      }
    });
  }, []);

  useEffect(() => {
    // Wait a few seconds before showing the first notification
    const initialDelay = setTimeout(() => {
      showRandomSale();
    }, 6000);

    const interval = setInterval(() => {
      showRandomSale();
    }, 28000); // Show a new notification every 28 seconds

    return () => {
      clearTimeout(initialDelay);
      clearInterval(interval);
    };
  }, [dbProducts]);

  const showRandomSale = () => {
    if (typeof window === "undefined") return;

    // Check if we are on a product detail page
    const isProductPage = window.location.pathname.startsWith("/produtos/") && window.location.pathname !== "/produtos";
    let productName = "";

    if (isProductPage) {
      // Get the product name from the H1 element
      const h1Text = document.querySelector("h1")?.textContent;
      if (h1Text) {
        productName = h1Text.trim();
      }
    }

    // Fallback if not on product page or H1 title is empty
    if (!productName) {
      const productList = dbProducts.length > 0 ? dbProducts : fallbackProducts;
      productName = productList[Math.floor(Math.random() * productList.length)];
    }

    const randomName = names[Math.floor(Math.random() * names.length)];
    const randomLocation = locations[Math.floor(Math.random() * locations.length)];
    const minutesAgo = Math.floor(Math.random() * 59) + 1;

    // Dismiss any previous toasts to prevent stacking on mobile
    toast.dismiss();

    const isMobile = window.innerWidth < 768;
    const toastPosition = isMobile ? "top-center" : "bottom-left";

    toast(
      <div className="flex items-center gap-2.5 w-full cursor-pointer text-left">
        <span className="relative flex h-2 w-2 shrink-0">
          <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
          <span className="relative inline-flex rounded-full h-2 w-2 bg-green-500"></span>
        </span>
        <div className="min-w-0 flex-1">
          <p className="font-medium text-foreground leading-normal text-[11px] sm:text-xs">
            <span className="font-bold">{randomName}</span> ({randomLocation}) comprou:
          </p>
          <p className="text-primary font-bold truncate text-[11px] sm:text-xs">{productName}</p>
        </div>
        <span className="text-[9px] font-mono text-muted-foreground shrink-0 whitespace-nowrap self-start mt-0.5">
          {minutesAgo}m atrás
        </span>
      </div>,
      {
        duration: 5000,
        position: toastPosition,
        style: {
          backgroundColor: "var(--card)",
          borderColor: "var(--border)",
          borderWidth: "2px",
          borderRadius: "0",
          padding: "10px 14px",
          width: isMobile ? "92vw" : "340px",
          margin: isMobile ? "8px auto" : "0",
        }
      }
    );
  };

  return null;
}
