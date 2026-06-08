"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { logoutAdmin } from "@/actions/admin-auth";
import {
  LayoutDashboard,
  ShoppingBag,
  FolderTree,
  Tag,
  Star,
  Users,
  Settings,
  LogOut,
  ChevronLeft,
  ChevronRight,
  ClipboardList,
  DollarSign,
  Plug,
  Image as ImageIcon,
} from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";

const menuItems = [
  { name: "Painel Geral", href: "/admin", icon: LayoutDashboard },
  { name: "Financeiro", href: "/admin/financeiro", icon: DollarSign },
  { name: "Pedidos", href: "/admin/pedidos", icon: ClipboardList },
  { name: "Produtos", href: "/admin/produtos", icon: ShoppingBag },
  { name: "Categorias", href: "/admin/categorias", icon: FolderTree },
  { name: "Banners", href: "/admin/banners", icon: ImageIcon },
  { name: "Cupons de Desconto", href: "/admin/cupons", icon: Tag },
  { name: "Avaliações", href: "/admin/avaliacoes", icon: Star },
  { name: "Clientes", href: "/admin/clientes", icon: Users },
  { name: "Integrações", href: "/admin/integracoes", icon: Plug },
  { name: "Configurações", href: "/admin/configuracoes", icon: Settings },
];

export function Sidebar() {
  const pathname = usePathname();
  const [collapsed, setCollapsed] = useState(false);

  const handleSignOut = async () => {
    toast.success("Sessão administrativa finalizada.");
    await logoutAdmin();
  };

  return (
    <aside
      className={`border-r-2 border-foreground bg-foreground text-background h-screen sticky top-0 flex flex-col justify-between py-6 transition-all duration-300 z-30 ${
        collapsed ? "w-20 px-2" : "w-64 px-5"
      }`}
    >
      {/* Sidebar Header */}
      <div className="space-y-6">
        <div className="flex items-center justify-between border-b border-background/20 pb-4">
          {!collapsed && (
            <span className="font-heading text-2xl font-extrabold tracking-tight text-background">
              ORNA CASA<span className="text-primary">.</span>
              <span className="label-mono block text-background/50">Painel Admin</span>
            </span>
          )}

          <button
            onClick={() => setCollapsed(!collapsed)}
            className="ml-auto flex size-8 items-center justify-center border-2 border-background/30 text-background/70 transition-colors hover:border-background hover:text-background cursor-pointer"
          >
            {collapsed ? <ChevronRight className="h-4 w-4" /> : <ChevronLeft className="h-4 w-4" />}
          </button>
        </div>

        {/* Sidebar Nav Links */}
        <nav className="flex flex-col gap-1.5">
          {menuItems.map((item) => {
            const isActive =
              pathname === item.href || (item.href !== "/admin" && pathname.startsWith(item.href));
            const Icon = item.icon;

            return (
              <Link
                key={item.href}
                href={item.href}
                title={item.name}
                className={`flex items-center gap-3 py-2.5 text-sm font-semibold transition-all ${
                  isActive
                    ? "bg-primary text-primary-foreground"
                    : "text-background/60 hover:text-background hover:bg-background/10"
                } ${collapsed ? "justify-center px-0 h-10 w-10 mx-auto" : "px-4"}`}
              >
                <Icon className="h-4.5 w-4.5 flex-shrink-0" />
                {!collapsed && <span>{item.name}</span>}
              </Link>
            );
          })}
        </nav>
      </div>

      {/* Sidebar Footer */}
      <div className="space-y-4 border-t border-background/20 pt-4">
        <button
          onClick={handleSignOut}
          title="Sair do Painel"
          className={`flex items-center gap-3 py-2.5 text-sm font-semibold text-destructive hover:bg-destructive/15 transition-colors w-full text-left cursor-pointer ${
            collapsed ? "justify-center px-0 h-10 w-10 mx-auto" : "px-4"
          }`}
        >
          <LogOut className="h-4.5 w-4.5 flex-shrink-0" />
          {!collapsed && <span>Sair do Painel</span>}
        </button>
      </div>
    </aside>
  );
}
