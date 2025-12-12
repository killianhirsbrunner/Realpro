/**
 * Design Tokens for Realpro Suite
 * Premium Apple-like Design System
 *
 * These tokens define the visual language of the design system
 * following WCAG 2.1 AA accessibility guidelines
 */

// ═══════════════════════════════════════════════════════════════════════════
// COLOR PALETTE
// ═══════════════════════════════════════════════════════════════════════════

export const colors = {
  // Brand colors - Realpro Turquoise
  brand: {
    25: '#F0FAFB',
    50: '#E6F7F9',
    100: '#CCF0F4',
    200: '#99E0E8',
    300: '#66D1DD',
    400: '#3DAABD',
    500: '#2D8A9A',
    600: '#236B78',
    700: '#1A4D56',
    800: '#102F34',
    900: '#081012',
    950: '#040809',
  },

  // Neutral grays - warm-tinted for premium feel
  neutral: {
    0: '#FFFFFF',
    25: '#FCFCFC',
    50: '#FAFAFA',
    100: '#F5F5F5',
    150: '#EDEDED',
    200: '#E5E5E5',
    300: '#D4D4D4',
    400: '#A3A3A3',
    500: '#737373',
    600: '#525252',
    700: '#404040',
    800: '#262626',
    900: '#171717',
    950: '#0A0A0A',
  },

  // Semantic colors
  success: {
    25: '#F6FEF9',
    50: '#ECFDF5',
    100: '#D1FAE5',
    200: '#A7F3D0',
    300: '#6EE7B7',
    400: '#34D399',
    500: '#10B981',
    600: '#059669',
    700: '#047857',
    800: '#065F46',
    900: '#064E3B',
  },

  warning: {
    25: '#FFFCF5',
    50: '#FFFBEB',
    100: '#FEF3C7',
    200: '#FDE68A',
    300: '#FCD34D',
    400: '#FBBF24',
    500: '#F59E0B',
    600: '#D97706',
    700: '#B45309',
    800: '#92400E',
    900: '#78350F',
  },

  error: {
    25: '#FFFBFA',
    50: '#FEF2F2',
    100: '#FEE2E2',
    200: '#FECACA',
    300: '#FCA5A5',
    400: '#F87171',
    500: '#EF4444',
    600: '#DC2626',
    700: '#B91C1C',
    800: '#991B1B',
    900: '#7F1D1D',
  },

  info: {
    25: '#F5FAFF',
    50: '#EFF6FF',
    100: '#DBEAFE',
    200: '#BFDBFE',
    300: '#93C5FD',
    400: '#60A5FA',
    500: '#3B82F6',
    600: '#2563EB',
    700: '#1D4ED8',
    800: '#1E40AF',
    900: '#1E3A8A',
  },
} as const;

// ═══════════════════════════════════════════════════════════════════════════
// SPACING SCALE (8px base unit)
// ═══════════════════════════════════════════════════════════════════════════

export const spacing = {
  0: '0',
  px: '1px',
  0.5: '0.125rem',  // 2px
  1: '0.25rem',     // 4px
  1.5: '0.375rem',  // 6px
  2: '0.5rem',      // 8px - base unit
  2.5: '0.625rem',  // 10px
  3: '0.75rem',     // 12px
  3.5: '0.875rem',  // 14px
  4: '1rem',        // 16px
  5: '1.25rem',     // 20px
  6: '1.5rem',      // 24px
  7: '1.75rem',     // 28px
  8: '2rem',        // 32px
  9: '2.25rem',     // 36px
  10: '2.5rem',     // 40px
  11: '2.75rem',    // 44px
  12: '3rem',       // 48px
  14: '3.5rem',     // 56px
  16: '4rem',       // 64px
  20: '5rem',       // 80px
  24: '6rem',       // 96px
  28: '7rem',       // 112px
  32: '8rem',       // 128px
  36: '9rem',       // 144px
  40: '10rem',      // 160px
  44: '11rem',      // 176px
  48: '12rem',      // 192px
  52: '13rem',      // 208px
  56: '14rem',      // 224px
  60: '15rem',      // 240px
  64: '16rem',      // 256px
  72: '18rem',      // 288px
  80: '20rem',      // 320px
  96: '24rem',      // 384px
} as const;

// ═══════════════════════════════════════════════════════════════════════════
// BORDER RADIUS
// ═══════════════════════════════════════════════════════════════════════════

export const borderRadius = {
  none: '0',
  xs: '0.125rem',   // 2px
  sm: '0.25rem',    // 4px
  DEFAULT: '0.5rem', // 8px
  md: '0.5rem',     // 8px
  lg: '0.75rem',    // 12px
  xl: '1rem',       // 16px
  '2xl': '1.25rem', // 20px
  '3xl': '1.5rem',  // 24px
  full: '9999px',
} as const;

