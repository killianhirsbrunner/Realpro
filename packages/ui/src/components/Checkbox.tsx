import { forwardRef, type InputHTMLAttributes, useId } from 'react';
import clsx from 'clsx';
import { Check, Minus } from 'lucide-react';

export interface CheckboxProps extends Omit<InputHTMLAttributes<HTMLInputElement>, 'type' | 'size'> {
  /** Checkbox label */
  label?: string;
  /** Description text below label */
  description?: string;
  /** Error message */
  error?: string;
  /** Indeterminate state (partially checked) */
  indeterminate?: boolean;
  /** Size variant */
  size?: 'sm' | 'md' | 'lg';
}

export const Checkbox = forwardRef<HTMLInputElement, CheckboxProps>(
  (
    {
      label,
      description,
      error,
      indeterminate = false,
      size = 'md',
      className,
      id,
      disabled,
      checked,
      ...props
    },
    ref
  ) => {
    const generatedId = useId();
    const checkboxId = id || generatedId;

    const sizeStyles = {
      sm: {
        checkbox: 'h-4 w-4',
        icon: 'h-3 w-3',
        label: 'text-sm',
        description: 'text-xs',
      },
      md: {
        checkbox: 'h-5 w-5',
        icon: 'h-3.5 w-3.5',
        label: 'text-sm',
        description: 'text-xs',
      },
      lg: {
        checkbox: 'h-6 w-6',
        icon: 'h-4 w-4',
        label: 'text-base',
        description: 'text-sm',
      },
    };

    const styles = sizeStyles[size];

    return (
      <div className={clsx('relative', className)}>
        <div className="flex items-start">
          <div className="flex items-center h-5">
            <div className="relative">
              <input
                ref={(node) => {
                  if (node) {
                    node.indeterminate = indeterminate;
                  }
                  if (typeof ref === 'function') {
                    ref(node);
                  } else if (ref) {
                    ref.current = node;
                  }
                }}
                id={checkboxId}
                type="checkbox"
                checked={checked}
                disabled={disabled}
                className={clsx(
                  'peer appearance-none',
                  styles.checkbox,
                  'rounded border-2 transition-all duration-150',
                  'focus:outline-none focus-visible:ring-2 focus-visible:ring-brand-400 focus-visible:ring-offset-2',
                  error
                    ? 'border-error-500 bg-error-50 dark:bg-error-950'
                    : 'border-neutral-300 bg-white dark:border-neutral-600 dark:bg-neutral-900',
                  'checked:border-brand-400 checked:bg-brand-400',
                  'hover:border-neutral-400 checked:hover:bg-brand-500',
                  'disabled:cursor-not-allowed disabled:opacity-50 disabled:hover:border-neutral-300'
                )}
                aria-invalid={error ? 'true' : undefined}
                aria-describedby={
                  error ? `${checkboxId}-error` : description ? `${checkboxId}-description` : undefined
                }
                {...props}
              />
              <div
                className={clsx(
                  'absolute inset-0 flex items-center justify-center pointer-events-none',
                  'text-white opacity-0 peer-checked:opacity-100 transition-opacity duration-150'
                )}
              >
                {indeterminate ? (
                  <Minus className={styles.icon} strokeWidth={3} />
                ) : (
                  <Check className={styles.icon} strokeWidth={3} />
                )}
              </div>
            </div>
          </div>

          {(label || description) && (
            <div className="ml-3">
              {label && (
                <label
                  htmlFor={checkboxId}
                  className={clsx(
                    'font-medium text-neutral-900 dark:text-neutral-100',
                    styles.label,
                    disabled && 'opacity-50 cursor-not-allowed'
                  )}
                >
                  {label}
                </label>
              )}
              {description && (
                <p
                  id={`${checkboxId}-description`}
                  className={clsx(
                    'text-neutral-500 dark:text-neutral-400 mt-0.5',
                    styles.description
                  )}
                >
                  {description}
                </p>
              )}
            </div>
          )}
        </div>

        {error && (
          <p
            id={`${checkboxId}-error`}
            className="mt-1.5 text-sm text-error-600 dark:text-error-400"
            role="alert"
          >
            {error}
          </p>
        )}
      </div>
    );
  }
);

Checkbox.displayName = 'Checkbox';
