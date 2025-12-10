import { useTheme } from '../../contexts/ThemeContext';

interface RealProLogoProps {
  className?: string;
  size?: 'sm' | 'md' | 'lg' | 'xl' | '2xl';
}

// Tailles optimisées pour le logo croppé (ratio ~4.4:1) - UX premium XXL
const sizeClasses = {
  sm: { height: 'h-20', width: 'w-[352px]' },     // 80px - topbar compact
  md: { height: 'h-24', width: 'w-[422px]' },     // 96px - sidebar standard
  lg: { height: 'h-32', width: 'w-[564px]' },     // 128px - headers
  xl: { height: 'h-40', width: 'w-[704px]' },     // 160px - landing pages
  '2xl': { height: 'h-48', width: 'w-[846px]' }   // 192px - hero sections
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
