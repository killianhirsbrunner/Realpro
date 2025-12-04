import { useTheme } from '../../contexts/ThemeContext';

interface RealProLogoProps {
  className?: string;
  width?: number;
  height?: number;
}

export function RealProLogo({ className = '', width = 180, height = 60 }: RealProLogoProps) {
  const { actualTheme } = useTheme();
  const isDark = actualTheme === 'dark';

  const logoSrc = isDark ? '/logos/5.svg' : '/logos/8.svg';

  return (
    <img
      src={logoSrc}
      alt="RealPro"
      width={width}
      height={height}
      className={className}
      style={{ maxWidth: '100%', height: 'auto', objectFit: 'contain' }}
    />
  );
}
