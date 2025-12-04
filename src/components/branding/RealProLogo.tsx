interface RealProLogoProps {
  className?: string;
  size?: 'sm' | 'md' | 'lg' | 'xl';
}

const sizeClasses = {
  sm: 'text-lg',
  md: 'text-2xl',
  lg: 'text-3xl',
  xl: 'text-4xl'
};

export function RealProLogo({ className = '', size = 'md' }: RealProLogoProps) {
  return (
    <div className={`flex items-center gap-0.5 ${sizeClasses[size]} font-bold ${className}`}>
      <span className="text-neutral-900 dark:text-white">Real</span>
      <span className="text-blue-600">Pro</span>
    </div>
  );
}