// ═══════════════════════════════════════════════════════════════════════════
// TYPOGRAPHY SCALE
// ═══════════════════════════════════════════════════════════════════════════

export const fontFamily = {
  sans: ['Inter', '-apple-system', 'BlinkMacSystemFont', 'SF Pro Display', 'Segoe UI', 'Roboto', 'sans-serif'],
  mono: ['SF Mono', 'Menlo', 'Monaco', 'Consolas', 'Liberation Mono', 'Courier New', 'monospace'],
} as const;

export const fontWeight = {
  normal: '400',
  medium: '500',
  semibold: '600',
  bold: '700',
} as const;

export const fontSize = {
  // Text sizes
  xs: ['0.75rem', { lineHeight: '1rem', letterSpacing: '0.01em' }],        // 12px
  sm: ['0.875rem', { lineHeight: '1.25rem', letterSpacing: '0' }],         // 14px
  base: ['1rem', { lineHeight: '1.5rem', letterSpacing: '0' }],            // 16px
  lg: ['1.125rem', { lineHeight: '1.75rem', letterSpacing: '-0.01em' }],   // 18px
  xl: ['1.25rem', { lineHeight: '1.75rem', letterSpacing: '-0.01em' }],    // 20px

  // Display sizes
  '2xl': ['1.5rem', { lineHeight: '2rem', letterSpacing: '-0.02em' }],     // 24px
  '3xl': ['1.875rem', { lineHeight: '2.25rem', letterSpacing: '-0.02em' }], // 30px
  '4xl': ['2.25rem', { lineHeight: '2.5rem', letterSpacing: '-0.02em' }],  // 36px
  '5xl': ['3rem', { lineHeight: '3.5rem', letterSpacing: '-0.02em' }],     // 48px
  '6xl': ['3.75rem', { lineHeight: '4rem', letterSpacing: '-0.02em' }],    // 60px
} as const;

// ═══════════════════════════════════════════════════════════════════════════
// SHADOWS (Apple-like, subtle)
// ═══════════════════════════════════════════════════════════════════════════

export const shadows = {
  none: 'none',
  xs: '0 1px 2px 0 rgb(0 0 0 / 0.03)',
  sm: '0 1px 3px 0 rgb(0 0 0 / 0.05), 0 1px 2px -1px rgb(0 0 0 / 0.03)',
  DEFAULT: '0 2px 4px -1px rgb(0 0 0 / 0.06), 0 1px 2px -1px rgb(0 0 0 / 0.03)',
  md: '0 4px 8px -2px rgb(0 0 0 / 0.08), 0 2px 4px -2px rgb(0 0 0 / 0.04)',
  lg: '0 8px 16px -4px rgb(0 0 0 / 0.1), 0 4px 8px -4px rgb(0 0 0 / 0.05)',
  xl: '0 16px 32px -8px rgb(0 0 0 / 0.12), 0 8px 16px -8px rgb(0 0 0 / 0.06)',
  '2xl': '0 24px 48px -12px rgb(0 0 0 / 0.15)',

  // Colored shadows for interactive elements
  brand: '0 4px 14px 0 rgb(61 170 189 / 0.3)',
  success: '0 4px 14px 0 rgb(16 185 129 / 0.3)',
  error: '0 4px 14px 0 rgb(239 68 68 / 0.3)',

  // Card shadows
  card: '0 1px 3px rgb(0 0 0 / 0.04), 0 1px 2px rgb(0 0 0 / 0.02)',
  cardHover: '0 4px 12px rgb(0 0 0 / 0.08), 0 2px 4px rgb(0 0 0 / 0.04)',
  panel: '0 8px 24px rgb(0 0 0 / 0.08), 0 4px 8px rgb(0 0 0 / 0.04)',
  modal: '0 20px 40px -8px rgb(0 0 0 / 0.2), 0 10px 20px -10px rgb(0 0 0 / 0.1)',

  // Inner shadow
  inner: 'inset 0 1px 2px 0 rgb(0 0 0 / 0.05)',
  innerLg: 'inset 0 2px 4px 0 rgb(0 0 0 / 0.08)',
} as const;

// ═══════════════════════════════════════════════════════════════════════════
// Z-INDEX SCALE
// ═══════════════════════════════════════════════════════════════════════════

export const zIndex = {
  hide: -1,
  base: 0,
  docked: 10,
  dropdown: 1000,
  sticky: 1100,
  banner: 1200,
  overlay: 1300,
  modal: 1400,
  popover: 1500,
  skipLink: 1600,
  toast: 1700,
  tooltip: 1800,
} as const;

// ═══════════════════════════════════════════════════════════════════════════
// TRANSITIONS & ANIMATIONS
// ═══════════════════════════════════════════════════════════════════════════

