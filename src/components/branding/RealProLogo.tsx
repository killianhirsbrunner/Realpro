interface RealProLogoProps {
  className?: string;
  size?: 'sm' | 'md' | 'lg' | 'xl';
  showIcon?: boolean;
}

const sizeClasses = {
  sm: { text: 'text-base', icon: 'w-5 h-5', gap: 'gap-1.5', iconSize: 'w-3 h-3' },
  md: { text: 'text-xl', icon: 'w-7 h-7', gap: 'gap-2', iconSize: 'w-3.5 h-3.5' },
  lg: { text: 'text-2xl', icon: 'w-8 h-8', gap: 'gap-2.5', iconSize: 'w-4 h-4' },
  xl: { text: 'text-3xl', icon: 'w-10 h-10', gap: 'gap-3', iconSize: 'w-5 h-5' }
};

export function RealProLogo({ className = '', size = 'md', showIcon = true }: RealProLogoProps) {
  const sizes = sizeClasses[size];

  return (
    <div className={`flex items-center ${sizes.gap} ${className}`}>
      {showIcon && (
        <div className="relative flex-shrink-0">
          <div className={`${sizes.icon} rounded-2xl bg-gradient-to-br from-brand-600 via-brand-600 to-brand-700 flex items-center justify-center shadow-xl shadow-brand-600/40 relative overflow-hidden group-hover:shadow-2xl group-hover:shadow-brand-600/50 transition-all duration-300`}>
            <svg
              className={`${sizes.iconSize} text-white relative z-10`}
              viewBox="0 0 40 40"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                d="M20 8L32 20L20 32L8 20L20 8Z"
                fill="currentColor"
                opacity="0.9"
              />
              <path
                d="M20 12L28 20L20 28L12 20L20 12Z"
                fill="currentColor"
                opacity="0.3"
              />
              <circle
                cx="20"
                cy="20"
                r="5"
                fill="currentColor"
                opacity="0.95"
              />
              <path
                d="M20 8L20 4M32 20L36 20M20 32L20 36M8 20L4 20"
                stroke="currentColor"
                strokeWidth="2.5"
                strokeLinecap="round"
                opacity="0.6"
              />
              <circle
                cx="20"
                cy="20"
                r="2"
                fill="currentColor"
                opacity="0.4"
              />
            </svg>
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
        <span className="bg-gradient-to-br from-brand-600 via-brand-600 to-brand-700 bg-clip-text text-transparent" style={{ letterSpacing: '-0.02em' }}>Pro</span>
      </div>
    </div>
  );
}
