"use client";

import type React from "react";
import { usePathname } from "next/navigation";
import { signOut } from "next-auth/react";

import { AppLayout } from "@/components/layout/AppLayout";
import { Navbar, type NavbarAction } from "@/components/layout/Navbar";
import { Sidebar, type SidebarNavItem } from "@/components/layout/Sidebar";

import {
  LayoutDashboard,
  ShoppingCart,
  Table2,
  UtensilsCrossed,
  Users,
  Truck,
  Package,
  DollarSign,
  Users2,
  BarChart3,
  Settings,
  LogOut,
  ChevronDown,
  Bell,
  User,
} from "lucide-react";

/**
 * Navigation items configuration for the admin sidebar
 * Organized by feature area with support for active state detection
 */
const getNavItems = (pathname: string): SidebarNavItem[] => {
  const isActive = (href: string, exact: boolean = false): boolean => {
    if (exact) return pathname === href;
    if (href === "/admin") return pathname === "/admin";
    return pathname.startsWith(href);
  };

  return [
    {
      href: "/admin",
      label: "Dashboard",
      icon: <LayoutDashboard className="h-4 w-4" />,
      active: isActive("/admin", true),
    },
    {
      href: "/admin/pedidos",
      label: "Pedidos",
      icon: <ShoppingCart className="h-4 w-4" />,
      active: isActive("/admin/pedidos"),
      submenu: [
        {
          href: "/admin/pedidos/salao",
          label: "Salão",
        },
        {
          href: "/admin/pedidos/delivery",
          label: "Delivery",
        },
        {
          href: "/admin/pedidos/balcao",
          label: "Balcão",
        },
      ],
    },
    {
      href: "/admin/mesas",
      label: "Mesas",
      icon: <Table2 className="h-4 w-4" />,
      active: isActive("/admin/mesas"),
    },
    {
      href: "/admin/cardapio/produtos",
      label: "Cardápio",
      icon: <UtensilsCrossed className="h-4 w-4" />,
      active: isActive("/admin/cardapio"),
    },
    {
      href: "/admin/settings",
      label: "Configurações",
      icon: <Settings className="h-4 w-4" />,
      active: isActive("/admin/settings"),
    },
  ];
};

/**
 * Sidebar Header Component
 * Displays the app logo and name
 */
function SidebarHeaderContent() {
  return (
    <div className="flex items-center gap-2">
      <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-primary">
        <span className="text-sm font-bold text-primary-foreground">R</span>
      </div>
      <span className="text-lg font-bold text-foreground">RXSAAS</span>
    </div>
  );
}

/**
 * Sidebar Footer Component
 * Displays copyright and logout button
 */
function SidebarFooterContent() {
  return (
    <div className="flex flex-col gap-3">
      <button
        onClick={() => signOut({ callbackUrl: "/login" })}
        className="flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium text-foreground transition-colors hover:bg-muted"
        aria-label="Logout"
      >
        <LogOut className="h-4 w-4" />
        <span>Sair</span>
      </button>
      <p className="px-3 py-1 text-xs text-muted-foreground">
        © 2026 RXSAAS
      </p>
    </div>
  );
}

/**
 * Navbar Actions
 * Action buttons displayed in the navbar
 */
const getNavbarActions = (): NavbarAction[] => [
  {
    icon: <Bell className="h-4 w-4" />,
    label: "Notificações",
    onClick: () => {
      console.log("Notifications clicked");
    },
  },
  {
    icon: <User className="h-4 w-4" />,
    label: "Perfil",
    onClick: () => {
      console.log("Profile clicked");
    },
  },
];

/**
 * AdminLayout Component
 * Main layout wrapper for all admin pages
 * Provides responsive design with sidebar, navbar, and content area
 */
export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}): React.ReactNode {
  const pathname = usePathname();
  const navItems = getNavItems(pathname);
  const navbarActions = getNavbarActions();

  return (
    <AppLayout
      navbarProps={{
        title: "Admin",
        subtitle: "Painel de Administração",
        searchPlaceholder: "Buscar...",
        actions: navbarActions,
      }}
      sidebarProps={{
        items: navItems,
        header: <SidebarHeaderContent />,
        footer: <SidebarFooterContent />,
      }}
    >
      <div className="p-6 animate-in fade-in">
        {children}
      </div>
    </AppLayout>
  );
}
