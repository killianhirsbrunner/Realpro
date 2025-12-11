/**
 * RealPro | Official Logo Component
 * © 2024-2025 Realpro SA. Tous droits réservés.
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

// RealPro brand color
const BRAND_COLOR = '#3DAABD';

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
      viewBox="0 0 200 150"
      fill="none"
      width={iconSize}
      height={iconSize * 0.75}
      className="flex-shrink-0"
    >
      {/* Bottom left pill shape */}
      <ellipse cx="45" cy="105" rx="30" ry="30" fill={BRAND_COLOR}/>
      {/* Top left circle */}
      <ellipse cx="55" cy="45" rx="25" ry="25" fill={BRAND_COLOR}/>
      {/* Main diagonal bar */}
      <rect x="35" y="55" width="110" height="35" rx="17.5" transform="rotate(-35 90 75)" fill={BRAND_COLOR}/>
      {/* Top right circle */}
      <ellipse cx="145" cy="55" rx="25" ry="25" fill={BRAND_COLOR}/>
      {/* Bottom right pill shape */}
      <ellipse cx="155" cy="105" rx="25" ry="25" fill={BRAND_COLOR}/>
      {/* Second diagonal bar */}
      <rect x="55" y="55" width="90" height="35" rx="17.5" transform="rotate(35 100 75)" fill={BRAND_COLOR}/>
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
