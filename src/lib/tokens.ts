/**
 * RXSAAS Design System Color Tokens
 * These tokens define the core color palette for the design system
 */

export const designTokens = {
  // Primary Colors
  primary: {
    50: "#faf5ff",
    100: "#f3e8ff",
    200: "#e9d5ff",
    300: "#d8b4fe",
    400: "#c084fc",
    500: "#8B5CF6", // Primary
    600: "#7c3aed",
    700: "#6d28d9",
    800: "#5b21b6",
    900: "#4c1d95",
  },

  // Semantic Colors
  success: "#22C55E",
  warning: "#F59E0B",
  error: "#EF4444",
  info: "#3B82F6",

  // Neutral Colors
  background: "#F8FAFC",
  card: "#FFFFFF",
  border: "#E2E8F0",
  textPrimary: "#1E293B",
  textSecondary: "#64748B",

  // Dark Mode Variants
  dark: {
    background: "#0F172A",
    card: "#1E293B",
    border: "#334155",
    textPrimary: "#F1F5F9",
    textSecondary: "#CBD5E1",
  },
} as const

// Color utility functions
export const getColorByVariant = (variant: string): string => {
  const colorMap: Record<string, string> = {
    default: designTokens.primary[500],
    primary: designTokens.primary[500],
    secondary: "#E2E8F0",
    success: designTokens.success,
    warning: designTokens.warning,
    error: designTokens.error,
    info: designTokens.info,
    outline: "transparent",
    ghost: "transparent",
  }
  return colorMap[variant] || designTokens.primary[500]
}

export const getTextColorByVariant = (variant: string): string => {
  const colorMap: Record<string, string> = {
    default: "#FFFFFF",
    primary: "#FFFFFF",
    secondary: designTokens.textPrimary,
    success: "#FFFFFF",
    warning: "#FFFFFF",
    error: "#FFFFFF",
    info: "#FFFFFF",
    outline: designTokens.textPrimary,
    ghost: designTokens.textPrimary,
  }
  return colorMap[variant] || "#FFFFFF"
}
