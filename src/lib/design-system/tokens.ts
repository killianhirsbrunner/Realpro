export const designTokens = {
  colors: {
    light: {
      background: '#eeede9',
      foreground: '#1b1b1b',
      primary: '#1b1b1b',
      secondary: '#c9c8c3',
      accent: '#6b7280',
      border: '#d7d6d2',
    },
    dark: {
      background: '#1b1b1b',
      foreground: '#eeede9',
      primary: '#eeede9',
      secondary: '#2a2a2a',
      accent: '#d1d5db',
      border: '#2e2e2e',
    },
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
    glow: '0 0 20px rgba(59, 178, 115, 0.3)',
  },

  typography: {
    fontFamily: 'Inter, SF Pro Display, system-ui, sans-serif',
    sizes: {
      xs: '0.75rem',
      sm: '0.875rem',
      base: '1rem',
      lg: '1.125rem',
      xl: '1.25rem',
      '2xl': '1.5rem',
      '3xl': '1.875rem',
      '4xl': '2.25rem',
      '5xl': '3rem',
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
    xs: '0.25rem',
    sm: '0.5rem',
    md: '1rem',
    lg: '1.5rem',
    xl: '2rem',
    '2xl': '3rem',
    '3xl': '4rem',
  },

  transitions: {
    fast: '150ms ease-out',
    normal: '200ms ease-out',
    slow: '300ms ease-out',
  },
} as const;

export type DesignTokens = typeof designTokens;
