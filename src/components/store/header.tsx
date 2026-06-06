"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { SearchBar } from "@/components/store/search-bar";
import { CartDrawer } from "@/components/store/cart-drawer";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import { Menu, ChevronDown } from "lucide-react";
import { CATEGORIES } from "@/lib/constants";

const TICKER_ITEMS = [
  "FRETE PARA TODO O BRASIL",
  "ATÉ 12X SEM JUROS",
  "1ª TROCA GRÁTIS",
  "FRETE GRÁTIS ACIMA DE R$350",
  "TAPETES QUE SÃO ARTE",
];

export function Header() {
  const pathname = usePathname();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 12);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const navLinkBase =
    "px-3 py-1.5 font-mono text-xs font-semibold uppercase tracking-wider transition-colors";

  return (
    <header className="sticky top-0 z-40 w-full">
      {/* Editorial ticker strip */}
      <div className="overflow-hidden border-b-2 border-foreground bg-foreground text-background">
        <div className="flex w-max animate-marquee">
          {[0, 1].map((dup) => (
            <div key={dup} className="flex shrink-0 items-center" aria-hidden={dup === 1}>
              {TICKER_ITEMS.map((item, i) => (
                <span
                  key={`${dup}-${i}`}
                  className="flex items-center gap-3 px-5 py-1.5 font-mono text-[0.65rem] font-medium tracking-wider"
                >
                  {item}
                  <span className="text-primary">✦</span>
                </span>
              ))}
            </div>
          ))}
        </div>
      </div>

      {/* Main bar */}
      <div
        className={`w-full border-b-2 border-foreground transition-colors duration-300 ${
          scrolled ? "bg-background/90 backdrop-blur-md" : "bg-background"
        }`}
      >
        <div className="container mx-auto flex h-16 items-center justify-between gap-4 px-4 md:px-6">
          {/* Mobile Menu */}
          <div className="md:hidden">
            <Sheet open={mobileMenuOpen} onOpenChange={setMobileMenuOpen}>
              <SheetTrigger asChild>
                <Button variant="ghost" size="icon" className="cursor-pointer text-foreground">
                  <Menu className="h-5 w-5 stroke-[2.5]" />
                </Button>
              </SheetTrigger>
              <SheetContent side="left" className="flex h-full w-[300px] flex-col bg-card p-0">
                <SheetHeader className="border-b-2 border-foreground px-6 py-5">
                  <SheetTitle className="text-left text-2xl font-extrabold tracking-tight">
                    LOJAI<span className="text-primary">.</span>
                  </SheetTitle>
                </SheetHeader>

                <nav className="flex flex-1 flex-col gap-1 p-4">
                  <Link
                    href="/"
                    onClick={() => setMobileMenuOpen(false)}
                    className={`flex items-center px-4 py-2.5 font-mono text-xs font-semibold uppercase tracking-wider transition-all ${
                      pathname === "/"
                        ? "bg-foreground text-background"
                        : "text-foreground/70 hover:bg-muted hover:text-foreground"
                    }`}
                  >
                    Início
                  </Link>
                  <Link
                    href="/produtos"
                    onClick={() => setMobileMenuOpen(false)}
                    className={`flex items-center px-4 py-2.5 font-mono text-xs font-semibold uppercase tracking-wider transition-all ${
                      pathname.startsWith("/produtos")
                        ? "bg-foreground text-background"
                        : "text-foreground/70 hover:bg-muted hover:text-foreground"
                    }`}
                  >
                    Todos os Tapetes
                  </Link>

                  <div className="mt-3 border-t-2 border-foreground pt-3">
                    <p className="label-mono mb-2 px-4 text-muted-foreground">
                      Categorias
                    </p>
                    {CATEGORIES.map((cat) => (
                      <Link
                        key={cat.slug}
                        href={`/produtos?category=${cat.slug}`}
                        onClick={() => setMobileMenuOpen(false)}
                        className="flex items-center px-4 py-2 text-sm font-medium text-foreground/70 transition-all hover:bg-muted hover:text-foreground"
                      >
                        {cat.name}
                      </Link>
                    ))}
                  </div>
                </nav>
              </SheetContent>
            </Sheet>
          </div>

          {/* Logo */}
          <Link href="/" className="flex shrink-0 items-center">
            <span className="font-heading text-2xl font-extrabold tracking-tight text-foreground transition-opacity hover:opacity-70 md:text-3xl">
              LOJAI<span className="text-primary">.</span>
            </span>
          </Link>

          {/* Desktop Nav */}
          <nav className="hidden items-center gap-1 md:flex">
            <Link
              href="/"
              className={`${navLinkBase} ${
                pathname === "/" ? "text-primary" : "text-foreground/65 hover:text-foreground"
              }`}
            >
              Início
            </Link>

            <DropdownMenu>
              <DropdownMenuTrigger className="flex cursor-pointer items-center gap-1 px-3 py-1.5 font-mono text-xs font-semibold uppercase tracking-wider text-foreground/65 transition-colors hover:text-foreground">
                Categorias <ChevronDown className="h-3.5 w-3.5 opacity-60" />
              </DropdownMenuTrigger>
              <DropdownMenuContent align="start" className="min-w-[180px]">
                {CATEGORIES.map((cat) => (
                  <DropdownMenuItem key={cat.slug} asChild className="cursor-pointer font-medium">
                    <Link href={`/produtos?category=${cat.slug}`} className="w-full cursor-pointer">
                      {cat.name}
                    </Link>
                  </DropdownMenuItem>
                ))}
              </DropdownMenuContent>
            </DropdownMenu>

            <Link
              href="/produtos"
              className={`${navLinkBase} ${
                pathname.startsWith("/produtos") ? "text-primary" : "text-foreground/65 hover:text-foreground"
              }`}
            >
              Todos os Tapetes
            </Link>
          </nav>

          {/* Search */}
          <div className="mx-4 hidden max-w-sm flex-1 sm:block md:max-w-md">
            <SearchBar />
          </div>

          {/* Actions — cart only (loja sem login) */}
          <div className="flex items-center gap-1 md:gap-2">
            <CartDrawer />
          </div>
        </div>
      </div>
    </header>
  );
}
