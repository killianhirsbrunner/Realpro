import { useTheme } from '../../contexts/ThemeContext';

interface RealProIconProps {
  className?: string;
  size?: number;
}

export function RealProIcon({ className = '', size = 48 }: RealProIconProps) {
  const { actualTheme } = useTheme();
  const isDark = actualTheme === 'dark';

  const iconSrc = isDark ? '/logos/6.svg' : '/logos/7.svg';

  return (
    <img
      src={iconSrc}
      alt="RealPro Icon"
      width={size}
      height={size}
      className={className}
      style={{ maxWidth: '100%', height: 'auto', objectFit: 'contain' }}
    />
  );
}
