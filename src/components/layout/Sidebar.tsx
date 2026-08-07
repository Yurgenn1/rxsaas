"use client"

import * as React from "react"
import { cn } from "@/lib/utils"
import Link from "next/link"
import { ChevronDown } from "lucide-react"

interface SubMenuItem {
  href: string
  label: string
}

interface SidebarNavItem {
  href: string
  label: string
  icon?: React.ReactNode
  active?: boolean
  submenu?: SubMenuItem[]
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
  const [expandedItems, setExpandedItems] = React.useState<Set<string>>(new Set())

  const toggleExpanded = (label: string) => {
    const newExpanded = new Set(expandedItems)
    if (newExpanded.has(label)) {
      newExpanded.delete(label)
    } else {
      newExpanded.add(label)
    }
    setExpandedItems(newExpanded)
  }

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
          {items.map((item, index) => {
            const hasSubmenu = item.submenu && item.submenu.length > 0
            const isExpanded = expandedItems.has(item.label)

            return (
              <li key={index}>
                <div className="relative">
                  {hasSubmenu ? (
                    <button
                      onClick={() => toggleExpanded(item.label)}
                      className={cn(
                        "group/nav-item flex w-full items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium transition-colors",
                        item.active
                          ? "bg-primary text-primary-foreground"
                          : "text-foreground hover:bg-muted hover:text-foreground"
                      )}
                    >
                      {item.icon && (
                        <span className="flex h-4 w-4 items-center justify-center">
                          {item.icon}
                        </span>
                      )}
                      <span className="flex-1 text-left">{item.label}</span>
                      <ChevronDown
                        className={cn(
                          "h-4 w-4 transition-transform",
                          isExpanded && "rotate-180"
                        )}
                      />
                    </button>
                  ) : (
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
                  )}
                </div>

                {/* Submenu Items */}
                {hasSubmenu && isExpanded && (
                  <ul className="mt-1 space-y-1 pl-6">
                    {item.submenu?.map((subitem, subindex) => (
                      <li key={subindex}>
                        <Link
                          href={subitem.href}
                          className={cn(
                            "flex items-center rounded-lg px-3 py-2 text-sm transition-colors",
                            "text-foreground/70 hover:text-foreground hover:bg-muted"
                          )}
                        >
                          {subitem.label}
                        </Link>
                      </li>
                    ))}
                  </ul>
                )}
              </li>
            )
          })}
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
