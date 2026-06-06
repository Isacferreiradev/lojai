"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { signOut } from "@/actions/auth";
import {
  User as UserIcon,
  ClipboardList,
  MapPin,
  KeyRound,
  LogOut,
  LayoutDashboard,
} from "lucide-react";
import { toast } from "sonner";
import { Header } from "@/components/store/header";
import { Footer } from "@/components/store/footer";

const navItems = [
  {
    name: "Painel Geral",
    href: "/minha-conta",
    icon: LayoutDashboard,
  },
  {
    name: "Meus Pedidos",
    href: "/minha-conta/pedidos",
    icon: ClipboardList,
  },
  {
    name: "Dados Pessoais",
    href: "/minha-conta/dados",
    icon: UserIcon,
  },
  {
    name: "Endereços",
    href: "/minha-conta/enderecos",
    icon: MapPin,
  },
  {
    name: "Alterar Senha",
    href: "/minha-conta/senha",
    icon: KeyRound,
  },
];

export default function AccountLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const router = useRouter();

  const handleSignOut = async () => {
    const result = await signOut();
    if (result.success) {
      toast.success("Sessão encerrada com sucesso.");
      router.push("/");
      router.refresh();
    } else {
      toast.error("Erro ao encerrar sessão.");
    }
  };

  return (
    <div className="flex flex-col min-h-screen">
      <Header />
      <main className="flex-1 bg-muted/20 py-8">
        <div className="container mx-auto px-4 md:px-6">
          <div className="flex flex-col lg:flex-row gap-8 items-start">
            {/* Sidebar Navigation */}
            <aside className="w-full lg:w-64 flex flex-col gap-1.5 bg-card border-2 border-foreground p-5">
              <div className="px-2 pb-3 mb-2 border-b-2 border-foreground">
                <h3 className="font-heading text-base font-extrabold text-foreground">Sua Conta</h3>
                <p className="font-mono text-[0.65rem] uppercase tracking-wide text-muted-foreground mt-0.5">Gerencie suas preferências</p>
              </div>

              {navItems.map((item) => {
                const isActive = pathname === item.href;
                const Icon = item.icon;
                return (
                  <Link
                    key={item.href}
                    href={item.href}
                    className={`flex items-center gap-3 px-4 py-2.5 text-sm font-semibold transition-all ${
                      isActive
                        ? "bg-foreground text-background"
                        : "text-muted-foreground hover:text-foreground hover:bg-muted"
                    }`}
                  >
                    <Icon className="h-4.5 w-4.5" />
                    {item.name}
                  </Link>
                );
              })}

              <button
                onClick={handleSignOut}
                className="flex items-center gap-3 px-4 py-2.5 text-sm font-semibold text-destructive hover:bg-destructive/10 transition-colors w-full text-left mt-4 border-t-2 border-foreground pt-4 cursor-pointer"
              >
                <LogOut className="h-4.5 w-4.5" />
                Sair da Conta
              </button>
            </aside>

            {/* Account Page View Content */}
            <div className="flex-1 w-full bg-card border-2 border-foreground p-6 md:p-8">
              {children}
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
}
