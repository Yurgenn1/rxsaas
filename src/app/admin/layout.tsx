import type { Metadata } from "next";

import { AppSidebar } from "@/components/admin/app-sidebar";
import { Topbar } from "@/components/admin/topbar";
import { SidebarInset, SidebarProvider } from "@/components/ui/sidebar";

export const metadata: Metadata = {
  title: "Admin - RXSAAS",
  description: "Painel administrativo do RXSAAS",
};

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <SidebarProvider>
      <AppSidebar />
      <SidebarInset>
        <Topbar />
        <main className="flex-1 p-6">{children}</main>
      </SidebarInset>
    </SidebarProvider>
  );
}
