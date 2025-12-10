import { useTheme } from '../../contexts/ThemeContext';

interface RealProLogoProps {
  className?: string;
  size?: 'sm' | 'md' | 'lg' | 'xl';
}

const sizeClasses = {
  sm: { height: 'h-6', maxWidth: 'max-w-[120px]' },
  md: { height: 'h-8', maxWidth: 'max-w-[160px]' },
  lg: { height: 'h-10', maxWidth: 'max-w-[200px]' },
  xl: { height: 'h-12', maxWidth: 'max-w-[240px]' }
};

export function RealProLogo({ className = '', size = 'md' }: RealProLogoProps) {
  const { actualTheme } = useTheme();
  const sizes = sizeClasses[size];

  const logoSrc = actualTheme === 'dark'
    ? '/logos/Official-dark.svg'
    : '/logos/Official-light.svg';

  return (
    <img
      src={logoSrc}
      alt="RealPro"
      className={`${sizes.height} ${sizes.maxWidth} w-auto object-contain ${className}`}
    />
  );
}
