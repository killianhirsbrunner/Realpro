// RealPro Design System - Enhanced Premium Tokens
export const designTokens = {
  colors: {
    // Light Mode
    light: {
      background: '#eeede9',
      foreground: '#1b1b1b',
      primary: '#1b1b1b',
      secondary: '#c9c8c3',
      accent: '#6b7280',
      border: '#d7d6d2',

      // Brand colors - Realpro Turquoise Official: #3DAABD
      brand: '#3DAABD',
      brandLight: '#5BC4D6',
      brandDark: '#2E8A9A',

      // Semantic colors
      success: '#10b981',
      successLight: '#34d399',
      warning: '#f59e0b',
      warningLight: '#fbbf24',
      danger: '#ef4444',
      dangerLight: '#f87171',
      info: '#0891b2',
      infoLight: '#06b6d4',
    },

    // Dark Mode
    dark: {
      background: '#1b1b1b',
      foreground: '#eeede9',
      primary: '#eeede9',
      secondary: '#2a2a2a',
      accent: '#d1d5db',
      border: '#2e2e2e',

      // Brand colors - Realpro Turquoise Official: #3DAABD
      brand: '#5BC4D6',
      brandLight: '#7DD4E5',
      brandDark: '#3DAABD',

      // Semantic colors
      success: '#10b981',
      successLight: '#34d399',
      warning: '#f59e0b',
      warningLight: '#fbbf24',
      danger: '#ef4444',
      dangerLight: '#f87171',
      info: '#06b6d4',
      infoLight: '#22d3ee',
    },

    // Status colors (mode-independent)
    status: {
      // CRM Pipeline
      prospect: '#8b5cf6',     // Purple
      interested: '#0891b2',   // Turquoise
      reserved: '#f59e0b',     // Amber
      sold: '#10b981',         // Green
      lost: '#ef4444',         // Red

      // Lot Status
      available: '#10b981',    // Green
      lotReserved: '#f59e0b',  // Amber
      lotSold: '#0891b2',      // Turquoise
      blocked: '#ef4444',      // Red

      // Financial Status
      paid: '#10b981',         // Green
      pending: '#f59e0b',      // Amber
      overdue: '#ef4444',      // Red
      draft: '#6b7280',        // Gray
    },

    // Data Visualization (8 distinct colors for charts)
    chart: [
      '#0891b2', // Turquoise (primary)
      '#10b981', // Green
      '#f59e0b', // Amber
      '#ef4444', // Red
      '#8b5cf6', // Purple
      '#14b8a6', // Teal
      '#ec4899', // Pink
      '#f97316', // Orange
    ],
  },

  radius: {
    sm: '0.5rem',
    md: '0.75rem',
    lg: '1rem',
    xl: '1.25rem',
    '2xl': '1.5rem',
    '3xl': '2rem',
  },

  shadows: {
    soft: '0 4px 12px rgba(0, 0, 0, 0.08)',
    card: '0 8px 18px rgba(0, 0, 0, 0.12)',
    panel: '0 12px 35px rgba(0, 0, 0, 0.18)',
    glow: '0 0 20px rgba(61, 170, 189, 0.3)',
    glowTurquoise: '0 0 20px rgba(61, 170, 189, 0.4)',
  },

  typography: {
    fontFamily: 'Inter, SF Pro Display, system-ui, sans-serif',
    sizes: {
      xs: '0.75rem',    // 12px
      sm: '0.875rem',   // 14px
      base: '1rem',     // 16px
      lg: '1.125rem',   // 18px
      xl: '1.25rem',    // 20px
      '2xl': '1.5rem',  // 24px
      '3xl': '1.875rem',// 30px
      '4xl': '2.25rem', // 36px
      '5xl': '3rem',    // 48px
    },
    weights: {
      normal: '400',
      medium: '500',
      semibold: '600',
      bold: '700',
    },
    lineHeight: {
      tight: '1.2',
      normal: '1.5',
      relaxed: '1.75',
    },
  },

  spacing: {
    xs: '0.25rem',  // 4px
    sm: '0.5rem',   // 8px
    md: '1rem',     // 16px
    lg: '1.5rem',   // 24px
    xl: '2rem',     // 32px
    '2xl': '3rem',  // 48px
    '3xl': '4rem',  // 64px
  },

  transitions: {
    fast: '150ms ease-out',
    normal: '200ms ease-out',
    slow: '300ms ease-out',
  },

  // Animation durations
  animation: {
    fast: 150,
    normal: 200,
    slow: 300,
  },
} as const;

export type DesignTokens = typeof designTokens;

// Helper function to get status color
export function getStatusColor(status: string, theme: 'light' | 'dark' = 'light'): string {
  const statusColors = designTokens.colors.status;
  const normalized = status.toLowerCase();

  // CRM statuses
  if (normalized.includes('prospect')) return statusColors.prospect;
  if (normalized.includes('intéressé') || normalized.includes('interested')) return statusColors.interested;
  if (normalized.includes('réservé') || normalized.includes('reserved')) return statusColors.reserved;
  if (normalized.includes('vendu') || normalized.includes('sold')) return statusColors.sold;
  if (normalized.includes('perdu') || normalized.includes('lost')) return statusColors.lost;

  // Lot statuses
  if (normalized.includes('disponible') || normalized.includes('available')) return statusColors.available;
  if (normalized.includes('bloqué') || normalized.includes('blocked')) return statusColors.blocked;

  // Financial statuses
  if (normalized.includes('payé') || normalized.includes('paid')) return statusColors.paid;
  if (normalized.includes('attente') || normalized.includes('pending')) return statusColors.pending;
  if (normalized.includes('retard') || normalized.includes('overdue')) return statusColors.overdue;
  if (normalized.includes('brouillon') || normalized.includes('draft')) return statusColors.draft;

  // Default
  return theme === 'light' ? designTokens.colors.light.accent : designTokens.colors.dark.accent;
}

// Helper to get semantic color
export function getSemanticColor(type: 'success' | 'warning' | 'danger' | 'info', theme: 'light' | 'dark' = 'light', variant: 'base' | 'light' = 'base'): string {
  const colors = theme === 'light' ? designTokens.colors.light : designTokens.colors.dark;

  if (variant === 'light') {
    return colors[`${type}Light` as keyof typeof colors] as string;
  }

  return colors[type as keyof typeof colors] as string;
}

// Export for easy access
export const colors = designTokens.colors;
export const spacing = designTokens.spacing;
export const typography = designTokens.typography;
export const radius = designTokens.radius;
export const shadows = designTokens.shadows;
export const transitions = designTokens.transitions;
