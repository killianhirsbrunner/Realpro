import { useTheme } from '../../contexts/ThemeContext';

interface RealProLogoProps {
  className?: string;
  size?: 'sm' | 'md' | 'lg' | 'xl' | '2xl';
}

// Tailles optimisées pour un rendu professionnel et compact (ratio ~4.4:1)
const sizeClasses = {
  sm: { height: 'h-7', width: 'w-auto' },         // 28px - topbar/footer compact
  md: { height: 'h-8', width: 'w-auto' },         // 32px - sidebar standard
  lg: { height: 'h-9', width: 'w-auto' },         // 36px - headers/footers
  xl: { height: 'h-10', width: 'w-auto' },        // 40px - landing pages headers
  '2xl': { height: 'h-12', width: 'w-auto' }      // 48px - hero sections
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
