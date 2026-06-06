import Link from "next/link";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { STORE_NAME, STORE_DESCRIPTION, CONTACT_INFO, CATEGORIES } from "@/lib/constants";
import { Mail, Phone, MapPin, ShieldCheck, Truck, RotateCcw } from "lucide-react";

function InstagramIcon({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
      <rect width="20" height="20" x="2" y="2" rx="5" ry="5" />
      <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z" />
      <line x1="17.5" x2="17.51" y1="6.5" y2="6.5" />
    </svg>
  );
}

function FacebookIcon({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
      <path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z" />
    </svg>
  );
}

const trustBadges = [
  { icon: Truck, label: "Entrega para todo o Brasil", sub: "Envio seguro e rastreado." },
  { icon: RotateCcw, label: "Primeira Troca Grátis", sub: "Até 7 dias sem custo." },
  { icon: ShieldCheck, label: "Compra 100% Segura", sub: "Criptografia SSL nos pagamentos." },
];

export function Footer() {
  return (
    <footer className="mt-auto border-t-2 border-foreground bg-foreground text-background">

      {/* Trust Strip */}
      <div className="border-b border-background/15">
        <div className="container mx-auto grid grid-cols-1 gap-px bg-background/15 px-4 md:grid-cols-3 md:px-6">
          {trustBadges.map((badge) => {
            const Icon = badge.icon;
            return (
              <div key={badge.label} className="flex items-center gap-4 bg-foreground px-2 py-6 md:px-6">
                <div className="flex size-11 shrink-0 items-center justify-center border-2 border-accent text-accent">
                  <Icon className="h-5 w-5" strokeWidth={2} />
                </div>
                <div>
                  <h4 className="font-heading text-sm font-bold text-background">{badge.label}</h4>
                  <p className="mt-0.5 text-xs text-background/55">{badge.sub}</p>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Main Footer */}
      <div className="container mx-auto grid grid-cols-1 gap-10 px-4 py-14 sm:grid-cols-2 md:grid-cols-4 md:px-6">

        {/* Brand */}
        <div className="space-y-4 sm:col-span-2 md:col-span-1">
          <Link href="/" className="inline-block">
            <span className="font-heading text-3xl font-extrabold tracking-tight text-background">
              {STORE_NAME.toUpperCase()}<span className="text-accent">.</span>
            </span>
          </Link>
          <p className="max-w-xs text-sm leading-relaxed text-background/55">
            {STORE_DESCRIPTION}
          </p>
          <div className="flex gap-3 pt-1">
            <a
              href="https://instagram.com"
              target="_blank"
              rel="noopener noreferrer"
              className="flex size-10 items-center justify-center border-2 border-background/30 text-background/70 transition-all hover:border-accent hover:text-accent"
            >
              <InstagramIcon className="h-4 w-4" />
            </a>
            <a
              href="https://facebook.com"
              target="_blank"
              rel="noopener noreferrer"
              className="flex size-10 items-center justify-center border-2 border-background/30 text-background/70 transition-all hover:border-accent hover:text-accent"
            >
              <FacebookIcon className="h-4 w-4" />
            </a>
          </div>
        </div>

        {/* Categories */}
        <div>
          <h4 className="label-mono mb-5 text-accent">Categorias</h4>
          <ul className="space-y-2.5">
            {CATEGORIES.map((cat) => (
              <li key={cat.slug}>
                <Link
                  href={`/produtos?category=${cat.slug}`}
                  className="text-sm font-medium text-background/55 transition-colors hover:text-accent"
                >
                  {cat.name}
                </Link>
              </li>
            ))}
            <li>
              <Link
                href="/produtos"
                className="text-sm font-semibold text-background/55 transition-colors hover:text-accent"
              >
                Todos os Modelos →
              </Link>
            </li>
          </ul>
        </div>

        {/* Contact */}
        <div>
          <h4 className="label-mono mb-5 text-accent">Contato</h4>
          <ul className="space-y-3 text-sm text-background/55">
            <li className="flex items-center gap-2.5">
              <Phone className="h-4 w-4 shrink-0 text-accent/70" />
              <span>{CONTACT_INFO.phone}</span>
            </li>
            <li className="flex items-center gap-2.5">
              <Mail className="h-4 w-4 shrink-0 text-accent/70" />
              <span className="truncate">{CONTACT_INFO.email}</span>
            </li>
            <li className="flex items-start gap-2.5">
              <MapPin className="mt-0.5 h-4 w-4 shrink-0 text-accent/70" />
              <span className="leading-relaxed">{CONTACT_INFO.address}</span>
            </li>
            <li className="border-t border-background/15 pt-1 text-xs text-background/35">
              {CONTACT_INFO.workingHours}
            </li>
          </ul>
        </div>

        {/* Newsletter */}
        <div>
          <h4 className="label-mono mb-5 text-accent">Novidades</h4>
          <p className="mb-4 text-sm leading-relaxed text-background/55">
            Inscreva-se e ganhe <strong className="font-bold text-accent">10% de desconto</strong> na primeira compra.
          </p>
          <div className="space-y-2">
            <Input
              type="email"
              placeholder="Seu melhor e-mail"
              className="h-11 border-background bg-background/10 px-4 text-background placeholder:text-background/40 focus-visible:border-accent focus-visible:ring-accent/30"
            />
            <Button className="h-11 w-full cursor-pointer border-background bg-accent text-accent-foreground shadow-[3px_3px_0_0_var(--color-background)] hover:bg-accent/90 hover:shadow-[5px_5px_0_0_var(--color-background)]">
              Cadastrar
            </Button>
          </div>
        </div>
      </div>

      {/* Bottom Bar */}
      <div className="border-t border-background/15 bg-black/30">
        <div className="container mx-auto flex flex-col items-center justify-between gap-3 px-4 py-5 font-mono text-[0.65rem] uppercase tracking-wider text-background/40 md:flex-row md:px-6">
          <p>© {new Date().getFullYear()} {STORE_NAME}. Todos os direitos reservados.</p>
          <div className="flex flex-wrap justify-center gap-3">
            <span>PIX</span>
            <span className="text-accent">/</span>
            <span>Cartão</span>
            <span className="text-accent">/</span>
            <span>Boleto</span>
            <span className="text-accent">/</span>
            <span>Mercado Pago</span>
          </div>
        </div>
      </div>
    </footer>
  );
}
