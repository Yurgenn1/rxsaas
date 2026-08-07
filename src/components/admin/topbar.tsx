"use client";

import { usePathname } from "next/navigation";

import { SidebarTrigger } from "@/components/ui/sidebar";
import { Separator } from "@/components/ui/separator";

const labels: Record<string, string> = {
  admin: "Dashboard",
  categories: "Categorias",
  products: "Produtos",
  orders: "Pedidos",
  create: "Criar",
};

function useBreadcrumb(pathname: string) {
  const segments = pathname.split("/").filter(Boolean);
  return segments.map((segment, index) => {
    const isDynamic = !labels[segment];
    return {
      label: isDynamic ? "Detalhes" : labels[segment],
      isLast: index === segments.length - 1,
    };
  });
}

export function Topbar() {
  const pathname = usePathname();
  const crumbs = useBreadcrumb(pathname);

  return (
    <header className="flex h-14 shrink-0 items-center gap-2 border-b border-border bg-background px-4 sticky top-0 z-40">
      <SidebarTrigger />
      <Separator orientation="vertical" className="h-4 mx-1" />
      <nav className="flex items-center gap-1.5 text-sm">
        {crumbs.map((crumb, index) => (
          <span key={index} className="flex items-center gap-1.5">
            {index > 0 && <span className="text-muted-foreground">/</span>}
            <span
              className={
                crumb.isLast
                  ? "font-medium text-foreground"
                  : "text-muted-foreground"
              }
            >
              {crumb.label}
            </span>
          </span>
        ))}
      </nav>
    </header>
  );
}
