"use client"

import * as React from "react"
import { cn } from "@/lib/utils"
import Link from "next/link"

interface SidebarNavItem {
  href: string
  label: string
  icon?: React.ReactNode
  active?: boolean
}

interface SidebarProps extends React.ComponentProps<"aside"> {
  items?: SidebarNavItem[]
  header?: React.ReactNode
  footer?: React.ReactNode
}

function Sidebar({
  items = [],
  header,
  footer,
  className,
  ...props
}: SidebarProps) {
  return (
    <aside
      data-slot="sidebar"
      className={cn(
        "fixed left-0 top-0 z-40 h-screen w-64 overflow-y-auto border-r border-border bg-card pt-[72px] transition-all duration-300",
        "flex flex-col",
        className
      )}
      {...props}
    >
      {/* Sidebar Header */}
      {header && (
        <div data-slot="sidebar-header" className="border-b border-border px-4 py-3">
          {header}
        </div>
      )}

      {/* Navigation Items */}
      <nav data-slot="sidebar-nav" className="flex-1 overflow-y-auto px-3 py-4">
        <ul className="space-y-1">
          {items.map((item, index) => (
            <li key={index}>
              <Link
                href={item.href}
                className={cn(
                  "group/nav-item flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium transition-colors",
                  item.active
                    ? "bg-primary text-primary-foreground"
                    : "text-foreground hover:bg-muted hover:text-foreground"
                )}
                aria-current={item.active ? "page" : undefined}
              >
                {item.icon && (
                  <span className="flex h-4 w-4 items-center justify-center">
                    {item.icon}
                  </span>
                )}
                <span>{item.label}</span>
              </Link>
            </li>
          ))}
        </ul>
      </nav>

      {/* Sidebar Footer */}
      {footer && (
        <div
          data-slot="sidebar-footer"
          className="border-t border-border px-4 py-3"
        >
          {footer}
        </div>
      )}
    </aside>
  )
}

export { Sidebar, type SidebarNavItem, type SidebarProps }
