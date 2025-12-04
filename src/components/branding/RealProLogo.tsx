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
              viewBox="0 0 24 24"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                d="M3 21L12 3L21 21"
                stroke="currentColor"
                strokeWidth="2.5"
                strokeLinecap="round"
                strokeLinejoin="round"
                opacity="0.25"
              />
              <rect
                x="7"
                y="12"
                width="4"
                height="9"
                rx="0.5"
                fill="currentColor"
                opacity="0.95"
              />
              <rect
                x="13"
                y="8"
                width="4"
                height="13"
                rx="0.5"
                fill="currentColor"
                opacity="0.85"
              />
              <rect
                x="10"
                y="14"
                width="2"
                height="7"
                rx="0.25"
                fill="currentColor"
                opacity="0.6"
              />
              <circle
                cx="12"
                cy="6"
                r="1.8"
                fill="currentColor"
                opacity="0.9"
              />
              <path
                d="M5 18H19"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                opacity="0.3"
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
