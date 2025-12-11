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
      viewBox="0 0 50 50"
      fill="none"
      width={iconSize}
      height={iconSize}
      className="flex-shrink-0"
    >
      {/* Official RealPro Logo - Interlocking Pills/Capsules Design */}
      {/* Main diagonal bar (top-left to bottom-right) - background layer */}
      <rect
        x="5"
        y="20"
        width="40"
        height="10"
        rx="5"
        fill={BRAND_COLOR}
        transform="rotate(-35, 25, 25)"
      />
      {/* Secondary diagonal bar (top-right to bottom-left) */}
      <g>
        {/* Top-right circle */}
        <circle cx="38" cy="12" r="7" fill={BRAND_COLOR} />
        {/* Bottom-left circle */}
        <circle cx="12" cy="38" r="7" fill={BRAND_COLOR} />
        {/* Connecting bar */}
        <rect
          x="5"
          y="20"
          width="32"
          height="10"
          rx="5"
          fill={BRAND_COLOR}
          transform="rotate(35, 25, 25)"
        />
      </g>
      {/* Top-left circle (part of main bar) */}
      <circle cx="10" cy="14" r="7" fill={BRAND_COLOR} />
      {/* Bottom-right end (part of main bar) - extends further */}
      <circle cx="40" cy="36" r="7" fill={BRAND_COLOR} />
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
    <div className={`flex items-center gap-1 ${className}`}>
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
