"use client"

import * as React from "react"
import { cn } from "@/lib/utils"
import { Navbar, type NavbarProps } from "./Navbar"
import { Sidebar, type SidebarProps } from "./Sidebar"

interface AppLayoutProps {
  children: React.ReactNode
  navbarProps?: NavbarProps
  sidebarProps?: SidebarProps
  showSidebar?: boolean
  className?: string
}

function AppLayout({
  children,
  navbarProps,
  sidebarProps,
  showSidebar = true,
  className,
}: AppLayoutProps) {
  return (
    <div
      data-slot="app-layout"
      className={cn(
        "relative flex h-screen overflow-hidden bg-background",
        className
      )}
    >
      {/* Navbar */}
      <Navbar {...navbarProps} />

      {/* Main Content Area */}
      <div
        data-slot="app-layout-content"
        className={cn(
          "flex-1 flex overflow-hidden pt-[72px]",
          showSidebar && "pl-64"
        )}
      >
        {/* Sidebar */}
        {showSidebar && <Sidebar {...sidebarProps} />}

        {/* Page Content */}
        <main
          data-slot="app-layout-main"
          className="flex-1 overflow-y-auto"
        >
          <div className="min-h-full">
            {children}
          </div>
        </main>
      </div>
    </div>
  )
}

export { AppLayout, type AppLayoutProps }
