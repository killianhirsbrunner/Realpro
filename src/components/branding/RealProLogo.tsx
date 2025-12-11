/**
 * RealPro | Official Logo Component
 * © 2024-2025 Realpro SA. Tous droits réservés.
 * Modern Cloud Design
 */

interface RealProLogoProps {
  variant?: 'full' | 'icon' | 'text';
  size?: 'xs' | 'sm' | 'md' | 'lg' | 'xl';
  className?: string;
  theme?: 'light' | 'dark' | 'auto';
}

const sizeConfig = {
  xs: { height: 24, iconSize: 24 },
  sm: { height: 32, iconSize: 32 },
  md: { height: 40, iconSize: 40 },
  lg: { height: 48, iconSize: 48 },
  xl: { height: 64, iconSize: 64 },
};

// RealPro brand colors
const BRAND_COLOR = '#3DAABD';
const BRAND_COLOR_DARK = '#2E8A9A';
const BRAND_COLOR_LIGHT = '#5BC4D6';

export function RealProLogo({
  variant = 'full',
  size = 'md',
  className = '',
  theme = 'auto'
}: RealProLogoProps) {
  const config = sizeConfig[size];

  // Determine text colors based on theme
  const getTextColor = () => {
    if (theme === 'light') return '#1A1A1A';
    if (theme === 'dark') return '#A8B5BD';
    // Auto: use CSS for dark mode detection
    return 'currentColor';
  };

  const RealProIconSVG = ({ iconSize }: { iconSize: number }) => (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 100 70"
      fill="none"
      width={iconSize}
      height={iconSize * 0.7}
      className="flex-shrink-0"
    >
      <defs>
        <linearGradient id="cloudGradient" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor={BRAND_COLOR_LIGHT} />
          <stop offset="50%" stopColor={BRAND_COLOR} />
          <stop offset="100%" stopColor={BRAND_COLOR_DARK} />
        </linearGradient>
        <linearGradient id="cloudGradientInner" x1="0%" y1="100%" x2="100%" y2="0%">
          <stop offset="0%" stopColor={BRAND_COLOR_DARK} />
          <stop offset="100%" stopColor={BRAND_COLOR} />
        </linearGradient>
      </defs>

      {/* Modern Cloud Shape - Main body */}
      <path
        d="M82 45c0-2.5-0.5-4.8-1.4-7 0.9-2.2 1.4-4.5 1.4-7 0-11-9-20-20-20-3 0-5.8 0.7-8.3 1.9C50.5 7.6 44.8 4 38 4c-11 0-20 9-20 20 0 1.4 0.2 2.7 0.4 4C10.6 30.5 5 37.5 5 46c0 11 9 20 20 20h52c8.3 0 15-6.7 15-15 0-2.2-0.5-4.2-1.3-6H82z"
        fill="url(#cloudGradient)"
      />

      {/* Inner cloud highlight for depth */}
      <path
        d="M77 50c0-6.6-5.4-12-12-12-1.5 0-2.9 0.3-4.2 0.8-2.8-4.8-8-8-14-8-6.5 0-12 3.8-14.5 9.3C30.5 39.4 28.3 39 26 39c-7.2 0-13 5.8-13 13 0 1.1 0.1 2.2 0.4 3.2 0.8-0.1 1.6-0.2 2.4-0.2h52c3.5 0 6.7-1.2 9.2-3.2V50z"
        fill="url(#cloudGradientInner)"
        opacity="0.4"
      />

      {/* Subtle shine effect */}
      <ellipse cx="35" cy="25" rx="12" ry="6" fill="white" opacity="0.2" />
    </svg>
  );

  if (variant === 'icon') {
    return (
      <div className={className}>
        <RealProIconSVG iconSize={config.iconSize} />
      </div>
    );
  }

  if (variant === 'text') {
    const fontSize = config.height * 0.6;
    return (
      <div className={`flex items-center ${className}`}>
        <span
          className="font-bold text-neutral-900 dark:text-neutral-300"
          style={{ fontSize: `${fontSize}px` }}
        >
          Real
        </span>
        <span
          className="font-bold"
          style={{ fontSize: `${fontSize}px`, color: BRAND_COLOR }}
        >
          Pro
        </span>
      </div>
    );
  }

  // Full variant: icon + text
  const fontSize = config.height * 0.55;
  return (
    <div className={`flex items-center gap-2 ${className}`}>
      <RealProIconSVG iconSize={config.iconSize * 0.8} />
      <div className="flex items-center">
        <span
          className="font-bold text-neutral-900 dark:text-neutral-300"
          style={{ fontSize: `${fontSize}px` }}
        >
          Real
        </span>
        <span
          className="font-bold"
          style={{ fontSize: `${fontSize}px`, color: BRAND_COLOR }}
        >
          Pro
        </span>
      </div>
    </div>
  );
}

// Simplified icon component for backwards compatibility
export function RealProIcon({
  className = '',
  size = 'md'
}: {
  className?: string;
  size?: 'sm' | 'md' | 'lg' | 'xl';
}) {
  return <RealProLogo variant="icon" size={size} className={className} />;
}

export default RealProLogo;
