import { useTheme } from '../../contexts/ThemeContext';

interface RealProIconProps {
  className?: string;
  size?: 'sm' | 'md' | 'lg';
}

export function RealProIcon({ className = '', size = 'md' }: RealProIconProps) {
  const { actualTheme } = useTheme();
  const isDark = actualTheme === 'dark';

  const sizeClasses = {
    sm: 'w-8 h-8 text-sm',
    md: 'w-10 h-10 text-base',
    lg: 'w-12 h-12 text-lg'
  };

  return (
    <div className={`${sizeClasses[size]} rounded-lg bg-gradient-to-br from-blue-600 to-blue-700 flex items-center justify-center font-bold text-white shadow-lg ${className}`}>
      <span className="tracking-tight">RP</span>
    </div>
  );
}
