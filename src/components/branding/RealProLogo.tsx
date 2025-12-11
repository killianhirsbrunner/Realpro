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
      viewBox="0 0 100 100"
      fill="none"
      width={iconSize}
      height={iconSize}
      className="flex-shrink-0"
    >
      {/* Two interlocking diagonal capsules forming X */}
      <path d="M15 75 L15 75 C6.7 66.7 6.7 53.3 15 45 L45 15 C53.3 6.7 66.7 6.7 75 15 L75 15 C83.3 23.3 83.3 36.7 75 45 L45 75 C36.7 83.3 23.3 83.3 15 75 Z" fill={BRAND_COLOR}/>
      <path d="M25 15 L25 15 C33.3 6.7 46.7 6.7 55 15 L85 45 C93.3 53.3 93.3 66.7 85 75 L85 75 C76.7 83.3 63.3 83.3 55 75 L25 45 C16.7 36.7 16.7 23.3 25 15 Z" fill={BRAND_COLOR}/>
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
      <RealProIconSVG iconSize={config.iconSize} />
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
