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
      viewBox="0 0 100 60"
      fill="none"
      width={iconSize}
      height={iconSize * 0.6}
      className="flex-shrink-0"
    >
      <defs>
        <linearGradient id="cloudGradient" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor={BRAND_COLOR_LIGHT} />
          <stop offset="100%" stopColor={BRAND_COLOR_DARK} />
        </linearGradient>
      </defs>

      {/* Geometric Cloud - Perfect circles composition */}
      {/* Large left circle */}
      <circle cx="28" cy="38" r="18" fill="url(#cloudGradient)" />
      {/* Large center circle */}
      <circle cx="50" cy="28" r="22" fill="url(#cloudGradient)" />
      {/* Medium right circle */}
      <circle cx="74" cy="36" r="16" fill="url(#cloudGradient)" />
      {/* Small top accent circle */}
      <circle cx="38" cy="18" r="10" fill={BRAND_COLOR} />
      {/* Base rectangle for flat bottom */}
      <rect x="10" y="38" width="80" height="18" rx="9" fill="url(#cloudGradient)" />
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
