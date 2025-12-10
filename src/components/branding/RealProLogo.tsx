import { useTheme } from '../../contexts/ThemeContext';

interface RealProLogoProps {
  className?: string;
  size?: 'sm' | 'md' | 'lg' | 'xl' | '2xl';
}

// Tailles optimisées pour le logo croppé (ratio ~4.4:1) - UX premium élargi
const sizeClasses = {
  sm: { height: 'h-10', width: 'w-[176px]' },     // 40px - topbar compact
  md: { height: 'h-12', width: 'w-[211px]' },     // 48px - sidebar standard
  lg: { height: 'h-16', width: 'w-[282px]' },     // 64px - headers
  xl: { height: 'h-20', width: 'w-[352px]' },     // 80px - landing pages
  '2xl': { height: 'h-24', width: 'w-[423px]' }   // 96px - hero sections
};

export function RealProLogo({ className = '', size = 'md' }: RealProLogoProps) {
  const { actualTheme } = useTheme();
  const sizes = sizeClasses[size];

  // Utilisation des versions croppées pour un meilleur affichage
  const logoSrc = actualTheme === 'dark'
    ? '/logos/Official-dark-cropped.svg'
    : '/logos/Official-light-cropped.svg';

  return (
    <img
      src={logoSrc}
      alt="RealPro"
      className={`${sizes.height} ${sizes.width} object-contain ${className}`}
    />
  );
}
