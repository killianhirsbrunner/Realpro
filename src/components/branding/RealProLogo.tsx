import { useTheme } from '../../contexts/ThemeContext';

interface RealProLogoProps {
  className?: string;
  width?: number;
  height?: number;
}

export function RealProLogo({ className = '', width = 180, height = 60 }: RealProLogoProps) {
  const { theme } = useTheme();

  const logo = theme === 'dark'
    ? '/logos/realpro-dark.png'
    : '/logos/realpro-light.png';

  return (
    <img
      src={logo}
      alt="RealPro"
      width={width}
      height={height}
      className={className}
      style={{ maxWidth: '100%', height: 'auto' }}
    />
  );
}
