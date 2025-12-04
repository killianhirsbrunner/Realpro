interface RealProIconProps {
  className?: string;
  size?: 'sm' | 'md' | 'lg' | 'xl';
}

const sizeClasses = {
  sm: 'w-8 h-8 text-xs',
  md: 'w-10 h-10 text-sm',
  lg: 'w-12 h-12 text-base',
  xl: 'w-16 h-16 text-xl'
};

export function RealProIcon({ className = '', size = 'md' }: RealProIconProps) {
  return (
    <div
      className={`${sizeClasses[size]} rounded-xl bg-gradient-to-br from-blue-500 to-blue-700 flex items-center justify-center font-bold text-white shadow-lg ${className}`}
    >
      RP
    </div>
  );
}
