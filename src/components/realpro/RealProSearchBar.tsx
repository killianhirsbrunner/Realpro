import { Search } from 'lucide-react';
import { InputHTMLAttributes } from 'react';

interface RealProSearchBarProps extends Omit<InputHTMLAttributes<HTMLInputElement>, 'type'> {
  onSearch?: (value: string) => void;
}

export function RealProSearchBar({
  placeholder = 'Rechercher...',
  onSearch,
  className = '',
  ...props
}: RealProSearchBarProps) {
  return (
    <div className={`relative ${className}`}>
      <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-neutral-400" />
      <input
        type="text"
        placeholder={placeholder}
        onChange={(e) => onSearch?.(e.target.value)}
        className="
          w-full
          pl-12
          pr-4
          py-3
          rounded-xl
          border
          border-neutral-200
          dark:border-neutral-800
          bg-white
          dark:bg-neutral-900
          text-neutral-900
          dark:text-neutral-100
          placeholder:text-neutral-400
          shadow-soft
          focus:outline-none
          focus:ring-2
          focus:ring-primary-500
          dark:focus:ring-primary-400
          focus:border-transparent
          transition-all
        "
        {...props}
      />
    </div>
  );
}
