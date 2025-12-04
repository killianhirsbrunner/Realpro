import { Building2 } from 'lucide-react';

interface RealProLogoProps {
  className?: string;
  size?: 'sm' | 'md' | 'lg' | 'xl';
  showIcon?: boolean;
}

const sizeClasses = {
  sm: { text: 'text-lg', icon: 'w-5 h-5', gap: 'gap-2' },
  md: { text: 'text-2xl', icon: 'w-6 h-6', gap: 'gap-2.5' },
  lg: { text: 'text-3xl', icon: 'w-8 h-8', gap: 'gap-3' },
  xl: { text: 'text-4xl', icon: 'w-10 h-10', gap: 'gap-3' }
};

export function RealProLogo({ className = '', size = 'md', showIcon = true }: RealProLogoProps) {
  const sizes = sizeClasses[size];

  return (
    <div className={`flex items-center ${sizes.gap} ${className}`}>
      {showIcon && (
        <div className="relative flex-shrink-0">
          <div className={`${sizes.icon} rounded-xl bg-gradient-to-br from-brand-600 to-brand-700 flex items-center justify-center shadow-lg shadow-brand-600/30 relative overflow-hidden`}>
            <Building2 className={`${size === 'sm' ? 'w-3 h-3' : size === 'md' ? 'w-3.5 h-3.5' : size === 'lg' ? 'w-5 h-5' : 'w-6 h-6'} text-white relative z-10`} />
            <div className="absolute inset-0 bg-gradient-to-tr from-white/20 to-transparent"></div>
            <div className="absolute bottom-0 right-0 w-2/3 h-2/3 border-t-2 border-l-2 border-white/30"></div>
          </div>
        </div>
      )}
      <div className={`flex items-center gap-0.5 ${sizes.text} font-bold`}>
        <span className="text-neutral-900 dark:text-white">Real</span>
        <span className="text-brand-600 dark:text-brand-500">Pro</span>
      </div>
    </div>
  );
}
