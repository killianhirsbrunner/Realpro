import { forwardRef, type InputHTMLAttributes, useId } from 'react';
import clsx from 'clsx';

export interface SwitchProps extends Omit<InputHTMLAttributes<HTMLInputElement>, 'type' | 'size'> {
  /** Switch label */
  label?: string;
  /** Description text */
  description?: string;
  /** Error message */
  error?: string;
  /** Size variant */
  size?: 'sm' | 'md' | 'lg';
  /** Label position */
  labelPosition?: 'left' | 'right';
}

export const Switch = forwardRef<HTMLInputElement, SwitchProps>(
  (
    {
      label,
      description,
      error,
      size = 'md',
      labelPosition = 'right',
      className,
      id,
      disabled,
      checked,
      ...props
    },
    ref
  ) => {
    const generatedId = useId();
    const switchId = id || generatedId;

    const sizeStyles = {
      sm: {
        track: 'h-5 w-9',
        thumb: 'h-4 w-4',
        translate: 'translate-x-4',
        label: 'text-sm',
        description: 'text-xs',
      },
      md: {
        track: 'h-6 w-11',
        thumb: 'h-5 w-5',
        translate: 'translate-x-5',
        label: 'text-sm',
        description: 'text-xs',
      },
      lg: {
        track: 'h-7 w-14',
        thumb: 'h-6 w-6',
        translate: 'translate-x-7',
        label: 'text-base',
        description: 'text-sm',
      },
    };

    const styles = sizeStyles[size];

    const switchElement = (
      <div className="relative inline-flex flex-shrink-0">
        <input
          ref={ref}
          id={switchId}
          type="checkbox"
          role="switch"
          checked={checked}
          disabled={disabled}
          className="peer sr-only"
          aria-invalid={error ? 'true' : undefined}
          aria-describedby={
            error ? `${switchId}-error` : description ? `${switchId}-description` : undefined
          }
          {...props}
        />
        {/* Track */}
        <span
          className={clsx(
            styles.track,
            'rounded-full transition-colors duration-200 ease-in-out cursor-pointer',
            'peer-focus-visible:ring-2 peer-focus-visible:ring-brand-400 peer-focus-visible:ring-offset-2',
            'peer-disabled:cursor-not-allowed peer-disabled:opacity-50',
            checked
              ? 'bg-brand-400 peer-hover:bg-brand-500'
              : 'bg-neutral-200 peer-hover:bg-neutral-300 dark:bg-neutral-700 dark:peer-hover:bg-neutral-600',
            error && !checked && 'bg-error-200 dark:bg-error-900'
          )}
        />
        {/* Thumb */}
        <span
          className={clsx(
            styles.thumb,
            'absolute top-0.5 left-0.5 rounded-full bg-white shadow-sm',
            'transition-transform duration-200 ease-in-out',
            'pointer-events-none',
            checked && styles.translate
          )}
        />
      </div>
    );

    const labelElement = (label || description) && (
      <div className={clsx(labelPosition === 'left' ? 'mr-3' : 'ml-3')}>
        {label && (
          <label
            htmlFor={switchId}
            className={clsx(
              'font-medium text-neutral-900 dark:text-neutral-100 cursor-pointer',
              styles.label,
              disabled && 'opacity-50 cursor-not-allowed'
            )}
          >
            {label}
          </label>
        )}
        {description && (
          <p
            id={`${switchId}-description`}
            className={clsx(
              'text-neutral-500 dark:text-neutral-400',
              styles.description
            )}
          >
            {description}
          </p>
        )}
      </div>
    );

    return (
      <div className={clsx('inline-flex flex-col', className)}>
        <div className="flex items-center">
          {labelPosition === 'left' && labelElement}
          {switchElement}
          {labelPosition === 'right' && labelElement}
        </div>

        {error && (
          <p
            id={`${switchId}-error`}
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

Switch.displayName = 'Switch';
