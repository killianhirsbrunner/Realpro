import { forwardRef, type InputHTMLAttributes, useCallback, useState, useRef, useEffect } from 'react';
import clsx from 'clsx';
import { Search, X, Loader2 } from 'lucide-react';

export interface SearchInputProps extends Omit<InputHTMLAttributes<HTMLInputElement>, 'type' | 'size'> {
  /** Callback when value changes (debounced) */
  onSearch?: (value: string) => void;
  /** Debounce delay in ms */
  debounceMs?: number;
  /** Loading state */
  isLoading?: boolean;
  /** Show clear button */
  showClear?: boolean;
  /** Size variant */
  size?: 'sm' | 'md' | 'lg';
}

export const SearchInput = forwardRef<HTMLInputElement, SearchInputProps>(
  (
    {
      onSearch,
      debounceMs = 300,
      isLoading = false,
      showClear = true,
      size = 'md',
      value,
      onChange,
      className,
      placeholder = 'Rechercher...',
      ...props
    },
    ref
  ) => {
    const [internalValue, setInternalValue] = useState(value || '');
    const debounceRef = useRef<ReturnType<typeof setTimeout> | null>(null);

    // Sync with external value
    useEffect(() => {
      if (value !== undefined) {
        setInternalValue(value as string);
      }
    }, [value]);

    const handleChange = useCallback(
      (e: React.ChangeEvent<HTMLInputElement>) => {
        const newValue = e.target.value;
        setInternalValue(newValue);
        onChange?.(e);

        // Debounced search callback
        if (onSearch) {
          if (debounceRef.current) {
            clearTimeout(debounceRef.current);
          }
          debounceRef.current = setTimeout(() => {
            onSearch(newValue);
          }, debounceMs);
        }
      },
      [debounceMs, onChange, onSearch]
    );

    const handleClear = useCallback(() => {
      setInternalValue('');
      onSearch?.('');
      // Trigger onChange with synthetic event
      const input = (ref as React.RefObject<HTMLInputElement>)?.current;
      if (input) {
        const nativeInputValueSetter = Object.getOwnPropertyDescriptor(
          window.HTMLInputElement.prototype,
          'value'
        )?.set;
        nativeInputValueSetter?.call(input, '');
        input.dispatchEvent(new Event('input', { bubbles: true }));
      }
    }, [onSearch, ref]);

    // Cleanup
    useEffect(() => {
      return () => {
        if (debounceRef.current) {
          clearTimeout(debounceRef.current);
        }
      };
    }, []);

    const sizeStyles = {
      sm: {
        input: 'py-1.5 pl-8 pr-8 text-sm',
        iconLeft: 'left-2.5',
        iconRight: 'right-2',
        icon: 'h-3.5 w-3.5',
      },
      md: {
        input: 'py-2 pl-10 pr-10 text-sm',
        iconLeft: 'left-3',
        iconRight: 'right-3',
        icon: 'h-4 w-4',
      },
      lg: {
        input: 'py-2.5 pl-11 pr-11 text-base',
        iconLeft: 'left-3.5',
        iconRight: 'right-3.5',
        icon: 'h-5 w-5',
      },
    };

    const styles = sizeStyles[size];
    const hasValue = Boolean(internalValue);

    return (
      <div className={clsx('relative', className)}>
        {/* Search icon */}
        <div
          className={clsx(
            'absolute inset-y-0 flex items-center pointer-events-none',
            styles.iconLeft
          )}
        >
          <Search
            className={clsx(
              styles.icon,
              'text-neutral-400 dark:text-neutral-500'
            )}
          />
        </div>

        {/* Input */}
        <input
          ref={ref}
          type="text"
          value={internalValue}
          onChange={handleChange}
          placeholder={placeholder}
          className={clsx(
            'block w-full rounded-lg border bg-white dark:bg-neutral-900',
            'text-neutral-900 dark:text-neutral-100',
            'placeholder-neutral-400 dark:placeholder-neutral-500',
            'focus:outline-none focus:ring-2 focus:ring-offset-0 focus:border-brand-400 focus:ring-brand-400/20',
            'border-neutral-300 dark:border-neutral-700',
            'transition-colors',
            styles.input,
            props.disabled && 'bg-neutral-50 dark:bg-neutral-800 cursor-not-allowed opacity-60'
          )}
          {...props}
        />

        {/* Right side: loading or clear */}
        <div
          className={clsx(
            'absolute inset-y-0 flex items-center',
            styles.iconRight
          )}
        >
          {isLoading ? (
            <Loader2
              className={clsx(styles.icon, 'text-neutral-400 animate-spin')}
            />
          ) : showClear && hasValue ? (
            <button
              type="button"
              onClick={handleClear}
              className={clsx(
                'p-0.5 rounded text-neutral-400 hover:text-neutral-600',
                'dark:hover:text-neutral-300 transition-colors',
                'focus:outline-none focus-visible:ring-2 focus-visible:ring-brand-400'
              )}
              aria-label="Effacer la recherche"
            >
              <X className={styles.icon} />
            </button>
          ) : null}
        </div>
      </div>
    );
  }
);

SearchInput.displayName = 'SearchInput';
