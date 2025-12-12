/**
 * Realpro | Official Logo Component
 * © 2024-2025 Realpro SA. Tous droits réservés.
 * Modern Cloud Design
 */

interface RealproLogoProps {
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

// Realpro brand colors - Official: #3DAABD
const BRAND_COLOR = '#3DAABD';
const BRAND_COLOR_DARK = '#2E8A9A';
const BRAND_COLOR_LIGHT = '#5BC4D6';

export function RealproLogo({
  variant = 'full',
  size = 'md',
  className = '',
  theme = 'auto'
}: RealproLogoProps) {
  const config = sizeConfig[size];

  // Determine text colors based on theme
  const getTextColor = () => {
    if (theme === 'light') return '#1A1A1A';
    if (theme === 'dark') return '#A8B5BD';
    // Auto: use CSS for dark mode detection
    return 'currentColor';
  };

  const RealproIconSVG = ({ iconSize }: { iconSize: number }) => (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 50 50"
      fill="none"
      width={iconSize}
      height={iconSize}
      className="flex-shrink-0"
    >
      <defs>
        <linearGradient id="grad1" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor={BRAND_COLOR_LIGHT} />
          <stop offset="100%" stopColor={BRAND_COLOR} />
        </linearGradient>
        <linearGradient id="grad2" x1="100%" y1="0%" x2="0%" y2="100%">
          <stop offset="0%" stopColor={BRAND_COLOR} />
          <stop offset="100%" stopColor={BRAND_COLOR_DARK} />
        </linearGradient>
      </defs>
      {/* Official RealPro Logo - Arcs with Center Dot */}
      {/* Top arc */}
      <path
        d="M8 25 Q8 8 25 8 Q42 8 42 25"
        stroke="url(#grad1)"
        strokeWidth="6"
        strokeLinecap="round"
        fill="none"
      />
      {/* Bottom arc */}
      <path
        d="M8 25 Q8 42 25 42 Q42 42 42 25"
        stroke="url(#grad2)"
        strokeWidth="6"
        strokeLinecap="round"
        fill="none"
      />
      {/* Center dot */}
      <circle cx="25" cy="25" r="5" fill={BRAND_COLOR} />
    </svg>
  );

  if (variant === 'icon') {
    return (
      <div className={className}>
        <RealproIconSVG iconSize={config.iconSize} />
      </div>
    );
  }

  if (variant === 'text') {
    const fontSize = config.height * 0.6;
    return (
      <div className={`flex items-center ${className}`}>
        <span className="font-bold" style={{ fontSize: `${fontSize}px` }}>
          <span style={{ color: '#FFFFFF' }}>Real</span>
          <span style={{ color: BRAND_COLOR }}>pro</span>
        </span>
      </div>
    );
  }

  // Full variant: icon + text
  const fontSize = config.height * 0.55;
  return (
    <div className={`flex items-center gap-2 ${className}`}>
      <RealproIconSVG iconSize={config.iconSize * 0.8} />
      <span className="font-bold" style={{ fontSize: `${fontSize}px` }}>
        <span style={{ color: '#FFFFFF' }}>Real</span>
        <span style={{ color: BRAND_COLOR }}>pro</span>
      </span>
    </div>
  );
}

// Simplified icon component for backwards compatibility
export function RealproIcon({
  className = '',
  size = 'md'
}: {
  className?: string;
  size?: 'sm' | 'md' | 'lg' | 'xl';
}) {
  return <RealproLogo variant="icon" size={size} className={className} />;
}

// Backwards compatibility aliases
export const RealProLogo = RealproLogo;
export const RealProIcon = RealproIcon;

export default RealproLogo;
