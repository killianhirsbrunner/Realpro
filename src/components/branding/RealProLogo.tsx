import { useTheme } from '../../contexts/ThemeContext';

interface RealProLogoProps {
  className?: string;
  size?: 'sm' | 'md' | 'lg' | 'xl';
}

// Tailles optimisées pour le logo croppé (ratio ~4.4:1)
const sizeClasses = {
  sm: { height: 'h-5', width: 'w-[88px]' },
  md: { height: 'h-7', width: 'w-[123px]' },
  lg: { height: 'h-9', width: 'w-[158px]' },
  xl: { height: 'h-11', width: 'w-[193px]' }
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