export const transitions = {
  // Durations
  duration: {
    instant: '0ms',
    fast: '100ms',
    normal: '150ms',
    moderate: '200ms',
    slow: '300ms',
    slower: '400ms',
    slowest: '500ms',
  },

  // Easings (Apple-like)
  easing: {
    linear: 'linear',
    easeIn: 'cubic-bezier(0.4, 0, 1, 1)',
    easeOut: 'cubic-bezier(0, 0, 0.2, 1)',
    easeInOut: 'cubic-bezier(0.4, 0, 0.2, 1)',
    // Apple-like spring curves
    spring: 'cubic-bezier(0.175, 0.885, 0.32, 1.275)',
    bounce: 'cubic-bezier(0.68, -0.55, 0.265, 1.55)',
    smooth: 'cubic-bezier(0.25, 0.1, 0.25, 1)',
  },

  // Pre-composed transitions
  fast: '100ms cubic-bezier(0.4, 0, 0.2, 1)',
  normal: '150ms cubic-bezier(0.4, 0, 0.2, 1)',
  moderate: '200ms cubic-bezier(0.4, 0, 0.2, 1)',
  slow: '300ms cubic-bezier(0.4, 0, 0.2, 1)',
} as const;

// ═══════════════════════════════════════════════════════════════════════════
// BREAKPOINTS (Mobile-first)
// ═══════════════════════════════════════════════════════════════════════════

export const breakpoints = {
  xs: '475px',   // Small phones
  sm: '640px',   // Large phones
  md: '768px',   // Tablets
  lg: '1024px',  // Laptops
  xl: '1280px',  // Desktops
  '2xl': '1536px', // Large screens
} as const;

// ═══════════════════════════════════════════════════════════════════════════
// LAYOUT CONSTANTS
// ═══════════════════════════════════════════════════════════════════════════

export const layout = {
  // Sidebar widths
  sidebarCollapsed: '64px',
  sidebarExpanded: '256px',

  // Header height
  headerHeight: '64px',

  // Container max widths
  containerXs: '475px',
  containerSm: '640px',
  containerMd: '768px',
  containerLg: '1024px',
  containerXl: '1280px',
  container2xl: '1536px',

  // Content max widths
  contentNarrow: '672px',  // 42rem - for reading
  contentDefault: '896px', // 56rem - for forms
  contentWide: '1152px',   // 72rem - for tables
  contentFull: '100%',

  // Grid
  gridGap: '1.5rem', // 24px
  gridColumns: 12,
} as const;

// ═══════════════════════════════════════════════════════════════════════════
// FOCUS STYLES (Accessibility)
// ═══════════════════════════════════════════════════════════════════════════

export const focus = {
  ring: '0 0 0 2px rgb(255 255 255), 0 0 0 4px rgb(61 170 189)',
  ringDark: '0 0 0 2px rgb(23 23 23), 0 0 0 4px rgb(61 170 189)',
  ringError: '0 0 0 2px rgb(255 255 255), 0 0 0 4px rgb(239 68 68)',
  ringOffset: '2px',
} as const;

// ═══════════════════════════════════════════════════════════════════════════
// COMPONENT SPECIFIC TOKENS
// ═══════════════════════════════════════════════════════════════════════════

export const components = {
  // Button
  button: {
    height: {
      xs: '28px',
      sm: '32px',
      md: '40px',
      lg: '48px',
      xl: '56px',
    },
    paddingX: {
      xs: '10px',
      sm: '12px',
      md: '16px',
      lg: '20px',
      xl: '24px',
    },
  },

  // Input
  input: {
    height: {
      sm: '32px',
      md: '40px',
      lg: '48px',
    },
    paddingX: '12px',
  },

  // Avatar
  avatar: {
    size: {
      xs: '24px',
      sm: '32px',
      md: '40px',
      lg: '48px',
      xl: '64px',
      '2xl': '96px',
    },
  },

  // Badge
  badge: {
    height: {
      sm: '20px',
      md: '24px',
      lg: '28px',
    },
  },

  // Card
  card: {
    padding: {
      sm: '12px',
      md: '16px',
      lg: '24px',
    },
  },

  // Icon
  icon: {
    size: {
      xs: '12px',
      sm: '16px',
      md: '20px',
      lg: '24px',
      xl: '32px',
    },
  },

  // Table
  table: {
    rowHeight: {
      sm: '40px',
      md: '52px',
      lg: '64px',
    },
    headerHeight: '44px',
  },
} as const;

// ═══════════════════════════════════════════════════════════════════════════
// EXPORT ALL TOKENS
// ═══════════════════════════════════════════════════════════════════════════

export const tokens = {
  colors,
  spacing,
  borderRadius,
  fontFamily,
  fontWeight,
  fontSize,
  shadows,
  zIndex,
  transitions,
  breakpoints,
  layout,
  focus,
  components,
} as const;

export default tokens;
