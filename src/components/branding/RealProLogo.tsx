import { Building2 } from 'lucide-react';

interface RealProLogoProps {
  className?: string;
  size?: 'sm' | 'md' | 'lg' | 'xl';
  showIcon?: boolean;
}

const sizeClasses = {
  sm: { text: 'text-lg', icon: 'w-6 h-6', gap: 'gap-2.5', iconSize: 'w-3.5 h-3.5' },
  md: { text: 'text-2xl', icon: 'w-8 h-8', gap: 'gap-3', iconSize: 'w-4 h-4' },
  lg: { text: 'text-3xl', icon: 'w-10 h-10', gap: 'gap-3.5', iconSize: 'w-5 h-5' },
  xl: { text: 'text-4xl', icon: 'w-12 h-12', gap: 'gap-4', iconSize: 'w-6 h-6' }
};

export function RealProLogo({ className = '', size = 'md', showIcon = true }: RealProLogoProps) {
  const sizes = sizeClasses[size];

  return (
    <div className={`flex items-center ${sizes.gap} ${className}`}>
      {showIcon && (
        <div className="relative flex-shrink-0">
          <div className={`${sizes.icon} rounded-2xl bg-gradient-to-br from-brand-600 via-brand-600 to-brand-700 flex items-center justify-center shadow-xl shadow-brand-600/40 relative overflow-hidden group-hover:shadow-2xl group-hover:shadow-brand-600/50 transition-all duration-300`}>
            <Building2 className={`${sizes.iconSize} text-white relative z-10`} strokeWidth={2.5} />
            <div className="absolute inset-0 bg-gradient-to-tr from-white/10 via-white/5 to-transparent"></div>
            <div className="absolute -bottom-1 -right-1 w-3/4 h-3/4">
              <div className="absolute bottom-2 right-2 w-full h-full border-t-2 border-l-2 border-white/20 rounded-tl-lg"></div>
              <div className="absolute bottom-1 right-1 w-2/3 h-2/3 border-t border-l border-white/10 rounded-tl-lg"></div>
            </div>
          </div>
        </div>
      )}
      <div className={`flex items-baseline ${sizes.text} font-extrabold tracking-tight`}>
        <span className="text-neutral-900 dark:text-white" style={{ letterSpacing: '-0.02em' }}>Real</span>
        <span className="text-brand-600 dark:text-brand-400 bg-gradient-to-br from-brand-600 via-brand-600 to-brand-700 bg-clip-text" style={{ letterSpacing: '-0.02em' }}>Pro</span>
      </div>
    </div>
  );
}
