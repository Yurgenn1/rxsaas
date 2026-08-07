"use client"

import * as React from "react"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { SearchIcon, BellIcon, SettingsIcon, UserIcon } from "lucide-react"

interface NavbarAction {
  icon: React.ReactNode
  label: string
  onClick?: () => void
  href?: string
}

interface NavbarProps extends React.ComponentProps<"header"> {
  title?: string
  subtitle?: string
  searchPlaceholder?: string
  onSearch?: (value: string) => void
  actions?: NavbarAction[]
  userMenu?: React.ReactNode
}

function Navbar({
  title,
  subtitle,
  searchPlaceholder = "Search...",
  onSearch,
  actions,
  userMenu,
  className,
  ...props
}: NavbarProps) {
  const [searchValue, setSearchValue] = React.useState("")

  const handleSearch = (value: string) => {
    setSearchValue(value)
    onSearch?.(value)
  }

  return (
    <header
      data-slot="navbar"
      className={cn(
        "fixed top-0 left-0 right-0 z-50 h-[72px] border-b border-border bg-card",
        className
      )}
      {...props}
    >
      <div className="flex h-full items-center justify-between gap-4 px-6">
        {/* Left Section - Title/Breadcrumb */}
        <div data-slot="navbar-left" className="flex items-center gap-4">
          {title && (
            <div className="hidden sm:flex flex-col gap-0.5">
              <h1 className="font-semibold text-foreground">{title}</h1>
              {subtitle && (
                <p className="text-xs text-muted-foreground">{subtitle}</p>
              )}
            </div>
          )}
        </div>

        {/* Center Section - Search */}
        {onSearch && (
          <div
            data-slot="navbar-search"
            className="hidden md:flex flex-1 max-w-xs"
          >
            <div className="relative w-full">
              <SearchIcon className="absolute left-2.5 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground pointer-events-none" />
              <Input
                placeholder={searchPlaceholder}
                value={searchValue}
                onChange={(e) => handleSearch(e.target.value)}
                className="pl-8 h-8"
              />
            </div>
          </div>
        )}

        {/* Right Section - Actions & User Menu */}
        <div data-slot="navbar-right" className="flex items-center gap-2">
          {actions && actions.length > 0 && (
            <div data-slot="navbar-actions" className="flex items-center gap-1">
              {actions.map((action, index) => (
                <Button
                  key={index}
                  variant="ghost"
                  size="icon"
                  onClick={action.onClick}
                  aria-label={action.label}
                  title={action.label}
                  className="h-8 w-8"
                >
                  {action.icon}
                </Button>
              ))}
            </div>
          )}

          {userMenu && (
            <div data-slot="navbar-user">{userMenu}</div>
          )}
        </div>
      </div>
    </header>
  )
}

export { Navbar, type NavbarAction, type NavbarProps }
