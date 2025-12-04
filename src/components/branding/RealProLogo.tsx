import { useTheme } from '../../contexts/ThemeContext';

interface RealProLogoProps {
  className?: string;
  width?: number;
  height?: number;
}

export function RealProLogo({ className = '', width = 200, height = 200 }: RealProLogoProps) {
  const { actualTheme } = useTheme();
  const isDark = actualTheme === 'dark';

  const logoSrc = isDark ? '/logos/9.svg' : '/logos/8 copy.svg';

  return (
    <img
      src={logoSrc}
      alt="RealPro"
      className={className}
      style={{ width: `${width}px`, height: `${height}px`, objectFit: 'cover' }}
    />
  );
}
