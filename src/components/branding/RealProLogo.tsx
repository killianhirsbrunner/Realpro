import { useTheme } from '../../contexts/ThemeContext';

interface RealProLogoProps {
  className?: string;
  size?: 'sm' | 'md' | 'lg' | 'xl';
}

export function RealProLogo({ className = '', size = 'md' }: RealProLogoProps) {
  const { actualTheme } = useTheme();
  const isDark = actualTheme === 'dark';

  const sizeClasses = {
    sm: 'text-2xl',
    md: 'text-3xl',
    lg: 'text-4xl',
    xl: 'text-5xl'
  };

  return (
    <div className={`font-bold ${sizeClasses[size]} ${className}`}>
      <span className={isDark ? 'text-white' : 'text-neutral-900'}>Real</span>
      <span className="text-blue-600">Pro</span>
    </div>
  );
}
